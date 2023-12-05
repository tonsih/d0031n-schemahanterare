import { Button, Spinner } from 'react-bootstrap';
import { FaCalendar } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { useRemoveAllEventsMutation } from '../slices/eventsApiSlice';
import { RootState } from '../interfaces/rootState';

const RemoveAllCanvasEventsButton: React.FC = () => {
    const authtoken = useSelector(
        (state: RootState) => state.authtoken?.authtoken
    );
    const userId = useSelector((state: RootState) => state.user?.user?.id);
    const [removeAllEvents, { isLoading }] = useRemoveAllEventsMutation();

    const handleClick = () => {
        if (authtoken && userId) {
            removeAllEvents({
                authtoken,
                contextCode: `user_${userId}`,
            });
        }
    };

    return (
        <Button
            className='d-flex justify-content-center align-items-center remove-all-canvas-events-btn'
            onClick={handleClick}
            disabled={!authtoken || !userId}
        >
            {!isLoading && (
                <div className='btn-icon d-flex align-items-center'>
                    <FaCalendar />
                </div>
            )}
            <div className='btn-text'>
                {isLoading ? (
                    `Remove all Canvas events`
                ) : (
                    <Spinner
                        animation='border'
                        role='status'
                        className='btn-spinner'
                    />
                )}
            </div>
        </Button>
    );
};

export default RemoveAllCanvasEventsButton;
