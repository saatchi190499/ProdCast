import React, { useState } from 'react';
import { Tabs, Tab, Container } from 'react-bootstrap';
import Events from './Events/Events';
import Trends from './Trends';

const Inputs = () => {
    const [activeTab, setActiveTab] = useState('events');

    return (
        <Container fluid>
            <Tabs
                id="inputs-tabs"
                activeKey={activeTab}
                onSelect={(k) => setActiveTab(k)}
                className="mb-3"
            >
                <Tab eventKey="events" title="Events">
                    <Events />
                </Tab>
                <Tab eventKey="trends" title="Trends">
                    <Trends />
                </Tab>
            </Tabs>
        </Container>
    );
};

export default Inputs;