"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { HButton, Layout } from "@/components";
import {
  styled,
  Box,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableSortLabel,
  TableBody,
  IconButton,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  DialogActions,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { Edit } from "@mui/icons-material";
import { showToast } from "@/store/settingsSlice";
import AddIcon from "@mui/icons-material/Add";
import CategoryDialog from "@/components/category";

const AddButton = styled(HButton)(() => ({
  marginTop: -50,
}));

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) return -1;
  if (b[orderBy] > a[orderBy]) return 1;
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilized = array.map((el, index) => [el, index]);
  stabilized.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilized.map((el) => el[0]);
}
export default function PageList() {
  const router = useRouter();
  const dispatch = useDispatch();
  const loading = useSelector((state) => state?.blog?.loading);
  const error = useSelector((state) => state?.blog?.error);
  const userInfo = useSelector((state) => state.auth.user);
  // sorting state
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("title");
  const [category, setCategory] = useState([]);
  const [editCategory, setEditCategory] = useState({});

  console.log("category", editCategory);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogOpenEdit, setDialogOpenEdit] = useState(false);

  const handleOpenEditDialog = () => setDialogOpenEdit(true);
  const handleCloseEditDialog = () => setDialogOpenEdit(false);

  const handleOpenDialog = () => setDialogOpen(true);
  const handleCloseDialog = () => setDialogOpen(false);

  const handleSaveCategory = async (category) => {
    try {
      const res = await fetch(`/api/category`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(category),
      });

      if (!res.ok) throw new Error("Failed to fetch data");

      const data = await res.json();
      dispatch(
        showToast({ type: "success", message: "Category added successfully!" }),
      );
    } catch (error) {
      console.error(error.message);
    }
    // here you could call your API to save to MongoDB
  };

  const handleEdit = (data) => {
    fetch(`/api/category/${data._id}`)
      .then((res) => res.json())
      .then((data) => {
        setEditCategory(data.data);
        handleOpenEditDialog();
      });
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
  const handleUpdateCategory = async () => {
    console.log("editCategory", editCategory);
    try {
      const res = await fetch(`/api/category`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editCategory),
      });

      if (!res.ok) throw new Error("Failed to fetch data");

      const data = await res.json();
      if (data.success) {
        handleCloseEditDialog();
        alert("update");
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    fetchCategory();
  }, []);

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };
  const handleChange = (field, value) => {
    setEditCategory({ ...editCategory, [field]: value });
  };

  return (
    <Layout title="Blogs Category">
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          gap: "20px",
        }}
      >
        <AddButton
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={handleOpenDialog}
        >
          Add Categories
        </AddButton>
      </Box>
      {loading ? (
        "loading"
      ) : (
        <>
          <TableContainer component={Paper} sx={{ mt: 3, borderRadius: 3 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell style={{ fontWeight: "bold", fontSize: "16px" }}>
                    <TableSortLabel
                      onClick={() => handleRequestSort("routPath")}
                    >
                      Path
                    </TableSortLabel>
                  </TableCell>
                  <TableCell style={{ fontWeight: "bold", fontSize: "16px" }}>
                    <TableSortLabel onClick={() => handleRequestSort("title")}>
                      Title
                    </TableSortLabel>
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
                {category.map((category) => (
                  <TableRow key={category.routPath}>
                    <TableCell
                      style={{ padding: "5px 10px", maxWidth: "250px" }}
                    >
                      {category.slug}
                    </TableCell>
                    <TableCell
                      style={{ padding: "5px 10px", maxWidth: "300px" }}
                    >
                      {category.name}
                    </TableCell>

                    <TableCell align="center" style={{ padding: "5px 10px" }}>
                      <IconButton
                        color="primary"
                        onClick={() => handleEdit(category)}
                      >
                        <Edit />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
      <CategoryDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        onSave={handleSaveCategory}
      />
      <Dialog
        open={dialogOpenEdit}
        onClose={handleCloseEditDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Category</DialogTitle>
        <DialogContent dividers>
          {console.log("editCategory+++", editCategory.name)}
          <TextField
            fullWidth
            margin="normal"
            label="Name"
            name="name"
            value={editCategory?.name || ""}
            onChange={(e) => handleChange("name", e.target.value)}
            required
          />

          <TextField
            fullWidth
            margin="normal"
            label="Slug"
            value={editCategory?.slug || ""}
            onChange={(e) => handleChange("slug", e.target.value.toLowerCase())}
            required
          />

          <TextField
            fullWidth
            margin="normal"
            label="Description"
            multiline
            rows={3}
            value={editCategory?.description || ""}
            onChange={(e) => handleChange("description", e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleUpdateCategory}
            variant="contained"
            color="primary"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
}
