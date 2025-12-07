import {FaChevronDown} from "react-icons/fa";
import {format} from "date-fns";
import {useMemo, useState} from "react";

type Post = {
    _id: string;
    summary: string;
    folders?: string[];
    createdAt?: string;
};

type RecencySidebarProps = {
    posts: Post[];
    currentPostId: string;
    onSelectPost: (id: string) => void;
};

export default function RecencySidebar({posts, currentPostId, onSelectPost}: RecencySidebarProps) {
    const [open, setOpen] = useState<Record<string, boolean>>({
        thisWeek: true,
        lastWeek: true,
        thisMonth: false,
        earlier: false,
    });

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

    return (
        <div className="post-sidebar">
            {Object.entries(grouped).map(([key, bucket]) => {
                if (!bucket.items.length) return null;
                const isOpen = open[key];
                return (
                    <div className="post-sidebar-group" key={key}>
                        <button
                            type="button"
                            className="post-sidebar-header border-0 bg-transparent w-100 text-start"
                            onClick={() => setOpen((prev) => ({...prev, [key]: !prev[key]}))}
                        >
                            <FaChevronDown size={10} className={isOpen ? "" : "rotate-90"}/>
                            <span>{bucket.label}</span>
                            <span className="post-sidebar-count">{bucket.items.length}</span>
                        </button>
                        {isOpen && (
                            <div className="post-sidebar-items">
                                {bucket.items.slice(0, 15).map((p) => {
                                    const isActive = p._id === currentPostId;
                                    return (
                                        <div
                                            key={p._id}
                                            className={`post-sidebar-item ${isActive ? "active" : ""}`}
                                            onClick={() => onSelectPost(p._id)}
                                        >
                                            <div className="post-sidebar-item-title">{p.summary}</div>
                                            <div className="post-sidebar-item-meta">
                                                <span>{p.createdAt ? format(new Date(p.createdAt), "MMM d") : ""}</span>
                                                <span>{p.folders?.slice(0, 2).join(" · ")}</span>
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
