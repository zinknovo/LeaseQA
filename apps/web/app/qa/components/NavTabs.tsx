"use client";

import { Button, Card, CardBody, Stack } from "react-bootstrap";

export default function NavTabs() {
    return (
        <Card className="mb-3">
            <CardBody className="py-2">
                <Stack
                    direction="horizontal"
                    className="justify-content-start flex-wrap gap-2"
                >
                    <Button href="/qa" size="sm" variant="link">
                        QA
                    </Button>
                    <Button href="/qa/resources" size="sm" variant="link">
                        Resources
                    </Button>
                    <Button href="/qa/stats" size="sm" variant="link">
                        Stats
                    </Button>
                </Stack>
            </CardBody>
        </Card>
    );
}