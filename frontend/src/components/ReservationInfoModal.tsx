import { Field, Formik, FormikProps, useField } from 'formik';
import { MutableRefObject, useRef, useState } from 'react';
import { Form } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import * as Yup from 'yup';
import { CalendarEvent } from '../interfaces/event';

interface ReservationInfoModalProps {
    eventData: CalendarEvent;
    show: boolean;
    handleSave: ({
        type,
        teachers,
        location,
        description,
    }: CalendarEvent) => void;
    handleClose: () => void;
    handleDelete: () => void;
}

const ReservationInfoModal: React.FC<ReservationInfoModalProps> = ({
    eventData,
    show,
    handleSave,
    handleClose,
    handleDelete,
}) => {
    const formikRef = useRef<FormikProps<CalendarEvent> | null>(null);

    const { type, teachers, location, title, description } = eventData;

    const [isSubmitting, setSubmitting] = useState(false);

    const handleSubmit = () => {
        if (formikRef?.current) {
            formikRef.current.submitForm();
        }
    };

    const validationSchema = Yup.object().shape({
        type: Yup.string().required('Typ är en obligatorisk fält'),
    });

    const ErrorMessage = ({
        touched,
        error,
    }: {
        touched: boolean | undefined;
        error: string | undefined;
    }) => {
        if (touched && error) {
            return <div className='text-danger'>{error}</div>;
        }
        return null;
    };

    const DescriptionTextField = ({
        fieldName,
        rows,
        placeholder,
    }: {
        fieldName: string;
        rows: number | undefined;
        placeholder: string | undefined;
    }) => {
        const [field] = useField(fieldName);

        return (
            <Form.Control
                as='textarea'
                rows={rows}
                {...field}
                placeholder={placeholder}
            />
        );
    };

    const getTeachersInitialValue = () => {
        let teacherValue: string | string[] | undefined = undefined;
        if (Array.isArray(teachers)) {
            teacherValue = teachers.join(', ');
        } else if (typeof teachers === 'string') {
            teacherValue = teachers.split(',').map(s => s.trim());
        }

        return teacherValue;
    };

    return (
        <>
            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Formik
                        innerRef={formikRef}
                        initialValues={{
                            type: type || '',
                            teachers: getTeachersInitialValue() || '',
                            location: location || '',
                            description: description || '',
                        }}
                        validationSchema={validationSchema}
                        onSubmit={(values, { setSubmitting, resetForm }) => {
                            const { teachers } = values;

                            let teachersValue: string[] | string | undefined =
                                teachers;

                            if (!Array.isArray(teachersValue)) {
                                if (typeof teachersValue === 'string') {
                                    teachersValue = teachersValue.split(', ');
                                } else {
                                    teachersValue = [];
                                }
                            }

                            const updatedValues = {
                                ...values,
                                teachers: teachersValue,
                            };
                            handleSave(updatedValues);
                            setSubmitting(false);
                            resetForm();
                        }}
                    >
                        {({ errors, touched }) => (
                            <Form>
                                <Form.Group
                                    className='mb-3'
                                    controlId='reservationForm.controlForm1'
                                >
                                    <Form.Label>Typ*</Form.Label>
                                    <Field
                                        name='type'
                                        type='text'
                                        as={Form.Control}
                                        placeholder={
                                            type || 'Föreläsning, laboration...'
                                        }
                                    />
                                    <ErrorMessage
                                        touched={
                                            touched?.type
                                                ? touched.type
                                                : undefined
                                        }
                                        error={
                                            errors?.type
                                                ? errors.type
                                                : undefined
                                        }
                                    />
                                </Form.Group>
                                <Form.Group
                                    className='mb-3'
                                    controlId='reservationForm.controlForm2'
                                >
                                    <Form.Label>Lärare</Form.Label>
                                    <Field
                                        name='teachers'
                                        type='text'
                                        as={Form.Control}
                                        placeholder={
                                            teachers ||
                                            'Lars Larsson, Frida Svensson...'
                                        }
                                    />
                                </Form.Group>
                                <Form.Group
                                    className='mb-3'
                                    controlId='reservationForm.controlForm3'
                                >
                                    <Form.Label>Plats</Form.Label>
                                    <Field
                                        name='location'
                                        type='text'
                                        as={Form.Control}
                                        placeholder={location || 'Zoom, Rumnr'}
                                    />
                                </Form.Group>
                                <Form.Group
                                    className='mb-3'
                                    controlId='reservationForm.controlForm5'
                                >
                                    <Form.Label>Beskrivning</Form.Label>
                                    <DescriptionTextField
                                        fieldName={'description'}
                                        rows={3}
                                        placeholder={description || ''}
                                    />
                                </Form.Group>
                            </Form>
                        )}
                    </Formik>
                    <div className='pt-3'>* Obligatorisk</div>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant='danger'
                        onClick={handleDelete}
                        id='remove-reservation-button'
                    >
                        Ta bort
                    </Button>
                    <Button variant='secondary' onClick={handleClose}>
                        Stäng
                    </Button>
                    <Button
                        variant='primary'
                        disabled={isSubmitting}
                        onClick={handleSubmit}
                        type='submit'
                    >
                        Spara ändringar
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default ReservationInfoModal;
