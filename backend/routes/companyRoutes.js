import express from "express";
import multer from "multer";
import path from "path";
import { authRequired } from "../middleware/auth.js";
import {
  createCompany,
  getAllCompanies,
  uploadCompanyImage,
  getCompanyById,
  editCompany,
} from "../controllers/companyController.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: "public/images/",
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "company-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const mimetype = allowedTypes.test(file.mimetype);
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());

  if (mimetype && extname) {
    return cb(null, true);
  }
  cb(new Error("Invalid file format. Only JPEG, PNG, and GIF are allowed."));
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

router.get("/", authRequired, getAllCompanies);
router.post("/create", authRequired, createCompany); 
router.get("/:id", authRequired, getCompanyById);
router.put("/edit/:id", authRequired, editCompany);
router.post("/uploadImage", authRequired, upload.single("image"), uploadCompanyImage); 

export default router;