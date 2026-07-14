"use client";

import React, { useRef } from "react";
import {
  Box,
  Typography,
  Grid,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
} from "@mui/material";
import { PhotoCamera } from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { showToast } from "@/store/settingsSlice";
import { HButton, HInput } from "@/components";
import { deleteThumbnail } from "@/utils/api";

const MAX_IMAGE_SIZE = 1 * 1024 * 1024; // 1MB

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const SEASON_TYPES = ["peak", "shoulder", "rainy"];

const FACT_FIELDS = [
  { key: "best", label: "Best Time to Visit" },
  { key: "flight", label: "Avg Flight Duration" },
  { key: "currency", label: "Currency" },
  { key: "language", label: "Language" },
  { key: "tz", label: "Time Zone" },
  { key: "budget", label: "Avg Daily Budget" },
  { key: "weather", label: "Weather" },
];

const COST_FIELDS = [
  { key: "flights", label: "Flights (round-trip)" },
  { key: "accom", label: "Accommodation" },
  { key: "food", label: "Food & dining" },
  { key: "transport", label: "Transportation" },
  { key: "activities", label: "Activities & tours" },
];

const ACTIVITY_ICONS = [
  "surfing",
  "snorkeling",
  "diving",
  "cruise",
  "beach-club",
  "island-hopping",
  "hiking",
  "spa",
  "dining",
  "nightlife",
  "shopping",
  "temple",
  "waterfall",
  "yoga",
];

const SectionTitle = ({ children, hint }) => (
  <Box
    mt={4}
    mb={2}
    px={2}
    py={1.5}
    sx={{
      borderLeft: "5px solid #1976d2",
      backgroundColor: "rgba(25, 118, 210, 0.08)",
      borderRadius: "4px",
    }}
  >
    <Typography variant="h6" fontWeight={700} color="#1976d2">
      {children}
    </Typography>
    {hint ? (
      <Typography variant="caption" color="textSecondary">
        {hint}
      </Typography>
    ) : null}
  </Box>
);

