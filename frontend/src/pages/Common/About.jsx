
import {
  Box, Typography, Grid, Paper, Stack, Avatar, Divider, Button
} from "@mui/material";
import LinkedInIcon from "@mui/icons-material/LinkedIn";

function FounderCard({
  name = "Rushitaben Vachhani",
  role = "Co-Founder & CTO",
  avatar = "https://media.licdn.com/dms/image/v2/D4D03AQGhVpCOH880_Q/profile-displayphoto-crop_800_800/B4DZm6RPDRJAAI-/0/1759766704750?e=1764806400&v=beta&t=IM1qKPf6D7zsi3DYdWnqtBT3Svlf-Fa8qNiA5Z7zG7o",
  highlights = [
    "M.S. in CS from Northeastern University",
    "Worked for Google and Microsoft",
    "Guided 50+ Students in Career Transitions"
  ],
  linkedin = "https://www.linkedin.com/in/rushita-vachhani/"
}) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2.5, md: 4 },
        borderRadius: 4,
        bgcolor: "#f6f8fb",
        border: "1px solid",
        borderColor: "divider",
        width: "100%",
      }}
    >
      {/* Header */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        gap={2.5}
        alignItems={{ xs: "flex-start", sm: "center" }}
        justifyContent="space-between"
      >
        <Stack direction="row" alignItems="center" spacing={2}>
          <Avatar src={avatar} alt={name} sx={{ width: 72, height: 72 }} />
          <Box>
            <Typography variant="h5" fontWeight={700}>
              {name}
            </Typography>
            <Typography color="text.secondary">{role}</Typography>
          </Box>
        </Stack>

        <Button
          size="small"
          variant="outlined"
          startIcon={<LinkedInIcon />}
          href={linkedin}
          target="_blank"
          rel="noreferrer"
          sx={{ textTransform: "none", borderRadius: 2 }}
        >
          LinkedIn
        </Button>
      </Stack>

      <Divider sx={{ my: 3 }} />

      {/* Highlights */}
      <Grid container spacing={2}>
        {highlights.map((h, i) => (
          <Grid
            item
            xs={12}
            sm={6}
            key={i}
            sx={{
              display: "flex",
              alignItems: "stretch",
            }}
          >
            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: 3,
                bgcolor: "white",
                border: "1px solid",
                borderColor: "divider",
                flexGrow: 1,
                display: "flex",
                alignItems: "center",
              }}
            >
              <Typography variant="body1">{h}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
}

export default function About() {
  return (
    <>
      {/* Our Mission */}
      <Box sx={{ textAlign: "center", mb: { xs: 6, md: 0 } }}>
        <Typography variant="h3" fontWeight={800} gutterBottom>
          OUR MISSION
        </Typography>
        <Typography variant="h6" sx={{ maxWidth: 900, mx: "auto" }} color="text.secondary">
          We empower you with equal opportunities to build your dream career.
          Applying to numerous jobs without a clear strategy won’t land the ideal role.
          With JobBest’s AI job copilot, you’ll be connected to the best opportunities
          and guided at every step - so the offer you deserve comes sooner.
        </Typography>
      </Box>

      {/* Founders */}
      <Box sx={{ textAlign: "center", mb: 3, mt: 2 }}>
        <Typography variant="h4" fontWeight={800}>FOUNDERS</Typography>
        <Typography color="text.secondary" sx={{ mt: 1, mb: 3 }}>
          We are a small and mighty team of AI pioneers.
        </Typography>
      </Box>

      {/* founder card*/}
      <FounderCard />
    </>
  );
}
