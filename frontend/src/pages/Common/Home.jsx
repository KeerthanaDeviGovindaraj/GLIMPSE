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
              Find your job better and faster
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Discover roles that match your skills and interests. Start searching and
              apply with confidence.
            </Typography>

            <PrimaryButton
              onClick={handleSearchClick}
              size="large"
              sx={{
                alignSelf: "flex-start",
                px: 4,
              }}
            >
              Browse Jobs
            </PrimaryButton>
          </CardContent>
        </Card>

        {/* Features Section */}
        <Grid
          container
          spacing={3}
          sx={{
            mb: 8,
            justifyContent: "center",
            alignItems: "stretch",
          }}
        >
          {[
            {
              title: "Curated Jobs",
              body: "Browse a hand-picked list of opportunities with clear skills and salary ranges.",
            },
            {
              title: "Company Showcase",
              body: "Explore companies and see real profile images pulled from the backend.",
            },
            {
              title: "Fast Apply",
              body: "Jump straight to the application with one click from the listings.",
            },
            {
              title: "AI Career Guidance",
              body: "Use smart suggestions to tailor your resume and find jobs that fit your long-term goals.",
            },
          ].map((f, i) => (
            <Grid item xs={12} sm={6} md={3} key={i} sx={{ display: "flex" }}>
              <Paper
                variant="outlined"
                sx={{
                  p: 3,
                  borderRadius: 2,
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-start",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: 3,
                  },
                }}
              >
                <Typography variant="h6" fontWeight={700}>
                  {f.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {f.body}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
}
