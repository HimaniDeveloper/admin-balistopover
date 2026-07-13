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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { showToast } from "@/store/settingsSlice";
import { PhotoCamera } from "@mui/icons-material";
import { HButton, HInput, Layout } from "@/components";
import { fetchBlogData, updateBlogData } from "@/store/blogSlice";
import { deleteThumbnail } from "@/utils/api";
import Editor from "@/components/Editor";

const MAX_IMAGE_SIZE = 1 * 1024 * 1024;

const BlogForm = ({ params }) => {
  const { routPath } = params;
  const router = useRouter();
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  const userInfo = useSelector((state) => state.auth.user);

  const [blogData, setBlogData] = useState({
    content: "",
    faqs: [],
    isActive: false,
    routPath: "",
    category: "",
    metaTitle: "",
    metaDescription: "",
    metaKeywords: "",
    description: "",
    title: "",
    author: "",
    thumbnail: "",
    thumbnail_public_id: "",
    imgageAlt: "",
  });
  const [author, setAuthor] = useState([]);

  const [loading, setLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [category, setCategory] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!routPath) return;
      setIsFetching(true);
      try {
        let result = await dispatch(fetchBlogData(routPath)).unwrap();

        if (result) {
          result = { ...result, content: result?.content?.content || "" };
          setBlogData(result);
        }
      } catch (error) {
        dispatch(showToast({ type: "error", message: error?.message }));
      } finally {
        setIsFetching(false);
      }
    };
    fetchData();
  }, [routPath, dispatch]);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await fetch(`/api/category`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        if (!res.ok) throw new Error("Failed to fetch data");
        const data = await res.json();
        if (data.success) {
          setCategory(data.data);
        }
      } catch (error) {
        console.error(error.message);
      }
    };
    const fetchAuthor = async () => {
      try {
        const res = await fetch(`/api/author`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) throw new Error("Failed to fetch data");

        const data = await res.json();
        if (data.success) {
          setAuthor(data.data);
        }
      } catch (error) {
        console.error(error.message);
      }
    };
    fetchCategory();
    fetchAuthor();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBlogData((prev) => ({ ...prev, [name]: value }));
  };

  const handleContentChange = (value) => {
    setBlogData((prev) => ({ ...prev, content: value }));
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
    formData.append("_id", blogData._id);
    formData.append("old_public_id", blogData.thumbnail_public_id);

    try {
      const updateRes = await fetch("/api/upload", {
        method: "PUT",
        body: formData,
      });
      const updateData = await updateRes.json();

      if (!updateRes.ok)
        throw new Error(updateData.error || "Thumbnail update failed");

      setBlogData((prev) => ({
        ...prev,
        thumbnail: updateData.url,
        thumbnail_public_id: updateData.public_id,
      }));

      dispatch(showToast({ type: "success", message: "Thumbnail updated!" }));
    } catch (err) {
      console.error("Image update failed:", err);
      dispatch(showToast({ type: "error", message: "Image update failed" }));
    }
  };

  const handleRemoveImage = async () => {
    try {
      await deleteThumbnail(blogData.thumbnail_public_id);

      setBlogData({
        ...blogData,
        thumbnail_public_id: "",
        thumbnail: "",
      });
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  const handleReuploadImageChange = async (e) => {
    try {
      await deleteThumbnail(blogData.thumbnail_public_id);

      setBlogData((prev) => ({
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
      await dispatch(updateBlogData(blogData)).unwrap();
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
    setBlogData((prev) => ({
      ...prev,
      faqs: prev.faqs.map((faq, i) =>
        i === index ? { ...faq, [field]: value } : faq
      ),
    }));
  };

  const addFaq = () => {
    setBlogData((prev) => ({
      ...prev,
      faqs: [...prev.faqs, { question: "", answer: "" }],
    }));
  };

  const deleteFaq = (index) => {
    const updatedFaqs = blogData.faqs.filter((_, i) => i !== index);
    setBlogData((prev) => ({ ...prev, faqs: updatedFaqs }));
  };

  return (
    <Layout title={"Edit Blog"}>
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
                  value={blogData.routPath}
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
                xs={3}
                style={{ display: "flex", justifyContent: "center" }}
              >
                <FormControl fullWidth margin="normal">
                  <InputLabel id="airline-label" required>
                    Select Category
                  </InputLabel>
                  <Select
                    labelId="category-label"
                    id="category-select"
                    value={blogData.category}
                    name="category"
                    label="Select Category"
                    onChange={handleChange}
                    required
                  >
                    {category.map((cat) => (
                      <MenuItem key={cat._id} value={cat._id}>
                        {cat.name}
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
                      checked={blogData.isActive}
                      onChange={(e) =>
                        setBlogData({ ...blogData, isActive: e.target.checked })
                      }
                      color="primary"
                    />
                  }
                  label={blogData.isActive ? "Active" : "Inactive"}
                />
              </Grid>
            </Grid>
            <Grid
              container
              rowSpacing={1}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            >
              <Grid item xs={7}>
                <HInput
                  label="Meta Title"
                  name="metaTitle"
                  value={blogData?.metaTitle}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  required
                />
              </Grid>
              <Grid
                item
                xs={5}
                style={{ display: "flex", justifyContent: "center" }}
              >
                <FormControl fullWidth margin="normal">
                  <InputLabel id="airline-label" required>
                    Select Author
                  </InputLabel>
                  <Select
                    labelId="Author-label"
                    id="Author-select"
                    value={blogData.author}
                    name="author"
                    label="Select Author"
                    onChange={handleChange}
                    required
                  >
                    {author.map((auth) => (
                      <MenuItem key={auth._id} value={auth._id}>
                        {auth.authorName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <HInput
              label="Meta Description"
              name="metaDescription"
              value={blogData.metaDescription}
              onChange={handleChange}
              fullWidth
              margin="normal"
              variant="outlined"
              required
            />
            <HInput
              label="Meta Keywords"
              name="metaKeywords"
              value={blogData.metaKeywords}
              onChange={handleChange}
              fullWidth
              margin="normal"
              variant="outlined"
            />
            <HInput
              label="Title"
              name="title"
              value={blogData.title}
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
              value={blogData.description}
              onChange={handleChange}
              fullWidth
              margin="normal"
              variant="outlined"
              multiline
              rows={2}
              required
            />
            {blogData.thumbnail ? (
              <Box mt={2}>
                <Typography variant="subtitle1">Thumbnail Image</Typography>
                <img src={blogData.thumbnail} alt="Thumbnail" />
                <Grid container spacing={2}>
                  <Grid item>
                    <HInput
                      type="text"
                      fullWidth={false}
                      placeholder="Image alt"
                      name="imgageAlt"
                      value={blogData.imgageAlt}
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
                content={blogData.content}
                onChange={handleContentChange}
              />
            </Box>
            <Box mt={4}>
              {blogData.faqs.map((faq, index) => (
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

BlogForm.modules = {
  toolbar: toolbarOptions,
  clipboard: {
    matchVisual: false,
  },
};

export default BlogForm;
