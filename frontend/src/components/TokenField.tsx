import { Field, Formik } from 'formik';
import React, { useCallback, useEffect, useState } from 'react';
import { Col, Container, Form, InputGroup, Row } from 'react-bootstrap';
import { FaEye, FaEyeSlash, FaKey } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import { RootState } from '../interfaces/rootState';
import { setAuthtoken } from '../slices/authtokenSlice';
import { useGetUserProfileQuery } from '../slices/userProfileApiSlice';
import { setUserData } from '../slices/userSlice';

const TokenField: React.FC = React.memo(() => {
    const [showAuthtoken, setShowAuthtoken] = useState(false);

    const dispatch = useDispatch();
    const reservationsToRegister = useSelector(
        (state: RootState) => state.reservations.reservationsToRegister
    );
    const authtoken = useSelector(
        (state: RootState) => state.authtoken.authtoken
    );
    const user = useSelector((state: RootState) => state.user.user);

    const { refetch: refetchUserProfileData } = useGetUserProfileQuery(
        authtoken,
        {
            skip: !authtoken,
        }
    );

    const ErrorMessage: React.FC<{ error: string | undefined }> = React.memo(
        ({ error }) => {
            if (error) {
                return <div className='text-danger'>{error}</div>;
            }
            return null;
        }
    );

    const SuccessMessage: React.FC<{ userId: number | string }> = React.memo(
        ({ userId }) => {
            return (
                <div className='text-success'>UserId: "{userId}" ansluten</div>
            );
        }
    );

    const ConnectionErrorMessage: React.FC = React.memo(() => {
        return (
            <div className='text-danger'>
                Det gick inte att upprätta en anslutning med den angivna
                auktoriseringskoden.
                <br /> Kontrollera koden och försök igen.
            </div>
        );
    });

    const validationSchema = Yup.object().shape({
        authtoken: Yup.string().required(
            'Ett Authorization Token behövs för att modifiera schemat'
        ),
    });

    const handleTokenChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const { value } = e.target;
            dispatch(setUserData(null));
            dispatch(setAuthtoken(value));
        },
        [dispatch]
    );

    useEffect(() => {
        const effect = async () => {
            if (authtoken) {
                const refetchedData = await refetchUserProfileData({
                    force: true,
                });
                if (
                    refetchedData &&
                    refetchedData?.data &&
                    refetchedData?.status === 'fulfilled'
                ) {
                    const { id } = refetchedData.data;
                    if (id) {
                        dispatch(setUserData({ ...user, id }));
                    }
                }
            }
        };

        effect();
    }, [authtoken, refetchUserProfileData]);

    return (
        <Container className='mt-3 w-50'>
            <Row className='pt-3'>
                <Col>
                    {reservationsToRegister && (
                        <Formik
                            onSubmit={() => {}}
                            initialValues={{
                                authtoken: '',
                            }}
                            validationSchema={validationSchema}
                            validateOnMount
                        >
                            {({ errors, handleChange }) => (
                                <Form>
                                    <Form.Group
                                        className='mb-3'
                                        controlId='reservationForm.controlForm1'
                                    >
                                        <InputGroup>
                                            <InputGroup.Text id='password-input'>
                                                <FaKey />
                                            </InputGroup.Text>
                                            <Field
                                                name='authtoken'
                                                type={
                                                    showAuthtoken
                                                        ? 'text'
                                                        : `password`
                                                }
                                                as={Form.Control}
                                                placeholder={
                                                    authtoken ||
                                                    'Authorization token'
                                                }
                                                onChange={(
                                                    e: React.ChangeEvent<HTMLInputElement>
                                                ) => {
                                                    handleChange(e);
                                                    handleTokenChange(e);
                                                }}
                                            />
                                            <InputGroup.Text
                                                onClick={() => {
                                                    setShowAuthtoken(
                                                        (
                                                            prevShowAuthtoken: boolean
                                                        ) => !prevShowAuthtoken
                                                    );
                                                }}
                                            >
                                                {showAuthtoken ? (
                                                    <FaEyeSlash />
                                                ) : (
                                                    <FaEye />
                                                )}
                                            </InputGroup.Text>
                                        </InputGroup>
                                        <ErrorMessage
                                            error={errors.authtoken}
                                        />
                                        {user && user.id ? (
                                            <SuccessMessage userId={user.id} />
                                        ) : (
                                            authtoken && (
                                                <ConnectionErrorMessage />
                                            )
                                        )}
                                    </Form.Group>
                                </Form>
                            )}
                        </Formik>
                    )}
                </Col>
            </Row>
        </Container>
    );
});

export default TokenField;
