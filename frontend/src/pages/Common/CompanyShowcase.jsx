import * as React from "react";
import {
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Skeleton,
  Box,
  Fab,
  IconButton,
  Pagination,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import api from "../../services/api";
import defaultCompanyImage from "../../assets/defaultCompanyImage.png";

export default function CompanyShowcase() {
  const navigate = useNavigate();
  const [companies, setCompanies] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [page, setPage] = React.useState(1);
  const pageSize = 8; // Show no. companies per page

  const { user } = useSelector((state) => state.auth);

  const BASE_URL = process.env.REACT_APP_API_BASE_URL;

  React.useEffect(() => {
    let mounted = true;

    api
      .get("/companies")
      .then((res) => {
        if (!mounted) return;

        const companyData = res.data || [];
        const mapped = companyData.map((company, idx) => {
          let image = defaultCompanyImage; 

          if (company.imagePath) {
            image = company.imagePath.startsWith("http")
              ? company.imagePath
              : `${BASE_URL}${company.imagePath}`;
          }

          return {
            id: company._id || `company-${idx}`,
            name: company.name || "Unnamed Company",
            img: image,
            description: company.description,
          };
        });

        setCompanies([...mapped]);
      })
      .catch((err) => console.error(err))
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, [BASE_URL]);

  const paginatedCompanies = companies.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  return (
    <>
      {user?.type === "admin" && (
        <Fab
          variant="extended"
          color="primary"
          aria-label="add company"
          onClick={() => navigate("/admin/add-company")}
          sx={{
            position: "fixed",
            top: { xs: 72, md: 80 },
            right: { xs: 16, md: 32 },
            bgcolor: "#0c554eff",
            borderRadius: 2,
            "&:hover": { bgcolor: "#1ba898ff" },
          }}
        >
          <AddIcon sx={{ mr: 1 }} />
          Add Company
        </Fab>
      )}
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        height: 'calc(100vh - 88px)'
      }}>
      <Box sx={{ flex: '1 1 100%', overflowY: 'auto', px: { xs: 2, md: 4 }, py: 3, maxWidth: "1200px", width: "100%", mx: "auto" }}>
        {loading ? (
          <Grid container spacing={3}>
            {Array.from({ length: 6 }).map((_, i) => (
              <Grid item xs={12} sm={6} md={4} key={i}>
                <Card variant="outlined" sx={{ borderRadius: 2 }}>
                  <Skeleton variant="rectangular" height={200} />
                  <CardContent>
                    <Skeleton width="60%" />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : companies.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 8, color: "text.secondary" }}>
            <Typography>No companies available yet.</Typography>
          </Box>
        ) : (
          <Grid container spacing={3} justifyContent="center" alignItems="stretch">
            {paginatedCompanies.map((company) => (
              <Grid 
                item 
    
                key={company.id}
              >
                <Card
                  variant="outlined"
                  sx={{
                    borderRadius: 2,
                    height: 360, 
                    display: "flex",
                    width: 250, 
                    flexDirection: "column",
                  }}
                >
                  <Box sx={{ position: 'relative' }}>
                    <CardMedia
                      component="img"
                      image={company.img}
                      alt={company.name}
                      sx={{ height: 200, objectFit: "cover", bgcolor: "#fff" }}
                    />
                      {user?.type === "admin" && (
                        <IconButton
                          aria-label="edit company"
                          onClick={() => navigate(`/admin/edit-company/${company.id}`)}
                          sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            bgcolor: 'rgba(255, 255, 255, 0.7)',
                            '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.9)' }
                          }}
                        ><EditIcon /></IconButton>
                      )}
                  </Box>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography
                      variant="h6"
                      fontWeight={700}
                      sx={{ color: "#004d40", minHeight: "3.2rem" }}
                    >
                      {company.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mt: 0.5,
                        display: "-webkit-box",
                        "-webkit-line-clamp": "3",
                        "-webkit-box-orient": "vertical",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        wordBreak: "break-word", 
                      }}
                    >
                      {company.description || "No description available."}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
        </Box>
        {companies.length > pageSize && (
          <Box sx={{
            flexShrink: 0, display: 'flex', justifyContent: 'center', alignItems: 'center',
            py: 2, borderTop: '1px solid #e0e0e0', bgcolor: 'background.paper',
            boxShadow: '0 -2px 10px rgba(0,0,0,0.05)'
          }}>
            <Pagination
              count={Math.ceil(companies.length / pageSize)}
              page={page}
              onChange={(e, value) => setPage(value)}
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
        )}
      </Box>
    </>
  );
}
