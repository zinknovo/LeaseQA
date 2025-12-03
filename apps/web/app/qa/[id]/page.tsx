"use client";

import Link from "next/link";
import {useMemo, useState} from "react";

const mockPost = {
    id: "1",
    title: "Is collecting three months of rent in advance legal?",
    author: {name: "Ava Chen", role: "tenant" as const},
    createdAt: "2024-10-25T08:00:00Z",
    folder: "Lease Review",
    viewCount: 132,
    details:
        "<p>The landlord wants three months of rent plus a full deposit before move-in. Does Massachusetts law allow this?</p>",
    answers: [
        {
            id: "a1",
            author: {name: "Attorney Lin", role: "lawyer" as const},
            createdAt: "2024-10-25T10:30:00Z",
            content:
                "<p>Under Massachusetts law a landlord may only request first month, last month, a security deposit (capped at one month), and a key fee. Anything beyond that violates Chapter 186 Section 15B.</p>",
        },
    ],
    discussions: [
        {
            id: "d1",
            author: {name: "Brian", role: "tenant" as const},
            createdAt: "2024-10-25T12:00:00Z",
            content: "Had the same experience last year—negotiate and cite the statute before signing.",
            isResolved: false,
            replies: [
                {
                    id: "d1-1",
                    author: {name: "Attorney Lin", role: "lawyer" as const},
                    createdAt: "2024-10-25T12:40:00Z",
                    content: "Reference Massachusetts General Laws Chapter 186, Section 15B when you respond.",
                },
            ],
        },
    ],
};

