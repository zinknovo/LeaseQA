"use client";

import {useEffect, useState} from "react";
import {useParams, useRouter} from "next/navigation";
import {Button, Col, Row} from "react-bootstrap";
import {useSelector} from "react-redux";
import {RootState} from "@/app/store";
import {
    createDiscussion,
    deleteAnswer,
    deleteDiscussion,
    deletePost,
    fetchJson,
    fetchPosts,
    updateAnswer,
    updateDiscussion,
    updatePost,
    uploadPostAttachments,
} from "@/app/lib/api";
import "react-quill-new/dist/quill.snow.css";

import {RecencySidebar, PostContent, AnswersSection, DiscussionsSection} from "./components";

type PostDetailData = {
    _id: string;
    summary: string;
    details: string;
    folders: string[];
    authorId: string;
    viewCount?: number;
    createdAt?: string;
    urgency?: string;
    status?: string;
    attachments?: {filename: string; url: string; size?: number}[];
    answers?: Answer[];
    discussions?: Discussion[];
    author?: any;
};

type Answer = {
    _id: string;
    postId: string;
    authorId: string;
    answerType: string;
    content: string;
    createdAt: string;
    isAccepted?: boolean;
    author?: any;
};

type Discussion = {
    _id: string;
    postId: string;
    parentId?: string | null;
    authorId: string;
    content: string;
    isResolved?: boolean;
    createdAt: string;
    replies?: Discussion[];
    author?: any;
};

