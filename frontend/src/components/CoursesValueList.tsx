import { Dispatch } from '@reduxjs/toolkit';
import { useCallback, useEffect, useRef } from 'react';
import { Container, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { SingleValue } from 'react-select';
import { Course } from '../interfaces/course';
import { Reservation } from '../interfaces/reservation';
import { RootState } from '../interfaces/rootState';
import { coursesApiSlice, useGetCoursesQuery } from '../slices/coursesApiSlice';
import { setReservationsForRegistration } from '../slices/reservationsSlice';
import { setSelectedCourse } from '../slices/selectedCourseSlice';
import LabeledSelect from './LabeledSelect';

const CourseValueList: React.FC = () => {
    const { data: courses } = useGetCoursesQuery();

    const dispatch: Dispatch<any> = useDispatch();
    const course = useSelector((state: RootState) => state.course);
    const courseSchedule = useSelector(
        (state: RootState) => state.course.fetchedCourseData
    );

    const selectRef = useRef<HTMLSelectElement>(null);

    const updateSelectedCourseData = useCallback(
        (newSelectedCourseData: SingleValue<Course['selectedCourseData']>) => {
            dispatch(setSelectedCourse(newSelectedCourseData));
        },
        [dispatch]
    );

    const handleChange = (
        newCourse: SingleValue<Course['selectedCourseData']>
    ) => {
        updateSelectedCourseData(newCourse);
        const { apiUrl } = newCourse as Course['selectedCourseData'];
        fetchCourseSchedule(apiUrl);
    };

    const getOptionLabel = (course: Course['selectedCourseData']) => {
        const { kurskod, namn, kommentar, signatur, specBenamning } = course;
        const courseParts = [kurskod, namn, kommentar, signatur, specBenamning];
        const courseString = courseParts.filter(Boolean).join(', ');
        return courseString;
    };

    const getOptionId = (course: Course['selectedCourseData']) =>
        course?.id?.toString();

    const fetchCourseSchedule = (apiUrl: string) => {
        dispatch(
            coursesApiSlice.endpoints.getCourseSchedule.initiate(apiUrl, {
                forceRefetch: true,
            })
        );
    };

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.ctrlKey && event.key === 'k') {
                event.preventDefault();
                selectRef.current ? selectRef.current.focus() : null;
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    useEffect(() => {
        if (courseSchedule) {
            if (courseSchedule?.reservations) {
                const reservations = courseSchedule.reservations.map(
                    (reservation: Reservation, index: number) => ({
                        ...reservation,
                        tempId: String(index),
                    })
                );

                dispatch(setReservationsForRegistration(reservations));
            }
        }
    }, [courseSchedule]);

    return (
        courses && (
            <Row>
                <Container fluid className='select-container'>
                    <LabeledSelect
                        innerRef={selectRef}
                        options={courses}
                        onChange={handleChange}
                        optionLabel={getOptionLabel}
                        optionValue={getOptionId}
                        value={course.selectedCourseData}
                        placeholder='Välj kurs...'
                        autoFocus
                    />
                    <span className='shortcut-text'>(CTRL + K)</span>
                </Container>
            </Row>
        )
    );
};

export default CourseValueList;
