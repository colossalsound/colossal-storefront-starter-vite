import type { Data } from "@puckeditor/core";
import { Render } from "@puckeditor/core";
import { useLocation } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { getDefaultData } from "#/lib/puck-defaults";
import config from "#/puck.config";

function normalizePath(pathname: string): string {
	if (/^\/product\/[^/]+$/.test(pathname)) return "/product/$uid";
	return pathname;
}

function pathToFileName(pagePath: string): string {
	const normalized = normalizePath(pagePath);
	const sanitized = normalized.replace(/[^a-zA-Z0-9/\-_$[\]]/g, "");
	return sanitized === "/"
		? "index"
		: sanitized.replace(/^\//, "").replace(/\//g, "--");
}

async function loadSavedData(pathname: string): Promise<Data | null> {
	const fileName = pathToFileName(pathname);
	try {
		const res = await fetch(`/puck-data/${fileName}.json`);
		if (!res.ok) return null;
		return await res.json();
	} catch {
		return null;
	}
}

export function PuckEditor({ children }: { children: React.ReactNode }) {
	const { pathname } = useLocation();
	const [isEditing, setIsEditing] = useState(false);
	const [savedData, setSavedData] = useState<Data | null>(null);
	const [editingData, setEditingData] = useState<Data | null>(null);
	const [loaded, setLoaded] = useState(false);

	useEffect(() => {
		setLoaded(false);
		setSavedData(null);
		setIsEditing(false);
		setEditingData(null);

		loadSavedData(pathname).then((data) => {
			if (data) setSavedData(data);
			setLoaded(true);
		});
	}, [pathname]);

	const startEditing = useCallback(() => {
		setEditingData(savedData || getDefaultData(pathname));
		setIsEditing(true);
	}, [savedData, pathname]);

	const stopEditing = useCallback(() => {
		setIsEditing(false);
		setEditingData(null);
	}, []);

	const handlePublish = useCallback(
		async (data: Data) => {
			const fileName = pathToFileName(pathname);
			await fetch("/__puck_save", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ fileName, data }),
			});
			setSavedData(data);
			setIsEditing(false);
			setEditingData(null);
		},
		[pathname],
	);

	// Dev-only: full editor mode
	if (import.meta.env.DEV && isEditing && editingData) {
		return (
			<DevEditor
				data={editingData}
				onPublish={handlePublish}
				onExit={stopEditing}
			/>
		);
	}

	const defaultData = getDefaultData(pathname);
	const hasDefaults = defaultData.content.length > 0;
	const hasPuckContent = savedData || hasDefaults;
	const renderData = savedData ?? (hasDefaults ? defaultData : null);

	return (
		<>
			{loaded && renderData ? (
				<Render config={config} data={renderData} />
			) : (
				children
			)}
			{import.meta.env.DEV && hasPuckContent && (
				<DevEditButton onEdit={startEditing} />
			)}
		</>
	);
}

// These components are only used within import.meta.env.DEV blocks,
// so Vite will dead-code eliminate them in production builds.
function DevEditor(_props: {
	data: Data;
	onPublish: (data: Data) => Promise<void>;
	onExit: () => void;
}) {
	// Dynamic import so editor code is not in the main bundle
	const [Editor, setEditor] = useState<React.ComponentType<{
		data: Data;
		onPublish: (data: Data) => Promise<void>;
		onExit: () => void;
	}> | null>(null);

	useEffect(() => {
		import("./puck-editor-inline").then((m) => setEditor(() => m.default));
	}, []);

	if (!Editor) return null;
	return <Editor {..._props} />;
}

function DevEditButton({ onEdit }: { onEdit: () => void }) {
	const [Panel, setPanel] = useState<React.ComponentType<{
		onEdit: () => void;
	}> | null>(null);

	useEffect(() => {
		import("./editor-panel").then((m) => setPanel(() => m.EditorPanel));
	}, []);

	if (!Panel) return null;
	return <Panel onEdit={onEdit} />;
}
