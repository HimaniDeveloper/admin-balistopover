import { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  Chip,
  Box,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { CloudUpload, Delete } from "@mui/icons-material";
import { deleteThumbnail } from "@/utils/api";

export default function AuthorDialog({
  open,
  onClose,
  onSave,
  initialData = null,
}) {
  const initialState = {
    authorName: "",
    slug: "",
    authorDes: "",
    role: "Travel Writer",
    image: "",
    thumbnail_public_id: "",
    expertise: [],
    expertiseInput: "",
    social: { linkedin: "", twitter: "", email: "" },
  };

  const [form, setForm] = useState(initialState);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Track the original public_id that came from the DB.
  // Anything different from this is an orphan we uploaded this session.
  const originalPublicIdRef = useRef("");

  useEffect(() => {
    if (!open) return;
    if (initialData) {
      originalPublicIdRef.current = initialData.thumbnail_public_id || "";
      setForm({
        authorName: initialData.authorName || "",
        slug: initialData.slug || "",
        authorDes: initialData.authorDes || "",
        role: initialData.role || "Travel Writer",
        image: initialData.image || "",
        thumbnail_public_id: initialData.thumbnail_public_id || "",
        expertise: initialData.expertise || [],
        expertiseInput: "",
        social: {
          linkedin: initialData.social?.linkedin || "",
          twitter: initialData.social?.twitter || "",
          email: initialData.social?.email || "",
        },
      });
    } else {
      originalPublicIdRef.current = "";
      setForm(initialState);
    }
  }, [open, initialData]);

  const reset = () => setForm(initialState);

  // Helper: delete a public_id from Cloudinary (used only for orphan cleanup)
  const destroyOrphan = async (publicId) => {
    if (!publicId) return;
    try {
      await fetch("/api/upload", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ thumbnail_public_id: publicId }),
      });
    } catch (err) {
      console.warn("Orphan cleanup failed:", err);
    }
  };

  const handleChange = (field, value) => setForm({ ...form, [field]: value });
  const handleSocial = (field, value) =>
    setForm({ ...form, social: { ...form.social, [field]: value } });

  const addExpertise = () => {
    const tag = form.expertiseInput.trim();
    if (tag && !form.expertise.includes(tag)) {
      setForm({
        ...form,
        expertise: [...form.expertise, tag],
        expertiseInput: "",
      });
    }
  };
  const removeExpertise = (tag) =>
    setForm({ ...form, expertise: form.expertise.filter((t) => t !== tag) });

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return alert("Please select an image");
    if (file.size > 5 * 1024 * 1024) return alert("Image must be under 5MB");

    setUploading(true);
    try {
      // If there's already an orphan from this session, kill it before uploading another.
      const currentId = form.thumbnail_public_id;
      const isOrphan = currentId && currentId !== originalPublicIdRef.current;
      if (isOrphan) await destroyOrphan(currentId);

      // Always POST. Don't use PUT replace — that deletes the original from
      // Cloudinary before the user has saved, leaving the DB with a broken ref.
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");

      setForm({
        ...form,
        image: data.url,
        thumbnail_public_id: data.public_id,
      });
    } catch (err) {
      alert(err.message);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // Just clear local state. Save will trigger the backend to delete
  // the original from Cloudinary AND update the DB in one transaction.
  // If the current image is an orphan we uploaded this session, clean it up now.
  const handleImageRemove = async () => {
    // const currentId = form.thumbnail_public_id;
    // const isOrphan = currentId && currentId !== originalPublicIdRef.current;

    // if (isOrphan) {
    //   setUploading(true);
    //   await destroyOrphan(currentId);
    //   setUploading(false);
    // }

    await deleteThumbnail(form.thumbnail_public_id);
    setForm({ ...form, image: "", thumbnail_public_id: "" });
  };

  const handleSubmit = () => {
    if (!form.authorName.trim() || !form.authorDes.trim()) {
      alert("Author Name and Description are required!");
      return;
    }
    const { expertiseInput, ...payload } = form;
    console.log("🟢 FRONTEND payload:", payload);
    console.log("   image:", JSON.stringify(payload.image));
    console.log(
      "   thumbnail_public_id:",
      JSON.stringify(payload.thumbnail_public_id),
    );

    onSave(payload);
    reset();
    onClose();
  };

  const handleCancel = async () => {
    // Cancel = throw away everything we did this session.
    // If we uploaded a new image and didn't save it, kill the orphan.
    const currentId = form.thumbnail_public_id;
    const isOrphan = currentId && currentId !== originalPublicIdRef.current;
    if (isOrphan) await destroyOrphan(currentId);

    reset();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleCancel} maxWidth="sm" fullWidth>
      <DialogTitle>{initialData ? "Edit Author" : "Add Author"}</DialogTitle>
      <DialogContent dividers>
        <TextField
          fullWidth
          margin="normal"
          label="Author Name"
          value={form.authorName}
          onChange={(e) => handleChange("authorName", e.target.value)}
          required
        />

        <TextField
          fullWidth
          margin="normal"
          label="Slug (auto-generated if blank)"
          value={form.slug}
          onChange={(e) => handleChange("slug", e.target.value)}
          helperText="e.g. rohit-sharma"
        />

        <TextField
          fullWidth
          margin="normal"
          label="Role"
          value={form.role}
          onChange={(e) => handleChange("role", e.target.value)}
          helperText="e.g. Senior Travel Writer, Destinations Editor"
        />

        <Box sx={{ mt: 2, mb: 1 }}>
          <Box sx={{ fontSize: 14, color: "text.secondary", mb: 1 }}>
            Author Image
          </Box>
          {form.image ? (
            <Box
              sx={{
                position: "relative",
                display: "inline-block",
                borderRadius: 2,
                overflow: "hidden",
                border: "1px solid #ddd",
              }}
            >
              <img
                src={form.image}
                alt="Author preview"
                style={{
                  width: 140,
                  height: 140,
                  objectFit: "cover",
                  display: "block",
                }}
              />
              <IconButton
                onClick={handleImageRemove}
                disabled={uploading}
                sx={{
                  position: "absolute",
                  top: 4,
                  right: 4,
                  background: "rgba(255,255,255,0.9)",
                }}
                size="small"
              >
                <Delete fontSize="small" color="error" />
              </IconButton>
            </Box>
          ) : (
            <Button
              component="label"
              variant="outlined"
              startIcon={
                uploading ? <CircularProgress size={16} /> : <CloudUpload />
              }
              disabled={uploading}
            >
              {uploading ? "Uploading..." : "Upload Image"}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                hidden
                onChange={handleImageUpload}
              />
            </Button>
          )}
        </Box>

        <TextField
          fullWidth
          margin="normal"
          label="Author Description (200-250 char)"
          multiline
          rows={5}
          value={form.authorDes}
          onChange={(e) => handleChange("authorDes", e.target.value)}
          required
        />

        <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 2 }}>
          <TextField
            label="Add Expertise Tag"
            size="small"
            value={form.expertiseInput}
            onChange={(e) => handleChange("expertiseInput", e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addExpertise();
              }
            }}
            sx={{ flex: 1 }}
            placeholder="e.g. Airlines, Loyalty Programs"
          />
          <Button onClick={addExpertise} variant="outlined">
            Add
          </Button>
        </Stack>

        {form.expertise.length > 0 && (
          <Stack
            direction="row"
            spacing={1}
            flexWrap="wrap"
            sx={{ gap: 1, mt: 2 }}
          >
            {form.expertise.map((tag) => (
              <Chip
                key={tag}
                label={tag}
                onDelete={() => removeExpertise(tag)}
              />
            ))}
          </Stack>
        )}

        <TextField
          fullWidth
          margin="normal"
          label="LinkedIn URL"
          value={form.social.linkedin}
          onChange={(e) => handleSocial("linkedin", e.target.value)}
          placeholder="https://linkedin.com/in/..."
        />
        <TextField
          fullWidth
          margin="normal"
          label="Twitter URL"
          value={form.social.twitter}
          onChange={(e) => handleSocial("twitter", e.target.value)}
          placeholder="https://twitter.com/..."
        />
        <TextField
          fullWidth
          margin="normal"
          label="Email"
          type="email"
          value={form.social.email}
          onChange={(e) => handleSocial("email", e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel} color="inherit" disabled={uploading}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={uploading}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
