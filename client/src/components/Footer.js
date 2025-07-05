import React from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  TextField,
  Button,
  IconButton,
  Link,
} from "@mui/material";
import {
  Facebook,
  Twitter,
  Instagram,
  YouTube,
  LinkedIn,
  School,
  Person,
} from "@mui/icons-material";
import SendIcon from "@mui/icons-material/Send";

const Footer = () => {
  return (
    <Box sx={{ backgroundColor: "#1a237e", color: "#fff", py: 6, mt: 8 }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Left Section - Club Info */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
              BBS Coding Club
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Join our community of developers, participate in hackathons,
              attend workshops, and enhance your skills.
            </Typography>
            <Typography variant="body2" sx={{ fontSize: "0.875rem" }}>
              &copy; {new Date().getFullYear()} BBS Coding Club. All rights
              reserved.
            </Typography>
          </Grid>

          {/* Center Section - Newsletter */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
              Subscribe to our Newsletter
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Stay updated with events, hackathons, and news from the club.
            </Typography>
            <Box
              component="form"
              noValidate
              autoComplete="off"
              sx={{ display: "flex", alignItems: "center" }}
            >
              <TextField
                variant="filled"
                label="Your Email"
                type="email"
                size="small"
                sx={{
                  backgroundColor: "#fff",
                  borderRadius: 1,
                  mr: 1,
                  flexGrow: 1,
                }}
              />
              <Button
                variant="contained"
                color="primary"
                endIcon={<SendIcon />}
                sx={{ height: 40 }}
              >
                Subscribe
              </Button>
            </Box>
          </Grid>

          {/* Right Section - Social & Developer Links */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
              Follow Us
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Connect with us on social media:
            </Typography>

            {/* Social Media Icons */}
            <Box>
              {[
                {
                  icon: <School />,
                  label: "College",
                  href: "https://bbs.ac.in/",
                },
                {
                  icon: <Facebook />,
                  label: "Facebook",
                  href: "https://www.facebook.com/bbsprayagraj/",
                },
                {
                  icon: <Twitter />,
                  label: "Twitter",
                  href: "https://twitter.com/BbsCollege",
                },
                {
                  icon: <Instagram />,
                  label: "Instagram",
                  href: "https://www.instagram.com/bbscollege/?hl=en",
                },
                {
                  icon: <LinkedIn />,
                  label: "LinkedIn",
                  href: "https://www.linkedin.com/company/bbscet-prayagraj",
                },
                {
                  icon: <YouTube />,
                  label: "YouTube",
                  href: "https://www.youtube.com/channel/UCPEWCEhKGjZCR4q2pQhwIeA?app=desktop",
                },
              ].map(({ icon, label, href }) => (
                <IconButton
                  key={label}
                  component="a"
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  sx={{
                    color: "#fff",
                    "&:hover": { color: "#90caf9" },
                  }}
                >
                  {icon}
                </IconButton>
              ))}
            </Box>

            {/* Developer Info */}
            <Typography
              variant="body2"
              sx={{ mt: 3, display: "flex", alignItems: "center" }}
            >
              <IconButton
                component="a"
                href="http://officialkanha.epizy.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Developer Link"
                sx={{ color: "#fff", mr: 1 }}
              >
                <Person />
              </IconButton>
              Developed by:
              <Link
                href="http://officialkanha.epizy.com/"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  color: "#fff",
                  fontWeight: "bold",
                  textDecoration: "none",
                  ml: 0.5,
                  "&:hover": { textDecoration: "underline" },
                }}
              >
                Kanhaiya Gupta
              </Link>
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Footer;
