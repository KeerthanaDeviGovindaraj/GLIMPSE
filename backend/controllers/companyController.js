import Company from "../models/Company.js";
import path from "path";
import fs from "fs/promises";

export async function createCompany(req, res) {
  try {
    const { name, description } = req.body;
    if (!name) {
      return res.status(400).json({ error: "Company name is required." });
    }
    if (description) {
      const words = description.split(/\s+/).filter(Boolean);
      if (words.length > 10) {
        return res.status(400).json({ error: "Description cannot exceed 10 words." });
      }
    }

    const company = new Company({ name, description });
    await company.save();
    return res.status(201).json({ message: "Company created successfully", company });
  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
}

export async function uploadCompanyImage(req, res) {
  try {
    const { companyId } = req.body;
    if (!companyId) return res.status(400).json({ error: "Company ID is required." });

    const company = await Company.findById(companyId);
    if (!company) return res.status(404).json({ error: "Company not found." });

    if (!req.file) {
      return res.status(400).json({ error: "Image file is required." });
    }

    const relPath = path.posix.join("/images", req.file.filename);
    company.imagePath = relPath;
    await company.save();

    return res.status(200).json({ message: "Image uploaded successfully.", company });
  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
}

export async function getAllCompanies(req, res) {
  try {
    const companies = await Company.find({});
    return res.status(200).json(companies);
  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
}

export async function getCompanyById(req, res) {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) return res.status(404).json({ error: "Company not found." });
    return res.status(200).json(company);
  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
}

export async function editCompany(req, res) {
  try {
    const { name, description, removeImage } = req.body;
    const company = await Company.findById(req.params.id);
    if (!company) return res.status(404).json({ error: "Company not found." });

    if (name) company.name = name;
    if (description !== undefined) {
      const words = (description || "").split(/\s+/).filter(Boolean);
      if (words.length > 10) {
        return res.status(400).json({ error: "Description cannot exceed 10 words." });
      }
      company.description = description;
    }

    if (removeImage && company.imagePath) {
      try {
        const oldImagePath = path.join(process.cwd(), 'public', company.imagePath);
        await fs.unlink(oldImagePath);
        company.imagePath = undefined; // Remove the image path
      } catch (err) {
        // Log the error but don't block the request if file deletion fails
        console.error("Failed to delete old image:", err.message);
      }
    }

    await company.save();
    return res.status(200).json({ message: "Company updated successfully", company });
  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
}