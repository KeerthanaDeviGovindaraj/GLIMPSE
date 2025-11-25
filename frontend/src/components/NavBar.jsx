import * as React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Stack,
  Drawer,
  List,
  ListItemButton,
  useScrollTrigger,
  useMediaQuery
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import LoginIcon from "@mui/icons-material/Login";
import { NavLink, useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/slices/authSlice";

function ElevationScroll({ children }) {
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 4,
  });
  return React.cloneElement(children, { elevation: trigger ? 6 : 0 });
}

// -----------------------------
// MENU ITEMS PER ROLE
// -----------------------------
const commonPages = [
  { to: "/", label: "HOME" },
  { to: "/about", label: "ABOUT" },
];

const employeePages = [
  ...commonPages,
];

const analystPages = [
  ...commonPages,
  // { to: "/analyst/dashboard", label: "DASHBOARD" }, // Example for analyst
];

const adminPages = [
  ...commonPages,
];

const unauthedPages = [
  { to: "/", label: "HOME" },
  { to: "/about", label: "ABOUT" },
];

const linkSx = {
  px: 1.25,
  py: 0.5,
  borderRadius: 2,
  color: "white",
  textTransform: "none",
  "&:hover": { bgcolor: "rgba(255,255,255,0.12)" },
  "&.active": { bgcolor: "rgba(255,255,255,0.18)", fontWeight: 700 },
};

export default function NavBar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));
  const [open, setOpen] = React.useState(false);

  const { isAuthenticated, role, user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  // role-based menu
  const pages =
    !isAuthenticated
      ? unauthedPages
      : role === "admin"
      ? adminPages : role === "analyst"
      ? analystPages
      : employeePages;

  return (
    <ElevationScroll>
      <AppBar
        position="sticky"
        sx={{
          background: "linear-gradient(90deg, #0b6b61 0%, #0fa39e 100%)",
        }}
      >
        <Toolbar
          disableGutters
          sx={{
            px: { xs: 1.5, sm: 2, md: 3 },
            minHeight: { xs: 56, sm: 64 },
            gap: 1,
            display: "flex",
            alignItems: "center",
          }}
        >
          {/* Mobile Menu Icon */}
          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton
              color="inherit"
              onClick={() => setOpen(true)}
            >
              <MenuIcon />
            </IconButton>
          </Box>

          {/* Brand */}
          <Typography
            variant="h6"
            noWrap
            sx={{
              flexGrow: 1,
              fontWeight: 800,
              letterSpacing: 0.5,
              textAlign: { xs: "center", md: "left" },
            }}
          >
            Glimpse
          </Typography>

          {/* Desktop Menu */}
          <Stack
            direction="row"
            spacing={0.5}
            sx={{
              display: { xs: "none", md: "flex" },
              mr: 2,
            }}
          >
            {pages.map((p) => (
              <Button
                key={p.to}
                component={NavLink}
                to={p.to}
                sx={linkSx}
              >
                {p.label}
              </Button>
            ))}
          </Stack>

          {/* Right Side: Auth */}
          <Box>
            {isMdUp ? (
              isAuthenticated ? (
                <Stack direction="row" spacing={1} alignItems="center">
                  <Box sx={{ textAlign: "right", pr: 1.5 }}>
                    <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.9)" }}>
                      {user?.email}
                    </Typography>
                    <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.7)" }}>
                      ({role.charAt(0).toUpperCase() + role.slice(1)})
                    </Typography>
                  </Box>
                  <Button
                    color="inherit"
                    startIcon={<LogoutIcon />}
                    sx={{ textTransform: "none" }}
                    onClick={handleLogout}
                  >
                    LOGOUT
                  </Button>
                </Stack>
              ) : (
                <Button
                  color="inherit"
                  startIcon={<LoginIcon />}
                  sx={{ textTransform: "none" }}
                  onClick={() => navigate("/login")}
                >
                  LOG IN
                </Button>
              )
            ) : (
              <IconButton
                color="inherit"
                onClick={isAuthenticated ? handleLogout : () => navigate("/login")}
              >
                {isAuthenticated ? <LogoutIcon /> : <LoginIcon />}
              </IconButton>
            )}
          </Box>
        </Toolbar>

        {/* MOBILE DRAWER */}
        <Drawer anchor="left" open={open} onClose={() => setOpen(false)}>
          <Box sx={{ width: 260, p: 2 }}>
            <Typography
              variant="h6"
              sx={{ mb: 2, fontWeight: 800 }}
            >
              Glimpse
            </Typography>

            <List sx={{ py: 0 }}>
              {pages.map((p) => (
                <ListItemButton
                  key={p.to}
                  component={NavLink}
                  to={p.to}
                  sx={{ "&.active": { bgcolor: "action.selected", fontWeight: 700 } }}
                  onClick={() => setOpen(false)}
                >
                  {p.label}
                </ListItemButton>
              ))}
            </List>

            {isAuthenticated ? (
              <ListItemButton
                onClick={() => {
                  setOpen(false);
                  handleLogout();
                }}
              >
                LOGOUT
              </ListItemButton>
            ) : (
              <ListItemButton
                onClick={() => {
                  setOpen(false);
                  navigate("/login");
                }}
              >
                LOG IN
              </ListItemButton>
            )}
          </Box>
        </Drawer>
      </AppBar>
    </ElevationScroll>
  );
}
