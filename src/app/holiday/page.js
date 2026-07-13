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
  Card,
  Box,
  CardContent,
  Typography,
  IconButton,
  CardMedia,
  Chip,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { Delete, Edit } from "@mui/icons-material";
import { holidayList, deleteHolidayData } from "@/store/holidaySlice";
import { showToast } from "@/store/settingsSlice";

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

export default function PageList() {
  const router = useRouter();
  const dispatch = useDispatch();
  const holidays = useSelector((state) => state?.holiday?.allHolidays) || [];
  const loading = useSelector((state) => state?.holiday?.loading);
  const error = useSelector((state) => state?.holiday?.error);
  const userInfo = useSelector((state) => state.auth.user);

  const [open, setOpen] = useState(false);
  const [holidayIdToDelete, setHolidayIdToDelete] = useState(null);

  useEffect(() => {
    dispatch(holidayList());
  }, [dispatch]);

  const handleEdit = (id) => {
    router.push("/holiday/edit/" + id);
  };

  const handleClickOpen = (id) => {
    setHolidayIdToDelete(id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setHolidayIdToDelete(null);
  };

  const handleDelete = async () => {
    if (holidayIdToDelete) {
      try {
        await dispatch(deleteHolidayData(holidayIdToDelete)).unwrap();
        dispatch(
          showToast({
            type: "success",
            message: "Holiday deleted successfully!",
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
    <Layout title={`Holidays`}>
      <AddButton onClick={() => router.push("/holiday/add")}>
        Add Holiday
      </AddButton>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      <CardContainer>
        {holidays.map((des, i) => (
          <Card
            sx={{
              display: "flex",
              position: "relative",
              width: 300,
              height: 200,
            }}
            key={i}
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
                <Typography component="div" variant="p">
                  {des?.tagline}
                </Typography>
                <Typography component="div" variant="p">
                  Price: {des?.price}
                </Typography>
                <Typography
                  variant="span"
                  component="span"
                  sx={{ color: "text.secondary" }}
                >
                  Off {des?.offer} %
                </Typography>
              </CardContent>
            </Box>

            {/* Add edit and delete icons at the bottom-right corner */}
            <CardActionsContainer>
              <IconButton color="primary" onClick={() => handleEdit(des._id)}>
                <Edit />
              </IconButton>
              {userInfo?.role === "admin" && (
                <IconButton
                  color="secondary"
                  onClick={() => handleClickOpen(des._id)}
                >
                  <Delete />
                </IconButton>
              )}
            </CardActionsContainer>
          </Card>
        ))}
      </CardContainer>

      {/* Delete Confirmation Dialog */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <p>Are you sure you want to delete this holiday package?</p>
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
