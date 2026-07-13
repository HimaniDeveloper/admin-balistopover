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
import { addFlightPageData, fetchAirlineData } from "@/store/flightpageSlice";
import { PhotoCamera } from "@mui/icons-material";
import Editor from "@/components/Editor";
const MAX_IMAGE_SIZE = 1 * 1024 * 1024; // 1MB
export default function AddFlight() {
  const router = useRouter();
  const dispatch = useDispatch();

  const airlines = useSelector((state) => state?.flight?.airlines) || [];
  const fileInputRef = useRef(null);
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

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPageData({ ...pageData, [name]: value });
  };

  const handleFaqChange = (index, field, value) => {
    const updatedFaqs = [...pageData.faqs];
    updatedFaqs[index][field] = value;
    setPageData({ ...pageData, faqs: updatedFaqs });
  };

  const addFaq = () => {
    setPageData({
      ...pageData,
      faqs: [...pageData.faqs, { question: "", answer: "" }],
    });
  };

  const deleteFaq = (index) => {
    const updatedFaqs = pageData.faqs.filter((_, i) => i !== index);
    setPageData({ ...pageData, faqs: updatedFaqs });
  };

  const handleLinkChange = (index, field, value) => {
    const updatedLinks = [...pageData.links];
    updatedLinks[index][field] = value;
    setPageData({ ...pageData, links: updatedLinks });
  };

  const addLink = () => {
    setPageData({
      ...pageData,
      links: [...pageData.links, { label: "", url: "" }],
    });
  };

  const deleteLink = (index) => {
    const updatedLinks = pageData.links.filter((_, i) => i !== index);
    setPageData({ ...pageData, links: updatedLinks });
  };

  const handleCabinChange = (index, field, value) => {
    const updatedCabins = [...pageData.cabins];
    updatedCabins[index][field] = value;
    setPageData({ ...pageData, cabins: updatedCabins });
  };

  const addCabin = () => {
    setPageData({
      ...pageData,
      cabins: [
        ...pageData.cabins,
        { cabin: "", bestFor: "", whatYouGet: "", fare: "" },
      ],
    });
  };

  const deleteCabin = (index) => {
    const updatedCabins = pageData.cabins.filter((_, i) => i !== index);
    setPageData({ ...pageData, cabins: updatedCabins });
  };

  const handleMediaBlockChange = (index, field, value) => {
    const updatedBlocks = [...pageData.mediaBlocks];
    updatedBlocks[index][field] = value;
    setPageData({ ...pageData, mediaBlocks: updatedBlocks });
  };

  const addMediaBlock = () => {
    setPageData({
      ...pageData,
      mediaBlocks: [
        ...pageData.mediaBlocks,
        { image: "", imageAlt: "", heading: "", text: "" },
      ],
    });
  };

  const deleteMediaBlock = (index) => {
    const updatedBlocks = pageData.mediaBlocks.filter((_, i) => i !== index);
    setPageData({ ...pageData, mediaBlocks: updatedBlocks });
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

  const handleAirlineChange = (event) => {
    const selectedAirline = event.target.value;
    const airline = airlines.find((flight) => flight._id === selectedAirline);
    const route = airline.businessName.toLowerCase().replace(/\s/g, "-");

    setPageData({
      ...pageData,
      airline: selectedAirline,
      title: airline.businessName,
      routPath: airline?.route || route,
    });
  };
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

      console.log("Imae data: ", data);
      if (data.url) {
        setPageData({
          ...pageData,
          thumbnail: data.url,
        });
        // setBlogData({ ...blogData, thumbnail_public_id: data.public_id });
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
    setPageData({ ...pageData, thumbnail: "" });
  };

  const handleContentChange = (value) =>
    setPageData({ ...pageData, content: value });

  const handleSave = async () => {
    setLoading(true);
    try {
      const result = await dispatch(addFlightPageData(pageData)).unwrap();
      if (result?.success) {
        dispatch(showToast({ type: "success", message: result?.data }));
        router.back();
      } else {
        dispatch(showToast({ type: "error", message: result?.message }));
      }
    } catch (error) {
      dispatch(showToast({ type: "error", message: error?.message }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    dispatch(fetchAirlineData());
  }, [dispatch]);

  return (
    <Layout title="Add Airline">
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
                value={pageData.airline}
                label="Select Airline"
                onChange={handleAirlineChange}
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
              fullWidth
              label="Route Path"
              name="routPath"
              value={pageData.routPath}
              onChange={handleChange}
              margin="normal"
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
          value={pageData.metaTags}
          onChange={handleChange}
          margin="normal"
        /> */}

        <HInput
          label="Meta Description"
          name="metaDescription"
          value={pageData.metaDescription}
          onChange={handleChange}
          margin="normal"
          required
        />
        <HInput
          label="Meta Kewords"
          name="metaKeywords"
          value={pageData.metaKeywords}
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
          value={pageData.title}
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
        {pageData.thumbnail ? (
          <Box mt={2}>
            <Typography variant="subtitle1">Thumbnail Image</Typography>
            <img src={pageData.thumbnail} alt="Thumbnail" />
            <Grid container spacing={2}>
              <Grid item>
                <HInput
                  type="text"
                  fullWidth={false}
                  placeholder="Image alt"
                  name="imgageAlt"
                  value={pageData.imgageAlt}
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
            content={pageData.content}
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
          {pageData.cabins.map((cabin, index) => (
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
          {pageData.mediaBlocks.map((block, index) => (
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
                            onChange={(e) => handleMediaBlockImageChange(index, e)}
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
                label={`Question`}
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
          <Box display="flex" justifyContent="flex-end" mt={2} gap={2}>
            <Button variant="contained" onClick={addFaq}>
              Add FAQ
            </Button>
          </Box>
        </Box>

        <Grid container>
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? "Saving..." : "Sumbit"}
            </Button>
          </Grid>
        </Grid>
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

AddFlight.modules = {
  toolbar: toolbarOptions,
  clipboard: {
    matchVisual: false,
  },
};
