import { useCartContext } from "@colossal-sh/storefront-sdk";
import { Link } from "@tanstack/react-router";
import { Search } from "lucide-react";

interface HeaderProps {
	storeName: string;
	onSearchClick?: () => void;
}

export function Header({ storeName, onSearchClick }: HeaderProps) {
	const { items, openCart } = useCartContext();
	const cartItemCount = items.length;

	return (
		<header className="sticky top-0 z-40 w-full border-b border-border bg-background">
			<div className="mx-auto flex h-14 max-w-[1400px] items-center justify-between px-4 sm:px-6 lg:px-8">
				<Link
					to="/"
					className="text-sm font-semibold uppercase tracking-[0.12em]"
				>
					{storeName}
				</Link>
				<div className="flex items-center gap-1.5">
					<button
						type="button"
						onClick={onSearchClick}
						className="flex items-center gap-1 border border-border px-4 py-1.5 text-sm font-medium transition-colors hover:bg-muted"
					>
						<Search className="mr-1 h-4 w-4" strokeWidth={1.75} />
						Search
					</button>

					<button
						type="button"
						onClick={() => openCart?.()}
						className="flex items-center gap-1.5 border border-border px-4 py-1.5 text-sm font-medium transition-colors hover:bg-muted"
						aria-label={`Shopping cart${cartItemCount > 0 ? `, ${cartItemCount} items` : ""}`}
					>
						Cart
						<span className="flex h-5 min-w-5 items-center justify-center bg-foreground px-1 text-xs font-semibold text-background">
							{cartItemCount}
						</span>
					</button>
				</div>
			</div>
		</header>
	);
}
