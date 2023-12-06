import { ViewApi } from '@fullcalendar/core/index.js';
import { EventImpl } from '@fullcalendar/core/internal';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import momentTimezonePlugin from '@fullcalendar/moment-timezone';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import { Dispatch } from '@reduxjs/toolkit';
import moment from 'moment-timezone';
import { useEffect, useRef, useState } from 'react';
import { Button, Col, Container, Row } from 'react-bootstrap';
import {
    FaCheckCircle,
    FaEdit,
    FaPaperPlane,
    FaTimesCircle,
} from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';
import { CalendarEvent } from '../interfaces/event';
import { Reservation } from '../interfaces/reservation';
import { RootState } from '../interfaces/rootState';
import { useAddEventMutation } from '../slices/eventsApiSlice';
import {
    removeReservation,
    setReservationsForRegistration,
} from '../slices/reservationsSlice';
import ConfirmationModal from './ConfirmationModal';
import ReservationInfoModal from './ReservationInfoModal';
import { toast } from 'react-toastify';
moment.tz.setDefault('Europe/Stockholm');

const LadokCalendar: React.FC = () => {
    const calendarRef = useRef<FullCalendar>(null);

    const dispatch: Dispatch = useDispatch();

    const courseSchedule = useSelector(
        (state: RootState) => state.course.fetchedCourseData
    );
    const kurskod = useSelector(
        (state: RootState) => state.course.selectedCourseData?.kurskod
    );
    const reservationsToRegister = useSelector(
        (state: RootState) => state.reservations.reservationsToRegister
    );
    const authtoken = useSelector(
        (state: RootState) => state.authtoken.authtoken
    );
    const user = useSelector((state: RootState) => state.user.user);

    const [addEvent] = useAddEventMutation();

    const [reservationModalOpen, setReservationModalOpen] =
        useState<boolean>(false);
    const [sendConfirmationModalOpen, setSendConfirmationModalOpen] =
        useState<boolean>(false);
    const [eventData, setEventData] = useState<CalendarEvent | null>(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [startDate, setStartDate] = useState<string>(
        new Date().toISOString()
    );
    const [sendIsLoading, setSendIsLoading] = useState<boolean>(false);
    const [prevReservations, setPrevReservations] = useState<
        Reservation[] | null
    >(null);

    const previousKurskodRef = useRef<string | undefined>();

    const businessHours = [
        {
            daysOfWeek: [1, 2, 3, 4, 5],
            startTime: '08:15',
            endTime: '09:45',
        },
        {
            daysOfWeek: [1, 2, 3, 4, 5],
            startTime: '10:15',
            endTime: '11:45',
        },
        {
            daysOfWeek: [1, 2, 3, 4, 5],
            startTime: '13:00',
            endTime: '14:30',
        },
        {
            daysOfWeek: [1, 2, 3, 4, 5],
            startTime: '14:45',
            endTime: '16:15',
        },
        {
            daysOfWeek: [1, 2, 3, 4, 5],
            startTime: '16:30',
            endTime: '18:00',
        },
    ];

    const findTimeWindow = (startTime: Date | string) => {
        const formattedStartTime = moment(startTime).format('HH:mm');
        const dayOfWeek = moment(startTime).day();

        return businessHours.find(
            ({ daysOfWeek, startTime: bhStartTime, endTime: bhEndTime }) => {
                const format = 'HH:mm';
                const startMoment = moment(bhStartTime, format);
                const endMoment = moment(bhEndTime, format);

                return (
                    daysOfWeek.includes(dayOfWeek) &&
                    formattedStartTime >= startMoment.format(format) &&
                    formattedStartTime <= endMoment.format(format)
                );
            }
        );
    };

    interface timeWindowObj {
        daysOfWeek: number[];
        endTime: string;
        startTime: string;
    }

    const adjustReservationTimeToWindow = (
        timeWindowObj: timeWindowObj,
        event: EventImpl
    ) => {
        const { startTime, endTime } = timeWindowObj;
        const { start, end, _def, setDates } = event;

        if (start && end) {
            const newStart = updateDate(start, startTime);
            const newEnd = updateDate(end, endTime);

            setDates(newStart, newEnd);

            const { publicId } = _def;

            const updatedReservations = reservationsToRegister.map(
                (reservation: Reservation) => {
                    if (reservation.tempId === publicId) {
                        return {
                            ...reservation,
                            startdate: moment(newStart).format('YYYY-MM-DD'),
                            starttime: moment(newStart).format('HH:mm'),
                            enddate: moment(newEnd).format('YYYY-MM-DD'),
                            endtime: moment(newEnd).format('HH:mm'),
                        };
                    }
                    return reservation;
                }
            );

            dispatch(setReservationsForRegistration(updatedReservations));
        }
    };

    const updateDate = (originalDate: string | Date, newTime: string) => {
        const [hours, minutes] = newTime.split(':').map(Number);
        const newDate = new Date(originalDate);
        newDate.setHours(hours, minutes, 0, 0);
        return newDate;
    };

    const handleEventDrop = ({ event }: { event: EventImpl }) => {
        if (event) {
            const { start } = event;
            if (start) {
                const timeWindow = findTimeWindow(start);
                if (timeWindow) {
                    adjustReservationTimeToWindow(timeWindow, event);
                }
            }
        }
    };

    const generateReservationTitle = (type: string, location: string) => {
        const titleParts = [type, location];
        const titleString = titleParts.filter(Boolean).join(' - ');
        return titleString;
    };

    const events = (reservationsToRegister: Reservation[]) =>
        reservationsToRegister.map((reservation: Reservation) => {
            const {
                tempId,
                startdate,
                starttime,
                enddate,
                endtime,
                columns,
                description,
            } = reservation;

            const start = moment(`${startdate} ${starttime}`)
                .tz('Europe/Stockholm')
                .format('YYYY-MM-DD HH:mm');
            const end = moment(`${enddate} ${endtime}`)
                .tz('Europe/Stockholm')
                .format('YYYY-MM-DD HH:mm');

            return {
                id: tempId,
                title: columns[1],
                start,
                end,
                extendedProps: {
                    type: columns[1],
                    location: columns[2],
                    teachers: columns[3].split(', '),
                    place: columns[9],
                    description,
                    start,
                    end,
                },
            };
        });

    const renderEventContent = ({ event }: { event: EventImpl }) => {
        const { extendedProps } = event;
        const { type, teachers, location, place, start, end } = extendedProps;

        const startTime: string = moment(start).format('HH:mm');
        const endTime: string = moment(end).format('HH:mm');

        return (
            <div>
                <span className='event-type'>
                    <strong>{type}</strong>
                </span>
                <br />
                <span>
                    kl. {startTime} - {endTime}
                </span>
                <br />
                {location && (
                    <>
                        <span>({location})</span>
                        <br />
                    </>
                )}
                {teachers && (
                    <>
                        <span>{teachers.join(', ')}</span>
                        <br />
                    </>
                )}
                {place && (
                    <>
                        <span>{place}</span>
                    </>
                )}
            </div>
        );
    };

    const handleEventClick = ({
        event: calendarEvent,
    }: {
        event: EventImpl;
    }) => {
        const { publicId } = calendarEvent._def;
        const { type, location, teachers, description, start, end } =
            calendarEvent._def.extendedProps;

        setEventData({
            publicId,
            type,
            location,
            teachers,
            start,
            end,
            title: generateReservationTitle(type, location),
            description,
        });
        setReservationModalOpen(true);
    };

    const handleDateSelect = ({
        view,
        start,
        end,
    }: {
        view: ViewApi;
        start: Date;
        end: Date;
    }) => {
        const calendarApi = view.calendar;
        calendarApi.unselect();

        const tempId = String(reservationsToRegister.length);

        setEventData({ publicId: tempId, title: 'Ny reservation', start, end });
        setReservationModalOpen(true);
    };

    const saveEventChanges = ({
        type,
        teachers,
        location,
        description,
    }: CalendarEvent) => {
        if (eventData) {
            const { start, end, publicId: tempId } = eventData;

            if (start) {
                const timeWindow = findTimeWindow(start);

                if (timeWindow) {
                    const { startTime, endTime } = timeWindow;

                    let teachersValue = '';
                    if (Array.isArray(teachers)) {
                        console.log(teachers);
                        teachersValue = teachers.join(', ');
                    } else if (typeof teachers === 'string') {
                        teachersValue = teachers;
                    }

                    const reservation = {
                        columns: [
                            '',
                            type || '',
                            location || '',
                            teachersValue,
                            '',
                            '',
                            '',
                            '',
                            '',
                            '',
                            '',
                        ],
                        startdate: moment(start).format('YYYY-MM-DD'),
                        starttime: startTime,
                        enddate: moment(end).format('YYYY-MM-DD'),
                        endtime: endTime,
                        tempId,
                        description,
                    };

                    const updatedReservations = reservationsToRegister.filter(
                        (reservation: Reservation) =>
                            reservation.tempId !== tempId
                    );

                    dispatch(removeReservation(tempId));

                    dispatch(
                        setReservationsForRegistration([
                            ...updatedReservations,
                            reservation,
                        ])
                    );
                }
            }
        }

        setReservationModalOpen(false);
    };

    const handleReservationModalClose = () => {
        setReservationModalOpen(false);
        setEventData(null);
    };

    const handleSendConfirmation = () => {
        setSendConfirmationModalOpen(true);
    };

    const handleSendConfirmationModalClose = () => {
        setSendConfirmationModalOpen(false);
    };

    const handleSendToCanvas = async () => {
        if (authtoken && !isEditMode) {
            const dateTimeToISOString = (date: string, time: string) =>
                moment(`${date} ${time}`, 'YYYY-MM-DD HH:mm').toISOString();

            if (reservationsToRegister) {
                const sendReservationsToCanvas = () => {
                    const promises = reservationsToRegister.map(
                        async reservation => {
                            try {
                                const {
                                    startdate,
                                    starttime,
                                    enddate,
                                    endtime,
                                    columns,
                                    description,
                                } = reservation;

                                return await addEvent({
                                    eventData: {
                                        start_at: dateTimeToISOString(
                                            startdate,
                                            starttime
                                        ),
                                        end_at: dateTimeToISOString(
                                            enddate,
                                            endtime
                                        ),
                                        description: description || '',
                                        title: columns[1],
                                        location_name: columns[2] || '',
                                    },
                                    authtoken,
                                    contextCode: `user_${user.id}`,
                                }).unwrap();
                            } catch (error) {
                                console.log(error);
                            }
                        }
                    );

                    return Promise.all(promises);
                };

                setSendIsLoading(true);
                await toast.promise(sendReservationsToCanvas(), {
                    pending: 'Bearbetar schemaregistrering...',
                    success: 'Schemat är nu framgångsrikt registrerat!',
                    error: 'Ett fel uppstod under registreringen av schemat',
                });
                setSendIsLoading(false);
                setSendConfirmationModalOpen(false);
            }
        }
    };

    const handleDelete = () => {
        const isConfirmed = window.confirm('Är du säker?');

        if (isConfirmed && eventData) {
            dispatch(removeReservation(eventData.publicId));

            setReservationModalOpen(false);
            setEventData(null);
        }
    };

    const handleCancelEdit = () => {
        setIsEditMode(false);
        dispatch(setReservationsForRegistration(prevReservations));
    };

    const handleEnterEditMode = () => {
        setPrevReservations(reservationsToRegister);
        setIsEditMode(true);
    };

    const findEarliestReservationIndex = () => {
        const parseStartDateTime = ({
            startdate,
            starttime,
        }: {
            startdate: Date | string;
            starttime: Date | string;
        }) => moment(`${startdate} ${starttime}`, 'YYYY-MM-DD HH:mm');

        if (reservationsToRegister && reservationsToRegister.length > 0) {
            let earliestReservationIndex = 0;
            let earliestDateTime = parseStartDateTime(
                reservationsToRegister[earliestReservationIndex]
            );

            reservationsToRegister.forEach(
                (reservation: Reservation, index: number) => {
                    const reservationDateTime = parseStartDateTime(reservation);
                    if (reservationDateTime.isBefore(earliestDateTime)) {
                        earliestReservationIndex = index;
                        earliestDateTime = reservationDateTime;
                    }
                }
            );

            return earliestReservationIndex;
        }
    };

    useEffect(() => {
        console.log('kurskod');
        console.log(kurskod);
        console.log('previousKurskodRef.current');
        console.log(previousKurskodRef.current);
        console.log(kurskod !== previousKurskodRef.current);
        if (
            kurskod !== previousKurskodRef.current &&
            reservationsToRegister &&
            courseSchedule &&
            calendarRef?.current
        ) {
            if (reservationsToRegister.length > 0) {
                const earliestReservationIndex = findEarliestReservationIndex();
                if (
                    earliestReservationIndex === 0 ||
                    earliestReservationIndex != null
                ) {
                    setStartDate(
                        reservationsToRegister[earliestReservationIndex]
                            .startdate
                    );
                }
            } else {
                setStartDate(new Date().toISOString());
            }
            previousKurskodRef.current = kurskod;
        }
    }, [reservationsToRegister]);

    useEffect(() => {
        if (startDate && calendarRef?.current) {
            const calendarApi = calendarRef.current.getApi();
            calendarApi.gotoDate(startDate);
        }
    }, [startDate]);

    return (
        <Container className='mt-3 justify-content-center'>
            {reservationsToRegister && (
                <>
                    <Row>
                        <Col className='d-flex btn-col justify-content-center mt-2'>
                            <Button
                                className={`${
                                    isEditMode
                                        ? 'edit-mode-btn'
                                        : 'non-edit-mode-btn'
                                } d-flex align-items-center space-between edit-btn outlined`}
                                onClick={
                                    isEditMode
                                        ? () => handleCancelEdit()
                                        : () => handleEnterEditMode()
                                }
                                variant={isEditMode ? 'danger' : `dark`}
                                disabled={!user?.id}
                            >
                                <div className='icon d-flex'>
                                    {isEditMode ? (
                                        <FaTimesCircle />
                                    ) : (
                                        <FaEdit />
                                    )}
                                </div>
                                <div className='btn-text'>
                                    {isEditMode ? 'Avbryt' : 'Modifiera'}
                                </div>
                            </Button>
                            <Button
                                className={`d-flex send-btn align-items-center space-between ${
                                    isEditMode
                                        ? 'edit-mode-btn'
                                        : 'non-edit-mode-btn'
                                }`}
                                variant={isEditMode ? 'success' : 'primary'}
                                onClick={
                                    isEditMode
                                        ? () => setIsEditMode(false)
                                        : handleSendConfirmation
                                }
                                disabled={!user?.id}
                            >
                                <div className='icon d-flex'>
                                    {isEditMode ? (
                                        <FaCheckCircle />
                                    ) : (
                                        <FaPaperPlane />
                                    )}
                                </div>
                                <div className='btn-text'>
                                    {!isEditMode
                                        ? `Skicka till Canvas`
                                        : 'Klart'}
                                </div>
                            </Button>
                        </Col>
                    </Row>
                    <Row
                        className={`mb-5 ${isEditMode ? '' : 'non-edit-mode'}`}
                    >
                        <FullCalendar
                            weekends={false}
                            plugins={[
                                interactionPlugin,
                                timeGridPlugin,
                                dayGridPlugin,
                                momentTimezonePlugin,
                            ]}
                            headerToolbar={{
                                left: 'title',
                                right: 'dayGridMonth,timeGridWeek,dayGridDay today prev,next',
                            }}
                            businessHours={businessHours}
                            initialView='timeGridWeek'
                            timeZone='Europe/Stockholm'
                            initialDate={startDate}
                            slotMinTime='08:00'
                            slotMaxTime='18:30'
                            height={'auto'}
                            slotDuration={'00:15:00'}
                            allDaySlot={false}
                            locale={'sv'}
                            buttonText={{
                                today: 'idag',
                                day: 'dag',
                                week: 'vecka',
                                month: 'månad',
                            }}
                            slotLabelFormat={{
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: false,
                            }}
                            eventTimeFormat={{
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: false,
                            }}
                            events={events(reservationsToRegister)}
                            eventContent={renderEventContent}
                            ref={calendarRef}
                            eventDidMount={info => {
                                if (!info.isMirror) {
                                    tippy(info.el, {
                                        content: info.event.title,
                                        interactive: true,
                                        appendTo: document.body,
                                    });
                                }
                            }}
                            eventConstraint={businessHours}
                            selectable={isEditMode}
                            selectMirror={isEditMode}
                            eventStartEditable={isEditMode}
                            eventDurationEditable
                            selectConstraint={businessHours}
                            select={isEditMode ? handleDateSelect : undefined}
                            eventClick={
                                isEditMode ? handleEventClick : undefined
                            }
                            eventDrop={isEditMode ? handleEventDrop : undefined}
                        />
                        {reservationModalOpen && eventData && (
                            <ReservationInfoModal
                                eventData={eventData}
                                show={reservationModalOpen}
                                handleSave={saveEventChanges}
                                handleClose={handleReservationModalClose}
                                handleDelete={handleDelete}
                            />
                        )}
                        {sendConfirmationModalOpen && (
                            <ConfirmationModal
                                show={sendConfirmationModalOpen}
                                handleSave={handleSendToCanvas}
                                handleClose={handleSendConfirmationModalClose}
                                confirmationHeading={'Skicka till Canvas'}
                                confirmationBodyText={'Är du säker?'}
                                centered
                                loading={sendIsLoading}
                            />
                        )}
                    </Row>
                </>
            )}
        </Container>
    );
};

export default LadokCalendar;
