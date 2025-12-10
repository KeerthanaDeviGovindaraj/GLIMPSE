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
        backgroundColor: (theme) =>
          theme.palette.mode === 'light'
            ? theme.palette.grey[200]
            : theme.palette.grey[800],
      }}
    >
      <Container maxWidth="lg">
        <Stack direction="row" justifyContent="center" spacing={4} sx={{ mb: 2 }}>
          <Link component={RouterLink} to="/about" color="text.primary" underline="hover">
            About
          </Link>
          <Link component={RouterLink} to="/contact" color="text.primary" underline="hover">
            Contact Us
          </Link>
        </Stack>
        <Typography variant="body2" color="text.secondary" align="center">
          {'Copyright © '}
          {new Date().getFullYear()}
          {' Info Portal. All rights reserved.'}
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;