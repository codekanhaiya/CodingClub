import React, { useEffect, useState } from "react";
import {
  Grid,
  Typography,
  Box,
  useMediaQuery,
  Divider,
  Chip,
  CircularProgress,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import FlagIcon from "@mui/icons-material/Flag";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CampaignIcon from "@mui/icons-material/Campaign";

const MessageSection = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch latest notices
  const fetchNotices = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/notices");
      const data = await response.json();
      data.sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by newest
      setNotices(data);
    } catch (error) {
      console.error("Error fetching notices:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  return (
    <Box sx={{ px: isSmallScreen ? 2 : 4, my: 5 }}>
      <Grid container spacing={4}>
        {/* Mission & Vision */}
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              backgroundColor: "#f0f4c3",
              padding: 3,
              borderRadius: 2,
              height: "100%",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <FlagIcon sx={{ fontSize: 40, color: "#ff7043" }} />
              <Typography variant="h5" sx={{ ml: 2 }}>
                Our Mission
              </Typography>
            </Box>

            <Typography variant="body1" sx={{ mb: 4 }}>
              Our mission is to foster a love for coding and technology in
              students, promoting collaborative learning and hands-on projects.
              We aim to build a strong community of coders and innovators who
              are ready to face the challenges of the tech world.
            </Typography>

            <Divider />

            <Box sx={{ display: "flex", alignItems: "center", mt: 4, mb: 2 }}>
              <VisibilityIcon sx={{ fontSize: 40, color: "#42a5f5" }} />
              <Typography variant="h5" sx={{ ml: 2 }}>
                Our Vision
              </Typography>
            </Box>

            <Typography variant="body1">
              Our vision is to empower students with the knowledge and skills
              needed to excel in the tech industry, through mentorship,
              hackathons, and industry-level coding experience.
            </Typography>
          </Box>
        </Grid>

        {/* Notice Board */}
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              backgroundColor: "#e3f2fd",
              padding: 3,
              borderRadius: 2,
              height: "100%",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
              overflow: "hidden",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <CampaignIcon sx={{ fontSize: 40, color: "#ef5350" }} />
              <Typography variant="h5" sx={{ ml: 2 }}>
                Notice Board
              </Typography>
            </Box>

            {/* Scrolling Message Box */}
            <Box
              sx={{
                height: 220,
                position: "relative",
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  width: "100%",
                  animation: `${
                    notices.length > 1 ? "scrollUp 20s linear infinite" : "none"
                  }`,
                }}
              >
                {loading ? (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "100%",
                    }}
                  >
                    <CircularProgress />
                  </Box>
                ) : notices.length > 0 ? (
                  <>
                    {notices.map((notice, index) => (
                      <Box key={index} sx={{ mb: 2 }}>
                        <Typography
                          component="div"
                          variant="body1"
                          sx={{
                            color: index === 0 ? "#000" : "#424242",
                            fontWeight: index === 0 ? "bold" : "normal",
                          }}
                        >
                          {index === 0 && (
                            <Chip
                              label="New"
                              color="primary"
                              size="small"
                              sx={{ mr: 1 }}
                            />
                          )}
                          {notice.message}
                        </Typography>

                        <Typography
                          variant="caption"
                          sx={{ color: "#757575", display: "block" }}
                        >
                          {new Date(notice.date).toLocaleDateString()}
                        </Typography>
                      </Box>
                    ))}
                  </>
                ) : (
                  <Typography
                    variant="body1"
                    sx={{ textAlign: "center", color: "#666" }}
                  >
                    No message available!
                  </Typography>
                )}
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>

      {/* Keyframe animation */}
      <style>
        {`
          @keyframes scrollUp {
            0% { transform: translateY(100%); }
            100% { transform: translateY(-100%); }
          }
        `}
      </style>
    </Box>
  );
};

export default MessageSection;
