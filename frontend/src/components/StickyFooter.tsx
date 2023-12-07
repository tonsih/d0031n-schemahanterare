import { useState } from 'react';
import { Container, Navbar, Nav } from 'react-bootstrap';
import RemoveAllCanvasEventsButton from './RemoveAllCanvasEventsButton';

const StickyFooter: React.FC = () => {
    const [isExpanded, setIsExpanded] = useState(false);

    const footerStyle = {
        height: isExpanded ? '120px' : '50px',
        transition: 'height 0.3s',
    };

    return (
        <Navbar
            fixed='bottom'
            className='footer'
            style={footerStyle}
            onMouseOver={() => setIsExpanded(true)}
            onMouseLeave={() => setIsExpanded(false)}
        >
            <Container
                fluid
                className='d-flex flex-column justify-content-start align-items-start h-100'
            >
                <Navbar.Brand>Utvecklarmeny</Navbar.Brand>
                <Nav className='d-flex flex-column mt-2 footer-menu-list'>
                    <Nav.Item>
                        <RemoveAllCanvasEventsButton />
                    </Nav.Item>
                </Nav>
            </Container>
        </Navbar>
    );
};

export default StickyFooter;
