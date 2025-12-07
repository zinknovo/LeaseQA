import {useRef} from "react";
import {FaEdit, FaTrash, FaPaperclip} from "react-icons/fa";
import {format} from "date-fns";
import dynamic from "next/dynamic";

const ReactQuill = dynamic(() => import("react-quill-new"), {ssr: false});

type Answer = {
    _id: string;
    authorId: string;
    answerType: string;
    content: string;
    createdAt: string;
    author?: any;
};

type AnswersSectionProps = {
    answers: Answer[];
    canEditPost: boolean;
    currentUserId: string | null;
    currentRole: string | null;
    resolvedStatus: "open" | "resolved";
    showAnswerBox: boolean;
    answerContent: string;
    answerFocused: boolean;
    answerFiles: File[];
    answerEditing: string | null;
    answerEditContent: string;
    error: string;
    onStatusChange: (status: "open" | "resolved") => void;
    onShowAnswerBox: () => void;
    onAnswerContentChange: (val: string) => void;
    onAnswerFocus: () => void;
    onAnswerFilesChange: (files: File[]) => void;
    onSubmitAnswer: () => void;
    onClearAnswer: () => void;
    onEditAnswer: (id: string, content: string) => void;
    onEditContentChange: (val: string) => void;
    onSaveEdit: (id: string) => void;
    onCancelEdit: () => void;
    onDeleteAnswer: (id: string) => void;
};

export default function AnswersSection({
    answers,
    canEditPost,
    currentUserId,
    currentRole,
    resolvedStatus,
    showAnswerBox,
    answerContent,
    answerFocused,
    answerFiles,
    answerEditing,
    answerEditContent,
    error,
    onStatusChange,
    onShowAnswerBox,
    onAnswerContentChange,
    onAnswerFocus,
    onAnswerFilesChange,
    onSubmitAnswer,
    onClearAnswer,
    onEditAnswer,
    onEditContentChange,
    onSaveEdit,
    onCancelEdit,
    onDeleteAnswer,
}: AnswersSectionProps) {
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const canEditAnswer = (ans: Answer) => currentRole === "admin" || ans.authorId === currentUserId;

    return (
        <div className="post-detail-card">
            <div className="post-section-header">
                <h2 className="post-section-title">Answers</h2>
                <div className="post-status-toggle">
                    <span>Status:</span>
                    {canEditPost ? (
                        <div className="post-status-options">
                            <label className={resolvedStatus === "open" ? "active" : ""}>
                                <input
                                    type="radio"
                                    checked={resolvedStatus === "open"}
                                    onChange={() => onStatusChange("open")}
                                />
                                <span>Open</span>
                            </label>
                            <label className={resolvedStatus === "resolved" ? "active" : ""}>
                                <input
                                    type="radio"
                                    checked={resolvedStatus === "resolved"}
                                    onChange={() => onStatusChange("resolved")}
                                />
                                <span>Resolved</span>
                            </label>
                        </div>
                    ) : (
                        <span className={`post-status-badge ${resolvedStatus}`}>
                            {resolvedStatus === "resolved" ? "Resolved" : "Open"}
                        </span>
                    )}
                </div>
            </div>

            {!showAnswerBox ? (
                <button className="post-btn primary" onClick={onShowAnswerBox}>
                    Write an answer
                </button>
            ) : (
                <div className="post-editor-box">
                    <ReactQuill
                        theme="snow"
                        value={answerContent}
                        onChange={onAnswerContentChange}
                        onFocus={onAnswerFocus}
                    />
                    <div className="post-editor-actions">
                        <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            hidden
                            onChange={(e) => onAnswerFilesChange(Array.from(e.target.files || []))}
                        />
                        <button
                            className="post-btn secondary"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <FaPaperclip size={12}/>
                            {answerFiles.length > 0 ? ` ${answerFiles.length} files` : " Attach"}
                        </button>
                        <button className="post-btn primary" onClick={onSubmitAnswer}>
                            Post answer
                        </button>
                        <button className="post-btn secondary" onClick={onClearAnswer}>
                            Cancel
                        </button>
                    </div>
                    {error && <div className="post-error">{error}</div>}
                </div>
            )}

            {answers.length > 0 && (
                <div className="post-answers-list">
                    {answers.map((ans) => (
                        <div key={ans._id} className="post-answer-item">
                            <div className="post-answer-header">
                                <span className="post-answer-author">
                                    {ans.author?.username || ans.author?.email || "Anonymous"}
                                </span>
                                <span className="post-answer-type">
                                    {ans.answerType === "lawyer_opinion" ? "⚖️ Lawyer" : "🏠 Community"}
                                </span>
                                <span className="post-answer-date">
                                    {ans.createdAt ? format(new Date(ans.createdAt), "MMM d, yyyy") : ""}
                                </span>
                                {canEditAnswer(ans) && (
                                    <div className="post-answer-actions">
                                        <button onClick={() => onEditAnswer(ans._id, ans.content)}>
                                            <FaEdit size={12}/>
                                        </button>
                                        <button onClick={() => onDeleteAnswer(ans._id)}>
                                            <FaTrash size={12}/>
                                        </button>
                                    </div>
                                )}
                            </div>
                            {answerEditing === ans._id ? (
                                <div className="post-editor-box">
                                    <ReactQuill
                                        theme="snow"
                                        value={answerEditContent}
                                        onChange={onEditContentChange}
                                    />
                                    <div className="post-editor-actions">
                                        <button className="post-btn primary" onClick={() => onSaveEdit(ans._id)}>
                                            Save
                                        </button>
                                        <button className="post-btn secondary" onClick={onCancelEdit}>
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="post-answer-content" dangerouslySetInnerHTML={{__html: ans.content}}/>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
