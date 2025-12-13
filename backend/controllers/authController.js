import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/User.js";
import Sport from "../models/Sport.js";
import { OAuth2Client } from "google-auth-library";
import { validationResult } from "express-validator";

function handleValidation(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ error: "Validation failed.", details: errors.array() });
    return true;
  }
  return false;
}

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export async function register(req, res) {
  if (handleValidation(req, res)) return;

  try {
    const { firstName, lastName, email, password, role, favoriteSport } = req.body;

    // Validate role
    if (role && !["admin", "user", "analyst"].includes(role)) {
      return res.status(400).json({ error: "Invalid role. Must be 'admin', 'user' or 'analyst'." });
    }

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: "User already exists." });

    // Fetch sport name to denormalize
    let favoriteSportName = '';
    if (favoriteSport) {
      const sportDoc = await Sport.findById(favoriteSport);
      if (sportDoc) {
        favoriteSportName = sportDoc.name;
      }
    }

    const newUser = { firstName, lastName, email, password, role, favoriteSport, favoriteSportName };

    if (req.file) {
      newUser.photo = req.file.buffer;
      newUser.photoType = req.file.mimetype;
    }

    await User.create(newUser);

    return res.status(201).json({ message: "User created successfully." });
  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
}

export async function googleLogin(req, res) {
  const { token } = req.body;
  if (!token) {
    return res.status(400).json({ error: "Google token is required." });
  }

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const { name, email, picture } = ticket.getPayload();

    let user = await User.findOne({ email });

    if (!user) {
      // User does not exist, create a new one
      const password = crypto.randomBytes(32).toString('hex');
      const firstName = name.split(' ')[0];
      const lastName = name.split(' ').slice(1).join(' ') || firstName;

      let photoBuffer = undefined;
      let photoType = undefined;

      if (picture) {
        try {
          const response = await fetch(picture);
          const arrayBuffer = await response.arrayBuffer();
          photoBuffer = Buffer.from(arrayBuffer);
          photoType = response.headers.get('content-type');
        } catch (fetchError) {
          console.error("Failed to fetch Google profile picture:", fetchError);
        }
      }

      user = await User.create({
        firstName,
        lastName,
        email,
        password, // This will be hashed by the pre-save hook
        photo: photoBuffer,
        photoType: photoType,
        status: "active"
      });
    }

    const appToken = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    const userProfile = await User.findById(user.id).select('-password');

    res.status(200).json({ message: "Login successful", token: appToken, user: userProfile });

  } catch (error) {
    console.error("Google Auth Error:", error);
    return res.status(401).json({ error: "Authentication failed. Invalid Google token." });
  }
}

export async function login(req, res) {
  if (handleValidation(req, res)) return;
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: "User not exist" });

    const ok = await user.matchPassword(password);
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });

    // ⭐ ADD THIS: Check if user account is active
    if (user.status === 'inactive') {
      return res.status(403).json({
        error: 'Your account has been disabled. Please contact an administrator.'
      });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    const userProfile = await User.findById(user.id).select('-password');

    return res.status(200).json({ message: "Login successful", token, user: userProfile });
  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
}