import { Spinner } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

interface ConfirmationModalProps {
    show: boolean;
    handleSave: () => void;
    handleClose: () => void;
    confirmationHeading?: string;
    confirmationBodyText: string;
    centered: boolean;
    loading?: boolean;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    show,
    handleSave,
    handleClose,
    confirmationHeading,
    confirmationBodyText,
    centered,
    loading,
}) => {
    return (
        <>
            <Modal show={show} onHide={handleClose} centered={centered}>
                <Modal.Header closeButton>
                    <Modal.Title>{confirmationHeading}</Modal.Title>
                </Modal.Header>
                <Modal.Body>{confirmationBodyText}</Modal.Body>
                <Modal.Footer>
                    <Button variant='secondary' onClick={handleClose}>
                        Avbryt
                    </Button>
                    <Button variant='primary' onClick={handleSave}>
                        {loading ? (
                            <Spinner
                                animation='border'
                                role='status'
                                className='btn-spinner'
                            />
                        ) : (
                            `OK`
                        )}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default ConfirmationModal;
