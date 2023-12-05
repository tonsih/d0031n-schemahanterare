import CoursesValueList from './components/CoursesValueList';
import LadokCalendar from './components/LadokCalendar';
import './assets/scss/main.scss';
import TokenField from './components/TokenField';
import { Col, Container, Row } from 'react-bootstrap';
import SelectCoursesTextContainer from './components/SelectCoursesTextContainer';
import StickyFooter from './components/StickyFooter';

const App = () => {
    return (
        <>
            <Container fluid className='g-0'>
                <Row className='g-0'>
                    <Col>
                        <CoursesValueList />
                    </Col>
                </Row>
                <Row className='g-0'>
                    <Col>
                        <TokenField />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <LadokCalendar />
                    </Col>
                </Row>
                <Row>
                    <Col className='d-flex align-items-center justify-content-center'>
                        <SelectCoursesTextContainer />
                    </Col>
                </Row>
                {import.meta.env.DEV && (
                    <Row>
                        <Col>
                            <StickyFooter />
                        </Col>
                    </Row>
                )}
            </Container>
        </>
    );
};

export default App;
