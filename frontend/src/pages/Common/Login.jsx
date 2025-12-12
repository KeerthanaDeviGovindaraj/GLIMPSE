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
} from "@mui/material";

import { useNavigate, Link as RouterLink } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../redux/slices/authSlice.js";
import api from "../../services/api.js";

import PrimaryButton from "../../components/PrimaryButton.jsx";
import heroImg from "../../assets/image2.jpg";
import { Visibility, VisibilityOff } from "@mui/icons-material";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (e) => e.preventDefault();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!password.trim()) {
      setError("Password cannot be empty.");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password });
      const { token, user } = res.data;

      // Ensure user and token exist before proceeding
      if (!user || !token) {
        setError("Login failed: Invalid response from server.");
        return;
      }

      // Save to Redux
      dispatch(
        setCredentials({ token, user })
      );

      // Redirect based on role
      // Use the user object from the API response for redirection
      // switch (user.role) {
      //   case "admin":
      //     navigate("/admin/dashboard"); // Or another admin-specific page
      //     break;
      //   case "analyst":
      //     navigate("/analyst/dashboard"); // Or another analyst-specific page
      //     break;
      //   default:
      //     navigate("/dashboard"); // Redirect 'user' to their dashboard
      // }

      // Navigate to commentary page for all users
navigate("/commentary");

    } catch (err) {
      // This will show the full error object in the browser console
      console.error("Login API Error:", err); 
      setError(err?.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Page Title */}
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
        LOGIN
      </Typography>

      <Container
        maxWidth="lg"
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
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
            alt="Login illustration"
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
              p: { xs: 3, md: 6 },
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              bgcolor: "#fafafa",
            }}
          >
            <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>
              Welcome
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Sign in to your account to continue exploring opportunities and companies.
            </Typography>

            <Stack spacing={2}>
              <TextField
                label="Email"
                type="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                fullWidth
              />
              <TextField
                label="Password"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                fullWidth
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <RouterLink to="/forgot-password" style={{ textDecoration: 'none', color: '#1976d2', fontSize: '0.875rem' }}>
                  Forgot Password?
                </RouterLink>
              </Box>

              {error && <Alert severity="error">{error}</Alert>}

              <PrimaryButton type="submit">LOG IN</PrimaryButton>

              <Typography variant="body2" sx={{ textAlign: 'center', mt: 2 }}>
                Don't have an account?{' '}
                <RouterLink to="/register" style={{ textDecoration: 'none' }}>
                  Sign Up
                </RouterLink>
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      </Container>
    </>
  );
}
