import { createSlice } from "@reduxjs/toolkit";

const getInitialSites = () => {
  try {
    const storedSites = localStorage.getItem("sites");
    return storedSites ? JSON.parse(storedSites) : [];
  } catch (error) {
    console.error("Error parsing sites from localStorage:", error);
    return [];
  }
};

const initialState = {
  sites: getInitialSites(),
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
    siteByIdSuccess: (state, action) => {
      console.log("Site payload:", action.payload);
      state.loading = false;
      const site = action.payload.site || action.payload;
      state.data = {
        ...state.data,
        [site._id]: site,
      };
    },
    
    siteCreateSuccess: (state, action) => {
      state.loading = false;
      state.sites.push(action.payload); // Add the new site
      // Save to localStorage after adding a new site
      localStorage.setItem("sites", JSON.stringify(state.sites));
    },
    siteUpdateSuccess: (state, action) => {
      state.loading = false;
      // Update the site in the sites array, ensuring all fields are updated
      state.sites = state.sites.map((site) =>
        site._id === action.payload._id ? {
          ...site,
          ...action.payload,
          status: action.payload.status,
          archiveDate: action.payload.archiveDate,
          archiveReason: action.payload.archiveReason,
          lastActiveDate: action.payload.lastActiveDate,
          updatedAt: action.payload.updatedAt
        } : site
      );
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
  siteByIdSuccess,
  siteCreateSuccess,
  siteUpdateSuccess,
  siteDeleteSuccess,
} = siteSlice.actions;

// Export the reducer to be used in the store
export default siteSlice.reducer;
