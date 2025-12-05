"use client";

import { useState } from "react";
import { Button, Card, CardBody, Container, Form, Alert } from "react-bootstrap";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { loginUser } from "@/app/lib/api";
import { useDispatch } from "react-redux";
import { setSession } from "@/app/store";

export default function LoginPage() {
    const router = useRouter();
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await loginUser({
                email: formData.email,
                password: formData.password
            });

            const user = (response as any)?.data || response;
            if (!user || typeof user !== "object") {
                throw new Error("Login response missing user data");
            }

            // 更新 Redux 状态
            dispatch(setSession(user));
            
            router.push("/account");
        } catch (err: any) {
            setError(err.message || "Invalid email or password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="d-flex align-items-center justify-content-center min-vh-100 py-5">
            <div style={{ maxWidth: "400px", width: "100%" }}>
                <div className="text-center mb-4">
                    <h1 className="h3 fw-bold">Welcome Back</h1>
                    <p className="text-muted">Sign in to continue to LeaseQA</p>
                </div>

                <Card className="border-0 shadow-sm">
                    <CardBody className="p-4">
                        {error && <Alert variant="danger">{error}</Alert>}
                        
                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3">
                                <Form.Label>Email address</Form.Label>
                                <Form.Control
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-4">
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>

                            <Button 
                                variant="primary" 
                                type="submit" 
                                className="w-100 mb-3"
                                disabled={loading}
                            >
                                {loading ? "Signing In..." : "Sign In"}
                            </Button>
                        </Form>

                        <div className="text-center text-muted small">
                            Don't have an account? <Link href="/auth/register" className="text-primary text-decoration-none">Create Account</Link>
                        </div>
                    </CardBody>
                </Card>
            </div>
        </Container>
    );
}
