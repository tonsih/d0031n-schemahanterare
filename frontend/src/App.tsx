import { Col, Container, Row } from 'react-bootstrap';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './assets/scss/main.scss';
import CoursesValueList from './components/CoursesValueList';
import Calendar from './components/Calendar';
import SelectCoursesTextContainer from './components/SelectCoursesTextContainer';
import StickyFooter from './components/StickyFooter';
import TokenField from './components/TokenField';

const App = () => {
    return (
        <>
            <ToastContainer
                pauseOnFocusLoss={false}
                position='bottom-right'
                autoClose={1500}
            />
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
                        <Calendar />
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
