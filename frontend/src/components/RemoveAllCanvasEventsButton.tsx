import { Button, Spinner } from 'react-bootstrap';
import { FaCalendar } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { useRemoveAllEventsMutation } from '../slices/eventsApiSlice';
import { RootState } from '../interfaces/rootState';
import { toast } from 'react-toastify';

const RemoveAllCanvasEventsButton: React.FC = () => {
    const authtoken = useSelector(
        (state: RootState) => state.authtoken?.authtoken
    );
    const userId = useSelector((state: RootState) => state.user?.user?.id);
    const [removeAllEvents, { isLoading }] = useRemoveAllEventsMutation();

    const handleClick = async () => {
        const removeAllEventsFunc = async () => {
            if (authtoken && userId) {
                try {
                    return await removeAllEvents({
                        authtoken,
                        contextCode: `user_${userId}`,
                    });
                } catch (error) {
                    console.log(error);
                }
            }
        };

        await toast.promise(removeAllEventsFunc(), {
            pending: 'Rensning av Canvas kalendern pågår...',
            success: 'Canvas kalendern har rensats!',
            error: 'Ett fel uppstått',
        });
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
                {!isLoading ? (
                    `Rensa Canvas kalendern`
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
