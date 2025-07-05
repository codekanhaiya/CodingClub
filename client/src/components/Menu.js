import React, { useState, useEffect } from "react";
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider,
  Tooltip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Logout,
  PersonAdd,
  Login as LoginIcon,
  Home as HomeIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

import LoginForm from "./LoginForm";

export default function MenuAppBar() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [openLogin, setOpenLogin] = useState(false);
  const [openLogout, setOpenLogout] = useState(false);
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackSeverity, setSnackSeverity] = useState("");
  const [snackMessage, setSnackMessage] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navigate = useNavigate();
  const open = Boolean(anchorEl);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    setIsLoggedIn(!!token);
  }, []);

  const handleSnackClose = () => setSnackOpen(false);

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleOpenLogin = () => {
    setOpenLogin(true);
    handleClose();
  };

  const handleCloseLogin = () => setOpenLogin(false);

  const handleDashboard = () => {
    navigate("/dashboard");
    handleClose();
  };

  const handleLogoutConfirm = () => {
    setOpenLogout(true);
    handleClose();
  };

  const handleCloseLogout = () => setOpenLogout(false);

  const handleConfirmLogout = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      const result = await response.json();
      if (response.ok) {
        setSnackSeverity("success");
        setSnackMessage(result.message || "Logout successful");
        localStorage.removeItem("authToken");
        setIsLoggedIn(false);

        setTimeout(() => {
          navigate("/");
          window.location.reload(); // Force UI update
        }, 800);
      } else {
        setSnackSeverity("error");
        setSnackMessage(result.message || "Logout failed");
      }
    } catch (err) {
      setSnackSeverity("error");
      setSnackMessage("An unexpected error occurred.");
    } finally {
      setSnackOpen(true);
      setOpenLogout(false);
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          {/* Home Button */}
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            sx={{ mr: 2 }}
            onClick={() => navigate("/")}
          >
            <HomeIcon />
          </IconButton>

          {/* Club Name */}
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            BBS Coding Club
          </Typography>

          {/* Right-side Menu */}
          <Tooltip title="Menu">
            <IconButton
              onClick={handleClick}
              size="small"
              sx={{ ml: 2 }}
              aria-controls={open ? "account-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
            >
              <MenuIcon sx={{ fontSize: 32, color: "white" }} />
            </IconButton>
          </Tooltip>

          {/* Menu Items */}
          <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={open}
            onClose={handleClose}
            PaperProps={{
              elevation: 0,
              sx: {
                overflow: "visible",
                filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                mt: 1.5,
                "&::before": {
                  content: '""',
                  display: "block",
                  position: "absolute",
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: "background.paper",
                  transform: "translateY(-50%) rotate(45deg)",
                  zIndex: 0,
                },
              },
            }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            {/* Logged-In View */}
            {isLoggedIn && [
              <MenuItem key="dashboard" onClick={handleDashboard}>
                <ListItemIcon>
                  <DashboardIcon fontSize="small" />
                </ListItemIcon>
                My Dashboard
              </MenuItem>,
              <Divider key="divider1" />,
              <MenuItem key="logout" onClick={handleLogoutConfirm}>
                <ListItemIcon>
                  <Logout fontSize="small" />
                </ListItemIcon>
                Logout
              </MenuItem>,
            ]}

            {/* Logged-Out View */}
            {!isLoggedIn && [
              <MenuItem key="register" onClick={() => navigate("/signup")}>
                <ListItemIcon>
                  <PersonAdd fontSize="small" />
                </ListItemIcon>
                Register
              </MenuItem>,
              <MenuItem key="login" onClick={handleOpenLogin}>
                <ListItemIcon>
                  <LoginIcon fontSize="small" />
                </ListItemIcon>
                Login
              </MenuItem>,
            ]}
          </Menu>

          {/* Login Dialog */}
          <Dialog open={openLogin} onClose={handleCloseLogin}>
            <DialogTitle>Login</DialogTitle>
            <DialogContent>
              <LoginForm />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseLogin} color="primary">
                Close
              </Button>
            </DialogActions>
          </Dialog>

          {/* Logout Confirmation Dialog */}
          <Dialog
            open={openLogout}
            onClose={handleCloseLogout}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">Confirm Logout</DialogTitle>
            <DialogContent>Are you sure you want to logout?</DialogContent>
            <DialogActions>
              <Button onClick={handleCloseLogout}>Cancel</Button>
              <Button onClick={handleConfirmLogout} autoFocus>
                Logout
              </Button>
            </DialogActions>
          </Dialog>

          {/* Snackbar Message */}
          <Snackbar
            open={snackOpen}
            autoHideDuration={2500}
            onClose={handleSnackClose}
          >
            <Alert
              onClose={handleSnackClose}
              severity={snackSeverity}
              sx={{ width: "100%" }}
            >
              {snackMessage}
            </Alert>
          </Snackbar>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
