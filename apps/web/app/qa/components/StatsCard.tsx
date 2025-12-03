"use client";

import {useEffect, useState} from "react";
import {Card, CardBody, Col, Row} from "react-bootstrap";
import * as client from "../client";

export default function StatsCard() {
    const [stats, setStats] = useState([
        {label: "Unread posts", value: 0},
        {label: "Unanswered", value: 0},
        {label: "Attorney replies", value: 0},
        {label: "Tenant replies", value: 0},
        {label: "Registered users", value: 0},
        {label: "Total posts", value: 0},
    ]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            const response = await client.fetchStats();
            if (response.data) {
                setStats([
                    {label: "Unread posts", value: response.data.unreadPosts || 0},
                    {label: "Unanswered", value: response.data.unansweredPosts || 0},
                    {label: "Attorney replies", value: response.data.lawyerResponses || 0},
                    {label: "Tenant replies", value: response.data.tenantResponses || 0},
                    {label: "Registered users", value: response.data.enrolledUsers || 0},
                    {label: "Total posts", value: response.data.totalPosts || 0},
                ]);
            }
        } catch (error) {
            console.error("Failed to load stats:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card>
            <CardBody>
                <div className="pill mb-2">Board stats</div>
                {loading ? (
                    <div className="text-secondary small">Loading stats...</div>
                ) : (
                    <Row className="g-2">
                        {stats.map(item => (
                            <Col xs={6} key={item.label}>
                                <div className="border rounded-3 p-2 h-100">
                                    <div className="small text-secondary">{item.label}</div>
                                    <div className="fw-bold">{item.value}</div>
                                </div>
                            </Col>
                        ))}
                    </Row>
                )}
            </CardBody>
        </Card>
    );
}