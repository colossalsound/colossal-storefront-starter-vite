import { Pencil } from "lucide-react";

export function EditorPanel({ onEdit }: { onEdit: () => void }) {
	return (
		<div className="fixed bottom-6 left-1/2 z-9999 -translate-x-1/2">
			<button
				type="button"
				onClick={onEdit}
				className="flex items-center gap-2 rounded-full bg-black px-5 py-2.5 text-sm font-medium text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl active:scale-95"
			>
				<Pencil className="h-3.5 w-3.5" />
				Edit Page
			</button>
		</div>
	);
}
