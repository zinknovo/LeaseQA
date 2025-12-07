export type ComposeState = {
    summary: string;
    details: string;
    folders: string[];
    postType: "question" | "note";
    audience: "everyone" | "admin";
    files: File[];
};

export const INITIAL_COMPOSE_STATE: ComposeState = {
    summary: "",
    details: "",
    folders: [],
    postType: "question",
    audience: "everyone",
    files: [],
};
