import React from "react";
import Slider from "react-slick";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { useTheme, useMediaQuery } from "@mui/material";

// Imported images
import firstImage from "../img/first.avif";
import secondImage from "../img/second.avif";
import thirdImage from "../img/third.jpg";

// Carousel image data
const images = [
  {
    id: 1,
    src: firstImage,
    alt: "Welcome to BBS Coding Club",
    caption: "Welcome to BBS Coding Club",
  },
  {
    id: 2,
    src: secondImage,
    alt: "Explore Coding with Us",
    caption: "Explore Coding with Us",
  },
  {
    id: 3,
    src: thirdImage,
    alt: "Join Our Hackathons!",
    caption: "Join Our Hackathons!",
  },
];

const Carousel = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Carousel config
  const settings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
    pauseOnHover: true,
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      {/* Outer wrapper with shadow & padding */}
      <Box
        sx={{
          backgroundColor: "#f9f9f9", // Softer background
          borderRadius: 3,
          padding: { xs: 2, sm: 3 },
          boxShadow: "0 6px 18px rgba(0, 0, 0, 0.08)",
        }}
      >
        <Slider {...settings}>
          {images.map((image) => (
            <Box key={image.id} sx={{ textAlign: "center" }}>
              {/* Responsive image */}
              <Box
                component="img"
                src={image.src}
                alt={image.alt}
                sx={{
                  width: "100%",
                  height: isMobile ? 200 : 400,
                  objectFit: "cover",
                  borderRadius: 2,
                }}
              />
              {/* Caption */}
              <Typography
                variant={isMobile ? "subtitle1" : "h6"}
                sx={{ pt: 2, fontWeight: 500, color: "#333" }}
              >
                {image.caption}
              </Typography>
            </Box>
          ))}
        </Slider>
      </Box>
    </Container>
  );
};

export default Carousel;
