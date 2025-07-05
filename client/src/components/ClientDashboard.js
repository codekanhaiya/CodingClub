import React, { useEffect, useState } from "react";
import {
  Typography,
  Avatar,
  Container,
  Grid,
  Card,
  CardContent,
  Button,
  CircularProgress,
} from "@mui/material";
import { Box } from "@mui/system";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/auth/members", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <Container sx={{ mt: 6, textAlign: "center" }}>
        <CircularProgress />
        <Typography variant="body1" mt={2}>
          Loading user data...
        </Typography>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container sx={{ mt: 6, textAlign: "center" }}>
        <Typography variant="h6" color="error">
          Sorry! No member data found.
        </Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4, mb: 6 }}>
      <Box>
        <Grid container spacing={4}>
          {/* Profile Section */}
          <Grid item xs={12} md={4}>
            <Card elevation={3}>
              <CardContent sx={{ textAlign: "left" }}>
                <Avatar
                  sx={{
                    width: 100,
                    height: 100,
                    mb: 2,
                    mx: "auto",
                    bgcolor: "#3f51b5",
                    fontSize: 32,
                  }}
                >
                  {user.firstName?.[0] || "?"}
                </Avatar>
                <Typography variant="h5" fontWeight={600}>
                  {`${user.firstName} ${user.lastName}`}
                </Typography>
                <Typography color="textSecondary" mb={1}>
                  {user.email}
                </Typography>
                <Typography variant="body1">
                  Roll No: {user.rollNumber}
                </Typography>
                <Typography variant="body1">
                  Branch: {`${user.course} ${user.subField}`}
                </Typography>
                <Typography variant="body1">Study Year: {user.year}</Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Welcome and Study Materials Section */}
          <Grid item xs={12} md={8}>
            <Card elevation={3}>
              <CardContent>
                <Typography variant="h5" fontWeight={600} gutterBottom>
                  Welcome to BBS Coding Club!
                </Typography>
                <Typography variant="body2" mb={2}>
                  Explore resources and enhance your coding skills with us.
                </Typography>
                <Button variant="contained" color="primary" sx={{ mb: 1 }}>
                  View Study Materials
                </Button>
                {/* You can add more sections like Upcoming Events, Resources, etc. */}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Dashboard;
