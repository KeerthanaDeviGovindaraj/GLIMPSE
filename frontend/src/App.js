import { Routes, Route, Navigate } from "react-router-dom";
import { Container, Box } from "@mui/material";
import { useSelector } from "react-redux";
import Home from "./pages/Common/Home";
import About from "./pages/Common/About";
import Contact from "./pages/Common/Contact";
import CompanyShowcase from "./pages/Common/CompanyShowcase";
import Login from "./pages/Common/Login";
import NavBar from "./components/NavBar";
import ProtectedRoute from "./components/ProtectedRoute";

import Employees from "./pages/Admin/Employees";
import AddJob from "./pages/Admin/AddJob";
import AddCompany from "./pages/Admin/AddCompany"; 
import EditCompany from "./pages/Admin/EditCompany";
import EmployeeJobs from "./pages/Employees/Jobs";

export default function App() {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#fafafa" }}>
      {isAuthenticated && <NavBar />}

      <Routes>
        {!isAuthenticated ? (
          <>
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </>
        ) : (
          <>
            {/* Authenticated Routes */}
            <Route
              path="/"
              element={
                <Container sx={{ py: 4 }}>
                  <Home />
                </Container>
              }
            />
            <Route
              path="/about"
              element={
                <Container sx={{ py: 4 }}>
                  <About />
                </Container>
              }
            />
            <Route
              path="/contact"
              element={
                <Container sx={{ py: 4 }}>
                  <Contact />
                </Container>
              }
            />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <Container sx={{ py: 4 }}>
                    <Employees />
                  </Container>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/add-job"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <Container sx={{ py: 4 }}>
                    <AddJob />
                  </Container>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/add-company"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <Container sx={{ py: 4 }}>
                    <AddCompany />
                  </Container>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/edit-company/:companyId"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <Container sx={{ py: 4 }}>
                    <EditCompany />
                  </Container>
                </ProtectedRoute>
              }
            />
            <Route
              path="/employee/jobs"
              element={
                <ProtectedRoute allowedRoles={["admin", "employee"]}>
                  <EmployeeJobs />
                </ProtectedRoute>
              }
            />
            <Route
              path="/companies"
              element={
                <ProtectedRoute allowedRoles={["admin", "employee"]}>
                  <CompanyShowcase />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" />} />
          </>
        )}
      </Routes>
    </Box>
  );
}
