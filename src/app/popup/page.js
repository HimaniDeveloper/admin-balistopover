"use client";

import { useState, useEffect } from "react";
import { HButton, HTable, Layout } from "@/components";
import styled from "@emotion/styled";
import { useRouter } from "next/navigation";
import { Box, Switch, TextField, Tooltip } from "@mui/material";

const AddButton = styled(HButton)(() => ({
  float: "right",
  marginTop: -50,
}));

const Page = () => {
  const router = useRouter();

  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const headers = [
    { key: "category", label: "Category", sortable: true },
    { key: "title", label: "Title", sortable: true },
    { key: "description", label: "Description", sortable: false },
    { key: "tfns", label: "TFNs (comma separated)", sortable: true },
    { key: "popupModify", label: "Pop-Up Modify", sortable: false },
    { key: "isActive", label: "Status", sortable: true },
    { key: "routeModify", label: "Specific Route Modify", sortable: false },
  ];

  useEffect(() => {
    const fetchPopups = async () => {
      try {
        const res = await fetch(`/api/popup?searchTerm=${searchTerm}`);
        if (res.ok) {
          const data = await res.json();
          console.log("data: ", data);
          setPages(data);
        } else {
          console.error("Failed to fetch popup list");
        }
      } catch (error) {
        console.error("Error fetching popup list:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPopups();
  }, [searchTerm]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await fetch(`/api/popup/edit?id=${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: newStatus }),
      });

      if (res.ok) {
        // update UI without refetch
        setPages((prev) =>
          prev.map((p) => (p._id === id ? { ...p, isActive: newStatus } : p))
        );
      } else {
        console.error("Failed to update status");
      }
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  console.log("pages: ", pages);
  const data = pages.map((page) => ({
    category: page?.category,
    title: page?.title,
    description: page?.description,
    tfns: page?.tfns.join(", "),
    popupModify: <button onClick={() => handleEdit(page?._id)}>Update</button>,
    isActive: (
      <Tooltip title={page.isActive ? "Deactivate" : "Activate"}>
        <Switch
          checked={page.isActive}
          onChange={(e) => handleStatusChange(page._id, e.target.checked)}
          color="success"
          disabled={page.role === "admin"}
        />
      </Tooltip>
    ),
    routeModify: (
      <button onClick={() => handleRouteEdit(page?.category, page?._id)}>
        Update
      </button>
    ),
  }));

  const handleEdit = (id) => {
    router.push(`/popup/edit/${id}`);
  };

  const handleRouteEdit = (category, _id) => {
    router.push(`/popup/edit/${category}-${_id}/listing`);
  };

  return (
    <Layout title={"Pop-Up"}>
      <AddButton onClick={() => router.push("/popup/add")}>Add Popup</AddButton>

      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <TextField
          variant="outlined"
          size="small"
          placeholder="Search with Route Path or Slug..."
          sx={{ width: 300 }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Box>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <HTable
          headers={headers}
          data={data}
          // onSortRequested={handleSortRequested}
        />
      )}
    </Layout>
  );
};

export default Page;