export default function PostDetailPage() {
    const params = useParams();
    const postId = Array.isArray(params?.id) ? params.id[0] : (params?.id as string);
    const router = useRouter();
    const session = useSelector((state: RootState) => state.session);
    const currentUserId = session.user?.id || (session.user as any)?._id;
    const currentRole = session.user?.role;

    const [post, setPost] = useState<PostDetailData | null>(null);
    const [allPosts, setAllPosts] = useState<PostDetailData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [isEditingPost, setIsEditingPost] = useState(false);
    const [editSummary, setEditSummary] = useState("");
    const [editDetails, setEditDetails] = useState("");

    const [answers, setAnswers] = useState<Answer[]>([]);
    const [resolvedStatus, setResolvedStatus] = useState<"open" | "resolved">("open");
    const [showAnswerBox, setShowAnswerBox] = useState(false);
    const [answerContent, setAnswerContent] = useState("");
    const [answerFocused, setAnswerFocused] = useState(false);
    const [answerFiles, setAnswerFiles] = useState<File[]>([]);
    const [answerEditing, setAnswerEditing] = useState<string | null>(null);
    const [answerEditContent, setAnswerEditContent] = useState("");

    const [discussions, setDiscussions] = useState<Discussion[]>([]);
    const [showFollowBox, setShowFollowBox] = useState(false);
    const [followFocused, setFollowFocused] = useState(false);
    const [discussionDrafts, setDiscussionDrafts] = useState<Record<string, string>>({});
    const [discussionReplying, setDiscussionReplying] = useState<string | null>(null);

    const isAuthor = post && currentUserId && post.authorId?.toString() === currentUserId;
    const canEditPost = isAuthor || currentRole === "admin";

    const fetchPost = async () => {
        try {
            setLoading(true);
            const res = await fetchJson<{data: PostDetailData}>(`/posts/${postId}`);
            const data = (res as any)?.data || (res as any);
            setPost(data);
            setAnswers(data.answers || []);
            setDiscussions(data.discussions || []);
            setResolvedStatus(data.status === "resolved" ? "resolved" : "open");
            setEditSummary(data.summary || "");
            setEditDetails(data.details || "");
        } catch (err: any) {
            setError(err.message || "Failed to load post");
        } finally {
            setLoading(false);
        }
    };

    const fetchRecency = async () => {
        try {
            const res = await fetchPosts({});
            setAllPosts((res as any)?.data || res || []);
        } catch (err) {
            console.error("Failed to load recency posts", err);
        }
    };

    useEffect(() => {
        if (postId) {
            fetchPost();
            fetchRecency();
        }
    }, [postId]);

    const handleDeletePost = async () => {
        await deletePost(postId);
        router.push("/qa");
    };

    const handleSavePost = async () => {
        await updatePost(postId, {summary: editSummary, details: editDetails});
        setIsEditingPost(false);
        fetchPost();
    };

    const handleCancelEditPost = () => {
        setIsEditingPost(false);
        setEditSummary(post?.summary || "");
        setEditDetails(post?.details || "");
    };

    const handleStatusChange = async (status: "open" | "resolved") => {
        setResolvedStatus(status);
        await updatePost(postId, {status});
        fetchPost();
    };

    const handleSubmitAnswer = async () => {
        setError("");
        if (!answerContent.trim()) {
            setError("Answer content is required");
            return;
        }
        try {
            const resp = await fetchJson(`/answers`, {
                method: "POST",
                body: JSON.stringify({
                    postId,
                    content: answerContent,
                    answerType: currentRole === "lawyer" ? "lawyer_opinion" : "community_answer",
                }),
            });
            const newAnswer = (resp as any)?.data || resp;
            if (newAnswer?._id && answerFiles.length) {
                await uploadPostAttachments(postId, answerFiles).catch(console.error);
            }
            setAnswerContent("");
            setAnswerFiles([]);
            setShowAnswerBox(false);
            setAnswerFocused(false);
            fetchPost();
        } catch (err: any) {
            setError(err.message || "Failed to submit answer");
        }
    };

    const handleClearAnswer = () => {
        setAnswerContent("");
        setAnswerFiles([]);
        setShowAnswerBox(false);
        setAnswerFocused(false);
    };

    const handleEditAnswer = (id: string, content: string) => {
        setAnswerEditing(id);
        setAnswerEditContent(content);
    };

    const handleSaveAnswerEdit = async (id: string) => {
        if (!answerEditContent.trim()) return;
        await updateAnswer(id, {content: answerEditContent});
        setAnswerEditing(null);
        setAnswerEditContent("");
        fetchPost();
    };

    const handleCancelAnswerEdit = () => {
        setAnswerEditing(null);
        setAnswerEditContent("");
    };

    const handleDeleteAnswer = async (id: string) => {
        await deleteAnswer(id);
        fetchPost();
    };

    const handleDraftChange = (key: string, val: string) => {
        setDiscussionDrafts((prev) => ({...prev, [key]: val}));
    };

    const handleSubmitDiscussion = async (parentId: string | null) => {
        const key = parentId || "root";
        const content = discussionDrafts[key] || "";
        if (!content.trim()) return;
        await createDiscussion({postId, parentId, content});
        setDiscussionDrafts((prev) => ({...prev, [key]: ""}));
        setDiscussionReplying(null);
        setShowFollowBox(false);
        setFollowFocused(false);
        fetchPost();
    };

    const handleUpdateDiscussion = async (id: string) => {
        const content = discussionDrafts[id] || "";
        if (!content.trim()) return;
        await updateDiscussion(id, {content});
        setDiscussionDrafts((prev) => ({...prev, [id]: ""}));
        setDiscussionReplying(null);
        fetchPost();
    };

    const handleDeleteDiscussion = async (id: string) => {
        await deleteDiscussion(id);
        fetchPost();
    };

    const handleReplyDiscussion = (id: string) => {
        setDiscussionReplying(id);
    };

    const handleEditDiscussion = (id: string, content: string) => {
        setDiscussionReplying(id);
        setDiscussionDrafts((prev) => ({...prev, [id]: content}));
    };

    const handleClearFollow = () => {
        setDiscussionDrafts((prev) => ({...prev, root: ""}));
        setShowFollowBox(false);
        setFollowFocused(false);
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center loading-min-height">
                <div className="text-center">
                    <div className="spinner-border text-primary mb-2" role="status"/>
                    <div className="text-secondary">Loading post…</div>
                </div>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="text-center py-5">
                <p className="text-danger">Post not found.</p>
                <Button variant="link" onClick={() => router.push("/qa")}>Back to QA</Button>
            </div>
        );
    }

    return (
        <Row className="g-2 mx-0">
            <Col lg={3} className="px-1">
                <RecencySidebar
                    posts={allPosts}
                    currentPostId={postId}
                    onSelectPost={(id) => router.push(`/qa/${id}`)}
                />
            </Col>

            <Col lg={9} className="px-1">
                <PostContent
                    post={post}
                    canEdit={canEditPost || false}
                    isEditing={isEditingPost}
                    editSummary={editSummary}
                    editDetails={editDetails}
                    onEdit={() => setIsEditingPost(true)}
                    onDelete={handleDeletePost}
                    onSave={handleSavePost}
                    onCancel={handleCancelEditPost}
                    onSummaryChange={setEditSummary}
                    onDetailsChange={setEditDetails}
                />

                <AnswersSection
                    answers={answers}
                    canEditPost={canEditPost || false}
                    currentUserId={currentUserId}
                    currentRole={currentRole || null}
                    resolvedStatus={resolvedStatus}
                    showAnswerBox={showAnswerBox}
                    answerContent={answerContent}
                    answerFocused={answerFocused}
                    answerFiles={answerFiles}
                    answerEditing={answerEditing}
                    answerEditContent={answerEditContent}
                    error={error}
                    onStatusChange={handleStatusChange}
                    onShowAnswerBox={() => setShowAnswerBox(true)}
                    onAnswerContentChange={setAnswerContent}
                    onAnswerFocus={() => setAnswerFocused(true)}
                    onAnswerFilesChange={setAnswerFiles}
                    onSubmitAnswer={handleSubmitAnswer}
                    onClearAnswer={handleClearAnswer}
                    onEditAnswer={handleEditAnswer}
                    onEditContentChange={setAnswerEditContent}
                    onSaveEdit={handleSaveAnswerEdit}
                    onCancelEdit={handleCancelAnswerEdit}
                    onDeleteAnswer={handleDeleteAnswer}
                />

                <DiscussionsSection
                    discussions={discussions}
                    currentUserId={currentUserId}
                    currentRole={currentRole || null}
                    showFollowBox={showFollowBox}
                    followFocused={followFocused}
                    discussionDrafts={discussionDrafts}
                    discussionReplying={discussionReplying}
                    onShowFollowBox={() => setShowFollowBox(true)}
                    onFollowFocus={() => setFollowFocused(true)}
                    onDraftChange={handleDraftChange}
                    onSubmit={handleSubmitDiscussion}
                    onUpdate={handleUpdateDiscussion}
                    onDelete={handleDeleteDiscussion}
                    onReply={handleReplyDiscussion}
                    onEdit={handleEditDiscussion}
                    onCancelReply={() => setDiscussionReplying(null)}
                    onClearFollow={handleClearFollow}
                />
            </Col>
        </Row>
    );
}
