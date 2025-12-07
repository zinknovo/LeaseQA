"use client";

import {PostDetailProps} from "../types";
import {getFolderDisplayName} from "../utils";

export default function PostDetail({post, folders}: PostDetailProps) {
    if (!post) return null;

    return (
        <div className="post-detail-card">
            <div className="post-detail-header">
                <div className="post-detail-meta">
                    <span className={`post-urgency-badge ${post.urgency || "low"}`}>
                        {post.urgency || "low"}
                    </span>
                    <span className="post-detail-folders">
                        {post.folders.map(f => getFolderDisplayName(folders, f)).join(" · ")}
                    </span>
                    <span className="post-detail-date">
                        {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                </div>
            </div>
            <h1 className="post-detail-title">{post.summary}</h1>
            <div className="post-detail-content" dangerouslySetInnerHTML={{__html: post.details}}/>
            {post.attachments && post.attachments.length > 0 && (
                <div className="post-attachments">
                    <div className="post-attachments-title">Attachments</div>
                    <div className="post-attachments-list">
                        {post.attachments.map((file) => (
                            <a
                                key={file.url}
                                href={file.url}
                                target="_blank"
                                rel="noreferrer"
                                className="post-attachment-item"
                            >
                                <span>{file.filename}</span>
                                {file.size && <span>{(file.size / 1024).toFixed(1)} KB</span>}
                            </a>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
