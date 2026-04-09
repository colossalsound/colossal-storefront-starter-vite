import { useProducts } from "@colossal-sh/storefront-sdk";
import { Link } from "@tanstack/react-router";
import { Search, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { STORE_UID } from "#/lib/constants";

interface SearchOverlayProps {
	open: boolean;
	onClose: () => void;
}

export function SearchOverlay({ open, onClose }: SearchOverlayProps) {
	const [query, setQuery] = useState("");
	const inputRef = useRef<HTMLInputElement>(null);
	const { products } = useProducts(STORE_UID);

	useEffect(() => {
		if (open) {
			setQuery("");
			setTimeout(() => inputRef.current?.focus(), 50);
		}
	}, [open]);

	useEffect(() => {
		if (!open) return;
		function onKeyDown(e: KeyboardEvent) {
			if (e.key === "Escape") onClose();
		}
		window.addEventListener("keydown", onKeyDown);
		return () => window.removeEventListener("keydown", onKeyDown);
	}, [open, onClose]);

	useEffect(() => {
		if (open) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "";
		}
		return () => {
			document.body.style.overflow = "";
		};
	}, [open]);

	const q = query.toLowerCase().trim();

	const productResults = useMemo(() => {
		if (!q) return [];
		return products
			.filter(
				(p) =>
					p.name.toLowerCase().includes(q) ||
					p.tagline?.toLowerCase().includes(q),
			)
			.slice(0, 6);
	}, [q, products]);

	const hasResults = productResults.length > 0;
	const hasQuery = q.length > 0;

	if (!open) return null;

	return (
		<div className="fixed inset-0 z-50 flex flex-col">
			<button
				type="button"
				aria-label="Close search"
				className="absolute inset-0 bg-black/40 backdrop-blur-sm"
				onClick={onClose}
			/>

			<div className="relative mx-auto mt-0 w-full max-w-2xl animate-in fade-in slide-in-from-top-4 duration-200">
				<div className="mx-4 mt-4 overflow-hidden border border-border bg-card shadow-2xl">
					<div className="flex items-center gap-3 border-b border-border px-5 py-4">
						<Search className="h-5 w-5 shrink-0 text-muted-foreground" />
						<input
							ref={inputRef}
							type="text"
							value={query}
							onChange={(e) => setQuery(e.target.value)}
							placeholder="Search products..."
							className="flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground"
						/>

						{query && (
							<button
								type="button"
								onClick={() => setQuery("")}
								className="shrink-0 text-muted-foreground hover:text-foreground"
							>
								<X className="h-4 w-4" />
							</button>
						)}
						<kbd className="hidden shrink-0 border border-border px-2 py-0.5 text-xs text-muted-foreground sm:inline-block">
							ESC
						</kbd>
					</div>

					<div className="max-h-[60vh] overflow-y-auto">
						{!hasQuery && (
							<div className="px-5 py-10 text-center text-muted-foreground text-base">
								Start typing what you want to find...
							</div>
						)}

						{hasQuery && !hasResults && (
							<div className="px-5 py-10 text-center text-sm text-muted-foreground">
								No results for &ldquo;{query}&rdquo;
							</div>
						)}

						{productResults.length > 0 && (
							<div className="px-2 py-3">
								<p className="px-3 py-2 text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">
									Products
								</p>
								{productResults.map((product) => (
									<Link
										key={product.uid}
										to="/product/$uid"
										params={{ uid: product.uid }}
										onClick={onClose}
										className="flex items-center gap-4 px-3 py-3 transition-colors hover:bg-muted"
									>
										{product.imageUrl ? (
											<img
												src={product.imageUrl}
												alt={product.name}
												className="h-12 w-12 shrink-0 object-cover"
											/>
										) : (
											<div className="h-12 w-12 shrink-0 bg-muted" />
										)}
										<div className="min-w-0 flex-1">
											<p className="truncate text-sm font-medium">
												{product.name}
											</p>
											{product.tagline && (
												<p className="truncate text-xs text-muted-foreground">
													{product.tagline}
												</p>
											)}
										</div>
										<span className="shrink-0 text-sm font-medium">
											{product.formattedPrice}
										</span>
									</Link>
								))}
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
