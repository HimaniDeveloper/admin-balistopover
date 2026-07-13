"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { HButton, Layout } from "@/components";
import {
  styled,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Pagination,
  CircularProgress,
  Box,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableSortLabel,
  TableBody,
  IconButton,
  Switch,
  Paper,
  Chip,
  TablePagination,
  TextField,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { HCard } from "@/components/HCard";
import { Delete, Edit } from "@mui/icons-material";
import { blogList, deleteBlogData } from "@/store/blogSlice";
import { showToast } from "@/store/settingsSlice";
import AddIcon from "@mui/icons-material/Add";
import CategoryDialog from "@/components/category";
import AuthorDialog from "@/components/author";
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   TextField,
//   Button,
//   Stack,
//   Chip,
//   Box,
//   IconButton,
//   CircularProgress,
// } from "@mui/material";

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
  const blogs = useSelector((state) => state?.blog?.blogs) || [];
  const pagination = useSelector((state) => state?.blog?.pagination) || {};
  const loading = useSelector((state) => state?.blog?.loading);
  const error = useSelector((state) => state?.blog?.error);
  const userInfo = useSelector((state) => state.auth.user);
  // sorting state
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("title");

  const [open, setOpen] = useState(false);
  const [blogIdToDelete, setBlogIdToDelete] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  // pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [openAuthor, setOpenAuthor] = useState(false);
  const [search, setSearch] = useState("");

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(0);
  };

  const handleOpenDialog = () => setDialogOpen(true);
  const handleCloseDialog = () => setDialogOpen(false);

  const onCloseOpenAuthor = () => setOpenAuthor(false);
  const handleOpenAuthor = () => setOpenAuthor(true);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value));
    setPage(0);
  };

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
  // const handleSaveAuthor = async (author) => {
  //   try {
  //     const res = await fetch(`/api/author`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(author),
  //     });

  //     if (!res.ok) throw new Error("Failed to fetch data");

  //     const data = await res.json();
  //     dispatch(
  //       showToast({ type: "success", message: "Author added successfully!" })
  //     );
  //   } catch (error) {
  //     console.error(error.message);
  //   }
  //   // here you could call your API to save to MongoDB
  // };

  const handleSaveAuthor = async (author) => {
    try {
      // Sanitize payload — strip empty strings on optional fields
      const payload = {
        authorName: author.authorName?.trim(),
        authorDes: author.authorDes?.trim(),
        ...(author.slug?.trim() && { slug: author.slug.trim() }),
        ...(author.role?.trim() && { role: author.role.trim() }),
        ...(author.image?.trim() && { image: author.image.trim() }),
        ...(author.expertise?.length > 0 && { expertise: author.expertise }),
        ...(author.social && {
          social: {
            linkedin: author.social.linkedin?.trim() || "",
            twitter: author.social.twitter?.trim() || "",
            email: author.social.email?.trim() || "",
          },
        }),
      };

      const res = await fetch(`/api/author`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to save author");
      }

      dispatch(
        showToast({
          type: "success",
          message: "Author added successfully!",
        }),
      );
    } catch (err) {
      dispatch(showToast({ type: "error", message: err.message }));
      console.error(err.message);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(blogList({ page: page + 1, limit: rowsPerPage, search }));
    }, 400);
    return () => clearTimeout(timer);
  }, [dispatch, page, rowsPerPage, search]);

  const handleEdit = (routPath) => {
    router.push("/blogs/edit/" + routPath);
  };

  const handleClickOpen = (routPath) => {
    setBlogIdToDelete(routPath);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setBlogIdToDelete(null);
  };

  const handleDelete = async () => {
    if (blogIdToDelete) {
      try {
        await dispatch(deleteBlogData(blogIdToDelete)).unwrap();
        dispatch(
          showToast({ type: "success", message: "Blog deleted successfully!" }),
        );
        handleClose();
        dispatch(blogList({ page: page + 1, limit: rowsPerPage, search }));
      } catch (err) {
        dispatch(showToast({ type: "error", message: err?.message }));
        handleClose();
      }
    }
  };

  const handleToggleActive = async (routPath, currentIsActive) => {
    try {
      const res = await fetch(
        `/api/blog/${routPath}?isActive=${!currentIsActive}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (!res.ok) throw new Error("Failed to fetch data");
      dispatch(blogList({ page: page + 1, limit: rowsPerPage, search }));
      await res.json();
    } catch (error) {
      console.error(error.message);
    }
  };
  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  return (
    <Layout title="Blogs Page">
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
          onClick={handleOpenAuthor}
        >
          Add Author
        </AddButton>
        {/* <AddButton
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={handleOpenDialog}
        >
          Add Categories
        </AddButton> */}
        <AddButton
          onClick={() => router.push("/blogs/add")}
          variant="outlined"
          startIcon={<AddIcon />}
        >
          Add Blog
        </AddButton>
      </Box>
      <Box sx={{ mt: 2, width: { xs: "100%", sm: "50%" } }}>
        <TextField
          label="Search by route path"
          variant="outlined"
          size="small"
          fullWidth
          value={search}
          onChange={handleSearchChange}
        />
      </Box>
      {loading ? (
        "loading"
      ) : (
        <>
          <TableContainer component={Paper} sx={{ mt: 3, borderRadius: 3 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell
                    sortDirection={orderBy === "routPath" ? order : false}
                    style={{ fontWeight: "bold", fontSize: "16px" }}
                  >
                    Thumbnail
                  </TableCell>
                  <TableCell
                    sortDirection={orderBy === "routPath" ? order : false}
                    style={{ fontWeight: "bold", fontSize: "16px" }}
                  >
                    <TableSortLabel
                      active={orderBy === "routPath"}
                      direction={orderBy === "routPath" ? order : "asc"}
                      onClick={() => handleRequestSort("routPath")}
                    >
                      Path
                    </TableSortLabel>
                  </TableCell>
                  <TableCell
                    sortDirection={orderBy === "title" ? order : false}
                    style={{ fontWeight: "bold", fontSize: "16px" }}
                  >
                    <TableSortLabel
                      active={orderBy === "title"}
                      direction={orderBy === "title" ? order : "asc"}
                      onClick={() => handleRequestSort("title")}
                    >
                      Title
                    </TableSortLabel>
                  </TableCell>
                  <TableCell style={{ fontWeight: "bold", fontSize: "16px" }}>
                    Status
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
                {blogs.map((blog) => (
                  <TableRow key={blog.routPath}>
                    <TableCell style={{ padding: "5px 10px" }}>
                      <img
                        src={blog.thumbnail || "/img/default-blog.jpg"}
                        height={50}
                        width={100}
                      />
                    </TableCell>
                    <TableCell
                      style={{ padding: "5px 10px", maxWidth: "250px" }}
                    >
                      {blog.routPath}
                    </TableCell>
                    <TableCell
                      style={{ padding: "5px 10px", maxWidth: "300px" }}
                    >
                      {blog.title}
                    </TableCell>
                    <TableCell style={{ padding: "5px 10px" }}>
                      <Chip
                        label={blog.isActive ? "Active" : "Inactive"}
                        sx={{
                          backgroundColor: blog.isActive
                            ? "#b9fbc0"
                            : "#ffb3b3", // light green / light red
                          color: "#000", // dark text for contrast
                          fontWeight: "bold",
                        }}
                        size="small"
                      />
                    </TableCell>

                    <TableCell align="center" style={{ padding: "5px 10px" }}>
                      <IconButton
                        color="primary"
                        onClick={() => handleEdit(blog.routPath)}
                      >
                        <Edit />
                      </IconButton>
                      {userInfo?.role === "admin" && (
                        <IconButton
                          color="error"
                          onClick={() => handleClickOpen(blog.routPath)}
                        >
                          <Delete />
                        </IconButton>
                      )}
                      <Switch
                        checked={blog.isActive}
                        onChange={() =>
                          handleToggleActive(blog.routPath, blog.isActive)
                        }
                        color="success"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          <TablePagination
            component="div"
            count={pagination.total}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[25, 50, 75, 100]}
          />
        </>
      )}

      {/* Dialog for delete confirmation */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <p>Are you sure you want to delete this blog?</p>
        </DialogContent>
        <DialogActions>
          <HButton onClick={handleClose} color="primary">
            Cancel
          </HButton>
          <HButton onClick={handleDelete} color="secondary">
            Delete
          </HButton>
        </DialogActions>
      </Dialog>
      <CategoryDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        onSave={handleSaveCategory}
      />
      <AuthorDialog
        open={openAuthor}
        onClose={onCloseOpenAuthor}
        onSave={handleSaveAuthor}
      />
    </Layout>
  );
}
