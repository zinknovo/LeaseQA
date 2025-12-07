"use client";

import {useEffect, useMemo, useState} from "react";
import {useSelector} from "react-redux";
import {useRouter} from "next/navigation";
import * as client from "../client";
import {RootState} from "@/app/store";
import {Folder} from "../types";
import {ManageHeader, ManageAlerts, CreateSectionForm, SectionsTable} from "./components";

type FolderDraft = {
    name: string;
    displayName: string;
    description?: string;
    color?: string;
};

const EMPTY_DRAFT: FolderDraft = {name: "", displayName: "", description: "", color: ""};

export default function ManageSectionsPage() {
    const router = useRouter();
    const session = useSelector((state: RootState) => state.session);
    const isAdmin = session.user?.role === "admin";

    const [folders, setFolders] = useState<Folder[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [showCreateForm, setShowCreateForm] = useState(false);
    const [newFolder, setNewFolder] = useState<FolderDraft>(EMPTY_DRAFT);

    const [editingId, setEditingId] = useState<string | null>(null);
    const [drafts, setDrafts] = useState<Record<string, FolderDraft>>({});

    const sortedFolders = useMemo(
        () => [...folders].sort((a, b) => a.displayName.localeCompare(b.displayName)),
        [folders]
    );

    const loadFolders = async () => {
        try {
            setLoading(true);
            setError("");
            const res = await client.fetchFolders();
            setFolders((res as any)?.data || res || []);
        } catch (err: any) {
            setError(err.message || "Failed to load sections");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isAdmin) loadFolders();
    }, [isAdmin]);

    if (!isAdmin) {
        return (
            <div className="manage-empty">
                <h2>Admin Only</h2>
                <p>You need admin permissions to manage sections.</p>
                <button className="manage-btn primary" onClick={() => router.push("/qa")}>
                    Back to Q&A
                </button>
            </div>
        );
    }

    const handleSaveNew = async () => {
        setError("");
        setSuccess("");
        if (!newFolder.name.trim() || !newFolder.displayName.trim()) {
            setError("Name and Display Name are required.");
            return;
        }
        try {
            await client.createFolder({
                name: newFolder.name.trim(),
                displayName: newFolder.displayName.trim(),
                description: newFolder.description?.trim() || "",
                color: newFolder.color || undefined,
            });
            setNewFolder(EMPTY_DRAFT);
            setShowCreateForm(false);
            setSuccess("Section created successfully.");
            loadFolders();
        } catch (err: any) {
            setError(err.message || "Failed to create section");
        }
    };

    const handleCancelCreate = () => {
        setNewFolder(EMPTY_DRAFT);
        setShowCreateForm(false);
        setError("");
    };

    const handleEdit = (id: string) => {
        const folder = folders.find((f) => f._id === id);
        if (folder) {
            setDrafts((prev) => ({
                ...prev,
                [id]: {
                    name: folder.name,
                    displayName: folder.displayName,
                    description: folder.description || "",
                    color: folder.color,
                },
            }));
            setEditingId(id);
        }
    };

    const handleDraftChange = (id: string, field: keyof FolderDraft, value: string) => {
        setDrafts((prev) => ({
            ...prev,
            [id]: {...prev[id], [field]: value},
        }));
    };

    const handleSaveEdit = async (id: string) => {
        setError("");
        setSuccess("");
        const draft = drafts[id];
        if (!draft?.displayName?.trim()) {
            setError("Display Name is required.");
            return;
        }
        try {
            await client.updateFolder(id, {
                displayName: draft.displayName.trim(),
                description: draft.description?.trim() || "",
                color: draft.color,
            });
            setEditingId(null);
            setDrafts((prev) => {
                const next = {...prev};
                delete next[id];
                return next;
            });
            setSuccess("Section updated successfully.");
            loadFolders();
        } catch (err: any) {
            setError(err.message || "Failed to update section");
        }
    };

    const handleCancelEdit = (id: string) => {
        setEditingId(null);
        setDrafts((prev) => {
            const next = {...prev};
            delete next[id];
            return next;
        });
    };

    const handleDelete = async (id: string) => {
        setError("");
        setSuccess("");
        const target = folders.find((f) => f._id === id);
        if (!window.confirm(`Delete section "${target?.displayName || ""}"?`)) return;
        try {
            await client.deleteFolder(id);
            setSuccess("Section deleted.");
            loadFolders();
        } catch (err: any) {
            setError(err.message || "Failed to delete section");
        }
    };

    return (
        <div className="manage-page">
            <ManageHeader
                loading={loading}
                showCreateForm={showCreateForm}
                onRefresh={loadFolders}
                onShowCreate={() => setShowCreateForm(true)}
            />

            <ManageAlerts
                error={error}
                success={success}
                onClearError={() => setError("")}
                onClearSuccess={() => setSuccess("")}
            />

            {showCreateForm && (
                <CreateSectionForm
                    draft={newFolder}
                    loading={loading}
                    onDraftChange={setNewFolder}
                    onSave={handleSaveNew}
                    onCancel={handleCancelCreate}
                />
            )}

            <SectionsTable
                folders={sortedFolders}
                editingId={editingId}
                drafts={drafts}
                onEdit={handleEdit}
                onDraftChange={handleDraftChange}
                onSave={handleSaveEdit}
                onCancelEdit={handleCancelEdit}
                onDelete={handleDelete}
            />
        </div>
    );
}
