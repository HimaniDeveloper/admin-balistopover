"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { HInput, Layout } from "@/components";
import {
  Button,
  Box,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Grid,
  FormControlLabel,
  Switch,
  Typography,
  IconButton,
} from "@mui/material";
import dynamic from "next/dynamic";
import { useDispatch, useSelector } from "react-redux";
import { showToast } from "@/store/settingsSlice";
import {
  fetchAirlineData,
  fetchFlightPageData,
  updateFlightPageData,
} from "@/store/flightpageSlice";
import { PhotoCamera } from "@mui/icons-material";
import Editor from "@/components/Editor";

const MAX_IMAGE_SIZE = 1 * 1024 * 1024; // 1MB
export default function EditFlight({ params }) {
  const { slug } = params;
  const router = useRouter();
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  const airlines = useSelector((state) => state?.flight?.airlines) || [];
  const userInfo = useSelector((state) => state.auth.user);

  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [pageData, setPageData] = useState({
    title: "",
    metaDescription: "",
    content: "",
    airline: "",
    metaKeywords: "",
    routPath: "",
    metaTitle: "",
    smallContent: "",
    isActive: false,
    faqs: [],
    links: [],
    cabins: [],
    mediaBlocks: [],
    imgageAlt: "",
    thumbnail: "",
    language: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPageData((prev) => ({ ...prev, [name]: value }));
  };

  const handleContentChange = (value) =>
    setPageData((prev) => ({ ...prev, content: value }));

  const handleDivClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > MAX_IMAGE_SIZE) {
      dispatch(
        showToast({ type: "error", message: "File too large. Max 1MB." }),
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

      if (data.url) {
        setPageData((prev) => ({ ...prev, thumbnail: data.url }));
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
    setPageData((prev) => ({ ...prev, thumbnail: "" }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const result = await dispatch(updateFlightPageData(pageData)).unwrap();
      setLoading(false);
      router.back();
      if (result?.success) {
        dispatch(showToast({ type: "success", message: result?.data }));
      } else {
        dispatch(showToast({ type: "error", message: result?.message }));
      }
    } catch (error) {
      dispatch(showToast({ type: "error", message: error?.message }));
      setLoading(false);
    }
  };

  const handleFaqChange = (index, field, value) => {
    setPageData((prev) => {
      const faqs = [...prev.faqs];
      faqs[index] = { ...faqs[index], [field]: value }; // create a new object
      return { ...prev, faqs };
    });
  };

  const addFaq = () => {
    setPageData((prev) => ({
      ...prev,
      faqs: [...prev.faqs, { question: "", answer: "" }],
    }));
  };

  const deleteFaq = (index) => {
    setPageData((prev) => ({
      ...prev,
      faqs: prev.faqs.filter((_, i) => i !== index),
    }));
  };

  const handleLinkChange = (index, field, value) => {
    setPageData((prev) => {
      const links = [...prev.links];
      links[index] = { ...links[index], [field]: value };
      return { ...prev, links };
    });
  };

  const addLink = () => {
    setPageData((prev) => ({
      ...prev,
      links: [...prev.links, { label: "", url: "" }],
    }));
  };

  const deleteLink = (index) => {
    setPageData((prev) => ({
      ...prev,
      links: prev.links.filter((_, i) => i !== index),
    }));
  };

  const handleCabinChange = (index, field, value) => {
    setPageData((prev) => {
      const cabins = [...(prev.cabins || [])];
      cabins[index] = { ...cabins[index], [field]: value };
      return { ...prev, cabins };
    });
  };

  const addCabin = () => {
    setPageData((prev) => ({
      ...prev,
      cabins: [
        ...(prev.cabins || []),
        { cabin: "", bestFor: "", whatYouGet: "", fare: "" },
      ],
    }));
  };

  const deleteCabin = (index) => {
    setPageData((prev) => ({
      ...prev,
      cabins: (prev.cabins || []).filter((_, i) => i !== index),
    }));
  };

  const handleMediaBlockChange = (index, field, value) => {
    setPageData((prev) => {
      const mediaBlocks = [...(prev.mediaBlocks || [])];
      mediaBlocks[index] = { ...mediaBlocks[index], [field]: value };
      return { ...prev, mediaBlocks };
    });
  };

  const addMediaBlock = () => {
    setPageData((prev) => ({
      ...prev,
      mediaBlocks: [
        ...(prev.mediaBlocks || []),
        { image: "", imageAlt: "", heading: "", text: "" },
      ],
    }));
  };

  const deleteMediaBlock = (index) => {
    setPageData((prev) => ({
      ...prev,
      mediaBlocks: (prev.mediaBlocks || []).filter((_, i) => i !== index),
    }));
  };

  const handleMediaBlockImageChange = async (index, e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > MAX_IMAGE_SIZE) {
      dispatch(
        showToast({ type: "error", message: "File too large. Max 1MB." }),
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

      if (data.url) {
        handleMediaBlockChange(index, "image", data.url);
        dispatch(showToast({ type: "success", message: "Image uploaded!" }));
      } else {
        throw new Error(data.error || "Upload failed");
      }
    } catch (err) {
      console.error(err);
      dispatch(showToast({ type: "error", message: "Upload failed" }));
    }
  };

  useEffect(() => {
    dispatch(fetchAirlineData());
  }, [dispatch]);

  useEffect(() => {
    if (airlines?.length && slug) {
      const fetData = async () => {
        setIsLoading(true);
        try {
          const result = await dispatch(fetchFlightPageData(slug)).unwrap();
          if (result) {
            setPageData(result);
          }
        } catch (error) {
          console.error(error);
        }
        setIsLoading(false);
      };
      fetData();
    }
  }, [airlines, slug, dispatch]); // Only when airlines load and slug exists

  if (isLoading) {
    return (
      <Layout title={`Edit ${pageData?.title || "Page"}`}>Loading...</Layout>
    );
  }

  return (
    <Layout title={`Edit Airline Page`}>
      <Box p={3}>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={6}>
            <FormControl fullWidth margin="normal">
              <InputLabel id="airline-label" required>
                Select Airline
              </InputLabel>
              <Select
                labelId="airline-label"
                id="airline-select"
                value={pageData?.airline}
                label="Select Airline"
                disabled={userInfo?.role === "admin" ? false : true}
                required
              >
                {airlines
                  .slice()
                  .sort((a, b) => a.commonName.localeCompare(b.commonName))
                  .map((flight) => (
                    <MenuItem key={flight._id} value={flight._id}>
                      {flight.commonName}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={6}>
            <HInput
              label="Route Path"
              name="routPath"
              value={pageData?.routPath}
              onChange={handleChange}
              margin="normal"
              disabled={userInfo?.role === "admin" ? false : true}
              required
            />
          </Grid>
        </Grid>

        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={6}>
            <HInput
              label="Meta Title"
              name="metaTitle"
              value={pageData?.metaTitle}
              onChange={handleChange}
              fullWidth
              margin="normal"
              variant="outlined"
              required
            />
          </Grid>
          <Grid item xs={3}>
            <FormControl fullWidth margin="normal">
              <InputLabel id="language-label" required>
                Select Language
              </InputLabel>
              <Select
                labelId="language-label"
                id="language-select"
                value={pageData.language}
                label="Select language"
                onChange={(e) => {
                  setPageData({ ...pageData, ["language"]: e.target.value });
                }}
                required
              >
                {[
                  { label: "EN-english", value: "EN" },
                  { label: "ES-spanish", value: "ES" },
                ].map((lang) => (
                  <MenuItem key={lang.value} value={lang.value}>
                    {lang.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid
            item
            xs={3}
            style={{ display: "flex", justifyContent: "center" }}
          >
            <FormControlLabel
              control={
                <Switch
                  checked={pageData.isActive}
                  onChange={(e) =>
                    setPageData({ ...pageData, isActive: e.target.checked })
                  }
                  color="primary"
                />
              }
              label={pageData.isActive ? "Active" : "Inactive"}
            />
          </Grid>
        </Grid>

        {/* <HInput
          label="Meta Tags"
          name="metaTags"
          value={pageData?.metaTags}
          onChange={handleChange}
          margin="normal"
        /> */}
        <HInput
          label="Meta Description"
          name="metaDescription"
          value={pageData?.metaDescription}
          onChange={handleChange}
          margin="normal"
          required
        />

        <HInput
          label="Meta Kewords"
          name="metaKeywords"
          value={pageData?.metaKeywords}
          onChange={handleChange}
          fullWidth
          margin="normal"
          variant="outlined"
        />
        {/* <HInput
          label="Description"
          name="description"
          value={pageData?.description}
          onChange={handleChange}
          fullWidth
          margin="normal"
          variant="outlined"
          inputProps={{ maxLength: 200 }}
        /> */}
        <HInput
          label="Title"
          name="title"
          value={pageData?.title}
          onChange={handleChange}
          margin="normal"
          required
        />
        <HInput
          label="Small Content"
          name="smallContent"
          value={pageData?.smallContent}
          onChange={handleChange}
          fullWidth
          margin="normal"
          variant="outlined"
          multiline
          rows={3}
          required
        />
        {pageData?.thumbnail ? (
          <Box mt={2}>
            <Typography variant="subtitle1">Thumbnail Image</Typography>
            <img src={pageData?.thumbnail} alt="Thumbnail" />
            <Grid container spacing={2}>
              <Grid item>
                <HInput
                  type="text"
                  fullWidth={false}
                  placeholder="Image alt"
                  name="imgageAlt"
                  value={pageData?.imgageAlt}
                  onChange={handleChange}
                  size={"small"}
                />
              </Grid>
              <Grid item>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleRemoveImage}
                >
                  Remove Image
                </Button>
              </Grid>
              <Grid item>
                <Button variant="outlined" color="secondary" component="label">
                  Reupload
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleImageChange}
                  />
                </Button>
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
              padding: "14px",
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
        <Box mt={2} mb={2}>
          <Editor
            content={pageData?.content}
            onChange={handleContentChange}
          />
        </Box>
        <Box mt={4} style={{ marginTop: "90px" }}>
          {pageData.links.map((link, index) => (
            <Box
              key={index}
              mb={4}
              p={2}
              border="1px solid #ccc"
              borderRadius="8px"
            >
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={4}>
                  <HInput
                    label={`Link Label`}
                    value={link.label}
                    onChange={(e) =>
                      handleLinkChange(index, "label", e.target.value)
                    }
                    fullWidth
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={6}>
                  <HInput
                    label={`Absolute URL`}
                    value={link.url}
                    onChange={(e) =>
                      handleLinkChange(index, "url", e.target.value)
                    }
                    fullWidth
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={2} display="flex" justifyContent="flex-end">
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => deleteLink(index)}
                  >
                    Delete Link
                  </Button>
                </Grid>
              </Grid>
            </Box>
          ))}
        </Box>
        <Box display="flex" justifyContent="flex-end" mt={2} gap={2}>
          <Button variant="contained" onClick={addLink}>
            Add Popular Link
          </Button>
        </Box>

        <Box mt={4}>
          <Typography variant="h6" mb={2}>
            Cabin Classes
          </Typography>
          {(pageData.cabins || []).map((cabin, index) => (
            <Box
              key={index}
              mb={4}
              p={2}
              border="1px solid #ccc"
              borderRadius="8px"
            >
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={3}>
                  <HInput
                    label="Cabin"
                    value={cabin.cabin}
                    onChange={(e) =>
                      handleCabinChange(index, "cabin", e.target.value)
                    }
                    fullWidth
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={3}>
                  <HInput
                    label="Best For"
                    value={cabin.bestFor}
                    onChange={(e) =>
                      handleCabinChange(index, "bestFor", e.target.value)
                    }
                    fullWidth
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={4}>
                  <HInput
                    label="What You Get"
                    value={cabin.whatYouGet}
                    onChange={(e) =>
                      handleCabinChange(index, "whatYouGet", e.target.value)
                    }
                    fullWidth
                    margin="normal"
                    multiline
                    rows={2}
                  />
                </Grid>
                <Grid item xs={2}>
                  <HInput
                    label="Fare"
                    value={cabin.fare}
                    onChange={(e) =>
                      handleCabinChange(index, "fare", e.target.value)
                    }
                    fullWidth
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} display="flex" justifyContent="flex-end">
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => deleteCabin(index)}
                  >
                    Delete Cabin
                  </Button>
                </Grid>
              </Grid>
            </Box>
          ))}
          <Box display="flex" justifyContent="flex-end" mt={2} gap={2}>
            <Button variant="contained" onClick={addCabin}>
              Add Cabin Class
            </Button>
          </Box>
        </Box>

        <Box mt={4}>
          <Typography variant="h6" mb={2}>
            Baggage / Family Blocks
          </Typography>
          {(pageData.mediaBlocks || []).map((block, index) => (
            <Box
              key={index}
              mb={4}
              p={2}
              border="1px solid #ccc"
              borderRadius="8px"
            >
              <Grid container spacing={2} alignItems="flex-start">
                <Grid item xs={4}>
                  {block.image ? (
                    <Box>
                      <img
                        src={block.image}
                        alt={block.imageAlt || "Block image"}
                        style={{ width: "100%", borderRadius: "8px" }}
                      />
                      <Box mt={1} display="flex" gap={1}>
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          onClick={() =>
                            handleMediaBlockChange(index, "image", "")
                          }
                        >
                          Remove
                        </Button>
                        <Button
                          variant="outlined"
                          color="secondary"
                          size="small"
                          component="label"
                        >
                          Reupload
                          <input
                            type="file"
                            accept="image/*"
                            hidden
                            onChange={(e) =>
                              handleMediaBlockImageChange(index, e)
                            }
                          />
                        </Button>
                      </Box>
                    </Box>
                  ) : (
                    <Button
                      variant="outlined"
                      component="label"
                      fullWidth
                      startIcon={<PhotoCamera />}
                    >
                      Upload Image
                      <input
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={(e) => handleMediaBlockImageChange(index, e)}
                      />
                    </Button>
                  )}
                  <HInput
                    label="Image Alt"
                    value={block.imageAlt}
                    onChange={(e) =>
                      handleMediaBlockChange(index, "imageAlt", e.target.value)
                    }
                    fullWidth
                    margin="normal"
                    size="small"
                  />
                </Grid>
                <Grid item xs={8}>
                  <HInput
                    label="Heading"
                    value={block.heading}
                    onChange={(e) =>
                      handleMediaBlockChange(index, "heading", e.target.value)
                    }
                    fullWidth
                    margin="normal"
                  />
                  <HInput
                    label="Text"
                    value={block.text}
                    onChange={(e) =>
                      handleMediaBlockChange(index, "text", e.target.value)
                    }
                    fullWidth
                    margin="normal"
                    multiline
                    rows={4}
                  />
                  <Box display="flex" justifyContent="flex-end" mt={1}>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => deleteMediaBlock(index)}
                    >
                      Delete Block
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          ))}
          <Box display="flex" justifyContent="flex-end" mt={2} gap={2}>
            <Button variant="contained" onClick={addMediaBlock}>
              Add Baggage / Family Block
            </Button>
          </Box>
        </Box>

        <Box mt={4}>
          {pageData.faqs.map((faq, index) => (
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
              <Editor
                content={faq.answer}
                onChange={(value) => handleFaqChange(index, "answer", value)}
                height={200}
              />
              <Box display="flex" justifyContent="flex-end" mt={2}>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => deleteFaq(index)}
                >
                  Delete FAQ
                </Button>
              </Box>
            </Box>
          ))}
          <Box display="flex" justifyContent="flex-end" mt={2}>
            <Button variant="contained" onClick={addFaq}>
              Add FAQ
            </Button>
          </Box>
        </Box>
        <Box mb={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save"}
          </Button>
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

EditFlight.modules = {
  toolbar: toolbarOptions,
  clipboard: {
    matchVisual: false,
  },
};
