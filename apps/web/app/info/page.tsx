"use client";

import {Card, CardBody, Col, Row} from "react-bootstrap";

const team = [
    {name: "Casey Tenant", role: "Product", focus: "Tenant experience & rubric alignment", emoji: "📋"},
    {name: "Alex Counsel", role: "Legal Ops", focus: "Policy review, attorney replies", emoji: "⚖️"},
    {name: "Jamie Engineer", role: "Full-stack", focus: "Next.js + Express + Mongo", emoji: "💻"},
    {name: "Eric Engineer", role: "Full-stack", focus: "Next.js + Express + Mongo", emoji: "🛠️"},
];

const techStack = [
    {name: "Next.js", description: "React framework", color: "#000000"},
    {name: "React-Bootstrap", description: "UI components", color: "#7952b3"},
    {name: "Express", description: "Backend API", color: "#000000"},
    {name: "MongoDB", description: "Database", color: "#47a248"},
];

export default function InfoPage() {
    return (
        <div className="mb-4">
            <Card
                className="mb-4 border-0 text-white"
                style={{
                    background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
                    borderRadius: "1.5rem",
                    overflow: "hidden"
                }}
            >
                <CardBody className="p-5">
                    <div
                        className="pill mb-3"
                        style={{
                            background: "rgba(255,255,255,0.15)",
                            color: "#fff",
                            display: "inline-block"
                        }}
                    >
                        ℹ️ About
                    </div>
                    <h1 className="display-6 fw-bold mb-3">LeaseQA Team & Credits</h1>
                    <p className="lead mb-0 opacity-75">
                        Built for NEU CS5610 — AI lease review + Piazza-inspired Q&A.<br/>
                        Helping Boston renters understand their rights.
                    </p>
                </CardBody>
            </Card>

            <div className="small text-secondary mb-3 fw-semibold">TEAM</div>
            <Row className="g-4 mb-4">
                {team.map((member, index) => {
                    const colors = [
                        "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
                        "linear-gradient(135deg, #e94560 0%, #ff6b6b 100%)",
                        "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
                    ];

                    return (
                        <Col md={6} lg={3} key={member.name}>
                            <Card
                                className="h-100 border-0 shadow-sm"
                                style={{
                                    borderRadius: "1rem",
                                    overflow: "hidden",
                                    borderTop: "4px solid transparent",
                                    borderImage: `${colors[index % colors.length]} 1`
                                }}
                            >
                                <CardBody className="p-4">
                                    <div
                                        className="d-flex align-items-center justify-content-center rounded-circle mb-3"
                                        style={{
                                            width: 50,
                                            height: 50,
                                            background: colors[index % colors.length],
                                            fontSize: "1.5rem"
                                        }}
                                    >
                                        {member.emoji}
                                    </div>
                                    <div className="fw-bold mb-1">{member.name}</div>
                                    <div
                                        className="small mb-2 px-2 py-1 rounded-pill d-inline-block"
                                        style={{background: "#f8f9fa", color: "#6c757d"}}
                                    >
                                        {member.role}
                                    </div>
                                    <div className="text-secondary small mt-2">{member.focus}</div>
                                </CardBody>
                            </Card>
                        </Col>
                    );
                })}
            </Row>

            <div className="small text-secondary mb-3 fw-semibold">TECH STACK</div>
            <Card
                className="border-0 shadow-sm"
                style={{borderRadius: "1rem", overflow: "hidden"}}
            >
                <CardBody className="p-4">
                    <Row className="g-3">
                        {techStack.map((tech) => (
                            <Col md={3} sm={6} key={tech.name}>
                                <div
                                    className="p-3 rounded-3 h-100"
                                    style={{background: "#f8f9fa"}}
                                >
                                    <div className="d-flex align-items-center gap-2 mb-2">
                                        <div
                                            className="rounded-circle"
                                            style={{
                                                width: 10,
                                                height: 10,
                                                background: tech.color
                                            }}
                                        />
                                        <span className="fw-bold">{tech.name}</span>
                                    </div>
                                    <div className="text-secondary small">{tech.description}</div>
                                </div>
                            </Col>
                        ))}
                    </Row>
                </CardBody>
            </Card>
        </div>
    );
}