"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
  Tooltip,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { HTable, Layout } from "@/components";

const Page = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [pages, setPages] = useState([]);

  const [formData, setFormData] = useState({
    category: "",
    title: "",
    description: "",
    highLight: "",
    pointer: "",
    tfns: "",
    isActive: false,
    activeRoute: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/popup/add");
      const data = await res.json();
      console.log({ data: data.data });
      setPages(data.data);
      setLoading(false);
    };

    fetchData();
  }, []);

  console.log("pagesdfsdsdfg: ", pages?.data);
  const handleChange = (e) => {
    let activeRoute = pages?.data?.map((page) => ({
      routePath: page?.routPath,
      isRouthActive: false,
      isRouthActive: false,
    }));

    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      activeRoute: activeRoute,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/popup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          category: formData.category,
          title: formData.title,
          description: formData.description,
          highLight: formData.highLight,
          pointer: formData.pointer.split(",").map((pt) => pt.trim()),
          tfns: formData.tfns.split(",").map((tfn) => tfn.trim()),
          isActive: formData.isActive,
          activeRoute: formData.activeRoute,
        }),
      });

      if (response.ok) {
        alert("Popup created successfully!");
        router.push("/popup");
      } else {
        const errorData = await response.json();
        alert("Error: " + errorData.error);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong");
    }
  };

  // activeRoute;
  // console.log({ activeRoute });
  // useEffect(() => {
  //   if (pages.length) {
  //     setFormData((prev) => ({
  //       ...prev,
  //       activeRoute: pages.map((page) => ({
  //         routePath: page?.routPath,
  //         isRouthActive: false,
  //       })),
  //     }));
  //   }
  // }, [pages]);

  // const headers = [
  //   { key: "routePath", label: "URL", sortable: true },
  //   { key: "isRouthActive", label: "Status", sortable: true },
  // ];
  // console.log({ pages });
  // const data = pages.map((page) => ({
  //   routePath: page?.routPath,
  //   isRouthActive: (
  //     <Tooltip title={page.isActive ? "Deactivate" : "Activate"}>
  //       <Switch
  //         checked={page.isActive}
  //         color="success"
  //         disabled={page.role === "admin"}
  //       />
  //     </Tooltip>
  //   ),
  // }));

  return (
    <Layout title="Create Popup">
      <Box component="form" onSubmit={handleSubmit}>
        <FormControl fullWidth margin="normal">
          <InputLabel id="airline-label">Category</InputLabel>
          <Select
            labelId="airline-label"
            id="airline-select"
            name="category"
            value={formData.category}
            label="Select Airline"
            onChange={handleChange}
          >
            {["flight"].map((flight, index) => (
              <MenuItem key={index} value={flight}>
                {flight}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          fullWidth
          margin="normal"
          variant="outlined"
        />

        <TextField
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

        <TextField
          label="High Light Text"
          name="highLight"
          value={formData.highLight}
          onChange={handleChange}
          fullWidth
          margin="normal"
          variant="outlined"
        />

        <TextField
          label="Add Pointer (comma separated)"
          name="pointer"
          value={formData.pointer}
          onChange={handleChange}
          fullWidth
          margin="normal"
          variant="outlined"
        />

        <TextField
          label="TFNs (comma separated)"
          name="tfns"
          value={formData.tfns}
          onChange={handleChange}
          fullWidth
          margin="normal"
          variant="outlined"
        />

        {/* <Box display="flex" alignItems="center" mt={2}>
          <input
            type="checkbox"
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}
          />
          <label style={{ marginLeft: "8px" }}>Active</label>
        </Box>

        {loading ? <p>Loading...</p> : <HTable headers={headers} data={data} />} */}

        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ mt: 3 }}
        >
          Create Popup
        </Button>
      </Box>
    </Layout>
  );
};

export default Page;
