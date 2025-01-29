import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../redux/slices/authSlice';
import leaveReducer from '../redux/slices/leaveSlice';
import availabilityReducer from '../redux/slices/availabilitySlice';

// import logger from 'redux-logger';


const store = configureStore({
    reducer: {
        auth: authReducer,
        leave: leaveReducer, // Add the leave slice here
        availability: availabilityReducer,

    },
    // This will print every dispatched action and the state changes in the browser's console
    // middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger), // 

})

export default store;