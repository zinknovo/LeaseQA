import {FaChevronDown, FaChevronRight} from "react-icons/fa";
import {format} from "date-fns";
import {PostSidebarProps} from "../types";

export default function PostSidebar({
                                        groupedPosts,
                                        bucketOpen,
                                        selectedId,
                                        currentRouteId,
                                        onToggleBucket,
                                        onSelectPost,
                                    }: PostSidebarProps) {
    const formatTimestamp = (date: any) => {
        if (!date) return "—";
        try {
            return format(new Date(date), "MMM d");
        } catch {
            return "—";
        }
    };

    const makeSnippet = (text: string) => {
        if (!text) return "";
        const clean = text.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
        return clean.length <= 80 ? clean : `${clean.slice(0, 80)}…`;
    };

    const hasAnyPosts = Object.values(groupedPosts).some(bucket => bucket.items.length > 0);

    if (!hasAnyPosts) {
        return null;
    }

    return (
        <div className="post-sidebar">
            {Object.entries(groupedPosts).map(([key, bucket]) => {
                if (!bucket.items.length) return null;
                const open = bucketOpen[key] ?? true;

                return (
                    <div key={key} className="post-sidebar-group">
                        <button
                            type="button"
                            className="post-sidebar-header"
                            onClick={() => onToggleBucket(key)}
                        >
                            {open ? <FaChevronDown size={10}/> : <FaChevronRight size={10}/>}
                            <span>{bucket.label}</span>
                            <span className="post-sidebar-count">{bucket.items.length}</span>
                        </button>

                        {open && (
                            <div className="post-sidebar-items">
                                {bucket.items.map((post) => {
                                    const isSelected = selectedId === post._id || currentRouteId === post._id;
                                    return (
                                        <div
                                            key={post._id}
                                            className={`post-sidebar-item ${isSelected ? "active" : ""}`}
                                            onClick={() => onSelectPost(post)}
                                        >
                                            <div className="post-sidebar-item-title">{post.summary}</div>
                                            <div className="post-sidebar-item-snippet">
                                                {makeSnippet(post.details)}
                                            </div>
                                            <div className="post-sidebar-item-date">
                                                {formatTimestamp(post.createdAt)}
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
