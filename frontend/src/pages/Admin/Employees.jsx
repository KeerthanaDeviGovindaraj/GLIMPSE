import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "../../redux/slices/userSlice";
import {
  Typography,
  Chip,
  Box,
  Skeleton,
  Card,
  CardContent,
  Stack,
} from "@mui/material";

export default function Employees() {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((state) => state.users);

  useEffect(() => {
    dispatch(fetchUsers());
  }, []);

  return (
    <>
      <Typography variant="h4" fontWeight={800} sx={{ mb: 3 }}>
        Admin Dashboard
      </Typography>
      {loading ? (
        <Stack spacing={2}>
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} variant="rounded" height={80} />
          ))}
        </Stack>
      ) : (
        <Stack spacing={2}>
          {items.map((user) => (
            <Card
              key={user.email}
              variant="outlined"
              sx={{
                borderRadius: 2,
                transition: "box-shadow 0.2s ease-in-out",
                "&:hover": {
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                },
              }}
            >
              <CardContent
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  alignItems: { xs: "flex-start", sm: "center" },
                  justifyContent: "space-between",
                  gap: 2,
                }}
              >
                <Box>
                  <Typography variant="h6" fontWeight={600}>
                    {user.fullName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {user.email}
                  </Typography>
                </Box>
                <Chip
                  label={user.type === "admin" ? "Admin" : "Employee"}
                  color={user.type === "admin" ? "primary" : "success"}
                  size="small"
                  sx={{
                    fontWeight: 600,
                    bgcolor:
                      user.type === "admin"
                        ? "rgba(12, 85, 78, 0.1)"
                        : "rgba(46, 125, 50, 0.1)",
                    color:
                      user.type === "admin"
                        ? "rgb(12, 85, 78)"
                        : "rgb(46, 125, 50)",
                  }}
                />
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}
    </>
  );
}
