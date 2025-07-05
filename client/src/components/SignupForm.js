import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  Typography,
  IconButton,
  Grid,
  Snackbar,
  Alert,
  InputAdornment,
  Paper,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    course: "",
    subField: "",
    year: "",
    rollNumber: "",
    gender: "",
    password: "",
    showPassword: false,
  });

  const [errors, setErrors] = useState({});
  const [snackMessage, setSnackMessage] = useState("");
  const [snackSeverity, setSnackSeverity] = useState("info");
  const [snackOpen, setSnackOpen] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "rollNumber" && !/^\d*$/.test(value)) return;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const validatePassword = (password) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$#!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password.trim());
  };

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName) newErrors.firstName = "First Name is required.";
    if (!formData.lastName) newErrors.lastName = "Last Name is required.";
    if (!formData.email) newErrors.email = "Email is required.";
    else if (!validateEmail(formData.email)) newErrors.email = "Invalid email.";
    if (!formData.course) newErrors.course = "Course is required.";
    if (formData.course === "B.Tech" && !formData.subField)
      newErrors.subField = "Branch is required.";
    if (!formData.year) newErrors.year = "Study year is required.";
    if (!formData.rollNumber || formData.rollNumber.length !== 13)
      newErrors.rollNumber = "Roll Number must be 13 digits.";
    if (!formData.gender) newErrors.gender = "Gender is required.";
    if (!formData.password) newErrors.password = "Password is required.";
    else if (!validatePassword(formData.password))
      newErrors.password =
        "Must be 8+ characters with upper, lower, number & special char.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      const { success, message, error } = result;

      if (success) {
        setSnackSeverity("success");
        setSnackMessage(message);
        setSnackOpen(true);
        setTimeout(() => navigate("/login"), 1000);
      } else {
        const msg = error?.details?.[0]?.message || message;
        setSnackSeverity("error");
        setSnackMessage(msg);
        setSnackOpen(true);
      }
    } catch (err) {
      setSnackSeverity("error");
      setSnackMessage("An unexpected error occurred.");
      setSnackOpen(true);
    }
  };

  const handleSnackClose = () => setSnackOpen(false);

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper
        elevation={3}
        sx={{ p: 4, backgroundColor: "#f0f4ff", borderRadius: 3 }}
      >
        <Typography variant="h5" align="center" gutterBottom>
          Student Registration
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {/* First & Last Name */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                error={!!errors.firstName}
                helperText={errors.firstName}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                error={!!errors.lastName}
                helperText={errors.lastName}
              />
            </Grid>

            {/* Email */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
              />
            </Grid>

            {/* Course */}
            <Grid item xs={12}>
              <FormControl fullWidth error={!!errors.course}>
                <InputLabel>Course</InputLabel>
                <Select
                  name="course"
                  value={formData.course}
                  onChange={handleChange}
                  label="Course"
                >
                  <MenuItem value="B.Tech">B.Tech</MenuItem>
                  <MenuItem value="BCA">BCA</MenuItem>
                  <MenuItem value="BBA">BBA</MenuItem>
                </Select>
                {errors.course && (
                  <Typography color="error" fontSize={12} pl={1}>
                    {errors.course}
                  </Typography>
                )}
              </FormControl>
            </Grid>

            {/* Branch for B.Tech */}
            {formData.course === "B.Tech" && (
              <Grid item xs={12}>
                <FormControl fullWidth error={!!errors.subField}>
                  <InputLabel>Branch</InputLabel>
                  <Select
                    name="subField"
                    value={formData.subField}
                    onChange={handleChange}
                    label="Branch"
                  >
                    <MenuItem value="CSE">CSE</MenuItem>
                    <MenuItem value="ME">ME</MenuItem>
                    <MenuItem value="EEE">EEE</MenuItem>
                    <MenuItem value="CE">CE</MenuItem>
                  </Select>
                  {errors.subField && (
                    <Typography color="error" fontSize={12} pl={1}>
                      {errors.subField}
                    </Typography>
                  )}
                </FormControl>
              </Grid>
            )}

            {/* Year */}
            <Grid item xs={12}>
              <FormControl fullWidth error={!!errors.year}>
                <InputLabel>Current Study Year</InputLabel>
                <Select
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  label="Current Study Year"
                >
                  <MenuItem value="1st Year">1st Year</MenuItem>
                  <MenuItem value="2nd Year">2nd Year</MenuItem>
                  <MenuItem value="3rd Year">3rd Year</MenuItem>
                </Select>
                {errors.year && (
                  <Typography color="error" fontSize={12} pl={1}>
                    {errors.year}
                  </Typography>
                )}
              </FormControl>
            </Grid>

            {/* Roll Number */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Roll Number"
                name="rollNumber"
                inputProps={{ maxLength: 13 }}
                value={formData.rollNumber}
                onChange={handleChange}
                error={!!errors.rollNumber}
                helperText={errors.rollNumber}
              />
            </Grid>

            {/* Gender */}
            <Grid item xs={12}>
              <FormControl error={!!errors.gender} component="fieldset">
                <RadioGroup
                  row
                  name="gender"
                  onChange={handleChange}
                  value={formData.gender}
                >
                  <FormControlLabel
                    value="Male"
                    control={<Radio />}
                    label="Male"
                  />
                  <FormControlLabel
                    value="Female"
                    control={<Radio />}
                    label="Female"
                  />
                  <FormControlLabel
                    value="Other"
                    control={<Radio />}
                    label="Other"
                  />
                </RadioGroup>
                {errors.gender && (
                  <Typography color="error" fontSize={12} pl={1}>
                    {errors.gender}
                  </Typography>
                )}
              </FormControl>
            </Grid>

            {/* Password */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Password"
                name="password"
                type={formData.showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                error={!!errors.password}
                helperText={errors.password}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() =>
                          setFormData({
                            ...formData,
                            showPassword: !formData.showPassword,
                          })
                        }
                        edge="end"
                      >
                        {formData.showPassword ? (
                          <Visibility />
                        ) : (
                          <VisibilityOff />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            {/* Submit */}
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                fullWidth
                size="large"
              >
                Register
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      {/* Snackbar */}
      <Snackbar
        open={snackOpen}
        autoHideDuration={3000}
        onClose={handleSnackClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity={snackSeverity}
          onClose={handleSnackClose}
          sx={{ width: "100%" }}
        >
          {snackMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default RegistrationForm;
