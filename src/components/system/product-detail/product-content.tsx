import type { SlotComponent } from "@puckeditor/core";

interface ProductContentProps {
	items: SlotComponent;
	puck: { dragRef: ((element: Element | null) => void) | null };
}

export function ProductContentRenderer({ items, puck }: ProductContentProps) {
	return (
		<div
			ref={puck.dragRef as React.Ref<HTMLDivElement>}
			className="lg:sticky lg:top-24"
		>
			{items({
				style: {
					display: "flex",
					flexDirection: "column",
					gap: "1.5rem",
				},
			})}
		</div>
	);
}
