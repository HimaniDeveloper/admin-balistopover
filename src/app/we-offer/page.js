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
  Pagination,
  CircularProgress,
  Box,
  Avatar,
  Typography,
  IconButton,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { Delete, Edit } from "@mui/icons-material";
import { feedbackList, deleteFeedbackData } from "@/store/feedbackSlice";
import { showToast } from "@/store/settingsSlice";

const AddButton = styled(HButton)(() => ({
  float: "right",
  marginTop: -50,
}));

const CardContainer = styled("div")(() => ({
  display: "flex",
  flexWrap: "wrap",
  gap: "24px",
  justifyContent: "center",
  padding: "20px 0",
}));

const FeedbackCard = styled("div")(({ theme }) => ({
  width: "280px",
  borderRadius: "8px",
  boxShadow: theme.shadows[2],
  background: "#fff",
  padding: "20px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  transition: "transform 0.3s",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: theme.shadows[4],
  },
}));

const UserInfo = styled("div")(() => ({
  display: "flex",
  justifyContent: "space-between",
  width: "100%",
  alignItems: "center",
  marginTop: "16px",
  paddingTop: "16px",
}));

export default function PageList() {
  const router = useRouter();
  const dispatch = useDispatch();
  const feedbacks = useSelector((state) => state?.feedback?.feedbacks) || [];
  const pagination = useSelector((state) => state?.feedback?.pagination) || {};
  const loading = useSelector((state) => state?.feedback?.loading);
  const error = useSelector((state) => state?.feedback?.error);
  const userInfo = useSelector((state) => state.auth.user);

  const [open, setOpen] = useState(false);
  const [feedbackIdToDelete, setFeedbackIdToDelete] = useState(null);

  const { page: currentPage = 1, limit = 10, totalPages = 1 } = pagination;

  useEffect(() => {
    dispatch(feedbackList({ page: currentPage, limit }));
  }, [dispatch, currentPage, limit]);

  const handleEdit = (routPath) => {
    router.push("/we-offer/edit/" + routPath);
  };

  const handleClickOpen = (routPath) => {
    setFeedbackIdToDelete(routPath);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFeedbackIdToDelete(null);
  };

  const handleDelete = async () => {
    if (feedbackIdToDelete) {
      try {
        await dispatch(deleteFeedbackData(feedbackIdToDelete)).unwrap();
        dispatch(
          showToast({
            type: "success",
            message: "Feedback deleted successfully!",
          })
        );
        handleClose();
        dispatch(feedbackList({ page: currentPage, limit }));
      } catch (err) {
        dispatch(showToast({ type: "error", message: err?.message }));
        handleClose();
      }
    }
  };

  const handlePageChange = (_, page) => {
    dispatch(feedbackList({ page, limit }));
  };

  return (
    <Layout title="We Offer">
      <AddButton onClick={() => router.push("/we-offer/add")}>
        Add We Offer
      </AddButton>

      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "50vh",
          }}
        >
          <CircularProgress />
        </Box>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <>
          <CardContainer>
            {feedbacks.map((feedback) => (
              <FeedbackCard key={feedback._id}>
                <Avatar
                  variant="square"
                  src={feedback.img || "/default-avatar.png"}
                  sx={{
                    width: 100,
                    height: 100,
                    mb: 3,
                    border: "3px solid #fff",
                    boxShadow: 3,
                  }}
                />
                <Typography variant="h5" textAlign="center">
                  {feedback.name}
                </Typography>
                <Typography variant="body1" sx={{ mb: 2, minHeight: "60px" }}>
                  {feedback.description}
                </Typography>
                <div>
                  <IconButton
                    color="primary"
                    onClick={() => handleEdit(feedback._id)}
                    size="small"
                  >
                    <Edit fontSize="small" />
                  </IconButton>
                  {userInfo?.role === "admin" && (
                    <IconButton
                      color="error"
                      onClick={() => handleClickOpen(feedback._id)}
                      size="small"
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  )}
                </div>
              </FeedbackCard>
            ))}
          </CardContainer>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "20px",
            }}
          >
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
            />
          </div>
        </>
      )}

      {/* Dialog for delete confirmation */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <p>Are you sure you want to delete this feedback?</p>
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
