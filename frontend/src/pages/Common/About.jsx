
import {
  Box, Typography, Grid, Stack, Avatar, Button, Container
} from "@mui/material";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import '../../components/styles/CommonStyles.css';

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
    <div className="auth-card" style={{ padding: '40px', maxWidth: '100%' }}>
      {/* Header */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        gap={2.5}
        alignItems={{ xs: "flex-start", sm: "center" }}
        justifyContent="space-between"
      >
        <Stack direction="row" alignItems="center" spacing={2}>
          <Avatar 
            src={avatar} 
            alt={name} 
            sx={{ 
              width: 80, 
              height: 80,
              border: '2px solid rgba(255, 255, 255, 0.2)'
            }} 
          />
          <Box>
            <Typography variant="h5" fontWeight={700} sx={{ color: 'var(--text-primary)', fontFamily: '"Cormorant Garamond", serif' }}>
              {name}
            </Typography>
            <Typography sx={{ color: 'var(--text-tertiary)' }}>{role}</Typography>
          </Box>
        </Stack>

        <Button
          size="small"
          variant="outlined"
          startIcon={<LinkedInIcon />}
          href={linkedin}
          target="_blank"
          rel="noreferrer"
          sx={{ 
            textTransform: "none", 
            borderRadius: 2,
            borderColor: 'rgba(255, 255, 255, 0.3)',
            color: 'var(--text-primary)',
            '&:hover': {
              borderColor: 'var(--netflix-red)',
              backgroundColor: 'rgba(229, 9, 20, 0.1)'
            }
          }}
        >
          LinkedIn
        </Button>
      </Stack>

      <Box sx={{ my: 3, borderTop: '1px solid rgba(255, 255, 255, 0.1)' }} />

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
            <div
              style={{
                padding: '16px',
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                width: '100%',
                display: "flex",
                alignItems: "center",
              }}
            >
              <Typography variant="body1" sx={{ color: 'var(--text-secondary)' }}>{h}</Typography>
            </div>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}

export default function About() {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <div className="auth-container" style={{ alignItems: 'flex-start', paddingTop: '40px', height: 'auto', minHeight: '100vh' }}>
      <Container maxWidth="lg">
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(isAuthenticated ? '/' : '/login')}
          sx={{ 
            mb: 4, 
            color: 'var(--text-primary)',
            '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' }
          }}
        >
          Back
        </Button>

        {/* Our Mission */}
        <Box sx={{ textAlign: "center", mb: 8 }}>
          <Typography variant="h3" fontWeight={800} gutterBottom sx={{ color: 'var(--text-primary)', fontFamily: '"Cormorant Garamond", serif' }}>
            OUR MISSION
          </Typography>
          <Typography variant="h6" sx={{ maxWidth: 900, mx: "auto", color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            We empower you with equal opportunities to build your dream career.
            Applying to numerous jobs without a clear strategy won’t land the ideal role.
            With Glimpse's AI job copilot, you’ll be connected to the best opportunities
            and guided at every step - so the offer you deserve comes sooner.
          </Typography>
        </Box>

        {/* Founders */}
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography variant="h4" fontWeight={800} sx={{ color: 'var(--text-primary)', fontFamily: '"Cormorant Garamond", serif' }}>
            FOUNDERS
          </Typography>
          <Typography sx={{ mt: 1, mb: 3, color: 'var(--text-tertiary)' }}>
            We are a small and mighty team of AI pioneers.
          </Typography>
        </Box>

        {/* founder card*/}
        <FounderCard />
      </Container>
    </div>
  );
}
