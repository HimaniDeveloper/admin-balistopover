import React from 'react';
import { Card, CardContent, CardActionArea, Typography, CardActions, Button, IconButton, Box } from '@mui/material';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export const CardTile = ({
  title,
  description,
  route,
  icon: Icon, // Icon component passed as prop
  backgroundImage, // Background image URL
  customStyles = {}, // Custom styles for the card
  hoverEffect = true, // Enable or disable hover effect
}) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(route);
  };

  return (
    <Card
      onClick={handleClick}
      sx={{
        cursor: 'pointer',
        mb: 2,
        ...customStyles,
        transition: hoverEffect ? 'transform 0.3s ease-in-out' : 'none',
        '&:hover': hoverEffect ? { transform: 'scale(1.05)' } : {},
      }}
    >
      {backgroundImage && (
          <Box sx={{ position: 'relative', height: 200 }}>
            <Image
              src={backgroundImage}
              alt={title}
              layout="fill"
              objectFit="cover"
              style={{ borderRadius: '4px 4px 0 0' }}
            />
          </Box>
        )}
        <CardContent>
          {Icon && <IconButton>{<Icon />}</IconButton>}
          <Typography variant="h6">{title}</Typography>
          <Typography variant="body2">{description}</Typography>
        </CardContent>
    </Card>
  );
};
