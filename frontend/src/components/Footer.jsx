import React from 'react';
import { Box, Container, Typography, Link, Stack } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: '#0f0f0f',
        borderTop: '1px solid rgba(255, 255, 255, 0.12)',
        color: '#fff',
      }}
    >
      <Container maxWidth="lg">
        <Stack direction="row" justifyContent="center" spacing={4} sx={{ mb: 2 }}>
          <Link
            component={RouterLink}
            to="/about"
            color="inherit"
            underline="hover"
            sx={{
              opacity: 0.7,
              transition: 'all 0.3s ease',
              '&:hover': { opacity: 1, color: '#E50914' },
            }}
          >
            About
          </Link>
          <Link
            component={RouterLink}
            to="/contact"
            color="inherit"
            underline="hover"
            sx={{
              opacity: 0.7,
              transition: 'all 0.3s ease',
              '&:hover': { opacity: 1, color: '#E50914' },
            }}
          >
            Contact Us
          </Link>
        </Stack>
        <Typography variant="body2" align="center" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
          {'Copyright © '}
          {new Date().getFullYear()}
          {' Glimpse. All rights reserved.'}
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;