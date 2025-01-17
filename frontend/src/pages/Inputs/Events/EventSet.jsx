import React, { useState, useEffect } from 'react';
import { Table, Button, Form } from 'react-bootstrap';
import { getEventSet, updateEventSet } from '../../../services/api';
import { useParams } from 'react-router-dom';

const EventSet = () => {
    const { eventId } = useParams();
    const [eventSetData, setEventSetData] = useState([]);
    const [newRow, setNewRow] = useState({});

    useEffect(() => {
        const fetchEventSet = async () => {
            try {
                const data = await getEventSet(eventId);
                console.log("Fetched event set data:", data);
                setEventSetData(Array.isArray(data.data) ? data.data : []);
            } catch (error) {
                console.error("Failed to fetch event set:", error);
                setEventSetData([]);
            }
        };
        fetchEventSet();
    }, [eventId]);

    const handleAddRow = () => {
        if (Array.isArray(eventSetData)) {
            setEventSetData([...eventSetData, newRow]);
            setNewRow({});
        } else {
            console.error("eventSetData is not an array:", eventSetData);
        }
    };

    const handleDeleteRow = (index) => {
        if (Array.isArray(eventSetData)) {
            const updatedData = eventSetData.filter((_, i) => i !== index);
            setEventSetData(updatedData);
        } else {
            console.error("eventSetData is not an array:", eventSetData);
        }
    };

    const handleSave = async () => {
        try {
            await updateEventSet(eventId, eventSetData);
            alert("Event set saved successfully!");
        } catch (error) {
            console.error("Failed to save event set:", error);
        }
    };

    return (
        <div className="container mt-5">
            <h1 className="text-center">Event Set</h1>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Column 1</th>
                        <th>Column 2</th>
                        <th>Column 3</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {Array.isArray(eventSetData) &&
                        eventSetData.map((row, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{row.column1}</td>
                                <td>{row.column2}</td>
                                <td>{row.column3}</td>
                                <td>
                                    <Button variant="danger" size="sm" onClick={() => handleDeleteRow(index)}>
                                        Delete
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    <tr>
                        <td>New</td>
                        <td>
                            <Form.Control
                                type="text"
                                placeholder="Column 1"
                                value={newRow.column1 || ''}
                                onChange={(e) => setNewRow({ ...newRow, column1: e.target.value })}
                            />
                        </td>
                        <td>
                            <Form.Control
                                type="text"
                                placeholder="Column 2"
                                value={newRow.column2 || ''}
                                onChange={(e) => setNewRow({ ...newRow, column2: e.target.value })}
                            />
                        </td>
                        <td>
                            <Form.Control
                                type="text"
                                placeholder="Column 3"
                                value={newRow.column3 || ''}
                                onChange={(e) => setNewRow({ ...newRow, column3: e.target.value })}
                            />
                        </td>
                        <td>
                            <Button variant="success" size="sm" onClick={handleAddRow}>
                                Add
                            </Button>
                        </td>
                    </tr>
                </tbody>
            </Table>
            <Button variant="primary" onClick={handleSave}>
                Save Changes
            </Button>
        </div>
    );
};

export default EventSet;