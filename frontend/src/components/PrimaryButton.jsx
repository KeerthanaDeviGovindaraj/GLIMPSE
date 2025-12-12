
import { Button } from "@mui/material";

export default function PrimaryButton({ children, sx = {}, ...props }) {
  return (
    <Button
      variant="contained"
      disableElevation
      disableRipple
      sx={{
        textTransform: "none",
        borderRadius: 2,
        fontWeight: 600,
        letterSpacing: 0.3,
        px: 3,
        py: 1,
        bgcolor: "#0c554eff", 
        color: "#fff",
        "&:hover": {
          bgcolor: "#1ba898ff", 
        },
        "&:active": {
          bgcolor: "#173a36ff",
        },
        ...sx, 
      }}
      {...props}
    >
      {children}
    </Button>
  );
}
