import { createRootRoute, Outlet } from "@tanstack/react-router";
import { PuckEditor } from "#/components/system/puck/puck-editor";
import { ClientShell } from "#/components/system/shell/client-shell";

export const Route = createRootRoute({
	component: RootComponent,
});

function RootComponent() {
	return (
		<ClientShell>
			<PuckEditor>
				<Outlet />
			</PuckEditor>
		</ClientShell>
	);
}
