import {
	CartProvider,
	initStorefrontClient,
	useStore,
} from "@colossal-sh/storefront-sdk";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { API_URL, STORE_UID } from "#/lib/constants";
import { CartDrawer } from "./cart-drawer";
import { Footer } from "./footer";
import { Header } from "./header";
import { SearchOverlay } from "./search-overlay";

if (API_URL) {
	initStorefrontClient({ url: API_URL });
}

const queryClient = new QueryClient();

export function ClientShell({ children }: { children: React.ReactNode }) {
	const [cartOpen, setCartOpen] = useState(false);
	const [searchOpen, setSearchOpen] = useState(false);

	return (
		<QueryClientProvider client={queryClient}>
			<CartProvider storeUid={STORE_UID}>
				<StoreShell
					cartOpen={cartOpen}
					setCartOpen={setCartOpen}
					searchOpen={searchOpen}
					setSearchOpen={setSearchOpen}
				>
					{children}
				</StoreShell>
			</CartProvider>
		</QueryClientProvider>
	);
}

function StoreShell({
	children,
	cartOpen,
	setCartOpen,
	searchOpen,
	setSearchOpen,
}: {
	children: React.ReactNode;
	cartOpen: boolean;
	setCartOpen: (open: boolean) => void;
	searchOpen: boolean;
	setSearchOpen: (open: boolean) => void;
}) {
	const { data } = useStore({ uid: STORE_UID });
	const storeName = data?.storeDetails?.name ?? "Your Store";

	return (
		<>
			<Header storeName={storeName} onSearchClick={() => setSearchOpen(true)} />

			<main className="min-h-[calc(100vh-4rem)]">{children}</main>

			<Footer storeName={storeName} />

			<CartDrawer open={cartOpen} onOpenChange={setCartOpen} />

			<SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
		</>
	);
}
