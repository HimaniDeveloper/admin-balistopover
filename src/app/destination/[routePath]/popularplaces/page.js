"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  HButton,
  Layout,
} from "@/components";
import {
  styled,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Card,
  Box,
  CardContent,
  Typography,
  IconButton,
  CardMedia,
  Chip,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { Delete, Edit, Flight } from "@mui/icons-material";
import { showToast } from "@/store/settingsSlice";
import { deletePlaceData, fetchPlaceByRoutPath } from "@/store/popularplaceSlice";

const AddButton = styled(HButton)(() => ({
  float: "right",
  marginTop: -50,
}));

const CardContainer = styled("div")(() => ({
  display: "flex",
  flexWrap: "wrap",
  gap: "16px",
  justifyContent: "flex-start",
}));

const CardActionsContainer = styled("div")(() => ({
  display: "flex",
  justifyContent: "flex-end",
  marginTop: "auto",
  padding: "8px",
  position: "absolute",
  bottom: 0,
  right: 0,
}));

export default function PageList({params}) {
    const { routePath } = params;
  const router = useRouter();
  const dispatch = useDispatch();
  const destinations = useSelector(
    (state) => state?.popularPlaces?.allPlaces
  ) || [];

  const loading = useSelector((state) => state?.popularPlaces?.loading);
  const error = useSelector((state) => state?.popularPlaces?.error);

  const [open, setOpen] = useState(false);
  const [destinationIdToDelete, setDestinationIdToDelete] = useState(null);

  // Fetch destinations based on the routPath
  useEffect(() => {
    if (routePath) {
      dispatch(fetchPlaceByRoutPath(routePath));
    }
  }, [dispatch, routePath]);

  const handleEdit = (id) => {
    router.push(`popularplaces/edit/${id}`);
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
        await dispatch(deletePlaceData(destinationIdToDelete)).unwrap();
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

  return (
    <Layout title={`Popular Places`}>
      <AddButton onClick={() => router.push('popularplaces/add')}>
        Add Place
      </AddButton>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      <CardContainer>
        {destinations.map((des) => (
          <Card
            key={des._id}
            sx={{ display: "flex", position: "relative", width: 300, height: 200 }}
          >
            <CardMedia
              component="img"
              sx={{ width: 151 }}
              image={des?.thumbnail}
              alt={des?.title}
            />
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <CardContent sx={{ flex: "1 0 auto" }}>
                <Typography component="div" variant="h6">
                  {des?.title}
                </Typography>
                <Box sx={{ display: "flex", marginTop: 2, marginBottom: 2}}>
                  <Typography>Price: {des?.price}</Typography>
                </Box>
                <Box sx={{ display: "flex", marginTop: 2, marginBottom: 2}}>
                  <Typography>Offer: {des?.offer} %</Typography>
                </Box>
              </CardContent>
            </Box>

            {/* Add edit and delete icons at the bottom-right corner */}
            <CardActionsContainer>
              <IconButton color="primary" onClick={() => handleEdit(des._id)}>
                <Edit />
              </IconButton>
              <IconButton
                color="secondary"
                onClick={() => handleClickOpen(des._id)}
              >
                <Delete />
              </IconButton>
            </CardActionsContainer>
          </Card>
        ))}
      </CardContainer>

      {/* Delete Confirmation Dialog */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <p>Are you sure you want to delete this popularplaces?</p>
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
