import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchJobs } from "../../redux/slices/jobSlice";
import {
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  Pagination,
  Snackbar,
  Alert,
  Container,
  Fab,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate, useLocation } from "react-router-dom";
import PrimaryButton from "../../components/PrimaryButton";

export default function EmployeeJobs() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { items, loading } = useSelector((state) => state.jobs);
  const { user } = useSelector((state) => state.auth);

  // Pagination
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const paginated = items.slice((page - 1) * pageSize, page * pageSize);
  
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });

  useEffect(() => {
    dispatch(fetchJobs());

    if (location.state?.message) {
      setSnackbar({ open: true, message: location.state.message });
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [dispatch, location.pathname, location.state?.message, navigate]);

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={5000} 
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Floating Action Button for Admin */}
      {user?.type === "admin" && (
        <Fab
          variant="extended"
          color="primary"
          aria-label="add job"
          onClick={() => navigate("/admin/add-job")}
          sx={{
            position: "fixed",
            borderRadius: 2,
            top: { xs: 72, md: 85 }, 
            right: { xs: 16, md: 32 },
            bgcolor: "#0c554eff",
            "&:hover": { bgcolor: "#1ba898ff" },
          }}
        >
          <AddIcon sx={{ mr: 1 }} />
          Add Job
        </Fab>
      )}

    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      height: 'calc(100vh - 88px)'
    }}>
      {/* Scrollable Job List Area (70% height) */}
      <Container maxWidth="lg" sx={{
        flex: '1 1 100%',
        overflowY: 'auto',
        overflowX: 'hidden', 
        px: { xs: 2, md: 4 },
        pt: 3,
        pb: 0,
      }}>
        <Typography variant="h4" fontWeight={800} sx={{ mb: 3 }}>
          User Dashboard
        </Typography>
        <Box sx={{ py: 2 }}>
          {paginated.map((job, idx) => (
            <JobCard key={job.id || idx} job={job} userType={user?.type} />
          ))}
        </Box>
      </Container>

      {/* Fixed Pagination Area (20% height) */}
      <Box sx={{
        flexShrink: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        py: 2,
        borderTop: '1px solid #e0e0e0',
        bgcolor: 'background.paper',
        boxShadow: '0 -2px 10px rgba(0,0,0,0.05)'
      }}>
        <Pagination
          count={Math.ceil(items.length / pageSize)}
          page={page}
          onChange={(e, val) => setPage(val)}
          color="primary"
          size="large"
          sx={{
            "& .Mui-selected": {
              backgroundColor: "#0c554eff !important",
              color: "#fff",
            },
            "& .Mui-selected:hover": {
              backgroundColor: "#1ba898ff !important",
            },
          }}
        />
      </Box>
    </Box>
    </>
  );
}

/* --------------- Job Card Component --------------- */
function JobCard({ job, userType }) {
  return (
    <Card
      elevation={1}
      sx={{
        width: "100%",
        borderRadius: 2,
        mb: 1.5,
        border: "1px solid #e0e0e0",
        transition: "box-shadow 0.2s ease-in-out",
        "&:hover": {
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        },
        "&:last-of-type": {
          mb: 1,
        },
      }}
    >
      <CardContent 
        sx={{ 
          display: "flex", 
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 1,
          p: 3,
          "&:last-child": { pb: 3 },
          flexDirection: { xs: "column", md: "row" }
        }}  
      >
        {/* Left Content */}
        <Box sx={{ 
          flex: 1, 
          minWidth: 0,
          width: "100%"
        }}>
          <Typography
            variant="h6"
            component="h2"
            fontWeight={700}
            sx={{ 
              color: "#1a1a1a", 
              mb: 0.5,
              fontSize: { xs: "1.1rem", md: "1.25rem" },
              lineHeight: 1.2,
              wordWrap: "break-word"
            }}
          >
            {job.company}
          </Typography>

          <Typography 
            variant="h6"
            component="h3" 
            sx={{ 
              mb: 1, 
              color: "#1a1a1a",
              fontStyle: "italic",
              fontWeight: 400,
              fontSize: { xs: "1rem", md: "1.1rem" },
              lineHeight: 1,
              wordWrap: "break-word"
            }}
          >
            {job.title}
          </Typography>

          <ShowMoreText text={job.description} />

          <Typography 
            variant="body1" 
            sx={{ 
              mt: 1,
              color: "#666",
              fontSize: "1rem",
              fontWeight: 500,
              wordWrap: "break-word"
            }}
          >
            <Box component="span" sx={{ color: "#1a1a1a", fontWeight: 600 }}>
              Salary:
            </Box>{" "}
            ${typeof job.salary === 'number' ? job.salary.toLocaleString() : job.salary}
          </Typography>
        </Box>

        {/* Right Button */}
        {userType === 'employee' && (
          <Box sx={{ 
            display: "flex", 
            alignItems: "center",
            mt: { xs: 0, md: 0 },
            alignSelf: { xs: "stretch", md: "center" }
          }}>
            <PrimaryButton
              fullWidth={true}
              sx={{
                px: { xs: 2, md: 4 },
                py: 1.5,
                minWidth: { xs: "100%", md: "140px" },
              }}
            >
              Apply Now
            </PrimaryButton>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}

/* --------------- Show More Component --------------- */
function ShowMoreText({ text = "" }) {
  const [expanded, setExpanded] = useState(false);
  const maxLength = 120; 
  
  if (!text || text.length <= maxLength) {
    return (
      <Typography 
        variant="body2" 
        sx={{ 
          mb: 1, 
          color: "#555",
          lineHeight: 1.6,
          fontSize: "0.9rem",
          wordWrap: "break-word",
          overflowWrap: "break-word",
          hyphens: "auto",
          width: "100%",
          maxWidth: "100%"
        }}
      >
        {text}
      </Typography>
    );
  }

  const shortText = text.substring(0, maxLength);

  return (
    <Typography 
      variant="body2" 
      sx={{ 
        mb: 1, 
        color: "#555",
        lineHeight: 1.6,
        fontSize: "0.9rem",
        wordWrap: "break-word",
        overflowWrap: "break-word",
        hyphens: "auto",
        width: "100%",
        maxWidth: "100%"
      }}
    >
      {expanded ? text : shortText + "..."}
      <Box
        component="span"
        onClick={() => setExpanded(!expanded)}
        sx={{
          color: "#2d5a54",
          cursor: "pointer",
          marginLeft: 1,
          fontWeight: 600,
          textDecoration: "underline",
          "&:hover": {
            color: "#1e3e39",
          },
          whiteSpace: "nowrap"
        }}
      >
        {expanded ? "Show Less" : "Show More"}
      </Box>
    </Typography>
  );
}