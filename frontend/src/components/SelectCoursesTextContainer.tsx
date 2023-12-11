import { Container } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { RootState } from '../interfaces/rootState';
import React from 'react';

const SelectCoursesTextContainer: React.FC = React.memo(() => {
    const courseSchedule = useSelector(
        (state: RootState) => state.course.fetchedCourseData
    );

    return (
        !courseSchedule && (
            <Container
                className='d-flex justify-content-center align-items-center text-center'
                style={{ minHeight: '30vh' }}
            >
                <h2 id='select-course-text'>
                    Välj kurs från sökfältet ovan (CTRL + K)
                </h2>
            </Container>
        )
    );
});

export default SelectCoursesTextContainer;
