import * as React from "react";
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Grid,
  Box,
  Typography,
  Container,
  IconButton,
  InputAdornment,
  Snackbar,
  Alert,
  Paper,
} from "@mui/material";
import {
  LockOutlined as LockOutlinedIcon,
  Email as EmailIcon,
  Person as PersonIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
  },
});

export default function RegisterForm() {
  const [showPassword, setShowPassword] = React.useState(false);
  const [formErrors, setFormErrors] = React.useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    adminId: "",
  });
  const [snackbar, setSnackbar] = React.useState({
    open: false,
    message: "",
    severity: "info" as "success" | "error" | "info",
  });

  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const validateForm = (data: FormData) => {
    const errors = {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      adminId: "",
    };

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const adminIdRegex = /^ADB[0-9]{5}$/;

    if (!data.get("firstName")) errors.firstName = "First name is required";
    if (!data.get("lastName")) errors.lastName = "Last name is required";

    const email = data.get("email")?.toString() || "";
    if (!email) errors.email = "Email is required";
    else if (!emailRegex.test(email)) errors.email = "Invalid email format";

    const password = data.get("password")?.toString().trim() || "";
    if (!password) errors.password = "Password is required";
    else if (password.length < 8)
      errors.password = "Minimum 8 characters required";
    else if (!/\d/.test(password) || !/[!@#$%^&*]/.test(password))
      errors.password =
        "Must include at least one number and one special character";

    const adminId = data.get("adminId")?.toString() || "";
    if (!adminId) errors.adminId = "Admin ID is required";
    else if (!adminIdRegex.test(adminId))
      errors.adminId = 'Must start with "ADB" followed by 5 digits';

    return errors;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const errors = validateForm(data);

    if (Object.values(errors).some((err) => err)) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      adminId: "",
    });

    const adminData = {
      firstName: data.get("firstName"),
      lastName: data.get("lastName"),
      email: data.get("email"),
      password: data.get("password"),
      adminId: data.get("adminId"),
    };

    try {
      const response = await fetch("http://localhost:8080/adm/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(adminData),
      });

      const result = await response.json();

      if (response.ok) {
        setSnackbar({
          open: true,
          message: result.message,
          severity: "success",
        });
        setTimeout(() => window.location.reload(), 3000);
      } else {
        setSnackbar({ open: true, message: result.message, severity: "error" });
      }
    } catch (err) {
      console.error(err);
      setSnackbar({
        open: true,
        message: "Server error. Please try again later.",
        severity: "error",
      });
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="sm">
        <CssBaseline />
        <Paper elevation={4} sx={{ mt: 6, p: 4, borderRadius: 3 }}>
          <Box display="flex" flexDirection="column" alignItems="center">
            <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography variant="h5" color="primary" gutterBottom>
              Admin Registration
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{ mt: 2 }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="firstName"
                    fullWidth
                    label="First Name"
                    required
                    error={!!formErrors.firstName}
                    helperText={formErrors.firstName}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="lastName"
                    fullWidth
                    label="Last Name"
                    required
                    error={!!formErrors.lastName}
                    helperText={formErrors.lastName}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    name="email"
                    fullWidth
                    label="Email Address"
                    required
                    error={!!formErrors.email}
                    helperText={formErrors.email}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    name="password"
                    fullWidth
                    label="Password"
                    required
                    type={showPassword ? "text" : "password"}
                    error={!!formErrors.password}
                    helperText={formErrors.password}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon color="primary" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword((prev) => !prev)}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    name="adminId"
                    fullWidth
                    label="Admin ID"
                    required
                    error={!!formErrors.adminId}
                    helperText={formErrors.adminId}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, py: 1.5, fontWeight: "bold" }}
              >
                Register
              </Button>
            </Box>
          </Box>
        </Paper>

        {/* Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={5000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={handleSnackbarClose}
            severity={snackbar.severity}
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </ThemeProvider>
  );
}
