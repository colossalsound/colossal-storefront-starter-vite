import {
	CartProvider,
	initStorefrontClient,
	useStore,
} from "@colossal-sh/storefront-sdk";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { API_URL, STORE_UID } from "#/lib/constants";
import { CartDrawer } from "#/components/store/cart-drawer";
import { Footer } from "#/components/store/footer";
import { Header } from "#/components/store/header";
import { SearchOverlay } from "#/components/store/search-overlay";

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
			<Header storeName={storeName} onSearchClick={() => setSearchOpen(true)} buttonStyle="default" size='default' layout='standard' links={[]} floating={false} />

			<main className="min-h-[calc(100vh-4rem)]">{children}</main>

			<Footer
					storeName={storeName}
					description="A curated collection of literature for the discerning reader. Every title hand-selected, every edition considered."
				/>

			<CartDrawer open={cartOpen} onOpenChange={setCartOpen} />

			<SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
		</>
	);
}
