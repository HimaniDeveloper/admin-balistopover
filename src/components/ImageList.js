"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { showToast } from "@/store/settingsSlice";
import { HButton, Layout } from "@/components";
import {
  styled,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Card,
  Box,
  CardContent,
  Typography,
  IconButton,
  CardMedia,
  Tooltip,
} from "@mui/material";
import { Delete, ContentCopy } from "@mui/icons-material";
import ImageUploader from "./ImageUploader";

const AddButton = styled(HButton)(() => ({
  float: "right",
  marginTop: -50,
}));

const CardContainer = styled("div")(() => ({
  display: "flex",
  flexWrap: "wrap",
  gap: "16px",
  justifyContent: "flex-start",
}));

const ActionButtons = styled("div")(() => ({
  display: "flex",
  justifyContent: "flex-end",
  gap: "8px",
  padding: "8px",
  backgroundColor: "rgba(0, 0, 0, 0.04)",
  borderTop: "1px solid rgba(0, 0, 0, 0.12)",
}));

export default function ImageList() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [imageToDelete, setImageToDelete] = useState(null);
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.auth.user);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/images");
      const data = await response.json();
      if (data.success) {
        setImages(data.data);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Failed to fetch images");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    dispatch(
      showToast({
        type: "success",
        message: "URL copied to clipboard!",
      })
    );
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleClickOpen = (image) => {
    setImageToDelete(image);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setImageToDelete(null);
  };

  const handleDelete = async () => {
    if (!imageToDelete) return;

    try {
      const response = await fetch(
        `/api/images?url=${encodeURIComponent(imageToDelete.url)}&_id=${
          imageToDelete._id
        }`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (data.success) {
        dispatch(
          showToast({
            type: "success",
            message: "Image deleted successfully!",
          })
        );
        fetchImages();
      } else {
        dispatch(showToast({ type: "error", message: data.message }));
      }
    } catch (err) {
      dispatch(showToast({ type: "error", message: "Failed to delete image" }));
    } finally {
      handleClose();
    }
  };

  const handleUploadSuccess = (url) => {
    dispatch(
      showToast({
        type: "success",
        message: "Image uploaded successfully!",
      })
    );
    fetchImages();
  };

  return (
    <Layout title="Image Gallery">
      <AddButton
        onClick={() => document.getElementById("image-upload-input")?.click()}
      >
        Upload Image
      </AddButton>

      <ImageUploader
        onUploadComplete={handleUploadSuccess}
        style={{ display: "none" }}
        id="image-upload-input"
      />

      {loading && <p>Loading images...</p>}
      {error && <p>Error: {error}</p>}
      {!loading && !images?.length && <p>No images available.</p>}

      <CardContainer>
        {images.map((image, index) => (
          <Card
            key={index}
            sx={{ width: 300, display: "flex", flexDirection: "column" }}
          >
            <CardMedia
              component="img"
              height="200"
              image={image.url}
              alt={image.name}
              sx={{ objectFit: "cover" }}
            />
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography gutterBottom variant="h6" component="div" noWrap>
                {image.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {Math.round(image.size / 1024)} KB
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mt: 1,
                  wordBreak: "break-all",
                  fontSize: "0.7rem",
                  opacity: 0.7,
                }}
              >
                {image.url}
              </Typography>
            </CardContent>
            <ActionButtons>
              <Tooltip title="Copy URL">
                <IconButton
                  color="primary"
                  onClick={() => copyToClipboard(image.url)}
                  size="small"
                >
                  <ContentCopy fontSize="small" />
                </IconButton>
              </Tooltip>

              {userInfo?.role === "admin" && (
                <Tooltip title="Delete">
                  <IconButton
                    color="error"
                    onClick={() => handleClickOpen(image)}
                    size="small"
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
            </ActionButtons>
          </Card>
        ))}
      </CardContainer>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <p>Are you sure you want to delete this image?</p>
        </DialogContent>
        <DialogActions>
          <HButton onClick={handleClose} color="primary">
            Cancel
          </HButton>
          <HButton onClick={handleDelete} color="error">
            Delete
          </HButton>
        </DialogActions>
      </Dialog>
    </Layout>
  );
}
