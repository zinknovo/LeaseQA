import {FaChevronDown} from "react-icons/fa";
import {format} from "date-fns";

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
    if (!posts.length) return null;

    return (
        <div className="post-sidebar">
            <div className="post-sidebar-group">
                <div className="post-sidebar-header">
                    <FaChevronDown size={10}/>
                    <span>Recent Posts</span>
                    <span className="post-sidebar-count">{posts.length}</span>
                </div>
                <div className="post-sidebar-items">
                    {posts.slice(0, 15).map((p) => {
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
            </div>
        </div>
    );
}
