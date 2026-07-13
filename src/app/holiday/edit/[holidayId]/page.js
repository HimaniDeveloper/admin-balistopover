"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Box, Typography, IconButton, Grid } from "@mui/material";
import { useDispatch } from "react-redux";
import { showToast } from "@/store/settingsSlice";
import { PhotoCamera } from "@mui/icons-material";
import { HButton, HInput, Layout } from "@/components";
import { fetchHolidayData, updateHolidayData } from "@/store/holidaySlice";
import Editor from "@/components/Editor";

const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB

export default function HolidayForm({ params }) {
  const { holidayId } = params;
  const router = useRouter();
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);

  const [isLoading, setIsLoading] = useState(true);
  const [holidayData, setHolidayData] = useState({
    title: "",
    metaTags: "",
    metaDescription: "",
    content: "",
    thumbnail: "",
    metaKeywords: "",
    routPath: "",
    imgageAlt: "",
    metaTitle:"",
    price: "",
    offer: "",
    tagline: ""
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await dispatch(fetchHolidayData(holidayId)).unwrap();
        if (result) {
          setHolidayData(result);
        } else {
          setHolidayData({
            title: "",
            metaTags: "",
            metaDescription: "",
            metaKeywords: "",
            content: "",
            thumbnail: "",
            routPath: "",
            price: "",
            offer: "",
            imgageAlt: "",
            metaTitle: "",
            tagline: ""
          });
        }
      } catch (error) {
        dispatch(showToast({ type: "error", message: error?.message }));
      } finally {
        setIsLoading(false);
      }
    };
    if (holidayId) {
      fetchData();
    }
  }, [holidayId, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setHolidayData({ ...holidayData, [name]: value });
  };

  const handleContentChange = (value) =>
    setHolidayData({ ...holidayData, content: value });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= MAX_IMAGE_SIZE) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setHolidayData({ ...holidayData, thumbnail: reader.result });
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
    setHolidayData({ ...holidayData, thumbnail: "" });
  };

  const handleDivClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await dispatch(
        updateHolidayData({ id: holidayId, ...holidayData })
      ).unwrap();
      dispatch(
        showToast({
          type: "success",
          message: "Holiday updated successfully!",
        })
      );
      router.back();
    } catch (error) {
      dispatch(showToast({ type: "error", message: error?.message }));
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return <Layout title={`Edit Holiday Package`}>Loading...</Layout>;
  }

  return (
    <Layout title={"Edit Holiday Package"}>
      <Box p={3} mx="auto">
        <Box mt={2}>
          <HInput
            label="Title"
            name="title"
            value={holidayData.title}
            onChange={handleChange}
            fullWidth
            margin="normal"
            variant="outlined"
          />
          <HInput
            label="Meta Title"
            name="metaTitle"
            value={holidayData?.metaTitle}
            onChange={handleChange}
            fullWidth
            margin="normal"
            variant="outlined"
          />
          <HInput
            label="Meta Tags"
            name="metaTags"
            value={holidayData.metaTags}
            onChange={handleChange}
            fullWidth
            margin="normal"
            variant="outlined"
          />
          <HInput
            label="Meta Description"
            name="metaDescription"
            value={holidayData.metaDescription}
            onChange={handleChange}
            fullWidth
            margin="normal"
            variant="outlined"
          />
          <HInput
            label="Meta Kewords"
            name="metaKeywords"
            value={holidayData.metaKeywords}
            onChange={handleChange}
            fullWidth
            margin="normal"
            variant="outlined"
          />
          <HInput
            label="Route Path"
            name="routPath"
            value={holidayData.routPath}
            onChange={handleChange}
            fullWidth
            margin="normal"
            variant="outlined"
            disabled
          />
          <HInput
            label="Tag line"
            name="tagline"
            placeholder={"Land of Diversity"}
            value={holidayData.tagline}
            onChange={handleChange}
            fullWidth
            margin="normal"
            variant="outlined"
            maxLength={3}
          />
          <HInput
            label="Price"
            name="price"
            placeholder={"Enter Price"}
            value={holidayData.price}
            onChange={handleChange}
            fullWidth
            margin="normal"
            variant="outlined"
            type="integer"
          />
          <HInput
            label="Offer Percentage %"
            name="offer"
            value={holidayData.offer}
            placeholder={"Offer Percentage"}
            onChange={handleChange}
            fullWidth
            margin="normal"
            variant="outlined"
            maxLength={3}
            type="integer"
          />
          <Box mt={2} mb={12}>
            <Editor
              content={holidayData.content}
              onChange={handleContentChange}
            />
          </Box>

          {/* Conditional File Upload */}
          {holidayData.thumbnail ? (
            <Box mt={2}>
              <Typography variant="subtitle1">Thumbnail Image</Typography>
              <img
                src={holidayData.thumbnail}
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
                      value={holidayData.imgageAlt}
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
                cursor: "pointer",
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
}
const toolbarOptions = [
  ["bold", "italic", "underline", "strike"],
  ["blockquote", "code-block"],
  ["link", "image"],

  [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
  [{ script: "sub" }, { script: "super" }],
  [{ indent: "-1" }, { indent: "+1" }],
  [{ direction: "rtl" }],

  [{ size: [false, "small", "large", "huge"] }],
  [{ header: [1, 2, 3, 4, 5, 6] }],

  [{ color: [] }, { background: [] }],
  [{ font: [] }],
  [{ align: [] }],
  ["clean"],
];

HolidayForm.modules = {
  toolbar: toolbarOptions,
  clipboard: {
    matchVisual: false,
  },
};
