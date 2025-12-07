import {FaChevronDown, FaChevronRight} from "react-icons/fa";
import {format} from "date-fns";
import {useMemo} from "react";
import {Post, RecencySidebarProps} from "../types";

export default function RecencySidebar({
    posts,
    currentPostId,
    onSelectPost,
    folderDisplayMap = {},
    bucketOpen,
    onToggleBucket,
}: RecencySidebarProps) {
    const grouped = useMemo(() => {
        const now = new Date();
        const buckets: Record<string, {label: string; items: Post[]}> = {
            thisWeek: {label: "This week", items: []},
            lastWeek: {label: "Last week", items: []},
            thisMonth: {label: "Earlier this month", items: []},
            earlier: {label: "Earlier", items: []},
        };

        const sorted = [...posts].sort((a, b) => {
            const da = new Date(a.createdAt || a.updatedAt || 0).getTime();
            const db = new Date(b.createdAt || b.updatedAt || 0).getTime();
            return db - da;
        });

        sorted.forEach((p) => {
            const created = new Date(p.createdAt || 0);
            const diffDays = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
            if (diffDays <= 6) buckets.thisWeek.items.push(p);
            else if (diffDays <= 13) buckets.lastWeek.items.push(p);
            else if (diffDays <= 30) buckets.thisMonth.items.push(p);
            else buckets.earlier.items.push(p);
        });

        return buckets;
    }, [posts]);

    const hasAny = Object.values(grouped).some((b) => b.items.length);
    if (!hasAny) return null;

    const makeSnippet = (text: string) => {
        if (!text) return "";
        const clean = text.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
        return clean;
    };

    const getAuthor = (p: Post) => p.author?.username || p.author?.email || "Anonymous";
    const getRole = (p: Post) => p.author?.role || "tenant";
    const getFolder = (p: Post) => {
        const key = p.folders?.[0];
        return key ? folderDisplayMap[key] || key : "";
    };

    return (
        <div className="post-sidebar">
            {Object.entries(grouped).map(([key, bucket]) => {
                if (!bucket.items.length) return null;
                const isOpen = bucketOpen[key] ?? true;
                return (
                    <div className="post-sidebar-group" key={key}>
                        <button
                            type="button"
                            className="post-sidebar-header"
                            onClick={() => onToggleBucket(key)}
                        >
                            {isOpen ? <FaChevronDown size={10}/> : <FaChevronRight size={10}/>}
                            <span>{bucket.label}</span>
                            <span className="post-sidebar-count">{bucket.items.length}</span>
                        </button>
                        {isOpen && (
                            <div className="post-sidebar-items">
                                {bucket.items.map((p) => {
                                    const isActive = p._id === currentPostId;
                                    return (
                                        <div
                                            key={p._id}
                                            className={`post-sidebar-item ${isActive ? "active" : ""}`}
                                            onClick={() => onSelectPost(p._id)}
                                        >
                                            <div className="post-sidebar-item-title mb-1">{p.summary}</div>
                                            <div className="d-flex gap-1 flex-wrap mb-2" style={{fontSize: "0.65rem"}}>
                                                <span className="badge rounded-pill bg-light text-secondary border text-uppercase">
                                                    {getRole(p)}
                                                </span>
                                                <span className="badge rounded-pill bg-light text-secondary border text-uppercase">
                                                    {p.createdAt ? format(new Date(p.createdAt), "MMM d") : ""}
                                                </span>
                                                {getFolder(p) && (
                                                    <span className="badge rounded-pill bg-light text-secondary border text-capitalize">
                                                        {getFolder(p)}
                                                    </span>
                                                )}
                                            </div>
                                            <div
                                                className="post-sidebar-item-snippet"
                                                style={{
                                                    display: "-webkit-box",
                                                    WebkitLineClamp: 2,
                                                    WebkitBoxOrient: "vertical",
                                                    overflow: "hidden",
                                                }}
                                            >
                                                {makeSnippet(p.details || "")}
                                            </div>
                                            <div className="post-sidebar-item-meta text-secondary small text-truncate mt-1">
                                                {getAuthor(p)}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
