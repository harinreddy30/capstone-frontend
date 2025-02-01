import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  sites: JSON.parse(localStorage.getItem("sites")) || [], // Load from localStorage if available, else use empty array
  site: null, // Store a single site
  loading: false, // Used when making an API call to the backend
  error: null,
};

const siteSlice = createSlice({
  name: "sites",
  initialState,
  reducers: {
    // Action to handle when the fetch request is pending
    sitePending: (state) => {
      state.loading = true; // API request completed
      state.error = null;
    },
    // Action to handle when the request is successful
    siteSuccess: (state, action) => {
      state.loading = false; // API request completed
      state.sites = action.payload; // payload contains the data
      // Save to localStorage when sites are updated
      localStorage.setItem("sites", JSON.stringify(state.sites));
    },
    // Action to handle when the request fails
    siteFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    // Action to handle when fetching a single user
    siteByIdSucess: (state, action) => {
      state.loading = false;
      state.site = action.payload;
    },
    siteCreateSuccess: (state, action) => {
      state.loading = false;
      state.sites.push(action.payload); // Add the new site
      // Save to localStorage after adding a new site
      localStorage.setItem("sites", JSON.stringify(state.sites));
    },
    siteUpdateSuccess: (state, action) => {
      state.loading = false;
      state.sites = state.sites.map((site) =>
        site._id === action.payload._id ? action.payload : site
      ); // Update the site in the sites array
      // Save to localStorage after updating a site
      localStorage.setItem("sites", JSON.stringify(state.sites));
    },
    siteDeleteSuccess: (state, action) => {
      state.loading = false;
      state.sites = state.sites.filter((site) => site._id !== action.payload); // Remove the deleted site
      // Save to localStorage after deleting a site
      localStorage.setItem("sites", JSON.stringify(state.sites));
    },
  },
});

export const {
  sitePending,
  siteSuccess,
  siteFailure,
  siteByIdSucess,
  siteCreateSuccess,
  siteUpdateSuccess,
  siteDeleteSuccess,
} = siteSlice.actions;

// Export the reducer to be used in the store
export default siteSlice.reducer;
