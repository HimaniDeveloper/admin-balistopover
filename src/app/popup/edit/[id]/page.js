"use client";
import { Layout, HInput } from "@/components";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { fetchAirlineData } from "@/store/flightpageSlice";

const Page = () => {
  const router = useRouter();
  const { id } = useParams();
  const dispatch = useDispatch();

  const airlines = useSelector((state) => state?.flight?.airlines) || [];
  const [formData, setFormData] = useState({
    url: "",
    airline: "",
    title: "",
    description: "",
    highLight: "",
    pointer: "",
    tfns: "",
    isActive: false,
  });

  // Edit mode: load existing data
  useEffect(() => {
    if (id) {
      const fetchPopup = async () => {
        try {
          const res = await fetch(`/api/popup/edit?id=${id}`);
          if (res.ok) {
            const data = await res.json();
            console.log("data: ", data);
            setFormData({
              url: data.url || "",
              airline: data.airline || "",
              title: data.title || "",
              description: data.description || "",
              highLight: data.highLight || "",
              tfns: data.tfns ? data.tfns.join(", ") : "",
              pointer: data.pointer ? data.pointer.join(", ") : "",
              isActive: data.isActive || false,
            });
          }
        } catch (error) {
          console.error("Failed to fetch popup:", error);
        }
      };
      fetchPopup();
    }
  }, [id]);
  useEffect(() => {
    dispatch(fetchAirlineData());
  }, [dispatch]);

  const handleAirlineChange = (e) => {
    const selectedAirline = e.target.value;

    if (selectedAirline === "all") {
      // Agar "All" select hua to URL bhi "all" set kar do
      setFormData((prev) => ({
        ...prev,
        airline: "all",
        url: "all",
      }));
    } else {
      const airline = airlines.find((flight) => flight._id === selectedAirline);
      const route = airline?.businessName
        ? airline.businessName.toLowerCase().replace(/\s/g, "-")
        : "";

      setFormData((prev) => ({
        ...prev,
        airline: selectedAirline,
        url: airline?.rout || route,
      }));
    }
  };

  // Input change handler
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Form submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/popup/edit?id=${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          pointer: formData.pointer.split(",").map((p) => p.trim()),
          tfns: formData.tfns.split(",").map((t) => t.trim()),
        }),
      });

      if (res.ok) {
        router.push("/popup"); // redirect back to listing
      } else {
        console.error("Failed to save popup");
      }
    } catch (error) {
      console.error("Error saving popup:", error);
    }
  };

  return (
    <Layout title="Edit Popup">
      <Box
        component="form"
        onSubmit={handleSubmit}
        // p={3}
        // mx="auto"
        // maxWidth={600}
      >
        {/*   <FormControl fullWidth margin="normal">
          <InputLabel id="airline-label">Select Airline</InputLabel>
          {console.log(formData.airline, "formData.airline")}
          <Select
            labelId="airline-label"
            id="airline-select"
            value={formData.airline}
            label="Select Airline"
            onChange={handleAirlineChange}
          >
            <MenuItem value="all">All</MenuItem>
            {airlines.map((flight) => (
              <MenuItem key={flight._id} value={flight._id}>
                {flight.businessName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <HInput
          label="URL"
          name="url"
          value={formData.url}
          onChange={handleAirlineChange}
          fullWidth
          margin="normal"
          variant="outlined"
        />*/}

        <HInput
          label="Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          fullWidth
          margin="normal"
          variant="outlined"
        />

        <HInput
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          fullWidth
          margin="normal"
          variant="outlined"
          multiline
          rows={4}
        />
        <HInput
          label="High Light Text"
          name="highLight"
          value={formData.highLight}
          onChange={handleChange}
          fullWidth
          margin="normal"
          variant="outlined"
        />

        <HInput
          label="Add Pointer (comma separated)"
          name="pointer"
          value={formData.pointer}
          onChange={handleChange}
          fullWidth
          margin="normal"
          variant="outlined"
        />
        <HInput
          label="TFNs (comma separated)"
          name="tfns"
          value={formData.tfns}
          onChange={handleChange}
          fullWidth
          margin="normal"
          variant="outlined"
        />

        <Box display="flex" alignItems="center" mt={2}>
          <input
            type="checkbox"
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}
          />
          <label style={{ marginLeft: "8px" }}>Active</label>
        </Box>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ mt: 3 }}
        >
          Update Popup
        </Button>
      </Box>
    </Layout>
  );
};

export default Page;
