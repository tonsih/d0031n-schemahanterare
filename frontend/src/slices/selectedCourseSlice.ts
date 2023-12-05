import { createSlice } from '@reduxjs/toolkit';
import { coursesApiSlice } from './coursesApiSlice';

export const selectedCourseSlice = createSlice({
    name: 'selectedCourse',
    initialState: {
        selectedCourseData: null,
        fetchedCourseData: null,
    },
    reducers: {
        setSelectedCourse: (state, action) => {
            state.selectedCourseData = action.payload;
        },
    },
    extraReducers: builder => {
        builder.addMatcher(
            coursesApiSlice.endpoints.getCourseSchedule.matchFulfilled,
            (state, action) => {
                state.fetchedCourseData = action.payload;
            }
        );
    },
});

export const { setSelectedCourse } = selectedCourseSlice.actions;
export default selectedCourseSlice.reducer;
