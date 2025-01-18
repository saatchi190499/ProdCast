import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { HotTable } from '@handsontable/react';
import 'handsontable/dist/handsontable.full.min.css';
import { getEventSet, updateEventSet, getDropdownData } from '../../../services/api';
import { Button, Box } from '@mui/material';
import Handsontable from 'handsontable';

const DataSetPage = () => {
    const [data, setData] = useState([]);
    const [dropdownData, setDropdownData] = useState({
        objectTypes: [],
        objectInstances: [],
        objectTypeProperties: [],
    });
    const [loading, setLoading] = useState(true);
    const { eventId } = useParams();
    const location = useLocation();
    const subDataSourceName = location.state?.subDataSourceName || "Unknown";

    useEffect(() => {
        const fetchData = async () => {
            try {
                const dropdowns = await getDropdownData();
                setDropdownData({
                    objectTypes: dropdowns.objectTypes.map((item) => item.object_type_name),
                    objectInstances: dropdowns.objectInstances.map((item) => item.object_instance_name),
                    objectTypeProperties: dropdowns.objectTypeProperties.map((item) => item.object_type_property_name),
                });

                const dataSet = await getEventSet(eventId);
                const formattedData = dataSet.map((item) => ({
                    id: item.id,
                    created_date: item.created_date,
                    object_type: item.object_type,
                    object_instance: item.object_instance,
                    object_type_property: item.object_type_property,
                }));
                setData(formattedData);
            } catch (error) {
                console.error('Failed to fetch data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [eventId]);

    const handleSave = async () => {
        try {
            const payload = data.map((row) => ({
                id: row.id || undefined,
                object_type: row.object_type,
                object_instance: row.object_instance,
                object_type_property: row.object_type_property,
            }));

            console.log('Payload to save:', payload);
            await updateEventSet(eventId, payload);
            alert('DataSet saved successfully!');
        } catch (error) {
            console.error('Failed to save data set:', error);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <Box sx={{ width: '100%', marginTop: 4 }}>
            <h2>Sub Data Source: {subDataSourceName}</h2> {/* Display sub_data_source name */}
            <Button variant="contained" color="primary" onClick={handleSave} sx={{ marginBottom: 2 }}>
                Save Changes
            </Button>
            <HotTable
                data={data}
                colHeaders={["Id", "Created Date", "Object Type", "Object Instance", "Object Type Property"]}
                columns={[
                    { data: 'id', type: 'numeric', readOnly: true },
                    { data: 'created_date', type: 'date', dateFormat: 'YYYY-MM-DD', readOnly: true },
                    {
                        data: 'object_type',
                        type: 'dropdown',
                        source: dropdownData.objectTypes,
                    },
                    {
                        data: 'object_instance',
                        type: 'dropdown',
                        source: dropdownData.objectInstances,
                    },
                    {
                        data: 'object_type_property',
                        type: 'dropdown',
                        source: dropdownData.objectTypeProperties,
                    },
                ]}
                rowHeaders={true}
                stretchH="all"
                width="100%"
                height="500"
                licenseKey="non-commercial-and-evaluation"
            />
        </Box>
    );
};

export default DataSetPage;
