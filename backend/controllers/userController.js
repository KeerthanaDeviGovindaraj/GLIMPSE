
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import User from "../models/User.js";
import path from "path";

function handleValidation(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ error: "Validation failed.", details: errors.array() });
    return true; 
  }
  return false;
}

export async function createUser(req, res) {
  if (handleValidation(req, res)) return;

  try {
    const { fullName, email, password, type } = req.body;

    // Validate type
    if (!["admin", "employee"].includes(type)) {
      return res.status(400).json({ error: "Invalid type. Must be 'admin' or 'employee'." });
    }

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: "User already exists." });

    const hash = await bcrypt.hash(password, 10);

    // Add type when creating user
    await User.create({ fullName, email, password: hash, type });

    return res.status(201).json({ message: "User created successfully." });
  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
}


export async function editUser(req, res) {
  if (handleValidation(req, res)) return;
  try {
    const { email, fullName, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found." });

    if (fullName) user.fullName = fullName;
    if (password) user.password = await bcrypt.hash(password, 10);

    await user.save();
    return res.status(200).json({ message: "User updated successfully." });
  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
}

export async function deleteUser(req, res) {
  try {
    const { email } = req.body;
    const user = await User.findOneAndDelete({ email });
    if (!user) return res.status(404).json({ error: "User not found." });
    return res.status(200).json({ message: "User deleted successfully." });
  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
}

export async function getAllUsers(req, res) {
  try {
    const users = await User.find({}, { fullName: 1, email: 1, imagePath: 1, _id: 0 });
    return res.status(200).json({ users });
  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
}

export async function getUsers(req, res) {
  try {
    // Admin-only endpoint: returns users WITHOUT password
    const users = await User.find({}, { password: 0, __v: 0 });

    return res.status(200).json(users);
  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
}


export async function uploadImage(req, res) {
  try {
    const email = req.body.email;
    if (!email) return res.status(400).json({ error: "Email is required." });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found." });

    if (user.imagePath) {
      return res.status(400).json({ error: "Image already exists for this user." });
    }

    if (!req.file) {
      return res.status(400).json({ error: "Invalid file format. Only JPEG, PNG, and GIF are allowed." });
    }

    const relPath = path.posix.join("/images", req.file.filename);
    user.imagePath = relPath;
    await user.save();

    return res.status(201).json({ message: "Image uploaded successfully.", filePath: relPath });
  } catch (err) {
    if (err?.message?.includes("Invalid file format")) {
      return res.status(400).json({ error: "Invalid file format. Only JPEG, PNG, and GIF are allowed." });
    }
    return res.status(500).json({ error: "Server error" });
  }
}

export async function login(req, res) {
  if (handleValidation(req, res)) return;
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: "User not exist" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });

    // Include user.type in JWT payload
    const token = jwt.sign(
      {
        sub: user.id,
        email: user.email,
        type: user.type, // <-- IMPORTANT
      },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        email: user.email,
        type: user.type,
      },
    });
  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
}
