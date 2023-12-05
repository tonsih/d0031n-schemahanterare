import { CANVAS_PROXY_URL } from './proxyURLS';

const EVENTS_URL = `${CANVAS_PROXY_URL}/users/self/calendar_events?all_events=true&context_codes[]=`;
const EVENT_URL = `${CANVAS_PROXY_URL}/calendar_events`;

const USER_COURSES_URL = `${CANVAS_PROXY_URL}/courses`;

const USER_PROFILE_URL = `${CANVAS_PROXY_URL}/users/self/profile`;

export { EVENTS_URL, EVENT_URL, USER_COURSES_URL, USER_PROFILE_URL };
