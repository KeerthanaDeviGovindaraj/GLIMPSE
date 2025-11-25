import { Routes, Route, Navigate } from "react-router-dom";
import { Box } from "@mui/material";
import { useSelector } from "react-redux";

import NavBar from "./components/NavBar";
import Home from "./pages/Common/Home";
import About from "./pages/Common/About";
import Login from "./pages/Common/Login";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <NavBar />
      <Box component="main" sx={{ flexGrow: 1, py: { xs: 2, md: 4 } }}>
        <Routes>
          {/* If logged in, redirect from /login to home */}
          <Route
            path="/login"
            element={isAuthenticated ? <Navigate to="/" /> : <Login />}
          />
          <Route path="/about" element={<About />} />
          <Route path="/" element={<ProtectedRoute element={Home} />} />
        </Routes>
      </Box>
    </Box>
  );
}

export default App
