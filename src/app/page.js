"use client";

import React from "react";
import { Layout, CardTile } from "@/components";
import { Pageview as PageviewIcon, Flight as FlightIcon } from "@mui/icons-material"; // Example icons

const pages = [
  {
    title: "All Pages",
    description: "View and manage all pages.",
    route: "/pagelist",
    icon: PageviewIcon,
  },
];

export default function HomePage() {
  return (
    <Layout title={"Pages"}>
      <div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
          {pages.map((page) => (
            <CardTile
              key={page.title}
              title={page.title}
              description={page.description}
              route={page.route}
              icon={page.icon}
            />
          ))}
        </div>
      </div>
    </Layout>
  );
}
