import multer from "multer";
import path from "path";
import fs from "fs";

const imagesDir = path.join(process.cwd(), "images");
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, imagesDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const safeBase = path
      .basename(file.originalname, ext)
      .replace(/[^a-z0-9-_]/gi, "_");
    cb(null, `${Date.now()}_${safeBase}${ext}`);
  },
});

const ALLOWED = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
]);

function fileFilter(req, file, cb) {
  console.log(
    "[upload] field=%s name=%s mimetype=%s",
    file.fieldname,
    file.originalname,
    file.mimetype
  );

  if (!ALLOWED.has(file.mimetype)) {
    return cb(new Error("Invalid file format. Only JPEG, PNG, and GIF are allowed."));
  }
  return cb(null, true);
}

export const uploadSingleImage = multer({ storage, fileFilter }).single("image");
