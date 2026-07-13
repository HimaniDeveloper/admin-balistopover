import React from 'react';
import { Card as MuiCard, CardActions, CardContent, CardMedia, Button, Typography, IconButton } from '@mui/material';

export const HCard = ({
  image, // Image URL
  altText = 'Image', // Alt text for the image
  title, // Title of the card
  description, // Description text
  buttons = [], // Array of button props
  iconButtons = [], // Array of IconButton props
  cardStyles = {}, // Custom styles for the card
  contentStyles = {}, // Custom styles for the content
  mediaStyles = {}, // Custom styles for the media
}) => {
  return (
    <MuiCard sx={{ maxWidth: 345, ...cardStyles }}>
      <CardMedia
        component="img"
        alt={altText}
        height="140"
        image={image}
        sx={{ ...mediaStyles }}
      />
      <CardContent sx={{ ...contentStyles }}>
        <Typography gutterBottom variant="h7" component="div">
          {title}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {description}
        </Typography>
      </CardContent>
      <CardActions sx={{float: 'right'}}>
        {iconButtons.map((iconButton, index) => (
          <IconButton
            key={index}
            onClick={iconButton.onClick}
            color={iconButton.color || 'default'}
          >
            {iconButton.icon}
          </IconButton>
        ))}
        {buttons.map((button, index) => (
          <Button
            key={index}
            size={button.size || 'small'}
            onClick={button.onClick}
            color={button.color || 'primary'}
          >
            {button.label}
          </Button>
        ))}
      </CardActions>
    </MuiCard>
  );
};
