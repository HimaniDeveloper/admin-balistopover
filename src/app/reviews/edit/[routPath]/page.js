"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  CircularProgress,
  Grid,
  MenuItem,
  Select,
  InputLabel,
  FormControl
} from "@mui/material";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useDispatch } from "react-redux";
import { showToast } from "@/store/settingsSlice";
import { HButton, HInput, Layout } from "@/components";
import { fetchReviewData, updateReviewData } from "@/store/reviewSlice";


const ReviewForm = ({ params }) => {
  const { routPath } = params;
  const router = useRouter();
  const dispatch = useDispatch();

  const [reviewData, setReviewData] = useState({
    title: "",
    description: "",
    name: "",
    date: new Date(),
    rating: 5
  });

  const [loading, setLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsFetching(true);
      try {
        let result = await dispatch(fetchReviewData(routPath)).unwrap();
        if (result) {
          const reviewWithDate = {
            ...result,
            date: result.date ? new Date(result.date) : new Date()
          };
          setReviewData(reviewWithDate);
        }
      } catch (error) {
        dispatch(showToast({ type: "error", message: error?.message }));
      } finally {
        setIsFetching(false);
      }
    };
    if (routPath) {
      fetchData();
    }
  }, [routPath, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReviewData({ ...reviewData, [name]: value });
  };

  const handleDateChange = (date) => {
    setReviewData({ ...reviewData, date });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await dispatch(updateReviewData(reviewData)).unwrap();
      dispatch(
        showToast({
          type: "success",
          message: "Review updated successfully!",
        })
      );
      router.push("/reviews");
    } catch (error) {
      dispatch(showToast({ type: "error", message: error?.message }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title={"Edit Review"}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Box p={3} mx="auto">
          {isFetching ? (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              height="100%"
            >
              <CircularProgress />
            </Box>
          ) : (
            <Box mt={2}>
              <HInput
                label="Title"
                name="title"
                value={reviewData.title}
                onChange={handleChange}
                fullWidth
                margin="normal"
                variant="outlined"
              />

              <HInput
                label="Description"
                name="description"
                value={reviewData.description}
                onChange={handleChange}
                fullWidth
                margin="normal"
                variant="outlined"
                multiline
                rows={4}
              />

              <HInput
                label="Reviewer Name"
                name="name"
                value={reviewData.name}
                onChange={handleChange}
                fullWidth
                margin="normal"
                variant="outlined"
              />

              <Box mt={2} mb={2}>
                <DatePicker
                  label="Date"
                  value={reviewData.date}
                  onChange={handleDateChange}
                  format="MMMM d, yyyy"
                  sx={{ width: '100%' }}
                />
              </Box>

              <FormControl fullWidth margin="normal">
                <InputLabel>Rating</InputLabel>
                <Select
                  name="rating"
                  value={reviewData.rating}
                  onChange={handleChange}
                  label="Rating"
                >
                  {[1, 2, 3, 4, 5].map((value) => (
                    <MenuItem key={value} value={value}>
                      {value} {value === 1 ? 'star' : 'stars'}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Grid container mt={4} mb={2} spacing={2}>
                <Grid item>
                  <HButton
                    variant="contained"
                    color="primary"
                    onClick={handleSave}
                    disabled={loading}
                  >
                    {loading ? "Saving..." : "Save Changes"}
                  </HButton>
                </Grid>
                <Grid item>
                  <HButton
                    variant="outlined"
                    color="secondary"
                    onClick={() => router.back()}
                  >
                    Cancel
                  </HButton>
                </Grid>
              </Grid>
            </Box>
          )}
        </Box>
      </LocalizationProvider>
    </Layout>
  );
};

export default ReviewForm;