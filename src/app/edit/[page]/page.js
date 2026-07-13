"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { HInput, Layout } from "@/components";
import { Button, Box, Grid } from "@mui/material";
import { useDispatch } from "react-redux";
import { fetchPageData, updatePageData } from "@/store/pagesSlice";
import { showToast } from "@/store/settingsSlice";
import Editor from "@/components/Editor";

export default function EditPage({ params }) {
  const { page } = params;
  const router = useRouter();
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(true);
  const [pageData, setPageData] = useState({
    title: "",
    metaTags: "",
    metaDescription: "",
    content: "",
    metaKeywords: "",
    metaTitle: "",
  });

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await dispatch(fetchPageData(page)).unwrap();
        if (result) {
          setPageData(result);
        } else {
          setPageData({
            title: "",
            metaTags: "",
            metaDescription: "",
            content: "",
            metaKeywords: "",
            metaTitle: "",
          });
        }
      } catch (error) {
        dispatch(showToast({ type: "error", message: error?.message }));
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [page, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPageData({ ...pageData, [name]: value });
  };

  const handleContentChange = (value) =>
    setPageData({ ...pageData, content: value });

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const result = await dispatch(updatePageData({ pageData })).unwrap();
      if (result?.success) {
        dispatch(showToast({ type: "success", message: result?.data }));
        router.back();
      } else {
        dispatch(showToast({ type: "error", message: result?.message }));
      }
    } catch (error) {
      dispatch(showToast({ type: "error", message: error?.message }));
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Layout title={`Edit ${pageData?.title || "Page"}`}>Loading...</Layout>
    );
  }

  return (
    <Layout title={`Edit ${pageData.title || "Page"}`}>
      <Box p={3}>
        <HInput
          label="Title"
          name="title"
          value={pageData.title}
          onChange={handleChange}
          margin="normal"
        />
        <HInput
          label="Meta Title"
          name="metaTitle"
          value={pageData?.metaTitle}
          onChange={handleChange}
          fullWidth
          margin="normal"
          variant="outlined"
        />
        <HInput
          label="Meta Tags"
          name="metaTags"
          value={pageData.metaTags}
          onChange={handleChange}
          margin="normal"
        />
        <HInput
          label="Meta Description"
          name="metaDescription"
          value={pageData.metaDescription}
          onChange={handleChange}
          margin="normal"
        />
        <HInput
          label="Meta Keywords"
          name="metaKeywords"
          value={pageData.metaKeywords}
          onChange={handleChange}
          margin="normal"
        />
        <Box mt={2} mb={2}>
          <Editor
            content={pageData.content}
            onChange={handleContentChange}
          />
        </Box>
        <Grid container mt={16} mb={2}>
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save"}
            </Button>
          </Grid>
          <Grid item>
            <Button
              style={{ marginLeft: 10 }}
              variant="outlined"
              color="secondary"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Layout>
  );
}

EditPage.modules = {
  toolbar: [
    [{ header: "1" }, { header: "2" }, { font: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    ["bold", "italic", "underline"],
    [
      {
        color: [
          "#FF0000",
          "#00FF00",
          "#0000FF",
          "#FFA500",
          "#800080",
          "#FFFF00",
          "#000000",
          "#FFFFFF",
        ],
      },
      {
        background: [
          "#FF0000",
          "#00FF00",
          "#0000FF",
          "#FFA500",
          "#800080",
          "#FFFF00",
          "#000000",
          "#FFFFFF",
        ],
      },
    ],
    [{ align: [] }],
    ["link", "image"],
  ],
  clipboard: {
    matchVisual: false,
  },
};

EditPage.formats = [
  "header",
  "font",
  "list",
  "bullet",
  "bold",
  "italic",
  "underline",
  "align",
  "link",
  "image",
  "color",
  "background",
];
