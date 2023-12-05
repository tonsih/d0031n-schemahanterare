import { Reservation } from './reservation';

interface Course {
    selectedCourseData: {
        id: number;
        apiUrl: string;
        kurskod: string;
        namn: string;
        signatur?: string;
        specBenamning?: string;
        kommentar?: string;
    };
    fetchedCourseData: {
        reservations: Reservation[];
    };
    courseSchedule: {
        columnheaders: string[];
        info?: {
            reservationlimit?: number;
            reservationcount?: number;
        };
        reservations?: Reservation[];
    };
}

export type { Course };
