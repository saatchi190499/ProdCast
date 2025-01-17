import React, { useState } from 'react';
import { Tabs, Tab, Container } from 'react-bootstrap';
import Inputs from './Inputs/Inputs';

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState('inputs');

    return (
        <Container fluid className="mt-3 w-100">
            <Tabs
                id="dashboard-tabs"
                activeKey={activeTab}
                onSelect={(k) => setActiveTab(k)}
                className="mb-3"
            >
                <Tab eventKey="inputs" title="Inputs">
                    <Inputs />
                </Tab>
            </Tabs>
        </Container>
    );
};

export default Dashboard;