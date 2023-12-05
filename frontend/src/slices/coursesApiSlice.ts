import { COURSES_URL } from '../../constants/pathsTimeEditLocal';
import { Course } from '../interfaces/course';
import { apiSlice } from './apiSlice';

export const coursesApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getCourses: builder.query<Course['selectedCourseData'][], void>({
            query: () => ({
                method: 'GET',
                url: COURSES_URL,
            }),
        }),
        getCourseSchedule: builder.query<Course['courseSchedule'], string>({
            query: apiUrl => ({
                method: 'GET',
                url: apiUrl,
            }),
        }),
    }),
});

export const { useGetCoursesQuery, useGetCourseScheduleQuery } =
    coursesApiSlice;
