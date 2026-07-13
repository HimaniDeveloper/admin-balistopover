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
  Chip,
  Stack,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { Delete, Edit, Star } from "@mui/icons-material";
import { reviewList, deleteReviewData } from "@/store/reviewSlice";
import { showToast } from "@/store/settingsSlice";
import { format } from "date-fns";

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

const ReviewCard = styled("div")(({ theme }) => ({
  width: "320px",
  borderRadius: "8px",
  boxShadow: theme.shadows[2],
  background: "#fff",
  padding: "20px",
  display: "flex",
  flexDirection: "column",
  transition: "transform 0.3s",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: theme.shadows[4],
  },
}));

const ReviewHeader = styled("div")(() => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "16px",
}));

const ReviewFooter = styled("div")(() => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginTop: "16px",
  paddingTop: "16px",
  borderTop: "1px solid rgba(0, 0, 0, 0.12)",
}));

const StarsRating = ({ rating }) => {
  return (
    <Box display="flex" alignItems="center">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          color={i < rating ? "primary" : "disabled"}
          fontSize="small"
        />
      ))}
      <Typography variant="caption" ml={1}>
        ({rating}.0)
      </Typography>
    </Box>
  );
};

export default function ReviewList() {
  const router = useRouter();
  const dispatch = useDispatch();
  const reviews = useSelector((state) => state?.review?.reviews) || [];
  const pagination = useSelector((state) => state?.review?.pagination) || {};
  const loading = useSelector((state) => state?.review?.loading);
  const error = useSelector((state) => state?.review?.error);
  const userInfo = useSelector((state) => state.auth.user);

  const [open, setOpen] = useState(false);
  const [reviewIdToDelete, setReviewIdToDelete] = useState(null);

  const { page: currentPage = 1, limit = 10, totalPages = 1 } = pagination;

  useEffect(() => {
    dispatch(reviewList({ page: currentPage, limit }));
  }, [dispatch, currentPage, limit]);

  const handleEdit = (routPath) => {
    router.push("/reviews/edit/" + routPath);
  };

  const handleClickOpen = (routPath) => {
    setReviewIdToDelete(routPath);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setReviewIdToDelete(null);
  };

  const handleDelete = async () => {
    if (reviewIdToDelete) {
      try {
        await dispatch(deleteReviewData(reviewIdToDelete)).unwrap();
        dispatch(
          showToast({
            type: "success",
            message: "Review deleted successfully!",
          })
        );
        handleClose();
        dispatch(reviewList({ page: currentPage, limit }));
      } catch (err) {
        dispatch(showToast({ type: "error", message: err?.message }));
        handleClose();
      }
    }
  };

  const handlePageChange = (_, page) => {
    dispatch(reviewList({ page, limit }));
  };

  return (
    <Layout title="Customer Reviews">
      <AddButton onClick={() => router.push("/reviews/add")}>
        Add New Review
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
            {reviews.map((review) => (
              <ReviewCard key={review._id}>
                <ReviewHeader>
                  <Typography variant="h6" fontWeight="bold">
                    {review.title}
                  </Typography>
                  <StarsRating rating={review.rating} />
                </ReviewHeader>

                <Typography variant="body2" color="text.secondary" mb={2}>
                  {format(new Date(review.date), "MMMM d, yyyy")}
                </Typography>

                <Typography variant="body1" sx={{ mb: 3, minHeight: "80px" }}>
                  {review.description}
                </Typography>

                {review.img && (
                  <Box mb={3} display="flex" justifyContent="center">
                    <Avatar
                      variant="square"
                      src={review.img}
                      sx={{
                        width: 120,
                        height: 120,
                        border: "2px solid #fff",
                        boxShadow: 3,
                      }}
                    />
                  </Box>
                )}

                <ReviewFooter>
                  <Typography variant="subtitle2" color="text.secondary">
                    {review.name}
                  </Typography>
                  <Stack direction="row" spacing={1}>
                    <IconButton
                      color="primary"
                      onClick={() => handleEdit(review._id)}
                      size="small"
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                    {userInfo?.role === "admin" && (
                      <IconButton
                        color="error"
                        onClick={() => handleClickOpen(review._id)}
                        size="small"
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    )}
                  </Stack>
                </ReviewFooter>
              </ReviewCard>
            ))}
          </CardContainer>

          <Box display="flex" justifyContent="center" mt={4}>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
            />
          </Box>
        </>
      )}

      {/* Delete confirmation dialog */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this review?</Typography>
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
