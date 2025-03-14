import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    users: [], // Stores all users fetched from the backend
    user: null, // Stores a single user, usually when fetching by ID
    loading: false, // Stores a single user, usually when fetching by ID
    error: null, // Stores any error messages that might occur during API calls
}

const userSlice = createSlice({
    name: "users",
    initialState,
    reducers: {

        // Action to handle when the fetch request is pending
        usersPending: (state) => {
            state.loading = true;
            state.error = null;
        },
        // Action to handle when the fetch request is successful (fetch all users)
        usersSuccess: (state, action) => {
            state.loading = false; // API req is completed
            state.users = action.payload; // action.payload contains the list of users
        },
        // Action to handle when the fetch request fails
        usersFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload; // Store the error message
        },
        // Action to handle when fetching a user by ID is successful
        userByIdSuccess: (state, action) => {
            state.loading = false;
            state.user = action.payload; // Store the fetched user by ID
        },
        // Action to handle when creating a user is successful
        userCreateSuccess: (state, action) => {
            state.loading = false;
            state.users.push(action.payload); // Add the new user to the users array
        },
        // Action to handle when updating a user is successful
        userUpdateSuccess: (state, action) => {
            state.loading = false;
            state.users = state.users.map((user) =>
                user._id === action.payload._id ? action.payload : user
            );
        },
        
        // Action to handle when deleting a user is successful
        userDeleteSuccess: (state, action) => {
            state.loading = false;
            state.users = state.users.filter((user) => user._id !== action.payload); // Remove the deleted user
        },
    }
})


// Export actions to be dispatched
export const { 
    usersPending, 
    usersSuccess, 
    usersFailure, 
    userByIdSuccess, 
    userCreateSuccess, 
    userUpdateSuccess, 
    userDeleteSuccess 
} = userSlice.actions;

// Export the reducer to be used in the store
export default userSlice.reducer;