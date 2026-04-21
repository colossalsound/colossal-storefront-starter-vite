import { Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, Plus, ShoppingBag } from "lucide-react";
import { useCallback, useState } from "react";
import { Button } from "#/components/ui/button";
import type { SimpleProduct } from "@colossal-sh/storefront-sdk";

export type CardHoverEffect = "lift" | "shadow";
export type CardCartButton = "outline" | "ghost" | "icon-only" | "overlay";
export type CardCartButtonIcon = "bag" | "plus";
export type CardCarousel = "none" | "hover";

export interface ProductCardProps {
	product: SimpleProduct;
	onAddToCart?: (productUid: string) => void;
	index?: number;
	hoverEffect?: CardHoverEffect;
	cartButton?: CardCartButton;
	cartButtonIcon?: CardCartButtonIcon;
	carousel?: CardCarousel;
}

export function ProductCard({
	product,
	onAddToCart,
	index = 0,
	hoverEffect = "lift",
	cartButton = "outline",
	cartButtonIcon = "bag",
	carousel = "hover",
}: ProductCardProps) {
	const images = product.images;
	const [activeIndex, setActiveIndex] = useState(0);

	const prev = useCallback(
		(e: React.MouseEvent) => {
			e.stopPropagation();
			setActiveIndex((i) => (i === 0 ? images.length - 1 : i - 1));
		},
		[images.length],
	);

	const next = useCallback(
		(e: React.MouseEvent) => {
			e.stopPropagation();
			setActiveIndex((i) => (i === images.length - 1 ? 0 : i + 1));
		},
		[images.length],
	);

	const goTo = useCallback((i: number) => {
		setActiveIndex(i);
	}, []);

	const isOverlay = cartButton === "overlay";
	const showDots = carousel === "hover" && !isOverlay && images.length > 1;
	const showArrows = carousel === "hover" && images.length > 1;

	const hoverClasses =
		hoverEffect === "lift"
			? "group-hover:-translate-y-1 group-hover:shadow-2xl group-hover:shadow-black/8"
			: "group-hover:border-border group-hover:shadow-lg group-hover:shadow-black/5";

	const CartIcon = cartButtonIcon === "plus" ? Plus : ShoppingBag;

	return (
		<div
			className="group flex h-full flex-col"
			style={{
				animation: "fade-up 0.6s ease-out both",
				animationDelay: `${index * 100}ms`,
			}}
		>
			<div
				className={`flex h-full flex-col overflow-hidden rounded-lg border border-border/60 bg-card transition-all duration-500 ${hoverClasses}`}
			>
				{/* Image */}
				<div
					data-editor-ignore
					className="relative aspect-4/5 overflow-hidden border-b border-border bg-muted/20"
				>
					{images.length > 0 ? (
						<>
							<Link
								to="/product/$uid"
								params={{ uid: product.uid }}
								className="block h-full"
							>
								<div
									className={`flex h-full transition-transform duration-500 ease-out ${hoverEffect === "shadow" ? "group-hover:scale-[1.03]" : ""}`}
									style={{
										transform: `translateX(-${activeIndex * 100}%)`,
									}}
								>
									{images.map((src, i) => (
										<img
											key={src}
											src={src}
											alt={`${product.name} - ${i + 1}`}
											className="h-full w-full shrink-0 object-cover"
										/>
									))}
								</div>
							</Link>

							{showArrows && (
								<>
									<button
										type="button"
										onClick={prev}
										className="absolute left-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center border border-border/40 bg-background/90 text-foreground opacity-0 backdrop-blur-sm transition-all group-hover:opacity-100"
									>
										<ChevronLeft className="h-3.5 w-3.5" />
									</button>
									<button
										type="button"
										onClick={next}
										className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center border border-border/40 bg-background/90 text-foreground opacity-0 backdrop-blur-sm transition-all group-hover:opacity-100"
									>
										<ChevronRight className="h-3.5 w-3.5" />
									</button>
								</>
							)}

							{showDots && (
								<div className="absolute bottom-3 left-0 right-0 flex items-center justify-center gap-1.5">
									{images.map((imgSrc, i) => (
										<button
											type="button"
											key={imgSrc}
											onClick={(e) => {
												e.stopPropagation();
												goTo(i);
											}}
											className={`h-1.5 transition-all ${
												i === activeIndex
													? "w-5 bg-foreground"
													: "w-1.5 bg-foreground/30"
											}`}
										/>
									))}
								</div>
							)}

							{/* Overlay footer */}
							{isOverlay && (
								<button
									type="button"
									className="absolute inset-x-0 bottom-0 flex translate-y-0 cursor-pointer items-center justify-center bg-primary py-2.5 text-[10px] font-medium uppercase tracking-[0.2em] text-primary-foreground transition-transform duration-300 ease-out hover:opacity-90 md:translate-y-full md:group-hover:translate-y-0"
									onClick={(e) => {
										e.preventDefault();
										e.stopPropagation();
										onAddToCart?.(product.uid);
									}}
								>
									Add to Bag
								</button>
							)}
						</>
					) : (
						<Link
							to="/product/$uid"
							params={{ uid: product.uid }}
							className="flex h-full items-center justify-center bg-muted"
						>
							<span className="font-display text-7xl italic text-muted-foreground/20">
								{product.name.charAt(0)}
							</span>
						</Link>
					)}
				</div>

				{/* Content */}
				<div className="flex flex-1 flex-col p-5 sm:p-6">
					<Link
						to="/product/$uid"
						params={{ uid: product.uid }}
						className="block"
					>
						<h3
							className="font-display text-lg font-semibold leading-tight"
							data-editable-entity="product"
							data-editable-id={product.uid}
							data-editable-field="name"
						>
							{product.name}
						</h3>
					</Link>

					{product.tagline && (
						<p
							className="mt-2 text-sm leading-relaxed text-muted-foreground line-clamp-2"
							data-editable-entity="product"
							data-editable-id={product.uid}
							data-editable-field="tagline"
						>
							{product.tagline}
						</p>
					)}

					{isOverlay && (
						<p
							className="mt-auto pt-3 text-sm font-semibold tracking-wide"
							data-editable-entity="product"
							data-editable-id={product.uid}
							data-editable-field="price"
						>
							{product.formattedPrice}
						</p>
					)}

					{!isOverlay && (
						<div className="mt-auto flex items-center justify-between gap-3 border-t border-border/60 pt-4">
							<p
								className="text-sm font-semibold tracking-wide"
								data-editable-entity="product"
								data-editable-id={product.uid}
								data-editable-field="price"
							>
								{product.formattedPrice}
							</p>

							{cartButton === "outline" && (
								<Button
									variant="outline"
									size="sm"
									className="cursor-pointer gap-2 border-primary/35 bg-background/90 px-3 text-[11px] font-semibold uppercase tracking-[0.18em] hover:bg-secondary"
									onClick={() => onAddToCart?.(product.uid)}
								>
									<ShoppingBag className="h-3.5 w-3.5" />
									Add to Bag
								</Button>
							)}

							{cartButton === "ghost" && (
								<Button
									variant="ghost"
									size="sm"
									className="cursor-pointer gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground"
									onClick={() => onAddToCart?.(product.uid)}
								>
									<CartIcon className="h-3.5 w-3.5" />
									Add
								</Button>
							)}

							{cartButton === "icon-only" && (
								<Button
									variant="ghost"
									size="icon-sm"
									className="cursor-pointer text-muted-foreground hover:text-foreground"
									onClick={() => onAddToCart?.(product.uid)}
									aria-label="Add to cart"
								>
									<CartIcon className="h-4 w-4" />
								</Button>
							)}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
