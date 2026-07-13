"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Typography,
  IconButton,
  CircularProgress,
  Grid,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { showToast } from "@/store/settingsSlice";
import { PhotoCamera } from "@mui/icons-material";
import { HButton, HInput, Layout } from "@/components";
import { fetchFeedbackData, updateFeedbackData } from "@/store/feedbackSlice";

const MAX_IMAGE_SIZE = 2 * 1024 * 1024;

const FeedbackForm = ({ params }) => {
  const { routPath } = params;
  const router = useRouter();
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);

  const [feedbackData, setFeedbackData] = useState({
    name: "",
    description: "",
    img: ""
  });

  const [loading, setLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsFetching(true);
      try {
        let result = await dispatch(fetchFeedbackData(routPath)).unwrap();
        if (result) {
          setFeedbackData(result);
        }
      } catch (error) {
        dispatch(showToast({ type: "error", message: error?.message }));
      } finally {
        setIsFetching(false);
      }
    };
    if (routPath) {
      fetchData();
    }
  }, [routPath, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFeedbackData({ ...feedbackData, [name]: value });
  };


  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= MAX_IMAGE_SIZE) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFeedbackData({ ...feedbackData, img: reader.result });
      };
      reader.readAsDataURL(file);
    } else {
      dispatch(
        showToast({
          type: "error",
          message: "File is too large. Max size is 2MB.",
        })
      );
    }
  };

  const handleRemoveImage = () => {
    setFeedbackData({ ...feedbackData, img: "" });
  };

  const handleDivClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await dispatch(updateFeedbackData(feedbackData)).unwrap();
      dispatch(
        showToast({
          type: "success",
          message: "Feedback updated successfully!",
        })
      );
      router.back();
    } catch (error) {
      dispatch(showToast({ type: "error", message: error?.message }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title={"Edit We Offer"}>
      <Box p={3} mx="auto">
        {isFetching ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100%"
          >
            <CircularProgress />
          </Box>
        ) : (
          <Box mt={2}>
            <HInput
              label="Title"
              name="name"
              value={feedbackData.name}
              onChange={handleChange}
              fullWidth
              margin="normal"
              variant="outlined"
            />
             <HInput
            label="Description"
            name="description"
            inputProps={{ maxLength: 150 }}
            value={feedbackData.description}
            onChange={handleChange}
            fullWidth
            margin="normal"
            variant="outlined"
          />
            {feedbackData.img ? (
              <Box mt={2}>
                <Typography variant="subtitle1">User Image</Typography>
                <img
                  src={feedbackData.img}
                  alt="img"
                  style={{ maxWidth: 300, height: "auto", borderRadius: 4 }}
                />
                <Grid container spacing={2}>
                  <Grid item>
                    <HInput
                      type="text"
                      fullWidth={false}
                      placeholder="Image alt"
                      name="imgageAlt"
                      value={feedbackData.img}
                      onChange={handleChange}
                      size={"small"}
                    />
                  </Grid>
                  <Grid item>
                    <HButton
                      variant="contained"
                      color="primary"
                      onClick={handleRemoveImage}
                    >
                      Remove Image
                    </HButton>
                  </Grid>
                  <Grid item>
                    <HButton
                      variant="outlined"
                      color="secondary"
                      component="label"
                    >
                      Reupload
                      <input
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={handleImageChange}
                      />
                    </HButton>
                  </Grid>
                </Grid>
              </Box>
            ) : (
              <Box
                onClick={handleDivClick}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "16.5px 14px",
                  borderRadius: "4px",
                  border: "1px solid rgba(0, 0, 0, 0.23)",
                  cursor: "pointer",
                }}
              >
                <Typography color="textSecondary">Upload Image</Typography>
                <IconButton>
                  <PhotoCamera />
                </IconButton>
              </Box>
            )}
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleImageChange}
            />
            <Grid container mt={50} mb={2}>
              <HButton
                variant="contained"
                color="primary"
                onClick={handleSave}
                style={{ marginRight: 10 }}
                disabled={loading}
              >
                {loading ? "Saving..." : "Save"}
              </HButton>
              <Grid item></Grid>
              <Grid item>
                <HButton
                  variant="outlined"
                  color="secondary"
                  onClick={() => router.back()}
                >
                  Cancel
                </HButton>
              </Grid>
            </Grid>
          </Box>
        )}
      </Box>
    </Layout>
  );
};

export default FeedbackForm;
