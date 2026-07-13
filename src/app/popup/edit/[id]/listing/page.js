// "use client";
// import { HTable, Layout } from "@/components";
// import { Box, Switch, TextField, Tooltip } from "@mui/material";
// import React, { useEffect, useState } from "react";

// const Page = () => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [pages, setPages] = useState([]);

//   // useEffect(() => {
//   //   const fetchPopups = async () => {
//   //     try {
//   //       const res = await fetch(`/api/popup?searchTerm=${searchTerm}`);
//   //       if (res.ok) {
//   //         const data = await res.json();
//   //         console.log("data: ", data);
//   //         setPages(data);
//   //       } else {
//   //         console.error("Failed to fetch popup list");
//   //       }
//   //     } catch (error) {
//   //       console.error("Error fetching popup list:", error);
//   //     } finally {
//   //       setLoading(false);
//   //     }
//   //   };

//   //   fetchPopups();
//   // }, [searchTerm]);

//   useEffect(() => {
//     const fetchData = async () => {
//       const res = await fetch(
//         `/api/popup/toggleRouthStatus?searchTerm=${searchTerm}`,
//       );
//       const data = await res.json();
//       console.log({ data: data.data });
//       // Sort here: true upar, false neeche
//       const sortedPages = [...data.data].sort(
//         (a, b) => (b.isRouthActive === true) - (a.isRouthActive === true),
//       );

//       setPages(sortedPages);
//       setLoading(false);
//     };

//     fetchData();
//   }, [searchTerm]);
//   const headers = [
//     { key: "sn", label: "Sn.", sortable: true },
//     { key: "routePath", label: "Route Path", sortable: true },
//     { key: "title", label: "Title", sortable: true },
//     { key: "language", label: "Language", sortable: true },
//     { key: "isRouthActive", label: "Route Status", sortable: true },
//   ];

//   const data = pages.map((page, i) => ({
//     sn: i + 1,
//     routePath: page?.routPath,
//     title: page?.title,
//     language: `${page?.language}`,
//     isRouthActive: (
//       <Tooltip title={page.isRouthActive ? "Deactivate" : "Activate"}>
//         <Switch
//           checked={page.isRouthActive}
//           color="success"
//           onChange={(e) =>
//             handleToggle(page?.routPath, e.target.checked, page?.language)
//           }
//           // disabled={page.role === "admin"}
//         />
//       </Tooltip>
//     ),
//   }));

//   const handleToggle = async (routePath, value, language) => {
//     try {
//       console.log({ routePath, value, language });
//       const res = await fetch("/api/popup/toggleRouthStatus", {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ routePath, value, language }),
//       });
//       const data = await res.json();
//       if (data.success) {
//         setPages((prev) =>
//           prev.map((p) =>
//             p.routPath === routePath ? { ...p, isRouthActive: value } : p,
//           ),
//         );
//       }
//     } catch (error) {
//       console.error("Error updating route status:", error);
//     }
//   };

//   return (
//     <Layout title={"Pop-Up Route Listing"}>
//       <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
//         <TextField
//           variant="outlined"
//           size="small"
//           placeholder="Search with Route Path or Slug..."
//           sx={{ width: 300 }}
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//         />
//       </Box>

//       {loading ? (
//         <p>Loading...</p>
//       ) : (
//         <HTable
//           headers={headers}
//           data={data}
//           // onSortRequested={handleSortRequested}
//         />
//       )}
//     </Layout>
//   );
// };

// export default Page;
"use client";
import { HTable, Layout } from "@/components";
import { Box, Switch, TextField, Tooltip } from "@mui/material";
import React, { useEffect, useState } from "react";

const Page = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [pages, setPages] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(
        `/api/popup/toggleRouthStatus?searchTerm=${searchTerm}`,
      );
      const data = await res.json();

      const sortedPages = [...data.data].sort(
        (a, b) => (b.isRouthActive === true) - (a.isRouthActive === true),
      );

      setPages(sortedPages);
      setLoading(false);
    };

    fetchData();
  }, [searchTerm]);

  const headers = [
    { key: "sn", label: "Sn.", sortable: true },
    { key: "routePath", label: "Route Path", sortable: true },
    { key: "title", label: "Title", sortable: true },
    { key: "language", label: "Language", sortable: true },
    { key: "isRouthActive", label: "Route Status", sortable: true },
  ];

  const handleToggle = async (routePath, value, language) => {
    try {
      console.log({ routePath, value, language });

      const res = await fetch("/api/popup/toggleRouthStatus", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ routePath, value, language }),
      });

      const data = await res.json();

      if (data.success) {
        setPages((prev) => {
          // 🔥 check karo kitne same route hain
          const sameRouteCount = prev.filter(
            (p) => p.routPath === routePath,
          ).length;

          return prev.map((p) => {
            // 👉 agar same route multiple hain → language bhi match karo
            if (sameRouteCount > 1) {
              if (p.routPath === routePath && p.language === language) {
                return { ...p, isRouthActive: value };
              }
            }
            // 👉 agar unique route hai → sirf routePath se update karo
            else {
              if (p.routPath === routePath) {
                return { ...p, isRouthActive: value };
              }
            }

            return p;
          });
        });
      }
    } catch (error) {
      console.error("Error updating route status:", error);
    }
  };

  const data = pages.map((page, i) => ({
    key: `${page.routPath}_${page.language}`, // ✅ unique key
    sn: i + 1,
    routePath: page?.routPath,
    title: page?.title,
    language: `${page?.language}`,
    isRouthActive: (
      <Tooltip title={page.isRouthActive ? "Deactivate" : "Activate"}>
        <Switch
          checked={page.isRouthActive}
          color="success"
          onChange={(e) =>
            handleToggle(page?.routPath, e.target.checked, page?.language)
          }
        />
      </Tooltip>
    ),
  }));

  return (
    <Layout title={"Pop-Up Route Listing"}>
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

      {loading ? <p>Loading...</p> : <HTable headers={headers} data={data} />}
    </Layout>
  );
};

export default Page;
