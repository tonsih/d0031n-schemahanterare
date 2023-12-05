import { createSlice } from '@reduxjs/toolkit';
import { Reservation } from '../interfaces/reservation';

export const reservationsSlice = createSlice({
    name: 'reservations',
    initialState: {
        reservationsToRegister: null,
    },
    reducers: {
        setReservationsForRegistration: (state, action) => {
            state.reservationsToRegister = action.payload;
        },
        removeReservation: (state, action) => {
            state.reservationsToRegister = state.reservationsToRegister.filter(
                (reservation: Reservation) =>
                    reservation.tempId !== action.payload
            );
        },
    },
});

export const { setReservationsForRegistration, removeReservation } =
    reservationsSlice.actions;
export default reservationsSlice.reducer;