export default function DestinationDetailFields({ data, setData }) {
  const dispatch = useDispatch();
  const galleryInputRef = useRef(null);

  const set = (patch) => setData((prev) => ({ ...prev, ...patch }));

  // ---- basics ----
  const handleField = (e) => {
    const { name, value } = e.target;
    set({ [name]: value });
  };

  // ---- facts (object) ----
  const handleFact = (key, value) =>
    setData((prev) => ({
      ...prev,
      facts: { ...(prev.facts || {}), [key]: value },
    }));

  // ---- cost (object) ----
  const handleCost = (key, value) =>
    setData((prev) => ({
      ...prev,
      cost: { ...(prev.cost || {}), [key]: value },
    }));

  // ---- overview (string[]) ----
  const handleOverview = (index, value) =>
    setData((prev) => {
      const overview = [...(prev.overview || [])];
      overview[index] = value;
      return { ...prev, overview };
    });
  const addOverview = () =>
    setData((prev) => ({ ...prev, overview: [...(prev.overview || []), ""] }));
  const deleteOverview = (index) =>
    setData((prev) => ({
      ...prev,
      overview: (prev.overview || []).filter((_, i) => i !== index),
    }));

  // ---- beaches ([{name, description}]) ----
  const handleBeach = (index, field, value) =>
    setData((prev) => ({
      ...prev,
      beaches: (prev.beaches || []).map((b, i) =>
        i === index ? { ...b, [field]: value } : b
      ),
    }));
  const addBeach = () =>
    setData((prev) => ({
      ...prev,
      beaches: [...(prev.beaches || []), { name: "", description: "" }],
    }));
  const deleteBeach = (index) =>
    setData((prev) => ({
      ...prev,
      beaches: (prev.beaches || []).filter((_, i) => i !== index),
    }));

  // ---- areas ([{name, tag, description}]) ----
  const handleArea = (index, field, value) =>
    setData((prev) => ({
      ...prev,
      areas: (prev.areas || []).map((a, i) =>
        i === index ? { ...a, [field]: value } : a
      ),
    }));
  const addArea = () =>
    setData((prev) => ({
      ...prev,
      areas: [...(prev.areas || []), { name: "", tag: "", description: "" }],
    }));
  const deleteArea = (index) =>
    setData((prev) => ({
      ...prev,
      areas: (prev.areas || []).filter((_, i) => i !== index),
    }));

  // ---- thingsToDo ([{icon, title, description}]) ----
  const handleThing = (index, field, value) =>
    setData((prev) => ({
      ...prev,
      thingsToDo: (prev.thingsToDo || []).map((t, i) =>
        i === index ? { ...t, [field]: value } : t
      ),
    }));
  const addThing = () =>
    setData((prev) => ({
      ...prev,
      thingsToDo: [
        ...(prev.thingsToDo || []),
        { icon: "", title: "", description: "" },
      ],
    }));
  const deleteThing = (index) =>
    setData((prev) => ({
      ...prev,
      thingsToDo: (prev.thingsToDo || []).filter((_, i) => i !== index),
    }));

  // ---- season (string[12]) ----
  const seasonValue = (index) => (data.season && data.season[index]) || "";
  const handleSeason = (index, value) =>
    setData((prev) => {
      const season = Array.from({ length: 12 }, (_, i) =>
        i === index ? value : (prev.season && prev.season[i]) || ""
      );
      return { ...prev, season };
    });

  // ---- gallery ([{url, public_id, alt}]) ----
  const uploadGalleryImage = async (e) => {
    const file = e.target.files[0];
    e.target.value = "";
    if (!file) return;
    if (file.size > MAX_IMAGE_SIZE) {
      dispatch(
        showToast({ type: "error", message: "File is too large. Max size is 1MB." })
      );
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const result = await res.json();
      if (result.url) {
        setData((prev) => ({
          ...prev,
          gallery: [
            ...(prev.gallery || []),
            { url: result.url, public_id: result.public_id, alt: "" },
          ],
        }));
        dispatch(showToast({ type: "success", message: "Image uploaded!" }));
      } else {
        throw new Error(result.error || "Upload failed");
      }
    } catch (err) {
      console.error(err);
      dispatch(showToast({ type: "error", message: "Upload failed" }));
    }
  };
  const handleGalleryAlt = (index, value) =>
    setData((prev) => ({
      ...prev,
      gallery: (prev.gallery || []).map((g, i) =>
        i === index ? { ...g, alt: value } : g
      ),
    }));
  const removeGalleryImage = async (index) => {
    const item = (data.gallery || [])[index];
    try {
      if (item?.public_id) await deleteThumbnail(item.public_id);
    } catch (error) {
      console.error("Error deleting image:", error);
    }
    setData((prev) => ({
      ...prev,
      gallery: (prev.gallery || []).filter((_, i) => i !== index),
    }));
  };

  return (
    <Box mt={4}>
      <Divider />
      <SectionTitle hint="These fields power the destination detail page on the website.">
        Destination details
      </SectionTitle>

      {/* Country + starting price */}
      <Grid container columnSpacing={2}>
        <Grid item xs={12} sm={8}>
          <HInput
            label="Country / Region"
            name="country"
            value={data.country || ""}
            onChange={handleField}
            fullWidth
            margin="normal"
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <HInput
            label="Starting price (USD)"
            name="startingPrice"
            type="integer"
            value={data.startingPrice ?? ""}
            onChange={handleField}
            fullWidth
            margin="normal"
            variant="outlined"
          />
        </Grid>
      </Grid>

      {/* Overview paragraphs */}
      <SectionTitle hint="Intro paragraphs shown under 'Welcome to ...'">
        Overview
      </SectionTitle>
      {(data.overview || []).map((para, index) => (
        <Box key={index} display="flex" gap={1} alignItems="flex-start">
          <HInput
            label={`Paragraph ${index + 1}`}
            value={para}
            onChange={(e) => handleOverview(index, e.target.value)}
            fullWidth
            margin="normal"
            variant="outlined"
            multiline
            rows={2}
          />
          <Box mt={2}>
            <HButton
              variant="outlined"
              color="error"
              onClick={() => deleteOverview(index)}
            >
              Remove
            </HButton>
          </Box>
        </Box>
      ))}
      <Box mt={1}>
        <HButton variant="outlined" onClick={addOverview}>
          Add Paragraph
        </HButton>
      </Box>

      {/* Quick facts */}
      <SectionTitle>Quick facts</SectionTitle>
      <Grid container columnSpacing={2}>
        {FACT_FIELDS.map((f) => (
          <Grid item xs={12} sm={6} md={4} key={f.key}>
            <HInput
              label={f.label}
              value={(data.facts && data.facts[f.key]) || ""}
              onChange={(e) => handleFact(f.key, e.target.value)}
              fullWidth
              margin="normal"
              variant="outlined"
            />
          </Grid>
        ))}
      </Grid>

      {/* Top beaches */}
      <SectionTitle hint="Name + short description for each beach.">
        Top beaches
      </SectionTitle>
      {(data.beaches || []).map((beach, index) => (
        <Box
          key={index}
          mb={2}
          p={2}
          border="1px solid #ccc"
          borderRadius="8px"
        >
          <Grid container columnSpacing={2} alignItems="center">
            <Grid item xs={12} sm={4}>
              <HInput
                label="Beach name"
                value={beach.name || ""}
                onChange={(e) => handleBeach(index, "name", e.target.value)}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={8}>
              <HInput
                label="Description"
                value={beach.description || ""}
                onChange={(e) =>
                  handleBeach(index, "description", e.target.value)
                }
                fullWidth
                margin="normal"
              />
            </Grid>
          </Grid>
          <Box display="flex" justifyContent="flex-end">
            <HButton
              variant="outlined"
              color="error"
              onClick={() => deleteBeach(index)}
            >
              Remove
            </HButton>
          </Box>
        </Box>
      ))}
      <HButton variant="outlined" onClick={addBeach}>
        Add Beach
      </HButton>

      {/* Popular areas to stay */}
      <SectionTitle hint="Name, a short tag, and a description for each area.">
        Popular areas to stay
      </SectionTitle>
      {(data.areas || []).map((area, index) => (
        <Box
          key={index}
          mb={2}
          p={2}
          border="1px solid #ccc"
          borderRadius="8px"
        >
          <Grid container columnSpacing={2} alignItems="center">
            <Grid item xs={12} sm={3}>
              <HInput
                label="Area name"
                value={area.name || ""}
                onChange={(e) => handleArea(index, "name", e.target.value)}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <HInput
                label="Tag"
                value={area.tag || ""}
                onChange={(e) => handleArea(index, "tag", e.target.value)}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <HInput
                label="Description"
                value={area.description || ""}
                onChange={(e) =>
                  handleArea(index, "description", e.target.value)
                }
                fullWidth
                margin="normal"
              />
            </Grid>
          </Grid>
          <Box display="flex" justifyContent="flex-end">
            <HButton
              variant="outlined"
              color="error"
              onClick={() => deleteArea(index)}
            >
              Remove
            </HButton>
          </Box>
        </Box>
      ))}
      <HButton variant="outlined" onClick={addArea}>
        Add Area
      </HButton>

      {/* Things to do */}
      <SectionTitle hint="Pick an icon, add a title and a short description for each activity.">
        Things to do
      </SectionTitle>
      {(data.thingsToDo || []).map((thing, index) => (
        <Box
          key={index}
          mb={2}
          p={2}
          border="1px solid #ccc"
          borderRadius="8px"
        >
          <Grid container columnSpacing={2} alignItems="center">
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth margin="normal">
                <InputLabel id={`thing-icon-${index}`}>Icon</InputLabel>
                <Select
                  labelId={`thing-icon-${index}`}
                  label="Icon"
                  value={thing.icon || ""}
                  onChange={(e) => handleThing(index, "icon", e.target.value)}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {ACTIVITY_ICONS.map((ic) => (
                    <MenuItem key={ic} value={ic}>
                      {ic}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={3}>
              <HInput
                label="Title"
                value={thing.title || ""}
                onChange={(e) => handleThing(index, "title", e.target.value)}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <HInput
                label="Description"
                value={thing.description || ""}
                onChange={(e) =>
                  handleThing(index, "description", e.target.value)
                }
                fullWidth
                margin="normal"
              />
            </Grid>
          </Grid>
          <Box display="flex" justifyContent="flex-end">
            <HButton
              variant="outlined"
              color="error"
              onClick={() => deleteThing(index)}
            >
              Remove
            </HButton>
          </Box>
        </Box>
      ))}
      <HButton variant="outlined" onClick={addThing}>
        Add Activity
      </HButton>

      {/* Best time to visit calendar */}
      <SectionTitle hint="Mark each month as peak, shoulder or rainy season.">
        Best time to visit (season calendar)
      </SectionTitle>
      <Grid container columnSpacing={2} rowSpacing={1}>
        {MONTHS.map((m, index) => (
          <Grid item xs={6} sm={3} md={2} key={m}>
            <FormControl fullWidth margin="normal" size="small">
              <InputLabel id={`season-${index}`}>{m}</InputLabel>
              <Select
                labelId={`season-${index}`}
                label={m}
                value={seasonValue(index)}
                onChange={(e) => handleSeason(index, e.target.value)}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {SEASON_TYPES.map((s) => (
                  <MenuItem key={s} value={s}>
                    {s}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        ))}
      </Grid>

      {/* Estimated trip cost */}
      <SectionTitle hint="Per-person estimate in USD for each category.">
        Estimated trip cost
      </SectionTitle>
      <Grid container columnSpacing={2}>
        {COST_FIELDS.map((c) => (
          <Grid item xs={12} sm={6} md={4} key={c.key}>
            <HInput
              label={c.label}
              type="integer"
              value={(data.cost && (data.cost[c.key] ?? "")) || ""}
              onChange={(e) => handleCost(c.key, e.target.value)}
              fullWidth
              margin="normal"
              variant="outlined"
            />
          </Grid>
        ))}
      </Grid>

      {/* Gallery */}
      <SectionTitle hint="Extra images shown in the destination gallery.">
        Gallery
      </SectionTitle>
      <Grid container spacing={2}>
        {(data.gallery || []).map((item, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Box p={1} border="1px solid #ccc" borderRadius="8px">
              <img
                src={item.url}
                alt={item.alt || `Gallery ${index + 1}`}
                style={{
                  width: "100%",
                  height: 160,
                  objectFit: "cover",
                  borderRadius: 4,
                }}
              />
              <HInput
                label="Image alt"
                value={item.alt || ""}
                onChange={(e) => handleGalleryAlt(index, e.target.value)}
                fullWidth
                margin="normal"
                size="small"
              />
              <HButton
                variant="outlined"
                color="error"
                onClick={() => removeGalleryImage(index)}
              >
                Remove
              </HButton>
            </Box>
          </Grid>
        ))}
      </Grid>
      <Box
        mt={2}
        onClick={() => galleryInputRef.current && galleryInputRef.current.click()}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px",
          borderRadius: "4px",
          border: "1px solid rgba(0, 0, 0, 0.23)",
          cursor: "pointer",
          maxWidth: 320,
        }}
      >
        <Typography color="textSecondary">Add gallery image</Typography>
        <IconButton>
          <PhotoCamera />
        </IconButton>
      </Box>
      <input
        type="file"
        accept="image/*"
        ref={galleryInputRef}
        style={{ display: "none" }}
        onChange={uploadGalleryImage}
      />
    </Box>
  );
}
