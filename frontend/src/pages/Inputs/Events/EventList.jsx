import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import { getEvents, createEvent } from '../../../services/api';
import { useNavigate } from 'react-router-dom';

const EventList = () => {
    const [events, setEvents] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newEvent, setNewEvent] = useState({ name: '', comment: '', copyFrom: '' });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEvents = async () => {
            const data = await getEvents();
            setEvents(data);
        };
        fetchEvents();
    }, []);

    const handleRegister = async () => {
        try {
            const response = await createEvent(newEvent);
            setShowModal(false);
            const data = await getEvents();
            setEvents(data);
            navigate(`/event-set/${response.id}`); // Open the new EventSet page
        } catch (error) {
            console.error("Failed to create event:", error);
        }
    };

    const handleEdit = (id) => {
        navigate(`/event-set/${id}`); // Navigate to the EventSet page
    };

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
                        <th>Created At</th>
                        <th>Created By</th>
                        <th>Comment</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {events.map((event) => (
                        <tr key={event.id}>
                            <td>{event.id}</td>
                            <td>{event.name}</td>
                            <td>{event.created_at}</td>
                            <td>{event.created_by}</td>
                            <td>{event.comment}</td>
                            <td>
                                <Button
                                    variant="warning"
                                    size="sm"
                                    className="me-2"
                                    onClick={() => handleEdit(event.id)}
                                >
                                    Edit
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
                                        {event.name}
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