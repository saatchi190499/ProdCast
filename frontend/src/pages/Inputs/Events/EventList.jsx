import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Spinner } from 'react-bootstrap';
import { getEvents, createEvent, deleteEvent } from '../../../services/api';
import { useNavigate } from 'react-router-dom';

const EventList = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [newEvent, setNewEvent] = useState({ name: '', comment: '', copyFrom: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const data = await getEvents();
                setEvents(data);
            } catch (error) {
                console.error('Failed to fetch events:', error);
                setError('Failed to load events. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    const handleRegister = async () => {
        if (!newEvent.name.trim()) {
            alert('Event name is required.');
            return;
        }
        try {
            const response = await createEvent(newEvent);
            setShowModal(false);
            const data = await getEvents();
            setEvents(data);
            navigate(`/event-set/${response.id}`); // Open the new EventSet page
        } catch (error) {
            console.error('Failed to create event:', error);
            alert('Failed to register event. Please try again later.');
        }
    };

    const handleEdit = (id, subDataSourceName) => {
        navigate(`/event-set/${id}`, { state: { subDataSourceName } }); // Navigate to the EventSet page
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this event?')) {
            return;
        }
        try {
            await deleteEvent(id);
            setEvents(events.filter((event) => event.id !== id)); // Remove the deleted event from the list
            alert('Event deleted successfully.');
        } catch (error) {
            console.error('Failed to delete event:', error);
            alert('Failed to delete event. Please try again later.');
        }
    };

    if (loading) {
        return (
            <div className="text-center mt-5">
                <Spinner animation="border" />
                <p>Loading events...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center mt-5">
                <p className="text-danger">{error}</p>
            </div>
        );
    }

    return (
        <div className="container mt-5">
            <h1 className="text-center">Event List</h1>
            <Button variant="primary" onClick={() => setShowModal(true)} className="mb-3">
                Register New Event
            </Button>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Created Date</th>
                        <th>Modified Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {events.map((event) => (
                        <tr key={event.id}>
                            <td>{event.id}</td>
                            <td>{event.sub_data_source_name}</td>
                            <td>{event.created_date}</td>
                            <td>{event.modified_date}</td>
                            <td>
                                <Button
                                    variant="warning"
                                    size="sm"
                                    className="me-2"
                                    onClick={() => handleEdit(event.id, event.sub_data_source_name)}
                                >
                                    Edit
                                </Button>
                                <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={() => handleDelete(event.id)}
                                >
                                    Delete
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Register New Event</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Event Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter event name"
                                value={newEvent.name}
                                onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Copy From</Form.Label>
                            <Form.Control
                                as="select"
                                value={newEvent.copyFrom}
                                onChange={(e) => setNewEvent({ ...newEvent, copyFrom: e.target.value })}
                            >
                                <option value="">None</option>
                                {events.map((event) => (
                                    <option key={event.id} value={event.id}>
                                        {event.sub_data_source_name}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Comment</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder="Enter comment"
                                value={newEvent.comment}
                                onChange={(e) => setNewEvent({ ...newEvent, comment: e.target.value })}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleRegister}>
                        Register
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default EventList;
