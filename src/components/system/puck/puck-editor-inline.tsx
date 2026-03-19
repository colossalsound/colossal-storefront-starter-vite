import type { Data } from "@puckeditor/core";
import { Puck, usePuck } from "@puckeditor/core";
import { useCallback, useState } from "react";
import "@puckeditor/core/puck.css";
import { Redo2, Save, Undo2, X } from "lucide-react";
import config from "#/puck.config";

interface Props {
	data: Data;
	onPublish: (data: Data) => Promise<void>;
	onExit: () => void;
}

export default function PuckEditorInline({ data, onPublish, onExit }: Props) {
	return (
		<div className="puck-inline-edit">
			<Puck
				config={config}
				data={data}
				onPublish={onPublish}
				iframe={{ enabled: false }}
			>
				<Puck.Preview />
				<InlineEditControls onPublish={onPublish} onExit={onExit} />
			</Puck>
		</div>
	);
}

function InlineEditControls({
	onPublish,
	onExit,
}: {
	onPublish: (data: Data) => Promise<void>;
	onExit: () => void;
}) {
	const { appState, history } = usePuck();
	const [saving, setSaving] = useState(false);

	const handleSave = useCallback(async () => {
		setSaving(true);
		await onPublish(appState.data);
		setSaving(false);
	}, [appState.data, onPublish]);

	return (
		<div className="fixed bottom-6 left-1/2 z-9999 -translate-x-1/2">
			<div className="flex items-center gap-1 rounded-full border border-white/10 bg-black px-2 py-1.5 text-white shadow-2xl">
				<div className="flex items-center gap-2 pl-3 pr-2">
					<span className="relative flex h-2 w-2">
						<span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
						<span className="relative inline-flex h-2 w-2 rounded-full bg-green-400" />
					</span>
					<span className="text-sm font-medium">Editing</span>
				</div>

				<div className="mx-1 h-5 w-px bg-white/20" />

				<button
					type="button"
					onClick={() => history.back()}
					disabled={!history.hasPast}
					className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-white/15 disabled:opacity-30"
					title="Undo"
				>
					<Undo2 className="h-4 w-4" />
				</button>
				<button
					type="button"
					onClick={() => history.forward()}
					disabled={!history.hasFuture}
					className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-white/15 disabled:opacity-30"
					title="Redo"
				>
					<Redo2 className="h-4 w-4" />
				</button>

				<div className="mx-1 h-5 w-px bg-white/20" />

				<button
					type="button"
					onClick={handleSave}
					disabled={saving}
					className="flex items-center gap-1.5 rounded-full bg-white/15 px-4 py-1.5 text-sm font-medium transition-colors hover:bg-white/25 disabled:opacity-50"
				>
					<Save className="h-3.5 w-3.5" />
					{saving ? "Saving..." : "Save"}
				</button>

				<button
					type="button"
					onClick={onExit}
					className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-white/15"
					title="Exit editor"
				>
					<X className="h-4 w-4" />
				</button>
			</div>
		</div>
	);
}
