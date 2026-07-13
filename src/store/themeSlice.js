import { createSlice } from "@reduxjs/toolkit";

const defaultMenu = {
  admin: [
    {
      name: "Home",
      url: "/",
      icon: "DashboardTwoTone",
      show: true,
      children: [],
    },
    {
      name: "Users",
      url: "/users",
      icon: "PeopleAltTwoTone",
      show: true,
      children: [],
    },
    // {
    //   name: "Airline",
    //   url: "/airline",
    //   icon: "AirlinesIcon",
    //   show: true,
    //   children: [],
    // },
    {
      name: "Category",
      url: "/category",
      icon: "TravelExploreTwoTone",
      show: true,
      children: [],
    },
    {
      name: "Blogs",
      url: "/blogs",
      icon: "AutoStoriesTwoTone",
      show: true,
      children: [],
    },
    {
      name: "Destination",
      url: "/destination",
      icon: "TravelExploreIcon",
      show: true,
      children: [],
    },
    // {
    //   name: "Deals",
    //   url: "/deals",
    //   icon: "TravelExploreIcon",
    //   show: true,
    //   children: [],
    // },

    // {
    //   name: "We Offer",
    //   url: "/we-offer",
    //   icon: "ProductionQuantityLimitsTwoTone",
    //   show: true,
    //   children: [],
    // },
    // {
    //   name: "Reviews",
    //   url: "/reviews",
    //   icon: "StackedLineChartTwoTone",
    //   show: true,
    //   children: [],
    // },
    // {
    //   name: "Images",
    //   url: "/images",
    //   icon: "Collections",
    //   show: true,
    //   children: [],
    // },
    // {
    //   name: "Pop-Up",
    //   url: "/popup",
    //   icon: "Collections",
    //   show: true,
    //   children: [],
    // },
    {
      name: "Authors",
      url: "/authors",
      icon: "PeopleAltTwoTone",
      show: true,
      children: [],
    },
  ],
  user: [
    {
      name: "Dashboard",
      url: "/",
      icon: "DashboardTwoTone",
      show: true,
      children: [],
    },
    // {
    //   name: "Airline",
    //   url: "/airline",
    //   icon: "AirlinesIcon",
    //   show: true,
    //   children: [],
    // },
    {
      name: "Blogs",
      url: "/blogs",
      icon: "AutoStoriesTwoTone",
      show: true,
      children: [],
    },
    {
      name: "Destination",
      url: "/destination",
      icon: "TravelExploreIcon",
      show: true,
      children: [],
    },
    // {
    //   name: "Deals",
    //   url: "/deals",
    //   icon: "TravelExploreIcon",
    //   show: true,
    //   children: [],
    // },
    // {
    //   name: "Holiday Package",
    //   url: "/holiday",
    //   icon: "TravelExploreTwoTone",
    //   show: true,
    //   children: [],
    // },

    // {
    //   name: "We Offer",
    //   url: "/we-offer",
    //   icon: "ProductionQuantityLimitsTwoTone",
    //   show: true,
    //   children: [],
    // },
    // {
    //   name: "Reviews",
    //   url: "/reviews",
    //   icon: "StackedLineChartTwoTone",
    //   show: true,
    //   children: [],
    // },
    // {
    //   name: "Images",
    //   url: "/images",
    //   icon: "Collections",
    //   show: true,
    //   children: [],
    // },
    {
      name: "Authors",
      url: "/authors",
      icon: "PeopleAltTwoTone",
      show: true,
      children: [],
    },
  ],
};

const initialState = {
  darkMode: false,
  menu: defaultMenu,
  availableMenus: defaultMenu,
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleTheme(state, action) {
      localStorage.setItem("theme", action.payload);
      state.darkMode = action.payload;
    },
    getMenu(state, action) {
      state.menu = action.payload;
    },
    setMenuBasedOnRole(state, action) {
      const role = action.payload;
      state.menu = state.availableMenus[role] || state.availableMenus.user;
    },
  },
});

export const { toggleTheme, getMenu, setMenuBasedOnRole } = themeSlice.actions;

export default themeSlice.reducer;
