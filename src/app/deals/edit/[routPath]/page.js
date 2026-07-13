"use client";
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Typography,
  IconButton,
  CircularProgress,
  Grid,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { showToast } from "@/store/settingsSlice";
import { PhotoCamera } from "@mui/icons-material";
import { HButton, HInput, Layout } from "@/components";
import { deleteThumbnail } from "@/utils/api";
import Editor from "@/components/Editor";
import { fetchDealData, updateDealData } from "@/store/dealsSlice";

const MAX_IMAGE_SIZE = 1 * 1024 * 1024;

const BlogForm = ({ params }) => {
  const { routPath } = params;
  const router = useRouter();
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  const userInfo = useSelector((state) => state.auth.user);

  const [dealsData, setDealsData] = useState({
    content: "",
    faqs: [],
    isActive: false,
    routPath: "",
    metaTitle: "",
    metaDescription: "",
    metaKeywords: "",
    description: "",
    title: "",
    thumbnail: "",
    thumbnail_public_id: "",
    imgageAlt: "",
  });
  const [loading, setLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!routPath) return;
      setIsFetching(true);
      try {
        let result = await dispatch(fetchDealData(routPath)).unwrap();
        if (result) {
          setDealsData(result);
        }
      } catch (error) {
        dispatch(showToast({ type: "error", message: error?.message }));
      } finally {
        setIsFetching(false);
      }
    };
    fetchData();
  }, [routPath, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDealsData((prev) => ({ ...prev, [name]: value }));
  };

  const handleContentChange = (value) => {
    setDealsData((prev) => ({ ...prev, content: value }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > MAX_IMAGE_SIZE) {
      dispatch(
        showToast({
          type: "error",
          message: "File too large. Max size is 1MB.",
        })
      );
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("old_public_id", dealsData.thumbnail_public_id);

    try {
      const updateRes = await fetch("/api/upload", {
        method: "PUT",
        body: formData,
      });
      const updateData = await updateRes.json();

      if (!updateRes.ok)
        throw new Error(updateData.error || "Thumbnail update failed");

      setDealsData((prev) => ({
        ...prev,
        thumbnail: updateData.url,
        thumbnail_public_id: updateData.public_id,
      }));

      dispatch(showToast({ type: "success", message: "Thumbnail updated!" }));
    } catch (err) {
      console.error("Image update failed:", err.message);
      dispatch(showToast({ type: "error", message: "Image update failed" }));
    }
  };

  const handleRemoveImage = async () => {
    try {
      await deleteThumbnail(dealsData.thumbnail_public_id);

      setDealsData({
        ...dealsData,
        thumbnail_public_id: "",
        thumbnail: "",
      });
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  const handleReuploadImageChange = async (e) => {
    try {
      await deleteThumbnail(dealsData.thumbnail_public_id);

      setDealsData((prev) => ({
        ...prev,
        thumbnail: "",
        thumbnail_public_id: "",
      }));
    } catch (error) {
      console.error("Error deleting image:", error);
    }

    handleImageChange(e);
  };

  const handleDivClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await dispatch(updateDealData(dealsData)).unwrap();
      dispatch(
        showToast({ type: "success", message: "Blog updated successfully!" })
      );
      router.back();
    } catch (error) {
      dispatch(showToast({ type: "error", message: error?.message }));
    } finally {
      setLoading(false);
    }
  };

  const handleFaqChange = (index, field, value) => {
    setDealsData((prev) => ({
      ...prev,
      faqs: prev.faqs.map((faq, i) =>
        i === index ? { ...faq, [field]: value } : faq
      ),
    }));
  };

  const addFaq = () => {
    setDealsData((prev) => ({
      ...prev,
      faqs: [...prev.faqs, { question: "", answer: "" }],
    }));
  };

  const deleteFaq = (index) => {
    const updatedFaqs = dealsData.faqs.filter((_, i) => i !== index);
    setDealsData((prev) => ({ ...prev, faqs: updatedFaqs }));
  };

  return (
    <Layout title={"Edit Deals"}>
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
            <Grid
              container
              rowSpacing={1}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            >
              <Grid item xs={7}>
                <HInput
                  label="Route Path"
                  name="routPath"
                  value={dealsData.routPath}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  disabled={userInfo?.role === "admin" ? false : true}
                  required
                />
              </Grid>
              <Grid
                item
                xs={2}
                style={{ display: "flex", justifyContent: "center" }}
              >
                <FormControlLabel
                  control={
                    <Switch
                      checked={dealsData.isActive}
                      onChange={(e) =>
                        setDealsData({
                          ...dealsData,
                          isActive: e.target.checked,
                        })
                      }
                      color="primary"
                    />
                  }
                  label={dealsData.isActive ? "Active" : "Inactive"}
                />
              </Grid>
            </Grid>
            <HInput
              label="Meta Title"
              name="metaTitle"
              value={dealsData?.metaTitle}
              onChange={handleChange}
              fullWidth
              margin="normal"
              variant="outlined"
              required
            />

            <HInput
              label="Meta Description"
              name="metaDescription"
              value={dealsData.metaDescription}
              onChange={handleChange}
              fullWidth
              margin="normal"
              variant="outlined"
              required
            />
            <HInput
              label="Meta Keywords"
              name="metaKeywords"
              value={dealsData.metaKeywords}
              onChange={handleChange}
              fullWidth
              margin="normal"
              variant="outlined"
            />
            <HInput
              label="Title"
              name="title"
              value={dealsData.title}
              onChange={handleChange}
              fullWidth
              margin="normal"
              variant="outlined"
              required
            />
            <HInput
              label="Description (150-200 Char)"
              name="description"
              inputProps={{ maxLength: 200 }}
              value={dealsData.description}
              onChange={handleChange}
              fullWidth
              margin="normal"
              variant="outlined"
              multiline
              rows={2}
              required
            />
            {dealsData.thumbnail ? (
              <Box mt={2}>
                <Typography variant="subtitle1">Thumbnail Image</Typography>
                <img src={dealsData.thumbnail} alt="Thumbnail" />
                <Grid container spacing={2}>
                  <Grid item>
                    <HInput
                      type="text"
                      fullWidth={false}
                      placeholder="Image alt"
                      name="imgageAlt"
                      value={dealsData.imgageAlt}
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
            <Box mt={2} mb={20}>
              <Editor
                content={dealsData.content}
                onChange={handleContentChange}
              />
            </Box>
            <Box mt={4}>
              {dealsData.faqs.map((faq, index) => (
                <Box
                  key={index}
                  mb={4}
                  p={2}
                  border="1px solid #ccc"
                  borderRadius="8px"
                >
                  <HInput
                    label={`Question ${index + 1}`}
                    value={faq.question}
                    onChange={(e) =>
                      handleFaqChange(index, "question", e.target.value)
                    }
                    fullWidth
                    margin="normal"
                  />

                  <HInput
                    label={`Answer ${index + 1}`}
                    value={faq.answer}
                    onChange={(e) =>
                      handleFaqChange(index, "answer", e.target.value)
                    }
                    fullWidth
                    margin="normal"
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
              <Box display="flex" justifyContent="flex-end" mt={2}>
                <HButton variant="contained" onClick={addFaq}>
                  Add FAQ
                </HButton>
              </Box>
            </Box>
            <Grid container mb={2}>
              <HButton
                variant="contained"
                color="primary"
                onClick={handleSave}
                style={{ marginRight: 10 }}
                disabled={loading}
              >
                {loading ? "Saving..." : "Save"}
              </HButton>
            </Grid>
          </Box>
        )}
      </Box>
    </Layout>
  );
};

export default BlogForm;
