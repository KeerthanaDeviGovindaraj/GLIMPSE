import * as React from "react";
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import PrimaryButton from "../../components/PrimaryButton.jsx";
import heroImg from "../../assets/image2.jpg";

export default function Home() {
  const navigate = useNavigate();

  //Redux replaces useAuth()
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const handleSearchClick = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    switch (user?.role) {
      case "admin":
        navigate("/admin/dashboard"); // Or another admin-specific page
        break;
      case "analyst":
        navigate("/analyst/dashboard"); // Or another analyst-specific page
        break;
      default: // for 'user'
        navigate("/dashboard"); // Redirect 'user' to their dashboard
    }
  };

  return (
    <>
      <Container maxWidth="lg" sx={{ px: 0 }}>
        {/* Hero Section */}
        <Card
          variant="outlined"
          sx={{
            borderRadius: 3,
            overflow: "hidden",
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            mb: { xs: 6, md: 8 },
          }}
        >
          <Box
            component="img"
            src={heroImg}
            alt="Career growth illustration"
            sx={{
              width: { xs: "100%", md: "50%" },
              height: { xs: 260, md: "auto" },
              objectFit: "contain",
              bgcolor: "#fff",
              p: 2,
            }}
          />

          <CardContent
            sx={{
              flex: 1,
              p: { xs: 3, md: 6 },
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: 2.5,
              bgcolor: "#fafafa",
            }}
          >
            <Typography variant="h4" fontWeight={800} sx={{ color: "#004d40" }}>
              Welcome to Your Dashboard
            </Typography>
            <Typography variant="body1" color="text.secondary">
              This is your personal space. You can manage your profile and explore
              features from here.
            </Typography>

            <PrimaryButton
              onClick={handleSearchClick}
              size="large"
              sx={{
                alignSelf: "flex-start",
                px: 4,
              }}
            >
              Go to Dashboard
            </PrimaryButton>
          </CardContent>
        </Card>
      </Container>
    </>
  );
}
