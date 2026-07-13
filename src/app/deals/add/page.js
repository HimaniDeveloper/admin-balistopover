"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Typography,
  IconButton,
  Grid,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { showToast } from "@/store/settingsSlice";
import { PhotoCamera } from "@mui/icons-material";
import { HButton, HInput, Layout } from "@/components";
import Editor from "@/components/Editor";
import { addDealData } from "@/store/dealsSlice";

const MAX_IMAGE_SIZE = 1 * 1024 * 1024; // 1MB

const DealsForm = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);

  const [dealsData, setDealsData] = useState({
    title: "",
    metaTitle: "",
    metaDescription: "",
    content: "",
    metaKeywords: "",
    routPath: "",
    thumbnail: "",
    thumbnail_public_id: "",
    imgageAlt: "",
    description: "",
    isActive: false,
    faqs: [],
  });

  const [loading, setLoading] = useState(false);
  const handleFaqChange = (index, field, value) => {
    const updatedFaqs = [...dealsData.faqs];
    updatedFaqs[index][field] = value;
    setDealsData({ ...dealsData, faqs: updatedFaqs });
  };

  const addFaq = () => {
    setDealsData({
      ...dealsData,
      faqs: [...dealsData.faqs, { question: "", answer: "" }],
    });
  };

  const deleteFaq = (index) => {
    const updatedFaqs = dealsData.faqs.filter((_, i) => i !== index);
    setDealsData({ ...dealsData, faqs: updatedFaqs });
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedBlogData = { ...dealsData, [name]: value };
    if (name === "routPath") {
      const sanitizedRoutPath = value.replace(/[^a-zA-Z0-9-_]/g, "");
      updatedBlogData = { ...updatedBlogData, routPath: sanitizedRoutPath };
    }
    setDealsData(updatedBlogData);
  };

  const handleContentChange = (value) =>
    setDealsData({ ...dealsData, content: value });

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > MAX_IMAGE_SIZE) {
      dispatch(
        showToast({ type: "error", message: "File too large. Max 1MB." })
      );
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      console.log("Imae data: ", data);
      if (data.url) {
        setDealsData({
          ...dealsData,
          thumbnail: data.url,
          thumbnail_public_id: data.public_id,
        });
        // setDealsData({ ...dealsData, thumbnail_public_id: data.public_id });
        dispatch(showToast({ type: "success", message: "Image uploaded!" }));
      } else {
        throw new Error(data.error || "Upload failed");
      }
    } catch (err) {
      console.error(err);
      dispatch(showToast({ type: "error", message: "Upload failed" }));
    }
  };

  const handleRemoveImage = () => {
    setDealsData({ ...dealsData, thumbnail: "" });
  };

  const handleDivClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleAddBDeals = async () => {
    setLoading(true);
    try {
      await dispatch(addDealData(dealsData)).unwrap();
      dispatch(
        showToast({ type: "success", message: "Deal added successfully!" })
      );
      router.push("/deals");
    } catch (err) {
      console.error("Failed to add Deal:", err);
      dispatch(showToast({ type: "error", message: err.message }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title={"Add New Deal"}>
      <Box p={3} mx="auto">
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={7}>
            <HInput
              label="Route Path"
              name="routPath"
              value={dealsData.routPath}
              onChange={handleChange}
              fullWidth
              margin="normal"
              variant="outlined"
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
                    setDealsData({ ...dealsData, isActive: e.target.checked })
                  }
                  color="primary"
                />
              }
              label={dealsData.isActive ? "Active" : "Inactive"}
            />
          </Grid>
        </Grid>
        <Box mt={2}>
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
            label="Meta Kewords"
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
          <HInput
            label="Description (150-200 Char)"
            inputProps={{ maxLength: 200 }}
            name="description"
            value={dealsData.description}
            onChange={handleChange}
            fullWidth
            margin="normal"
            variant="outlined"
            multiline
            required
            rows={2} // adjust number of rows as needed
          />

          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleImageChange}
          />

          <Box mt={2} mb={18}>
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
                  label={`Question`}
                  value={faq.question}
                  onChange={(e) =>
                    handleFaqChange(index, "question", e.target.value)
                  }
                  fullWidth
                  margin="normal"
                />

                <HInput
                  label={`Answer`}
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
            <Box display="flex" justifyContent="flex-end" mt={2} gap={2}>
              <HButton variant="contained" onClick={addFaq}>
                Add FAQ
              </HButton>
            </Box>
          </Box>
          <Grid container mb={2}>
            <Grid item>
              {" "}
              <HButton
                variant="contained"
                color="primary"
                onClick={handleAddBDeals}
                disabled={loading}
                style={{ marginRight: 10 }}
              >
                {loading ? "Adding..." : "Sumbit"}
              </HButton>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Layout>
  );
};

export default DealsForm;
