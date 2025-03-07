import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../redux/slices/authSlice';
import leaveReducer from '../redux/slices/leaveSlice';
import usersReducer from '../redux/slices/userSlice';
import sitesReducer from '../redux/slices/siteSlice';
import shiftsReducer from "../redux/slices/shiftSlice";
import reportsReducer from "../redux/slices/reportSlice";
import availabilityReducer from "../redux/slices/availabilitySlice"
<<<<<<< HEAD
import chatReducer from "../redux/slices/chatSlice"
import groupReducer from "../redux/slices/groupSlice";
import messageReducer from "../redux/slices/messageSlice";

=======
import payrollReducer from './slices/payrollSlice';
>>>>>>> cccf7f61dd263e4b1c464ed29cbe83456fbeb2c5
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
<<<<<<< HEAD
        chat: chatReducer,
        groups: groupReducer,
        message: messageReducer,


=======
        payroll: payrollReducer,
>>>>>>> cccf7f61dd263e4b1c464ed29cbe83456fbeb2c5
    },
    // This will print every dispatched action and the state changes in the browser's console
    // middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger), // 
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
})

export default store;