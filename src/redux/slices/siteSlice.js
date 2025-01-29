import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    sites: [], // Store all the sites from backend
    site: null, // store a single site
    loading: false, // used when making a api call to the backend
    error: null,
    managers: [] // Store managers here
}

const siteSlice = createSlice({
    name: "sites",
    initialState,
    reducers: {

        // Action to handle when the fetch request is pending
        sitePending: (state) => {
            state.loading = true; // API request completed
            state.error = null;
        },
        // Action to handle when the req is succesfull
        siteSuccess: (state, action) => {
            state.loading = false; // API req completed
            state.sites = action.payload; // payload contain the data
        },
        // Action to handle when the req fails
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
            state.sites.push(action.payload); // add the site
        },
        siteUpdateSuccess: (state, action) => {
            state.loading = false;
            state.sites = state.sites.map((site) => 
                site._id === action.payload._id ? action.payload : site
            ); // Update the site in the sites array
        },
        siteDeleteSuccess: (state, action) => {
            state.loading = false;
            state.sites = state.sites.filter((site) => site._id !== action.payload); // Remove the deleted site
        },
        siteManagersSuccess: (state, action) => {
            state.loading = false;
            state.managers = action.payload; // Store fetched managers
        },

    }
})

export const {
    sitePending,
    siteSuccess,
    siteFailure,
    siteByIdSucess,
    siteCreateSuccess,
    siteUpdateSuccess,
    siteDeleteSuccess,
    siteManagersSuccess
} = siteSlice.actions;

// Export the reducer to be used in the store
export default siteSlice.reducer;