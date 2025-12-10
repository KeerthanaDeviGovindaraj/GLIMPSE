import * as React from "react";
import {
  Container,
  Card,
  CardContent,
  Typography,
  TextField,
  Stack,
  Box,
  Alert,
  InputAdornment,
  IconButton,
  Backdrop,
  CircularProgress,
  Button,
  Autocomplete,
} from "@mui/material";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import api from "../../services/api.js";
import PrimaryButton from "../../components/PrimaryButton.jsx";
import heroImg from "../../assets/image2.jpg";
import { Visibility, VisibilityOff, PhotoCamera } from "@mui/icons-material";

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = React.useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    favoriteSport: "",
    photo: null,
  });
  const [showPassword, setShowPassword] = React.useState(false);
  const [errors, setErrors] = React.useState({});
  const [success, setSuccess] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [sports, setSports] = React.useState([]);

  React.useEffect(() => {
    const fetchSports = async () => {
      try {
        const { data } = await api.get("/sports");
        setSports(data.sort((a, b) => a.name.localeCompare(b.name)));
      } catch (error) {
        console.error("Failed to fetch sports", error);
      }
    };
    fetchSports();
  }, []);

  const validate = (fieldValues = formData) => {
    let tempErrors = { ...errors };

    if ("firstName" in fieldValues) {
      tempErrors.firstName = fieldValues.firstName ? "" : "First name is required.";
    }
    if ("lastName" in fieldValues) {
      tempErrors.lastName = fieldValues.lastName ? "" : "Last name is required.";
    }
    if ("email" in fieldValues) {
      tempErrors.email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fieldValues.email)
        ? ""
        : "Email is not valid.";
    }
    if ("password" in fieldValues) {
      tempErrors.password = fieldValues.password.length >= 8 ? "" : "Password must be at least 8 characters long.";
    }
    if ("confirmPassword" in fieldValues) {
      tempErrors.confirmPassword =
        fieldValues.password === fieldValues.confirmPassword
          ? ""
          : "Passwords do not match.";
    }

    setErrors({ ...tempErrors });

    // Return true if the form is valid
    return Object.values(tempErrors).every(x => x === "");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Optionally, validate on change
    validate({ [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, photo: e.target.files[0] }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    validate({ [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");

    if (!validate()) {
      return;
    }

    setLoading(true);

    const submissionData = new FormData();
    Object.keys(formData).forEach(key => {
      if (key !== 'confirmPassword') {
        submissionData.append(key, formData[key]);
      }
    });

    try {
      await api.post("/auth/register", submissionData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccess("Registration successful! Please log in.");
      setTimeout(() => navigate("/login"), 2000);

    } catch (err) {
      setErrors({ api: err?.response?.data?.error || "Registration failed. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <Typography
        variant="h3"
        fontWeight={800}
        sx={{ textAlign: "center", mb: { xs: 6, md: 4 }, mt: { xs: 2, md: 4 } }}
        gutterBottom
      >
        CREATE ACCOUNT
      </Typography>

      <Container
        maxWidth="lg"
        sx={{ display: "flex", justifyContent: "center", alignItems: "center", mb: 4 }}
      >
        <Card
          variant="outlined"
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            borderRadius: 3,
            overflow: "hidden",
            width: "100%",
            maxWidth: "900px",
          }}
          component="form"
          onSubmit={handleSubmit}
        >
          {/* Left Side: Image */}
          <Box
            component="img"
            src={heroImg}
            alt="Registration illustration"
            sx={{
              width: { xs: "100%", md: "50%" },
              height: { xs: 240, md: "auto" },
              objectFit: "contain",
              bgcolor: "#fff",
              p: 2,
            }}
          />

          {/* Right Side: Form */}
          <CardContent
            sx={{
              flex: 1,
              p: { xs: 3, md: 4 },
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              bgcolor: "#fafafa",
            }}
          >
            <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>
              Join Us Today
            </Typography>

            {errors.api && <Alert severity="error" sx={{ mb: 2 }}>{errors.api}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

            <Stack spacing={2}>
              <Stack direction="row" spacing={2}>
                <TextField
                  label="First Name"
                  name="firstName"
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  required
                  fullWidth
                  error={!!errors.firstName}
                  helperText={errors.firstName}
                />
                <TextField
                  label="Last Name"
                  name="lastName"
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  required
                  fullWidth
                  error={!!errors.lastName}
                  helperText={errors.lastName}
                />
              </Stack>
              <TextField
                label="Email"
                name="email"
                type="email"
                onChange={handleInputChange}
                onBlur={handleBlur}
                required
                fullWidth
                error={!!errors.email}
                helperText={errors.email}
              />
              <Autocomplete
                fullWidth
                options={sports}
                getOptionLabel={(option) => option.name}
                value={sports.find((s) => s._id === formData.favoriteSport) || null}
                onChange={(event, newValue) => {
                  setFormData((prev) => ({
                    ...prev,
                    favoriteSport: newValue ? newValue._id : "",
                  }));
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Favorite Sport" />
                )}
                isOptionEqualToValue={(option, value) => option._id === value._id}
              />
              <TextField
                label="Password"
                name="password"
                type={showPassword ? "text" : "password"}
                onChange={handleInputChange}
                onBlur={handleBlur}
                required
                fullWidth
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                error={!!errors.password}
                helperText={errors.password}
              />
              <TextField
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                onChange={handleInputChange}
                onBlur={handleBlur}
                required
                fullWidth
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
              />

              <Button
                variant="outlined"
                component="label"
                startIcon={<PhotoCamera />}
              >
                Upload Profile Photo
                <input type="file" name="photo" hidden accept="image/*" onChange={handleFileChange} />
              </Button>
              {formData.photo && (
                <Typography variant="body2" color="text.secondary">
                  Selected: {formData.photo.name}
                </Typography>
              )}

              <PrimaryButton type="submit" disabled={loading}>
                {loading ? "Creating Account..." : "REGISTER"}
              </PrimaryButton>

              <Typography variant="body2" sx={{ textAlign: 'center', mt: 2 }}>
                Already have an account?{' '}
                <RouterLink to="/login" style={{ textDecoration: 'none' }}>
                  Log In
                </RouterLink>
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      </Container>
    </>
  );
}