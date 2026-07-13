"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Typography,
  IconButton,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { showToast } from "@/store/settingsSlice";
import { PhotoCamera } from "@mui/icons-material";
import { HButton, HInput, Layout } from "@/components";
import {
  fetchDestinationData,
  updateDestinationData,
} from "@/store/destinationSlice";
import { deleteThumbnail } from "@/utils/api";
import Editor from "@/components/Editor";
import DestinationDetailFields from "@/components/destination/DestinationDetailFields";

const MAX_IMAGE_SIZE = 1 * 1024 * 1024; // 1MB



export default function DestinationForm({ params }) {
  const { destinationId } = params;
  const router = useRouter();
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);

  const [isLoading, setIsLoading] = useState(true);
  const userInfo = useSelector((state) => state.auth.user);

  const [destinationData, setDestinationData] = useState({
    title: "",
    description: "",
    metaDescription: "",
    content: "",
    thumbnail: "",
    thumbnail_public_id: "",
    metaKeywords: "",
    routPath: "",
    imgageAlt: "",
    metaTitle: "",
    isActive: false,
    destinationtype: "international",
    country: "",
    startingPrice: "",
    overview: [],
    facts: {
      best: "",
      flight: "",
      currency: "",
      language: "",
      tz: "",
      budget: "",
      weather: "",
    },
    beaches: [],
    areas: [],
    season: Array.from({ length: 12 }, () => ""),
    cost: {
      flights: "",
      accom: "",
      food: "",
      transport: "",
      activities: "",
    },
    gallery: [],
    faqs: [],
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await dispatch(
          fetchDestinationData(destinationId)
        ).unwrap();
        if (result) {
          setDestinationData(result);
        } else {
          setDestinationData({
            title: "",
            description: "",
            metaDescription: "",
            content: "",
            thumbnail: "",
            thumbnail_public_id: "",
            metaKeywords: "",
            routPath: "",
            imgageAlt: "",
            metaTitle: "",
            isActive: false,
            destinationtype: "international",
            faqs: [],
          });
        }
      } catch (error) {
        dispatch(showToast({ type: "error", message: error?.message }));
      } finally {
        setIsLoading(false);
      }
    };
    if (destinationId) {
      fetchData();
    }
  }, [destinationId, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDestinationData({ ...destinationData, [name]: value });
  };

  const handleContentChange = (value) =>
    setDestinationData({ ...destinationData, content: value });

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file && file.size <= MAX_IMAGE_SIZE) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();

        console.log("Imae data: &&& ", data);
        if (data.url) {
          setDestinationData({
            ...destinationData,
            thumbnail: data.url,
            thumbnail_public_id: data.public_id,
          });
          dispatch(showToast({ type: "success", message: "Image uploaded!" }));
        } else {
          throw new Error(data.error || "Upload failed");
        }
      } catch (err) {
        console.error(err);
        dispatch(showToast({ type: "error", message: "Upload failed" }));
      }
    } else {
      dispatch(
        showToast({
          type: "error",
          message: "File is too large. Max size is 1MB.",
        })
      );
    }
  };

  const handleRemoveImage = async () => {
    try {
      await deleteThumbnail(destinationData.thumbnail_public_id);

      setDestinationData({
        ...destinationData,
        thumbnail_public_id: "",
        thumbnail: "",
      });
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  const handleReuploadImageChange = async (e) => {
    try {
      await deleteThumbnail(destinationData.thumbnail_public_id);

      setDestinationData({
        ...destinationData,
        thumbnail_public_id: "",
        thumbnail: "",
      });
    } catch (error) {
      console.error("Error deleting image:", error);
    }

    handleImageChange(e);
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
        updateDestinationData({ id: destinationId, ...destinationData })
      ).unwrap();
      dispatch(
        showToast({
          type: "success",
          message: "Destination updated successfully!",
        })
      );
      router.back();
    } catch (error) {
      dispatch(showToast({ type: "error", message: error?.message }));
    } finally {
      setLoading(false);
    }
  };

  const handleFaqChange = (index, field, value) => {
    setDestinationData((prev) => ({
      ...prev,
      faqs: prev.faqs.map((faq, i) =>
        i === index ? { ...faq, [field]: value } : faq
      ),
    }));
  };

  const addFaq = () => {
    setDestinationData((prev) => ({
      ...prev,
      faqs: [...prev.faqs, { question: "", answer: "" }],
    }));
  };

  const deleteFaq = (index) => {
    const updatedFaqs = destinationData.faqs.filter((_, i) => i !== index);
    setDestinationData((prev) => ({ ...prev, faqs: updatedFaqs }));
  };

  return (
    <Layout title={"Edit Destination"}>
      {isLoading ? (
        "Loading..."
      ) : (
        <Box p={3} mx="auto">
          <Box mt={2}>
            <Grid
              container
              rowSpacing={1}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            >
              <Grid item xs={7}>
                <HInput
                  label="Route Path"
                  name="routPath"
                  value={destinationData?.routPath}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  disabled={userInfo?.role === "admin" ? false : true}
                />
              </Grid>
              <Grid
                item
                xs={3}
                style={{ display: "flex", justifyContent: "center" }}
              >
                <FormControl fullWidth margin="normal">
                  <InputLabel id="destination-label" required>
                    Destination Type
                  </InputLabel>
                  <Select
                    labelId="Destination Type"
                    id="destination-type"
                    value={destinationData?.destinationtype}
                    name="destinationtype"
                    label="Destination Type"
                    onChange={handleChange}
                    required
                  >
                    {["domestic", "international", "trending"].map((des) => (
                      <MenuItem key={des} value={des}>
                        {des}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid
                item
                xs={2}
                style={{ display: "flex", justifyContent: "center" }}
              >
                <FormControlLabel
                  control={
                    <Switch
                      checked={destinationData?.isActive}
                      onChange={(e) =>
                        setDestinationData({
                          ...destinationData,
                          isActive: e.target.checked,
                        })
                      }
                      color="primary"
                    />
                  }
                  label={destinationData?.isActive ? "Active" : "Inactive"}
                />
              </Grid>
            </Grid>

            <HInput
              label="Meta Title"
              name="metaTitle"
              value={destinationData?.metaTitle}
              onChange={handleChange}
              fullWidth
              margin="normal"
              variant="outlined"
            />

            <HInput
              label="Meta Description"
              name="metaDescription"
              value={destinationData?.metaDescription}
              onChange={handleChange}
              fullWidth
              margin="normal"
              variant="outlined"
            />
            <HInput
              label="Meta Kewords"
              name="metaKeywords"
              value={destinationData?.metaKeywords}
              onChange={handleChange}
              fullWidth
              margin="normal"
              variant="outlined"
            />
            <HInput
              label="Title"
              name="title"
              value={destinationData?.title}
              onChange={handleChange}
              fullWidth
              margin="normal"
              variant="outlined"
            />

            <HInput
              label="Description"
              name="description"
              value={destinationData?.description}
              onChange={handleChange}
              fullWidth
              margin="normal"
              variant="outlined"
              multiline
              rows={2}
            />
            {/* Conditional File Upload */}
            {destinationData?.thumbnail ? (
              <Box mt={2}>
                <Typography variant="subtitle1">Thumbnail Image</Typography>
                <img
                  src={destinationData?.thumbnail}
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
                      value={destinationData?.imgageAlt}
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
                        onChange={(e) => handleReuploadImageChange(e)}
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
                  padding: "10px",
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
            <Box mt={2} mb={12}>
              <Editor
                content={destinationData?.content}
                onChange={handleContentChange}
              />
            </Box>
            <Box mt={4}>
              {destinationData?.faqs?.map((faq, index) => (
                <Box
                  key={index}
                  mb={4}
                  p={2}
                  border="1px solid #ccc"
                  borderRadius="8px"
                >
                  <HInput
                    label={`Question`}
                    value={faq?.question}
                    onChange={(e) =>
                      handleFaqChange(index, "question", e.target.value)
                    }
                    fullWidth
                    margin="normal"
                  />
                  <Editor
                    content={faq?.answer}
                    onChange={(value) =>
                      handleFaqChange(index, "answer", value)
                    }
                    height={200}
                  />
                  <Box display="flex" justifyContent="flex-end" mt={2}>
                    <HButton
                      variant="outlined"
                      color="error"
                      onClick={() => deleteFaq(index)}
                    >
                      Delete FAQ
                    </HButton>
                  </Box>
                </Box>
              ))}
              <Box display="flex" justifyContent="flex-end" mt={2} gap={2}>
                <HButton variant="outlined" onClick={addFaq}>
                  Add FAQ
                </HButton>
              </Box>
            </Box>

            <DestinationDetailFields
              data={destinationData}
              setData={setDestinationData}
            />

            <HButton
              variant="contained"
              color="primary"
              onClick={handleSave}
              disabled={loading}
              style={{ marginRight: 10, marginTop: 10 }}
            >
              {loading ? "Saving..." : "Save"}{" "}
            </HButton>
          </Box>
        </Box>
      )}
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

DestinationForm.modules = {
  toolbar: toolbarOptions,
  clipboard: {
    matchVisual: false,
  },
};
