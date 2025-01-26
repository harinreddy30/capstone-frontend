import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../redux/slices/authSlice';
import logger from 'redux-logger';


const store = configureStore({
    reducer: {
        auth: authReducer
    },
    // This will print every dispatched action and the state changes in the browser's console
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger), // 

})

export default store;