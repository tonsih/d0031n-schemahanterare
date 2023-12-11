import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from './slices/apiSlice';
import authtokenReducer from './slices/authtokenSlice';
import reservationsReducer from './slices/reservationsSlice';
import selectedCourseReducer from './slices/selectedCourseSlice';
import userReducer from './slices/userSlice';

const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        course: selectedCourseReducer,
        authtoken: authtokenReducer,
        reservations: reservationsReducer,
        user: userReducer,
    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware().concat(apiSlice.middleware),
    devTools: true,
});

export default store;