export default function PostDetailPage() {
    const [showFollowUp, setShowFollowUp] = useState(false);

    const lawyerAnswers = useMemo(
        () => mockPost.answers.filter((answer) => answer.author.role === "lawyer"),
        [],
    );
    const tenantAnswers = useMemo(
        () => mockPost.answers.filter((answer) => answer.author.role === "tenant"),
        [],
    );

    return (
        <div className="mx-auto w-full max-w-6xl px-4 py-8">
            <div className="grid gap-5 lg:grid-cols-[260px_1fr]">
                <aside className="space-y-4">
                    <div className="rounded-2xl border border-white/5 bg-[var(--app-panel)] p-4 text-sm text-slate-300">
                        <p className="text-[11px] uppercase tracking-[0.3em] text-slate-500">Navigation</p>
                        <h2 className="mt-2 text-lg font-semibold text-white">{mockPost.folder}</h2>
                        <p className="mt-1 text-xs text-slate-500">Currently viewing Post #{mockPost.id}</p>
                        <div className="mt-3 flex flex-wrap gap-2 text-xs">
              <span className="rounded-full border border-white/10 px-3 py-1 text-slate-300">
                {mockPost.viewCount} views
              </span>
                            <span
                                className="rounded-full border border-white/10 px-3 py-1 text-slate-300">4 followers</span>
                        </div>
                        <Link
                            href="/qa"
                            className="mt-4 inline-flex items-center rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/10"
                        >
                            ← Back to board
                        </Link>
                    </div>
                    <div className="rounded-2xl border border-white/5 bg-[var(--app-panel)] p-4 text-sm text-slate-300">
                        <p className="text-[11px] uppercase tracking-[0.3em] text-slate-500">Quick actions</p>
                        <ul className="mt-3 space-y-2">
                            <li>
                                <button
                                    className="w-full rounded-xl border border-white/10 px-3 py-2 text-left text-xs text-slate-200 hover:bg-white/5">
                                    Follow thread
                                </button>
                            </li>
                            <li>
                                <button
                                    className="w-full rounded-xl border border-white/10 px-3 py-2 text-left text-xs text-slate-200 hover:bg-white/5">
                                    Mark resolved
                                </button>
                            </li>
                            <li>
                                <button
                                    className="w-full rounded-xl border border-white/10 px-3 py-2 text-left text-xs text-slate-200 hover:bg-white/5">
                                    Report issue
                                </button>
                            </li>
                        </ul>
                    </div>
                </aside>

                <div className="space-y-6">
                    <article
                        className="rounded-2xl border border-white/5 bg-[var(--app-panel)] p-6 shadow-lg shadow-black/20">
                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
              <span className="rounded-full bg-[var(--badge-bg)] px-3 py-0.5 text-[11px] uppercase tracking-[0.3em]">
                Tenant question
              </span>
                            <span>{new Date(mockPost.createdAt).toLocaleString()}</span>
                        </div>
                        <h1 className="mt-3 text-3xl font-semibold text-white">{mockPost.title}</h1>
                        <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-400">
                            <span>{mockPost.author.name}</span>
                            <span className="text-xs text-slate-600">·</span>
                            <button className="text-xs font-medium text-[var(--accent-cyan)] hover:underline">Edit
                            </button>
                            <button className="text-xs font-medium text-[var(--accent-cyan)] hover:underline">More
                                actions
                            </button>
                        </div>
                        <div
                            className="mt-6 space-y-4 rounded-2xl border border-white/5 bg-black/20 p-4 text-sm leading-relaxed text-slate-200"
                            dangerouslySetInnerHTML={{__html: mockPost.details}}
                        />
                    </article>

                    <AnswerSection
                        title="Attorney answers (⚖️)"
                        answers={lawyerAnswers}
                        emptyHint="Waiting for a verified attorney to weigh in…"
                    />
                    <AnswerSection
                        title="Community answers (🏠)"
                        answers={tenantAnswers}
                        emptyHint="Share your experience to help the next renter."
                    />

                    <section
                        className="rounded-2xl border border-white/5 bg-[var(--app-panel)] p-6 shadow-lg shadow-black/20">
                        <header className="flex items-center justify-between">
                            <h2 className="text-xl font-semibold text-white">Follow-up discussion</h2>
                            <button
                                className="text-sm font-medium text-[var(--accent-cyan)] hover:text-white"
                                onClick={() => setShowFollowUp((prev) => !prev)}
                            >
                                {showFollowUp ? "Hide composer" : "Start new thread"}
                            </button>
                        </header>

                        {showFollowUp && (
                            <form className="mt-4 space-y-3 rounded-2xl border border-white/10 bg-black/20 p-4">
                <textarea
                    className="h-32 w-full resize-none rounded-xl border border-white/10 bg-transparent p-3 text-sm text-white placeholder:text-slate-500 focus:border-[var(--accent-blue)] focus:outline-none"
                    placeholder="Add context or raise a new follow-up question…"
                />
                                <div className="flex justify-end gap-2">
                                    <button
                                        type="button"
                                        className="rounded-xl border border-white/10 px-3 py-1.5 text-xs text-slate-300 hover:bg-white/5"
                                        onClick={() => setShowFollowUp(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="rounded-xl bg-[var(--accent-blue)] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[var(--accent-blue-hover)]"
                                    >
                                        Post thread
                                    </button>
                                </div>
                            </form>
                        )}

                        <div className="mt-6 space-y-4">
                            {mockPost.discussions.map((discussion) => (
                                <div key={discussion.id} className="rounded-2xl border border-white/10 bg-black/10 p-4">
                                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                                        <span>{discussion.author.name}</span>
                                        <span>· {discussion.author.role === "lawyer" ? "⚖️ Attorney" : "🏠 Tenant"}</span>
                                        <span>· {new Date(discussion.createdAt).toLocaleString()}</span>
                                    </div>
                                    <p className="mt-3 text-sm text-slate-100">{discussion.content}</p>
                                    <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-400">
                                        <button className="rounded border border-white/10 px-2 py-1 hover:bg-white/5">
                                            {discussion.isResolved ? "Reopen" : "Mark resolved"}
                                        </button>
                                        <button className="hover:text-[var(--accent-cyan)]">Reply</button>
                                        <button className="hover:text-[var(--accent-cyan)]">More actions</button>
                                    </div>

                                    <div className="mt-4 space-y-3 border-l border-white/10 pl-4">
                                        {discussion.replies.map((reply) => (
                                            <div key={reply.id} className="text-sm text-slate-200">
                                                <div
                                                    className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                                                    <span>{reply.author.name}</span>
                                                    <span>· {reply.author.role === "lawyer" ? "⚖️ Attorney" : "🏠 Tenant"}</span>
                                                    <span>· {new Date(reply.createdAt).toLocaleString()}</span>
                                                </div>
                                                <p className="mt-2 text-slate-100">{reply.content}</p>
                                                <div className="mt-2 flex gap-3 text-xs text-slate-400">
                                                    <button className="hover:text-[var(--accent-cyan)]">Reply</button>
                                                    <button className="hover:text-[var(--accent-cyan)]">More actions
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}

function AnswerSection({
                           title,
                           answers,
                           emptyHint,
                       }: {
    title: string;
    answers: typeof mockPost.answers;
    emptyHint: string;
}) {
    return (
        <section className="rounded-2xl border border-white/5 bg-[var(--app-panel)] p-6 shadow-lg shadow-black/20">
            <header className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white">{title}</h2>
                <button className="text-sm font-medium text-[var(--accent-cyan)] hover:text-white">Write answer</button>
            </header>
            <div className="mt-6 space-y-5">
                {answers.length === 0 ? (
                    <p className="rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-slate-400">{emptyHint}</p>
                ) : (
                    answers.map((answer) => (
                        <div key={answer.id} className="rounded-2xl border border-white/10 bg-black/15 p-4">
                            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                                <span>{answer.author.name}</span>
                                <span>· {answer.author.role === "lawyer" ? "⚖️ Attorney" : "🏠 Tenant"}</span>
                                <span>· {new Date(answer.createdAt).toLocaleString()}</span>
                            </div>
                            <div
                                className="mt-3 text-sm leading-relaxed text-slate-100"
                                dangerouslySetInnerHTML={{__html: answer.content}}
                            />
                            <div className="mt-4 flex gap-3 text-xs text-slate-400">
                                <button className="hover:text-white">Edit</button>
                                <button className="hover:text-white">More actions</button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </section>
    );
}
