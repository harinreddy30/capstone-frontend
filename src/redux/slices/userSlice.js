import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    users: [], // Stores all users
    availableEmployees: {}, // ✅ Stores available employees per day
    user: null, 
    loading: false,
    error: null, 
};

const userSlice = createSlice({
    name: "users",
    initialState,
    reducers: {

        usersPending: (state) => {
            state.loading = true;
            state.error = null;
        },

        usersSuccess: (state, action) => {
            state.loading = false;
            state.users = action.payload; // ✅ Stores all users
        },

        availableEmployeesSuccess: (state, action) => {
            const { day, employees } = action.payload;
            state.availableEmployees[day] = employees; // ✅ Stores employees by shift day
            state.loading = false;
        },

        usersFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },

        userByIdSuccess: (state, action) => {
            state.loading = false;
            state.user = action.payload;
        },

        userCreateSuccess: (state, action) => {
            state.loading = false;
            state.users.push(action.payload);
        },

        userUpdateSuccess: (state, action) => {
            state.loading = false;
            state.users = state.users.map((user) =>
                user._id === action.payload._id ? action.payload : user
            );
        },
        
        userDeleteSuccess: (state, action) => {
            state.loading = false;
            state.users = state.users.filter((user) => user._id !== action.payload);
        },
    }
});

export const { 
    usersPending, 
    usersSuccess, 
    availableEmployeesSuccess, // ✅ New action for available employees
    usersFailure, 
    userByIdSuccess, 
    userCreateSuccess, 
    userUpdateSuccess, 
    userDeleteSuccess 
} = userSlice.actions;

export default userSlice.reducer;
