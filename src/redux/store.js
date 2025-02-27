import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../redux/slices/authSlice';
import leaveReducer from '../redux/slices/leaveSlice';
import usersReducer from '../redux/slices/userSlice';
import sitesReducer from '../redux/slices/siteSlice';
import shiftsReducer from "../redux/slices/shiftSlice";
import reportsReducer from "../redux/slices/reportSlice";
import availabilityReducer from "../redux/slices/availabilitySlice"
import payrollReducer from './slices/payrollSlice';
// import profileReducer from '../redux/slices/profileSlice';

// import logger from 'redux-logger';


const store = configureStore({
    reducer: {
        auth: authReducer,
        // profile: profileReducer,
        leave: leaveReducer, // Add the leave slice here
        users: usersReducer,
        sites: sitesReducer,
        shifts: shiftsReducer,
        reports: reportsReducer,
        availability: availabilityReducer,
        payroll: payrollReducer,
    },
    // This will print every dispatched action and the state changes in the browser's console
    // middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger), // 
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
})

export default store;