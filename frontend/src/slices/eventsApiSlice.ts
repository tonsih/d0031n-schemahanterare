import { EVENTS_URL, EVENT_URL } from '../../constants/pathsCanvas';
import { apiSlice } from './apiSlice';

export const eventsApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getEvents: builder.query({
            query: ({
                authtoken,
                contextCode,
            }: {
                authtoken: string;
                contextCode: string;
            }) => ({
                method: 'GET',
                url: `${EVENTS_URL}${contextCode}`,
                headers: authtoken
                    ? { Authorization: `Bearer ${authtoken}` }
                    : {},
            }),
            providesTags: ['Events'],
        }),
        getEvent: builder.query({
            query: ({
                eventId,
                authtoken,
            }: {
                eventId: string;
                authtoken: string;
            }) => ({
                method: 'GET',
                url: `${EVENT_URL}/${eventId}`,
                headers: authtoken
                    ? { Authorization: `Bearer ${authtoken}` }
                    : {},
            }),
            invalidatesTags: ['Events'],
        }),
        addEvent: builder.mutation({
            query: ({ eventData, authtoken, contextCode }) => {
                const formData = new FormData();
                formData.append(`calendar_event[context_code]`, contextCode);
                Object.keys(eventData).forEach(key => {
                    formData.append(`calendar_event[${key}]`, eventData[key]);
                });

                return {
                    method: 'POST',
                    url: `${EVENT_URL}.json`,
                    body: formData,
                    headers: authtoken
                        ? { Authorization: `Bearer ${authtoken}` }
                        : {},
                };
            },
            invalidatesTags: ['Events'],
        }),
        removeEvent: builder.mutation({
            query: ({
                eventId,
                authtoken,
            }: {
                eventId: string;
                authtoken: string;
            }) => {
                return {
                    method: 'DELETE',
                    url: `${EVENT_URL}/${eventId}`,
                    headers: authtoken
                        ? { Authorization: `Bearer ${authtoken}` }
                        : {},
                };
            },
            invalidatesTags: ['Events'],
        }),
        removeAllEvents: builder.mutation({
            queryFn: async (
                {
                    authtoken,
                    contextCode,
                }: { authtoken: string; contextCode: string },
                { dispatch }
            ) => {
                try {
                    const response = await dispatch(
                        apiSlice.endpoints.getEvents.initiate({
                            authtoken,
                            contextCode,
                        })
                    ).unwrap();

                    const eventIds = response.map(event => event.id);

                    for (const eventId of eventIds) {
                        await dispatch(
                            apiSlice.endpoints.removeEvent.initiate({
                                eventId,
                                authtoken,
                            })
                        ).unwrap();
                    }

                    return { data: 'All events removed' };
                } catch (error) {
                    return { error: error };
                }
            },
            invalidatesTags: ['Events'],
        }),
    }),
});

export const {
    useGetEventsQuery,
    useGetEventQuery,
    useAddEventMutation,
    useRemoveEventMutation,
    useRemoveAllEventsMutation,
} = eventsApiSlice;
