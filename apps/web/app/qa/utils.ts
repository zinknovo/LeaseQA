import { Folder, Post } from "./types";

export const getFolderDisplayName = (folders: Folder[], folderName: string) => {
    const folder = folders.find(f => f.name === folderName);
    return folder?.displayName || folderName;
};

export const getPostCount = (posts: Post[], folderName: string) => {
    return posts.filter(post => post.folders.includes(folderName)).length;
};