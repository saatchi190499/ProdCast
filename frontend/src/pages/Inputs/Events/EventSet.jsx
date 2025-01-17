import React, { useState, useEffect } from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { getEventSet, updateEventSet } from '../../../services/api';
import { useParams } from 'react-router-dom';
import { Button, Box } from '@mui/material';

const EventSet = () => {
    const { eventId } = useParams();
    const [rows, setRows] = useState([]);
    const [columns, setColumns] = useState([
        { field: 'id', headerName: 'ID', width: 100 },
        { field: 'column1', headerName: 'Column 1', editable: true, width: 150 },
        { field: 'column2', headerName: 'Column 2', editable: true, width: 150 },
        { field: 'column3', headerName: 'Column 3', editable: true, width: 150 },
        { field: 'column4', headerName: 'Column 4', editable: true, width: 150 },
        { field: 'column5', headerName: 'Column 5', editable: true, width: 150 },
    ]);

    useEffect(() => {
        const fetchEventSet = async () => {
            try {
                const data = await getEventSet(eventId);
                setRows(data.data || []); // Set rows from the API response
            } catch (error) {
                console.error('Failed to fetch event set:', error);
            }
        };
        fetchEventSet();
    }, [eventId]);

    const handleSave = async () => {
        try {
            await updateEventSet(eventId, rows);
            alert('EventSet saved successfully!');
        } catch (error) {
            console.error('Failed to save event set:', error);
        }
    };

    const handleAddRow = () => {
        const newId = rows.length > 0 ? rows[rows.length - 1].id + 1 : 1;
        const newRow = { id: newId, column1: '', column2: '', column3: '', column4: '', column5: '' };
        setRows([...rows, newRow]);
    };

    const handleDeleteRow = (selectedIds) => {
        setRows(rows.filter((row) => !selectedIds.includes(row.id)));
    };

    return (
        <Box sx={{ height: 500, width: '100%', marginTop: 4 }}>
            <Button variant="contained" color="primary" onClick={handleAddRow} sx={{ marginBottom: 2 }}>
                Add Row
            </Button>
            <Button variant="contained" color="secondary" onClick={handleSave} sx={{ marginBottom: 2, marginLeft: 2 }}>
                Save Changes
            </Button>
            <DataGrid
                rows={rows}
                columns={columns}
                checkboxSelection
                disableSelectionOnClick
                processRowUpdate={(newRow) => {
                    const updatedRows = rows.map((row) => (row.id === newRow.id ? newRow : row));
                    setRows(updatedRows);
                    return newRow;
                }}
                onProcessRowUpdateError={(error) => console.error('Error updating row:', error)}
                components={{
                    Toolbar: GridToolbar,
                }}
                onSelectionModelChange={(ids) => handleDeleteRow(ids)}
                experimentalFeatures={{ newEditingApi: true }}
            />
        </Box>
    );
};

export default EventSet;
