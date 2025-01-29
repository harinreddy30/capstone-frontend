import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../redux/slices/authSlice';
import leaveReducer from '../redux/slices/leaveSlice';
import usersReducer from '../redux/slices/userSlice';
import sitesReducer from '../redux/slices/siteSlice';
import shiftsReducer from "../redux/slices/shiftSlice";

// import logger from 'redux-logger';


const store = configureStore({
    reducer: {
        auth: authReducer,
        leave: leaveReducer, // Add the leave slice here
        users: usersReducer,
        sites: sitesReducer,
        shifts: shiftsReducer,

    },
    // This will print every dispatched action and the state changes in the browser's console
    // middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger), // 

})

export default store;