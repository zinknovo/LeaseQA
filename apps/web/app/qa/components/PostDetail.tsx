"use client";

import {Badge, Button, Card, CardBody, Stack} from "react-bootstrap";
import {PostDetailProps} from "../types";
import {getFolderDisplayName} from "../utils";

export default function PostDetail({post, folders}: PostDetailProps) {
    if (!post) {
        return (
            <Card>
                <CardBody>
                    <div className="text-secondary">Select a post to view details.</div>
                </CardBody>
            </Card>
        );
    }

    return (
        <Card>
            <CardBody>
                <div className="d-flex align-items-center gap-2 mb-2">
                    <Badge bg={post.urgency === "high" ? "danger" : "secondary"}>
                        {post.urgency}
                    </Badge>
                    <span className="text-secondary small">
                        {post.folders.map(f => getFolderDisplayName(folders, f)).join(" · ")} · {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                </div>
                <h3 className="h5 fw-semibold">{post.summary}</h3>
                <p className="text-secondary">{post.details}</p>

                <Stack direction="horizontal" gap={2} className="flex-wrap mt-3">
                    <Button size="sm" variant="primary">
                        Open thread
                    </Button>
                    <Button href="/qa/new" size="sm" variant="outline-secondary">
                        Reply
                    </Button>
                </Stack>
            </CardBody>
        </Card>
    );
}