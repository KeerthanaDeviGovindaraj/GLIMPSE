import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
  IconButton,
} from "@mui/material";
import PrimaryButton from "../../components/PrimaryButton";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';

export default function EditCompany() {
  const { companyId } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", description: "" });
  const [existingImage, setExistingImage] = useState(null);
  const [image, setImage] = useState(null);
  const [removeImage, setRemoveImage] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    api.get(`/companies/${companyId}`)
      .then(res => {
        const { name, description, imagePath } = res.data;
        setForm({ name, description });
        if (imagePath) {
          setRemoveImage(false); 
          setExistingImage(imagePath.split("/").pop());
        }
        setPageLoading(false);
      })
      .catch(err => {
        console.error(err);
        setErrors({ submit: "Failed to load company data." });
        setPageLoading(false);
      });
  }, [companyId]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "description") {
      const words = value.split(/\s+/).filter(Boolean);
      if (words.length > 10) {
        // Trim the value to 10 words and update the state
        const trimmedValue = words.slice(0, 10).join(" ");
        setForm({ ...form, [name]: trimmedValue });
        setErrors({ ...errors, description: "Description cannot exceed 10 words." });
      } else {
        const newErrors = { ...errors };
        delete newErrors.description;
        setErrors(newErrors);
        setForm({ ...form, [name]: value });
      }
    } else {
      setForm({ ...form, [name]: value });
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
    setRemoveImage(false); 
    const newErrors = { ...errors };
    delete newErrors.image;
    setErrors(newErrors);
  };

  const handleSubmit = async () => {
    const newErrors = {};
    if (!form.name) {
      newErrors.name = "Company name is required.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setPageLoading(true);


    try {
      await api.put(`/companies/edit/${companyId}`, { ...form, removeImage });

      if (image) {
        const formData = new FormData();
        formData.append("companyId", companyId);
        formData.append("image", image);
        await api.post("/companies/uploadImage", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      navigate("/companies", {
        state: { message: "Company updated successfully!" },
      });
    } catch (error) {
      const errorMessage = error.response?.data?.error || "An unexpected error occurred.";
      setErrors({ submit: errorMessage });
    } finally {
      setPageLoading(false);
    }
  };

  const handleRemoveImage = () => {
    setExistingImage(null);
    setImage(null);
    setRemoveImage(true);
  };

  if (pageLoading && !form.name) {
    return <Container sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Container>;
  }

  return (
    <Container maxWidth="md">
      <Backdrop
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={pageLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <Card variant="outlined" sx={{ borderRadius: 3, width: "100%" }}>
        <CardContent sx={{ p: { xs: 3, md: 4 } }}>
          <Typography variant="h4" fontWeight={800} sx={{ mb: 1 }}>
            Edit Company
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
            Update the company name, description, or upload a new logo.
          </Typography>

          <Stack spacing={2.5}>
            <TextField
              name="name"
              label="Company Name"
              fullWidth
              value={form.name}
              onChange={handleChange}
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
              value={form.description}
              onChange={handleChange}
              error={!!errors.description}
              helperText={errors.description || `${form.description?.split(/\s+/).filter(Boolean).length || 0}/10 words`}
            />
            <Button
              component="label"
              variant="outlined"
              startIcon={<CloudUploadIcon />}
              sx={{ borderColor: "#ccc", color: "#555" }}
            >
              Upload New Logo
              <input type="file" hidden accept="image/*" onChange={handleImageChange} />
            </Button>
            
            {existingImage && !image && !removeImage && (
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography variant="body2" color="text.secondary">
                  Current logo: {existingImage}
                </Typography>
                <IconButton onClick={handleRemoveImage} size="small" aria-label="remove current logo">
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Stack>
            )}
            {removeImage && (
                <Typography variant="body2" color="text.secondary">Logo will be removed on save.</Typography>
            )}

            {image && (
              <Typography variant="body2" color="text.secondary">
                New logo selected: {image.name}
              </Typography>
            )}
            {errors.image && (
              <Typography color="error" variant="body2">{errors.image}</Typography>
            )}
            {errors.submit && (
              <Typography color="error" variant="body2">{errors.submit}</Typography>
            )}
            <Stack direction="row" spacing={2} sx={{ pt: 2 }}>
              <PrimaryButton onClick={handleSubmit}>SAVE CHANGES</PrimaryButton>
              <Button variant="outlined" onClick={() => navigate("/companies")} sx={{
                  borderColor: "#0c554eff",
                  color: "#0c554eff",
                  "&:hover": {
                    borderColor: "#1ba898ff",
                    color: "#1ba898ff"
                  },
                }}>
                CANCEL
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </Container>
  );
}