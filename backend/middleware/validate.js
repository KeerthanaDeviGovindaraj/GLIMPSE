import { body } from "express-validator";

const nameRegex = /^[A-Za-z ]+$/;
const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

export const createUserValidation = [
  body("fullName").exists().withMessage("fullName is required")
    .matches(nameRegex).withMessage("Full name must contain only alphabetic characters and spaces"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("password").matches(strongPasswordRegex).withMessage("Password must be at least 8 chars, include upper, lower, digit, and special char")
];

export const editUserValidation = [
  body("email").isEmail().withMessage("Valid email is required (identifies user)"),
  body("fullName").optional().matches(nameRegex).withMessage("Full name must contain only alphabetic characters and spaces"),
  body("password").optional().matches(strongPasswordRegex).withMessage("Password must be at least 8 chars, include upper, lower, digit, and special char")
];

export const loginValidation = [
  body("email").isEmail().withMessage("Valid email is required"),
  body("password").exists().withMessage("Password is required")
];
