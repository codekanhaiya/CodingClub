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
  Link,
  Paper,
  Alert,
} from "@mui/material";
import {
  LockOutlined as LockOutlinedIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
  LockReset,
} from "@mui/icons-material";
import { createTheme, ThemeProvider } from "@mui/material/styles";

// Define the type for form errors
type FormErrors = {
  email: string;
  password: string;
};

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
  },
});

export default function LoginForm() {
  const [showPassword, setShowPassword] = React.useState(false);
  const [formErrors, setFormErrors] = React.useState<FormErrors>({
    email: "",
    password: "",
  });
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");
  const [snackbarSeverity, setSnackbarSeverity] = React.useState<
    "success" | "error" | "warning"
  >("success");

  const validateForm = (data: FormData): FormErrors => {
    const errors: FormErrors = { email: "", password: "" };
    const email = data.get("email") as string;
    const password = data.get("password") as string;

    if (!email) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Invalid email format";
    }

    if (!password) {
      errors.password = "Password is required";
    }

    return errors;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const errors = validateForm(data);

    if (Object.values(errors).some((e) => e)) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({ email: "", password: "" });

    const adminData = {
      email: data.get("email"),
      password: data.get("password"),
    };

    try {
      const response = await fetch("http://localhost:8080/adm/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(adminData),
      });

      const result = await response.json();

      if (response.ok) {
        localStorage.setItem("token", result.token);
        setSnackbarSeverity("success");
        setSnackbarMessage("Login successful!");
        setSnackbarOpen(true);
        setTimeout(() => window.location.reload(), 3000);
      } else {
        setSnackbarSeverity("error");
        setSnackbarMessage(result.message);
        setSnackbarOpen(true);
      }
    } catch (err) {
      console.error(err);
      setSnackbarSeverity("error");
      setSnackbarMessage("An unexpected error occurred.");
      setSnackbarOpen(true);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Paper elevation={4} sx={{ mt: 6, p: 4, borderRadius: 3 }}>
          <Box display="flex" flexDirection="column" alignItems="center">
            <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography variant="h5" color="primary" gutterBottom>
              Admin Login
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 2 }}
            >
              <Grid container spacing={2}>
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
                    type={showPassword ? "text" : "password"}
                    required
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
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
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
                Login
              </Button>
            </Box>

            <Box sx={{ width: "100%", mt: 2, textAlign: "right" }}>
              <Link
                href="/adr"
                underline="hover"
                sx={{ display: "inline-flex", alignItems: "center" }}
              >
                <LockReset sx={{ fontSize: 18, mr: 0.5 }} />
                Forgot Password?
              </Link>
            </Box>
          </Box>

          {/* Snackbar Feedback */}
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={6000}
            onClose={() => setSnackbarOpen(false)}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          >
            <Alert
              severity={snackbarSeverity}
              onClose={() => setSnackbarOpen(false)}
              sx={{ width: "100%" }}
            >
              {snackbarMessage}
            </Alert>
          </Snackbar>
        </Paper>
      </Container>
    </ThemeProvider>
  );
}
