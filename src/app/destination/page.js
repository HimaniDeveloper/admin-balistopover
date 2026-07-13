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
  IconButton,
  Chip,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  Switch,
  Paper,
  TableBody,
  TablePagination,
  Box,
  TextField,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { Delete, Edit } from "@mui/icons-material";
import {
  destinationList,
  deleteDestinationData,
} from "@/store/destinationSlice";
import { showToast } from "@/store/settingsSlice";
import AddIcon from "@mui/icons-material/Add";

const AddButton = styled(HButton)(() => ({
  float: "right",
  marginTop: -50,
}));

export default function PageList() {
  const router = useRouter();
  const dispatch = useDispatch();
  const destinations =
    useSelector((state) => state?.destination?.allDestinations) || [];
  const pagination =
    useSelector((state) => state?.destination?.pagination) || {};
  const loading = useSelector((state) => state?.destination?.loading);
  const error = useSelector((state) => state?.destination?.error);
  const userInfo = useSelector((state) => state.auth.user);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [search, setSearch] = useState("");

  const [open, setOpen] = useState(false);
  const [destinationIdToDelete, setDestinationIdToDelete] = useState(null);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value));
    setPage(0);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(destinationList({ page: page + 1, limit: rowsPerPage, search }));
    }, 400);
    return () => clearTimeout(timer);
  }, [dispatch, page, rowsPerPage, search]);

  const handleEdit = (id) => {
    router.push("/destination/edit/" + id);
  };

  const handlePopularPlaces = (rout) => {
    router.push(`/destination/${rout}/popularplaces`);
  };

  const handleClickOpen = (id) => {
    setDestinationIdToDelete(id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setDestinationIdToDelete(null);
  };

  const handleDelete = async () => {
    if (destinationIdToDelete) {
      try {
        await dispatch(deleteDestinationData(destinationIdToDelete)).unwrap();
        dispatch(
          showToast({
            type: "success",
            message: "Destination deleted successfully!",
          })
        );
        handleClose();
      } catch (err) {
        dispatch(showToast({ type: "error", message: err?.message }));
        handleClose();
      }
    }
  };

  const handleToggleActive = async (routPath, currentIsActive) => {
    try {
      const res = await fetch(
        `/api/destination/${routPath}?isActive=${!currentIsActive}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) throw new Error("Failed to fetch data");

      await res.json();
      await dispatch(
        destinationList({ page: page + 1, limit: rowsPerPage, search })
      );
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <Layout title={`Destinations`}>
      <AddButton
        onClick={() => router.push("/destination/add")}
        variant="outlined"
        startIcon={<AddIcon />}
      >
        Add Destination
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
        <p>Loading...</p>
      ) : (
        <>
          <TableContainer component={Paper} sx={{ mt: 3, borderRadius: 3 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell style={{ fontWeight: "bold", fontSize: "16px" }}>
                    Thumbnail
                  </TableCell>
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
                {destinations.map((des) => (
                  <TableRow key={des.routPath}>
                    <TableCell style={{ padding: "5px 10px" }}>
                      <img
                        src={des.thumbnail || "/img/default-des.jpg"}
                        height={50}
                        width={100}
                      />
                    </TableCell>
                    <TableCell
                      style={{ padding: "5px 10px", maxWidth: "250px" }}
                    >
                      {des.routPath}
                    </TableCell>
                    <TableCell
                      style={{ padding: "5px 10px", maxWidth: "300px" }}
                    >
                      {des.title}
                    </TableCell>
                    <TableCell style={{ padding: "5px 10px" }}>
                      <Chip
                        label={des.isActive ? "Active" : "Inactive"}
                        sx={{
                          backgroundColor: des.isActive ? "#b9fbc0" : "#ffb3b3", // light green / light red
                          color: "#000", // dark text for contrast
                          fontWeight: "bold",
                        }}
                        size="small"
                      />
                    </TableCell>

                    <TableCell align="center" style={{ padding: "5px 10px" }}>
                      <IconButton
                        color="primary"
                        onClick={() => handleEdit(des.routPath)}
                      >
                        <Edit />
                      </IconButton>
                      {userInfo?.role === "admin" && (
                        <IconButton
                          color="error"
                          onClick={() => handleClickOpen(des._id)}
                        >
                          <Delete />
                        </IconButton>
                      )}
                      <Switch
                        checked={des.isActive}
                        onChange={() =>
                          handleToggleActive(des.routPath, des.isActive)
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
      {error && <p>Error: {error}</p>}

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <p>Are you sure you want to delete this destination?</p>
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
