"use client";

import {Badge, Card, CardBody, ListGroup} from "react-bootstrap";
import {PostDetailProps} from "../types";
import {getFolderDisplayName} from "../utils";

export default function PostDetail({post, folders}: PostDetailProps) {
    if (!post) return null;

    return (
        <Card>
            <CardBody className="p-2">
                <div className="d-flex align-items-center gap-2 mb-1">
                    <Badge bg={post.urgency === "high" ? "danger" : "secondary"}>
                        {post.urgency}
                    </Badge>
                    <span className="text-secondary small">
                        {post.folders.map(f => getFolderDisplayName(folders, f)).join(" · ")} · {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                </div>
                <h3 className="h5 fw-semibold">{post.summary}</h3>
                <p className="text-secondary">{post.details}</p>
                {post.attachments && post.attachments.length > 0 && (
                    <div className="mt-2">
                        <div className="fw-semibold small mb-1">Attachments</div>
                        <ListGroup>
                            {post.attachments.map((file) => (
                                <ListGroup.Item key={file.url} className="py-1 px-2">
                                    <a href={file.url} target="_blank" rel="noreferrer" className="d-flex justify-content-between align-items-center">
                                        <span>{file.filename}</span>
                                        {file.size && (
                                            <span className="text-muted small">
                                                {(file.size / 1024).toFixed(1)} KB
                                            </span>
                                        )}
                                    </a>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    </div>
                )}
            </CardBody>
        </Card>
    );
}
