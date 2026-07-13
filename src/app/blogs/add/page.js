"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Typography,
  IconButton,
  Grid,
  FormControlLabel,
  Switch,
  InputLabel,
  Select,
  FormControl,
  MenuItem,
} from "@mui/material";
import dynamic from "next/dynamic";
import { useDispatch } from "react-redux";
import { showToast } from "@/store/settingsSlice";
import { PhotoCamera } from "@mui/icons-material";
import { HButton, HInput, Layout } from "@/components";
import { addBlogData } from "@/store/blogSlice";
import Editor from "@/components/Editor";

const MAX_IMAGE_SIZE = 1 * 1024 * 1024; // 1MB

const BlogForm = () => {
  // console.log(object)
  const router = useRouter();
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);

  const [blogData, setBlogData] = useState({
    title: "",
    metaTitle: "",
    // metaTags: "",
    metaDescription: "",
    content: "",
    metaKeywords: "",
    routPath: "",
    thumbnail: "",
    thumbnail_public_id: "",
    imgageAlt: "",
    description: "",
    isActive: false,
    author: "",
    category: "",
    faqs: [],
  });

  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState([]);
  const [author, setAuthor] = useState([]);
  const handleFaqChange = (index, field, value) => {
    const updatedFaqs = [...blogData.faqs];
    updatedFaqs[index][field] = value;
    setBlogData({ ...blogData, faqs: updatedFaqs });
  };

  const addFaq = () => {
    setBlogData({
      ...blogData,
      faqs: [...blogData.faqs, { question: "", answer: "" }],
    });
  };

  const deleteFaq = (index) => {
    const updatedFaqs = blogData.faqs.filter((_, i) => i !== index);
    setBlogData({ ...blogData, faqs: updatedFaqs });
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedBlogData = { ...blogData, [name]: value };
    if (name === "routPath") {
      const sanitizedRoutPath = value.replace(/[^a-zA-Z0-9-_]/g, "");
      updatedBlogData = { ...updatedBlogData, routPath: sanitizedRoutPath };
    }
    // if (name === "title") {
    //   const generatedRoutPath = value.toLowerCase().replace(/\s+/g, "_");
    //   const sanitizedRoutPath = generatedRoutPath.replace(
    //     /[^a-zA-Z0-9-_]/g,
    //     ""
    //   );
    //   updatedBlogData = { ...updatedBlogData, routPath: sanitizedRoutPath };
    // }
    setBlogData(updatedBlogData);
  };

  const handleContentChange = (value) =>
    setBlogData({ ...blogData, content: value });

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
        setBlogData({
          ...blogData,
          thumbnail: data.url,
          thumbnail_public_id: data.public_id,
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
    setBlogData({ ...blogData, thumbnail: "" });
  };

  const handleDivClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleAddBlog = async () => {
    setLoading(true);
    try {
      await dispatch(addBlogData(blogData)).unwrap();
      dispatch(
        showToast({ type: "success", message: "Blog added successfully!" }),
      );
      router.push("/blogs");
    } catch (err) {
      console.error("Failed to add blog:", err);
      dispatch(showToast({ type: "error", message: err.message }));
    } finally {
      setLoading(false);
    }
  };
  const fetchCategory = async () => {
    try {
      const res = await fetch(`/api/category`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
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

  useEffect(() => {
    fetchCategory();
    fetchAuthor();
  }, []);

  return (
    <Layout title={"Add New Blog"}>
      <Box p={3} mx="auto">
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={7}>
            <HInput
              label="Route Path"
              name="routPath"
              value={blogData.routPath}
              onChange={handleChange}
              fullWidth
              margin="normal"
              variant="outlined"
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
                label="Select Category*"
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
        <Box mt={2}>
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
            label="Meta Kewords"
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
            inputProps={{ maxLength: 1000 }}
            name="description"
            value={blogData.description}
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
            <Editor content={blogData.content} onChange={handleContentChange} />
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
                onClick={handleAddBlog}
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
