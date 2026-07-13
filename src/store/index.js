import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "./themeSlice";
import authReducer from "./authSlice";
import settingsReducer from "./settingsSlice";
import pagesReducer from "./pagesSlice";
import flightReducer from "./flightpageSlice";
import blogReducer from "./blogSlice";
import destinationReducer from "./destinationSlice";
import holidayReducer from "./holidaySlice";
import popuplarPlacesReducer from "./popularplaceSlice";
import feedbackReducer from "./feedbackSlice";
import reviewReducer from "./reviewSlice";
import dealsReducer from "./dealsSlice";

const store = configureStore({
  reducer: {
    theme: themeReducer,
    auth: authReducer,
    settings: settingsReducer,
    pages: pagesReducer,
    flight: flightReducer,
    blog: blogReducer,
    destination: destinationReducer,
    holiday: holidayReducer,
    popularPlaces: popuplarPlacesReducer,
    feedback: feedbackReducer,
    review: reviewReducer,
    deals: dealsReducer,
  },
});

export default store;
