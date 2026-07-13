import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
} from "@mui/material";

export default function CategoryDialog({ open, onClose, onSave }) {
  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
  });

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const handleSubmit = () => {
    if (!form.name.trim() || !form.slug.trim()) {
      alert("Name and Slug are required!");
      return;
    }
    onSave(form);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Category</DialogTitle>
      <DialogContent dividers>
        <TextField
          fullWidth
          margin="normal"
          label="Name"
          value={form.name}
          onChange={(e) => handleChange("name", e.target.value)}
          required
        />
        <TextField
          fullWidth
          margin="normal"
          label="Slug"
          value={form.slug}
          onChange={(e) => handleChange("slug", e.target.value.toLowerCase())}
          required
        />
        <TextField
          fullWidth
          margin="normal"
          label="Description"
          multiline
          rows={3}
          value={form.description}
          onChange={(e) => handleChange("description", e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
