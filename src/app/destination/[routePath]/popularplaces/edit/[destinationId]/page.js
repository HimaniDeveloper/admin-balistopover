"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Box, Typography, IconButton, Grid } from "@mui/material";
import { useDispatch } from "react-redux";
import { showToast } from "@/store/settingsSlice";
import { PhotoCamera } from "@mui/icons-material";
import { HButton, HInput, Layout } from "@/components";
import { fetchPlaceById, updatePlaceData } from "@/store/popularplaceSlice";


const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB

const DestinationForm = ({ params }) => {
  const { destinationId, routePath } = params;
  const router = useRouter();
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);

  const [destinationData, setDestinationData] = useState({
    routPath: routePath || "",
    title: "",
    description: "",
    price: "",
    offer: "",
    thumbnail: ""
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await dispatch(fetchPlaceById({ routPath: routePath, id: destinationId })).unwrap();
        if (result) {
          setDestinationData(result);
        } else {
          setDestinationData({
            routPath: routePath || "",
            title: "",
            description: "",
            price: "",
            offer: "",
            thumbnail: ""
          });
        }
      } catch (error) {
        dispatch(showToast({ type: "error", message: error?.message }));
      }
    };
    if (destinationId && routePath) {
      fetchData();
    }
  }, [destinationId, routePath, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDestinationData({ ...destinationData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= MAX_IMAGE_SIZE) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setDestinationData({ ...destinationData, thumbnail: reader.result });
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
    setDestinationData({ ...destinationData, thumbnail: "" });
  };

  const handleDivClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await dispatch(updatePlaceData(destinationData)).unwrap();
      dispatch(
        showToast({
          type: "success",
          message: "Place updated successfully!",
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
    <Layout title={'Edit Place'}>
      <Box p={3} mx="auto">
        <Box mt={2}>
          <HInput
            label="Route Path"
            name="routPath"
            value={destinationData.routPath}
            onChange={handleChange}
            fullWidth
            margin="normal"
            variant="outlined"
            disabled
          />
          <HInput
            label="Title"
            name="title"
            value={destinationData.title}
            onChange={handleChange}
            fullWidth
            margin="normal"
            variant="outlined"
          />
          <HInput
            label="Description"
            name="description"
            value={destinationData.description}
            onChange={handleChange}
            fullWidth
            margin="normal"
            variant="outlined"
          />
          <HInput
          type="number"
            label="Price"
            name="price"
            value={destinationData.price}
            onChange={handleChange}
            fullWidth
            margin="normal"
            variant="outlined"
          />
          <HInput
            type="number"
            label="Offer %"
            name="offer"
            value={destinationData.offer}
            onChange={handleChange}
            fullWidth
            margin="normal"
            variant="outlined"
          />

          {/* Conditional File Upload */}
          {destinationData.thumbnail ? (
            <Box mt={2}>
              <Typography variant="subtitle1">Thumbnail Image</Typography>
              <img
                src={destinationData.thumbnail}
                alt="Thumbnail"
                style={{ maxWidth: "100%", height: "auto", borderRadius: 4 }}
              />
              <Grid container spacing={2}>
                <Grid item>
                  <HInput
                    type="text"
                    fullWidth={false}
                    placeholder="Image alt"
                    name="imgageAlt"
                    value={destinationData.imgageAlt}
                    onChange={handleChange}
                    size={'small'}
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
                cursor: "pointer"
              }}
            >
              <Typography color="textSecondary">Upload Thumbnail</Typography>
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

          <HButton
            variant="contained"
            color="primary"
            onClick={handleSave}
            style={{ marginRight: 10 }}
            disabled={loading} // Disable button when loading
          >
            {loading ? "Saving..." : "Save"}
          </HButton>
          <HButton
            variant="outlined"
            color="secondary"
            onClick={() => router.back()}
          >
            Cancel
          </HButton>
        </Box>
      </Box>
    </Layout>
  );
};

export default DestinationForm;
