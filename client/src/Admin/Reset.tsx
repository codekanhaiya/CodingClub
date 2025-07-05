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
  Paper,
  Alert,
} from "@mui/material";
import {
  LockResetOutlined,
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { createTheme, ThemeProvider } from "@mui/material/styles";

type FormErrors = {
  email: string;
  newPassword: string;
  confirmPassword: string;
};

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
  },
});

export default function ResetPasswordForm() {
  const [showPassword, setShowPassword] = React.useState(false);
  const [formErrors, setFormErrors] = React.useState<FormErrors>({
    email: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");
  const [snackbarSeverity, setSnackbarSeverity] = React.useState<
    "success" | "error" | "warning"
  >("success");

  const validateForm = (data: FormData): FormErrors => {
    const errors: FormErrors = {
      email: "",
      newPassword: "",
      confirmPassword: "",
    };
    const email = data.get("email") as string;
    const newPassword = (data.get("newPassword") as string)?.trim();
    const confirmPassword = data.get("confirmPassword") as string;

    if (!email) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Invalid email format";
    }

    if (!newPassword) {
      errors.newPassword = "New Password is required";
    } else if (
      !/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
        newPassword
      )
    ) {
      errors.newPassword =
        "Password must be 8+ chars, include uppercase, lowercase, digit, and special character";
    }

    if (!confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (confirmPassword !== newPassword) {
      errors.confirmPassword = "Passwords do not match";
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

    setFormErrors({ email: "", newPassword: "", confirmPassword: "" });

    const resetData = {
      email: data.get("email"),
      newPassword: data.get("newPassword"),
    };

    try {
      const response = await fetch("http://localhost:8080/adm/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(resetData),
      });

      const result = await response.json();

      if (response.ok) {
        setSnackbarSeverity("success");
        setSnackbarMessage("Password reset successful!");
        setSnackbarOpen(true);
        setTimeout(() => window.location.reload(), 3000);
      } else {
        setSnackbarSeverity("error");
        setSnackbarMessage(result.message);
        setSnackbarOpen(true);
      }
    } catch (err) {
      console.error("Reset error:", err);
      setSnackbarSeverity("error");
      setSnackbarMessage("Unexpected error occurred.");
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
              <LockResetOutlined />
            </Avatar>
            <Typography
              component="h1"
              variant="h5"
              color="primary"
              gutterBottom
            >
              Reset Password
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
                    name="newPassword"
                    fullWidth
                    label="New Password"
                    type={showPassword ? "text" : "password"}
                    required
                    error={!!formErrors.newPassword}
                    helperText={formErrors.newPassword}
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

                <Grid item xs={12}>
                  <TextField
                    name="confirmPassword"
                    fullWidth
                    label="Confirm Password"
                    type={showPassword ? "text" : "password"}
                    required
                    error={!!formErrors.confirmPassword}
                    helperText={formErrors.confirmPassword}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon color="primary" />
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
                Reset Password
              </Button>
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
