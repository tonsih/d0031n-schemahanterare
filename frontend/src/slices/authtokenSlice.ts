import { createSlice } from '@reduxjs/toolkit';

export const authtokenSlice = createSlice({
    name: 'authtoken',
    initialState: {
        authtoken: null,
    },
    reducers: {
        setAuthtoken: (state, action) => {
            state.authtoken = action.payload;
        },
    },
});

export const { setAuthtoken } = authtokenSlice.actions;
export default authtokenSlice.reducer;
