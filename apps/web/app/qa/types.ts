export type Folder = {
    _id: string;
    name: string;
    displayName: string;
    description: string;
    color: string;
};

export type Post = {
    _id: string;
    summary: string;
    details: string;
    postType: "question" | "announcement" | "note" | "poll";
    visibility: "class" | "private";
    audience?: "everyone" | "admin";
    folders: string[];
    attachments?: {
        filename: string;
        url: string;
        mimetype?: string;
        size?: number;
    }[];
    authorId: string;
    lawyerOnly: boolean;
    fromAIReviewId: string | null;
    urgency: "low" | "medium" | "high";
    viewCount: number;
    isResolved: boolean;
    createdAt: string;
    updatedAt: string;
    lastActivityAt: string;
    author?: UserSummary | null;
    answers?: Answer[];
    discussions?: Discussion[];
};

export type Answer = {
    _id: string;
    postId: string;
    authorId: string;
    answerType: "lawyer_opinion" | "community_answer";
    content: string;
    isAccepted?: boolean;
    createdAt?: string;
    updatedAt?: string;
    author?: UserSummary | null;
};

export type Discussion = {
    _id: string;
    postId: string;
    parentId?: string | null;
    authorId: string;
    content: string;
    isResolved?: boolean;
    createdAt?: string;
    updatedAt?: string;
    replies?: Discussion[];
    author?: UserSummary | null;
};

export type UserSummary = {
    _id?: string;
    id?: string;
    username?: string;
    email?: string;
    role?: string;
};

export type Stat = {
    label: string;
    value: number;
};

export type FeedHeaderProps = {
    folders: Folder[];
    posts: Post[];
    activeFolder: string | null;
    onSelectFolderAction: (folderName: string) => void;
};

export type PostDetailProps = {
    post: Post | null;
    folders: Folder[];
};

export type NavTabsProps = {
    active?: "qa" | "resources" | "stats" | "manage";
};
