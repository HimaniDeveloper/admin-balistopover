"use client";

import React, { useEffect, useState } from "react";
import { Layout, HButton } from "@/components";
import {
  styled,
  Box,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Paper,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { Delete, Edit } from "@mui/icons-material";
import { showToast } from "@/store/settingsSlice";
import AddIcon from "@mui/icons-material/Add";
import AuthorDialog from "@/components/author";

const AddButton = styled(HButton)(() => ({
  marginTop: -50,
}));

export default function AuthorsListPage() {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.auth.user);

  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAuthor, setEditingAuthor] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [authorToDelete, setAuthorToDelete] = useState(null);

  const fetchAuthors = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/author");
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch authors");
      setAuthors(data.data || data || []);
    } catch (err) {
      dispatch(showToast({ type: "error", message: err.message }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuthors();
  }, []);

  const handleOpenAdd = () => {
    setEditingAuthor(null);
    setDialogOpen(true);
  };

  const handleOpenEdit = (author) => {
    setEditingAuthor(author);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingAuthor(null);
  };

  const handleSaveAuthor = async (author) => {
    try {
      const isEditing = !!editingAuthor;
      const payload = {
        authorName: author.authorName?.trim(),
        authorDes: author.authorDes?.trim(),
        ...(author.slug?.trim() && { slug: author.slug.trim() }),
        ...(author.role?.trim() && { role: author.role.trim() }),
        // ...(author.image?.trim() && { image: author.image.trim() }),
        // ...(author.thumbnail_public_id && {
        //   thumbnail_public_id: author.thumbnail_public_id,
        // }),
        image: author.image?.trim() || "",
        thumbnail_public_id: author.thumbnail_public_id || "",

        ...(author.expertise?.length > 0 && { expertise: author.expertise }),
        ...(author.social && {
          social: {
            linkedin: author.social.linkedin?.trim() || "",
            twitter: author.social.twitter?.trim() || "",
            email: author.social.email?.trim() || "",
          },
        }),
      };

      const url = isEditing
        ? `/api/author/${editingAuthor.slug || editingAuthor._id}`
        : `/api/author`;
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to save author");

      dispatch(
        showToast({
          type: "success",
          message: isEditing ? "Author updated!" : "Author added!",
        }),
      );
      fetchAuthors();
    } catch (err) {
      dispatch(showToast({ type: "error", message: err.message }));
    }
  };

  const handleClickDelete = (author) => {
    setAuthorToDelete(author);
    setDeleteOpen(true);
  };

  const handleCloseDelete = () => {
    setDeleteOpen(false);
    setAuthorToDelete(null);
  };

  // const handleDelete = async () => {
  //   if (!authorToDelete) return;
  //   try {
  //     const res = await fetch(`/api/author/${authorToDelete.slug}`, {
  //       method: "DELETE",
  //     });
  //     const data = await res.json();
  //     if (!res.ok) throw new Error(data.message || "Failed to delete");

  //     dispatch(showToast({ type: "success", message: "Author deleted!" }));
  //     handleCloseDelete();
  //     fetchAuthors();
  //   } catch (err) {
  //     dispatch(showToast({ type: "error", message: err.message }));
  //     handleCloseDelete();
  //   }
  // };
  const handleDelete = async () => {
    if (!authorToDelete) {
      console.error("❌ No author selected");
      return;
    }

    console.log("🔍 Author object:", authorToDelete);
    console.log("🔍 Slug:", authorToDelete.slug);
    console.log("🔍 _id:", authorToDelete._id);

    if (!authorToDelete.slug) {
      dispatch(
        showToast({
          type: "error",
          message: "This author has no slug — cannot delete via slug route",
        }),
      );
      handleCloseDelete();
      return;
    }

    try {
      const url = `/api/author/${authorToDelete.slug}`;
      console.log("📡 DELETE URL:", url);

      const res = await fetch(url, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      console.log("📥 Status:", res.status);
      console.log("📥 Status text:", res.statusText);

      const text = await res.text();
      console.log("📥 Raw response:", text);

      let data;
      try {
        data = JSON.parse(text);
        console.log("📥 Parsed:", data);
      } catch (e) {
        throw new Error(`Server returned non-JSON: ${text}`);
      }

      if (!res.ok) {
        throw new Error(
          data.message || data.error || `Failed (status ${res.status})`,
        );
      }

      dispatch(showToast({ type: "success", message: "Author deleted!" }));
      handleCloseDelete();
      fetchAuthors();
    } catch (err) {
      console.error("❌ Delete error:", err);
      dispatch(showToast({ type: "error", message: err.message }));
      handleCloseDelete();
    }
  };

  return (
    <Layout title="Authors">
      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: "20px" }}>
        <AddButton
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={handleOpenAdd}
        >
          Add Author
        </AddButton>
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper} sx={{ mt: 3, borderRadius: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell style={{ fontWeight: "bold", fontSize: "16px" }}>
                  Image
                </TableCell>
                <TableCell style={{ fontWeight: "bold", fontSize: "16px" }}>
                  Name
                </TableCell>
                <TableCell style={{ fontWeight: "bold", fontSize: "16px" }}>
                  Role
                </TableCell>
                <TableCell style={{ fontWeight: "bold", fontSize: "16px" }}>
                  Expertise
                </TableCell>
                <TableCell
                  align="center"
                  style={{ fontWeight: "bold", fontSize: "16px" }}
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {authors.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                    No authors yet. Click "Add Author" to create one.
                  </TableCell>
                </TableRow>
              ) : (
                authors.map((author) => (
                  <TableRow key={author._id || author.slug}>
                    <TableCell style={{ padding: "5px 10px" }}>
                      {author.image ? (
                        <img
                          src={author.image}
                          alt={author.authorName}
                          style={{
                            width: 50,
                            height: 50,
                            borderRadius: "50%",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <Box
                          sx={{
                            width: 50,
                            height: 50,
                            borderRadius: "50%",
                            background: "#eaf3f1",
                            color: "#346f61",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: 600,
                          }}
                        >
                          {author.authorName?.[0]?.toUpperCase() || "?"}
                        </Box>
                      )}
                    </TableCell>
                    <TableCell style={{ padding: "5px 10px" }}>
                      <strong>{author.authorName}</strong>
                      <Box
                        sx={{
                          fontSize: 12,
                          color: "text.secondary",
                          mt: 0.5,
                        }}
                      >
                        {author.slug}
                      </Box>
                    </TableCell>
                    <TableCell style={{ padding: "5px 10px" }}>
                      {author.role || "-"}
                    </TableCell>
                    <TableCell style={{ padding: "5px 10px", maxWidth: 250 }}>
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {(author.expertise || []).map((tag) => (
                          <Chip
                            key={tag}
                            label={tag}
                            size="small"
                            sx={{
                              backgroundColor: "#eaf3f1",
                              color: "#346f61",
                              fontSize: 11,
                            }}
                          />
                        ))}
                      </Box>
                    </TableCell>
                    <TableCell align="center" style={{ padding: "5px 10px" }}>
                      <IconButton
                        color="primary"
                        onClick={() => handleOpenEdit(author)}
                      >
                        <Edit />
                      </IconButton>
                      {userInfo?.role === "admin" && (
                        <IconButton
                          color="error"
                          onClick={() => handleClickDelete(author)}
                        >
                          <Delete />
                        </IconButton>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={deleteOpen} onClose={handleCloseDelete}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <p>
            Are you sure you want to delete{" "}
            <strong>{authorToDelete?.authorName}</strong>?
          </p>
        </DialogContent>
        <DialogActions>
          <HButton onClick={handleCloseDelete} color="primary">
            Cancel
          </HButton>
          <HButton onClick={handleDelete} color="secondary">
            Delete
          </HButton>
        </DialogActions>
      </Dialog>

      <AuthorDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        onSave={handleSaveAuthor}
        initialData={editingAuthor}
      />
    </Layout>
  );
}
