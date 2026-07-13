"use client";

import React, { useState, useEffect } from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
  Chip,
  IconButton,
  Switch,
  TableContainer,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Box,
  TextField,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { deleteFlightPage, flightPages } from "@/store/flightpageSlice";
import { HButton, Layout } from "@/components";
import styled from "@emotion/styled";

const AddButton = styled(HButton)(() => ({
  float: "right",
  marginTop: -50,
}));
export default function AirlineTable() {
  // console.log("object");
  const router = useRouter();
  const dispatch = useDispatch();
  const allPages = useSelector((state) => state?.flight?.allPages) || {};
  const loading = useSelector((state) => state?.flight?.loading);
  const { data = [], pagination = {} } = allPages;
  const userInfo = useSelector((state) => state.auth.user);

  const [open, setOpen] = useState(false);
  const [routToDelete, setRoutToDelete] = useState(null);

  // pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [search, setSearch] = useState("");

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(0);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(flightPages({ page: page + 1, limit: rowsPerPage, search }));
    }, 400);
    return () => clearTimeout(timer);
  }, [dispatch, page, rowsPerPage, search]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value));
    setPage(0);
  };

  const handleEdit = (routPath) => {
    router.push("/airline/edit/" + routPath);
  };

  const handleClickOpen = (routPath) => {
    setRoutToDelete(routPath);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setRoutToDelete(null);
  };

  const handleDelete = async () => {
    if (routToDelete) {
      try {
        await dispatch(deleteFlightPage(routToDelete)).unwrap();
        await dispatch(
          flightPages({ page: page + 1, limit: rowsPerPage, search })
        );
        handleClose();
      } catch (err) {
        handleClose();
      }
    }
  };

  const handleToggleActive = async (routPath, currentIsActive) => {
    try {
      const res = await fetch(
        `/api/flightpage/${routPath}?isActive=${!currentIsActive}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (!res.ok) throw new Error("Failed to fetch data");

      await res.json();
      await dispatch(
        flightPages({ page: page + 1, limit: rowsPerPage, search })
      );
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <Layout title="Airline Pages">
      {/* Add Airline Button */}
      <AddButton
        onClick={() => router.push("/airline/add")}
        variant="outlined"
        startIcon={<AddIcon />}
      >
        Add Airline
      </AddButton>
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
        "Loading"
      ) : (
        <>
          {/* Table */}
          <TableContainer component={Paper} sx={{ mt: 3, borderRadius: 3 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell style={{ fontWeight: "bold", fontSize: "16px" }}>
                    Path
                  </TableCell>
                  <TableCell style={{ fontWeight: "bold", fontSize: "16px" }}>
                    Title
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
                {data.map((page) => (
                  <TableRow key={page.routPath}>
                    <TableCell style={{ padding: "5px 10px" }}>
                      {page.routPath}
                    </TableCell>
                    <TableCell style={{ padding: "5px 10px" }}>
                      {page.title}
                    </TableCell>
                    <TableCell style={{ padding: "5px 10px" }}>
                      <Chip
                        label={page.isActive ? "Active" : "Inactive"}
                        sx={{
                          backgroundColor: page.isActive
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
                        onClick={() => handleEdit(page._id)}
                      >
                        <Edit />
                      </IconButton>
                      {userInfo?.role === "admin" && (
                        <IconButton
                          color="error"
                          onClick={() => handleClickOpen(page.routPath)}
                        >
                          <Delete />
                        </IconButton>
                      )}
                      <Switch
                        checked={page.isActive}
                        onChange={() =>
                          handleToggleActive(page.routPath, page.isActive)
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
            count={pagination.total || data.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[25, 50, 75, 100]}
          />
        </>
      )}

      {/* Confirm Delete Dialog */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <p>Are you sure you want to delete this airline page?</p>
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
