import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import {
  TextField,
  Typography,
  Stack,
  Container,
  Card,
  CardContent,
  Button,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import PrimaryButton from "../../components/PrimaryButton";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

export default function AddCompany() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleDescriptionChange = (e) => {
    const { value } = e.target;
    const words = value.split(/\s+/).filter(Boolean);

    if (words.length > 10) {
      const trimmedValue = words.slice(0, 10).join(" ");
      setDescription(trimmedValue);
      setErrors({ ...errors, description: "Description cannot exceed 10 words." });
    } else {
      const newErrors = { ...errors };
      delete newErrors.description;
      setErrors(newErrors);
      setDescription(value);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      setErrors({ ...errors, image: "Invalid file format. Only JPEG, PNG, and GIF are allowed." });
      setImage(null); 
      e.target.value = null;
      return;
    }

    setImage(file);
    const newErrors = { ...errors };
    delete newErrors.image;
    setErrors(newErrors);
  };

  const handleSubmit = async () => {
    const newErrors = {};
    if (!name) newErrors.name = "Company name is required.";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const createResponse = await api.post("/companies/create", { name, description });
      const companyId = createResponse.data.company._id;

      if (image) {
        const formData = new FormData();
        formData.append("companyId", companyId);
        formData.append("image", image);

        await api.post("/companies/uploadImage", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      navigate("/companies", {
        state: { message: "Company created successfully!" },
      });
    } catch (error) {
      const errorMessage = error.response?.data?.error || "An unexpected error occurred.";
      setErrors({ submit: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <Card variant="outlined" sx={{ borderRadius: 3, width: "100%" }}>
        <CardContent sx={{ p: { xs: 3, md: 4 } }}>
          <Typography variant="h4" fontWeight={800} sx={{ mb: 1 }}>
            Add New Company
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
            Fill out the details to register a new company profile.
          </Typography>

          <Stack spacing={2.5}>
            <TextField
              name="name"
              label="Company Name"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={!!errors.name}
              helperText={errors.name}
              required
            />
            <TextField
              name="description"
              label="Company Description"
              fullWidth
              multiline
              rows={4}
              value={description}
              onChange={handleDescriptionChange}
              error={!!errors.description}
              helperText={errors.description || `${description.split(/\s+/).filter(Boolean).length || 0}/10 words`}
            />

            <Button
              component="label"
              variant="outlined"
              startIcon={<CloudUploadIcon />}
              sx={{ borderColor: "#ccc", color: "#555" }}
            >
              Upload Logo
              <input type="file" hidden accept="image/*" onChange={handleImageChange} />
            </Button>
            {image && (
              <Typography variant="body2" color="text.secondary">
                Selected: {image.name}
              </Typography>
            )}
            {errors.image && (
              <Typography color="error" variant="body2">{errors.image}</Typography>
            )}

            {errors.submit && (
              <Typography color="error" variant="body2">{errors.submit}</Typography>
            )}

            <Stack direction="row" spacing={2} sx={{ pt: 2 }}>
              <PrimaryButton onClick={handleSubmit}>CREATE COMPANY</PrimaryButton>
              <Button variant="outlined" onClick={() => navigate("/companies")} sx={{
                  borderColor: "#0c554eff",
                  color: "#0c554eff",
                  "&:hover": {
                    borderColor: "#1ba898ff",
                    color: "#1ba898ff"
                  },
                }}>
                BACK TO COMPANIES
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </Container>
  );
}