import { Authtoken } from './authtoken';
import { Course } from './course';
import { Reservation } from './reservation';
import { User } from './user';

export interface RootState {
    course: Course;
    authtoken: Authtoken;
    reservations: {
        reservationsToRegister: Reservation[];
    };
    user: {
        user: User;
    };
}
