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
} from "@mui/material";
import PrimaryButton from '../../components/PrimaryButton';
import heroImg from '../../assets/image2.jpg';


export default function Contact() {
  const [formState, setFormState] = React.useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (Object.values(formState).some((field) => field === "")) {
      setError("All fields are required.");
      return;
    }
    setSuccess("Your message has been sent successfully!");
    setFormState({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <>
      <Container maxWidth="lg" sx={{ display: "flex", justifyContent: "center" }}>
        <Card
          variant="outlined"
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            borderRadius: 3,
            overflow: "hidden",
            width: "100%",
            maxWidth: "1100px", 
          }}
          component="form"
          onSubmit={handleSubmit}
        >
          {/* Left: Image */}
          <Box
            component="img"
            src={heroImg}
            alt="Contact illustration"
            sx={{
              width: { xs: "100%", md: "55%" },
              height: { xs: 240, md: "auto" },
              objectFit: "contain", 
              bgcolor: "#ffffff",
              p: 2, 
            }}
          />

          {/* Right: Form */}
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
            <Typography variant="h5" fontWeight={700} sx={{ mb: 1 }}>
              Get in Touch
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Have questions about JobBest, jobs, or companies? Reach out and our
              team will respond as soon as possible.
            </Typography>

            <Stack spacing={2}>
              <TextField
                label="Your Name"
                name="name"
                value={formState.name}
                onChange={handleChange}
                required
                fullWidth
              />
              <TextField
                label="Your Email"
                name="email"
                type="email"
                value={formState.email}
                onChange={handleChange}
                required
                fullWidth
              />
              <TextField
                label="Subject"
                name="subject"
                value={formState.subject}
                onChange={handleChange}
                required
                fullWidth
              />
              <TextField
                label="Message"
                name="message"
                value={formState.message}
                onChange={handleChange}
                required
                fullWidth
                multiline
                rows={4}
              />
              {error && <Alert severity="error">{error}</Alert>}
              {success && <Alert severity="success">{success}</Alert>}
              <PrimaryButton
                type="submit"
                sx={{ alignSelf: "flex-start", px: 4 }}
              >
                SEND
              </PrimaryButton>
            </Stack>
          </CardContent>
        </Card>
      </Container>
    </>
  );
}
