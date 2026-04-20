import { createRootRoute, Outlet } from "@tanstack/react-router";
import { PageEditor } from "@colossal-sh/visual-editor";
import type { ComponentRegistry, FieldLabels } from "@colossal-sh/visual-editor";
import { useQueryClient } from "@tanstack/react-query";
import { ClientShell } from "#/components/system/shell/client-shell";

const registry: ComponentRegistry = {
	ProductGallery: {
		label: "Gallery",
		sourceFile: "src/components/system/product-detail/index.tsx",
		variants: {
			propName: "variant",
			options: [
				{ value: "grid", label: "Grid" },
				{ value: "stack", label: "Stack" },
				{ value: "featured", label: "Featured" },
			],
		},
	},
};

const fieldLabels: FieldLabels = {
	product: {
		name: "Product Name",
		price: "Product Price",
		description: "Product Description",
		tagline: "Product Tagline",
	},
	store: {
		name: "Store Name",
	},
};

export const Route = createRootRoute({
	component: RootComponent,
});

const parentOrigin = import.meta.env.VITE_PARENT_ORIGIN || null;

function RootComponent() {
	return (
		<ClientShell>
			<PreviewEditor>
				<Outlet />
			</PreviewEditor>
		</ClientShell>
	);
}

function PreviewEditor({ children }: { children: React.ReactNode }) {
	const queryClient = useQueryClient();
	return (
		<PageEditor
			registry={registry}
			fieldLabels={fieldLabels}
			parentOrigin={parentOrigin}
			onRefresh={() => queryClient.invalidateQueries()}
		>
			{children}
		</PageEditor>
	);
}
