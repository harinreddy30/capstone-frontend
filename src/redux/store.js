import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../redux/slices/authSlice';
import leaveReducer from '../redux/slices/leaveSlice';
import usersReducer from '../redux/slices/userSlice';
import sitesReducer from '../redux/slices/siteSlice';
import shiftsReducer from "../redux/slices/shiftSlice";
import reportsReducer from "../redux/slices/reportSlice";
import availabilityReducer from "../redux/slices/availabilitySlice"
import chatReducer from "../redux/slices/chatSlice"
import groupReducer from "../redux/slices/groupSlice";
import messageReducer from "../redux/slices/messageSlice";
import scheduleReducer from "../redux/slices/scheduleSlice";
import swapReducer from "../redux/slices/swapSlice"
import payrollReducer from '../redux/slices/payrollSlice';

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
        chat: chatReducer,
        groups: groupReducer,
        messages: messageReducer,
        schedule: scheduleReducer,
        payroll: payrollReducer,
        swaps: swapReducer,
    },
    // This will print every dispatched action and the state changes in the browser's console
    // middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger), // 
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
})

export default store;