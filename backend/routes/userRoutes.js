import express from "express";
import {
  createUser,
  editUser,
  deleteUser,
  getAllUsers,
  getUsers,
  uploadImage,
  login
} from "../controllers/userController.js";

import { authRequired } from "../middleware/auth.js";
import multer from "multer";
import path from "path";
import { body } from "express-validator";

const storage = multer.diskStorage({
  destination: "public/images/",
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "user-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  if (allowedTypes.test(file.mimetype) && allowedTypes.test(path.extname(file.originalname).toLowerCase())) {
    return cb(null, true);
  }
  cb(new Error("Invalid file format. Only JPEG, PNG, and GIF are allowed."));
};
const upload = multer({ storage: storage, fileFilter: fileFilter });

const router = express.Router();

// ----------------------------
// PUBLIC ROUTES
// ----------------------------

// CREATE USER (admin or employee)
router.post(
  "/user/create",
  [
    body("fullName").notEmpty().withMessage("Full name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").notEmpty().withMessage("Password is required"),
    body("type")
      .isIn(["admin", "employee"])
      .withMessage("Type must be admin or employee"),
  ],
  createUser
);

// LOGIN
router.post(
  "/auth/login",
  [
    body("email").isEmail().withMessage("Email is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  login
);

// ----------------------------
// PROTECTED ROUTES
// ----------------------------

// EDIT USER
router.put(
  "/user/edit",
  authRequired,
  [
    body("email").isEmail().withMessage("Valid email is required"),
    body("fullName").optional().isString(),
    body("password").optional().isString(),
  ],
  editUser
);

// DELETE USER
router.delete(
  "/user/delete",
  authRequired,
  [body("email").isEmail().withMessage("Valid email is required")],
  deleteUser
);

// GET ALL USERS (with password)
router.get("/getAll", authRequired, getAllUsers);

// UPLOAD IMAGE
router.post(
  "/user/uploadImage",
  authRequired,
  upload.single("image"), 
  [body("email").isEmail().withMessage("Valid email is required")],
  uploadImage
);

// ADMIN USER LIST (no password)
router.get("/users", authRequired, getUsers);

export default router;
