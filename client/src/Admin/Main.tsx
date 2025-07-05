import * as React from "react";
import { AppBar, Tabs, Tab, Typography, Box, Container } from "@mui/material";

// Custom Components
import RegisterForm from "./Register.tsx";
import LoginForm from "./Login.tsx";
import AdminDash from "./AdminDash.tsx";
import Notice from "./Notice.tsx";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel({ children, value, index }: TabPanelProps) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tab-panel-${index}`}
      aria-labelledby={`tab-${index}`}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `tab-${index}`,
    "aria-controls": `tab-panel-${index}`,
  };
}

export default function AdminPanelTabs() {
  const [value, setValue] = React.useState(0);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const isLoggedIn = Boolean(localStorage.getItem("token"));

  const NotAllowedMessage = ({ label }: { label: string }) => (
    <Typography variant="h6" sx={{ mb: 2 }} color="error">
      You can't access the {label.toLowerCase()} panel without login.
    </Typography>
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 3 }}>
      <Box sx={{ bgcolor: "background.paper", borderRadius: 2, boxShadow: 3 }}>
        <AppBar position="static" color="primary" elevation={2}>
          <Tabs
            value={value}
            onChange={handleChange}
            indicatorColor="secondary"
            textColor="inherit"
            variant="fullWidth"
            aria-label="admin panel tabs"
          >
            <Tab label="Register" {...a11yProps(0)} />
            <Tab label="Login" {...a11yProps(1)} />
            <Tab label="Dashboard" {...a11yProps(2)} />
            <Tab label="Notice" {...a11yProps(3)} />
          </Tabs>
        </AppBar>

        {/* Register Tab */}
        <TabPanel value={value} index={0}>
          {isLoggedIn ? (
            <NotAllowedMessage label="registration" />
          ) : (
            <RegisterForm />
          )}
        </TabPanel>

        {/* Login Tab */}
        <TabPanel value={value} index={1}>
          {isLoggedIn ? <NotAllowedMessage label="login" /> : <LoginForm />}
        </TabPanel>

        {/* Dashboard Tab */}
        <TabPanel value={value} index={2}>
          {isLoggedIn ? <AdminDash /> : <NotAllowedMessage label="dashboard" />}
        </TabPanel>

        {/* Notice Tab */}
        <TabPanel value={value} index={3}>
          {isLoggedIn ? <Notice /> : <NotAllowedMessage label="notice" />}
        </TabPanel>
      </Box>
    </Container>
  );
}
