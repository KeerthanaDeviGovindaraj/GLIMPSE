import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createJob } from "../../redux/slices/jobSlice";
import {
  TextField,
  Typography,
  Stack,
  Container,
  Card,
  CardContent,
  Button,
  InputAdornment,
} from "@mui/material";
import PrimaryButton from "../../components/PrimaryButton";

export default function AddJob() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    company: "",
    title: "",
    description: "",
    salary: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    // For salary, prevent non-digit characters
    if (name === 'salary' && value !== '' && !/^\d+$/.test(value)) {
      return;
    }

    setForm({ ...form, [name]: value });
    // Clear validation error 
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null });
    }
  };

  const submitJob = async () => {
    const newErrors = {};
    if (!form.company) newErrors.company = "Company is required.";
    if (!form.title) newErrors.title = "Job Title is required.";
    if (!form.description) newErrors.description = "Description is required.";
    if (!form.salary) newErrors.salary = "Salary is required.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({}); 

    try {
      await dispatch(createJob({ ...form, salary: Number(form.salary) })).unwrap();
      navigate("/employee/jobs", {
        state: { message: "Job created successfully!" },
      });
    } catch (error) {
      setErrors({
        submit:
          error.message ||
          "An unexpected error occurred. Please try again.",
      });
    }
  };

  return (
    <Container maxWidth="md">
      <Card
        variant="outlined"
        sx={{
          borderRadius: 3,
          overflow: "hidden",
          width: "100%",
        }}
      >
        <CardContent sx={{ p: { xs: 3, md: 4 } }}>
          <Typography variant="h4" fontWeight={800} sx={{ mb: 1 }}>
            Add New Job
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
            Fill out the details below to post a new job opportunity.
          </Typography>

          <Stack spacing={2.5}>
            <TextField
              name="company"
              label="Company"
              fullWidth
              value={form.company}
              onChange={handleChange}
              error={!!errors.company}
              helperText={errors.company}
              required
            />

            <TextField
              name="title"
              label="Job Title"
              fullWidth
              value={form.title}
              onChange={handleChange}
              error={!!errors.title}
              helperText={errors.title}
              required
            />

            <TextField
              name="description"
              label="Description"
              fullWidth
              multiline
              rows={4}
              value={form.description}
              onChange={handleChange}
              error={!!errors.description}
              helperText={errors.description}
              required
            />

            <TextField
  name="salary"
  label="Salary"
  type="number"
  fullWidth
  value={form.salary}
  onChange={handleChange}
  error={!!errors.salary}
  helperText={errors.salary || "per annum"}
  required
  InputProps={{
    startAdornment: (
      <InputAdornment position="start">$</InputAdornment>
    ),
  }}
  onKeyDown={(e) => {
    if (["e", "E", "+", "-"].includes(e.key)) {
      e.preventDefault();
    }
  }}
/>


            <Stack direction="row" spacing={2} sx={{ pt: 2 }}>
              <PrimaryButton onClick={submitJob}>CREATE JOB</PrimaryButton>
              <Button
                variant="outlined"
                onClick={() => navigate("/employee/jobs")}
                sx={{
                  borderColor: "#0c554eff",
                  color: "#0c554eff",
                  "&:hover": {
                    borderColor: "#1ba898ff",
                    color: "#1ba898ff"
                  },
                }}>
                BACK TO JOBS
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </Container>
  );
}
