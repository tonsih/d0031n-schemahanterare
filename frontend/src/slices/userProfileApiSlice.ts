import { USER_PROFILE_URL } from '../../constants/pathsCanvas';
import { apiSlice } from './apiSlice';

export const userProfileApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getUserProfile: builder.query({
            query: authtoken => ({
                method: 'GET',
                url: USER_PROFILE_URL,
                headers: authtoken
                    ? { Authorization: `Bearer ${authtoken}` }
                    : {},
            }),
        }),
    }),
});

export const { useGetUserProfileQuery } = userProfileApiSlice;
