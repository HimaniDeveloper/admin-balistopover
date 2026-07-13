"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { HButton, Layout } from "@/components";
import {
  styled,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
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
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { Delete, Edit } from "@mui/icons-material";

import { showToast } from "@/store/settingsSlice";
import AddIcon from "@mui/icons-material/Add";
import { dealsList, deleteDealData } from "@/store/dealsSlice";

const AddButton = styled(HButton)(() => ({
  marginTop: -50,
}));

export default function PageList() {
  const router = useRouter();
  const dispatch = useDispatch();
  const Deals = useSelector((state) => state?.deals?.allDeals) || [];
  const pagination = useSelector((state) => state?.deals?.pagination) || {};
  const loading = useSelector((state) => state?.deals?.loading);
  const error = useSelector((state) => state?.deals?.error);
  const userInfo = useSelector((state) => state.auth.user);
  // sorting state
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("title");
  
  const [open, setOpen] = useState(false);
  const [blogIdToDelete, setBlogIdToDelete] = useState(null);
  // pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);

  console.log("Deals", Deals);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value));
    setPage(0);
  };

  useEffect(() => {
    dispatch(dealsList({ page: page + 1, limit: rowsPerPage }));
  }, [dispatch, page, rowsPerPage]);

  const handleEdit = (routPath) => {
    router.push("/deals/edit/" + routPath);
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
        await dispatch(deleteDealData(blogIdToDelete)).unwrap();
        dispatch(
          showToast({ type: "success", message: "Blog deleted successfully!" })
        );
        handleClose();
        dispatch(dealsList({ page: page + 1, limit: rowsPerPage }));
      } catch (err) {
        dispatch(showToast({ type: "error", message: err?.message }));
        handleClose();
      }
    }
  };

  const handleToggleActive = async (routPath, currentIsActive) => {
    try {
      const res = await fetch(
        `/api/deals/${routPath}?isActive=${!currentIsActive}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) throw new Error("Failed to fetch data");
      dispatch(dealsList({ page: page + 1, limit: rowsPerPage }));
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
    <Layout title="Deals Page">
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          gap: "20px",
        }}
      >
        <AddButton
          onClick={() => router.push("/deals/add")}
          variant="outlined"
          startIcon={<AddIcon />}
        >
          Add Deals
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
                {Deals.map((deals) => (
                  <TableRow key={deals.routPath}>
                    <TableCell style={{ padding: "5px 10px" }}>
                      <img
                        src={deals.thumbnail || "/img/default-deals.jpg"}
                        height={50}
                        width={100}
                      />
                    </TableCell>
                    <TableCell
                      style={{ padding: "5px 10px", maxWidth: "250px" }}
                    >
                      {deals.routPath}
                    </TableCell>
                    <TableCell
                      style={{ padding: "5px 10px", maxWidth: "300px" }}
                    >
                      {deals.title}
                    </TableCell>
                    <TableCell style={{ padding: "5px 10px" }}>
                      <Chip
                        label={deals.isActive ? "Active" : "Inactive"}
                        sx={{
                          backgroundColor: deals.isActive
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
                        onClick={() => handleEdit(deals.routPath)}
                      >
                        <Edit />
                      </IconButton>
                      {userInfo?.role === "admin" && (
                        <IconButton
                          color="error"
                          onClick={() => handleClickOpen(deals.routPath)}
                        >
                          <Delete />
                        </IconButton>
                      )}
                      <Switch
                        checked={deals.isActive}
                        onChange={() =>
                          handleToggleActive(deals.routPath, deals.isActive)
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
          <p>Are you sure you want to delete this deals?</p>
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
    </Layout>
  );
}
