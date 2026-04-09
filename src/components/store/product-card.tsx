import { Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, ShoppingBag } from "lucide-react";
import { useCallback, useState } from "react";
import { Button } from "#/components/ui/button";
import type { SimpleProduct } from "@colossal-sh/storefront-sdk";
const GRADIENTS = [
	"linear-gradient(145deg, #e8e8e8 0%, #c8c8c8 100%)",
	"linear-gradient(145deg, #e0e0e0 0%, #b8b8b8 100%)",
	"linear-gradient(145deg, #eaeaea 0%, #d0d0d0 100%)",
	"linear-gradient(145deg, #dcdcdc 0%, #b0b0b0 100%)",
	"linear-gradient(145deg, #ececec 0%, #c4c4c4 100%)",
	"linear-gradient(145deg, #d8d8d8 0%, #a8a8a8 100%)",
	"linear-gradient(145deg, #e4e4e4 0%, #cccccc 100%)",
	"linear-gradient(145deg, #dedede 0%, #bababa 100%)",
];

interface ProductCardProps {
	product: SimpleProduct;
	onAddToCart?: (productUid: string) => void;
	index?: number;
}

export function ProductCard({
	product,
	onAddToCart,
	index = 0,
}: ProductCardProps) {
	const gradient = GRADIENTS[index % GRADIENTS.length];
	const images = product.images;
	const [activeIndex, setActiveIndex] = useState(0);

	const goTo = useCallback((i: number) => {
		setActiveIndex(i);
	}, []);

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

	return (
		<div
			className="group animate-in fade-in slide-in-from-bottom-4 duration-700"
			style={{
				animationDelay: `${index * 80}ms`,
				animationFillMode: "both",
			}}
		>
			<div className="overflow-hidden rounded-lg border border-border bg-card/90 transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-2xl group-hover:shadow-black/8">
				{/* Image carousel */}
				<div
					data-editor-ignore
					className="relative aspect-4/5 overflow-hidden border-b border-border bg-muted/40"
				>
					{images.length > 0 ? (
						<>
							<Link
								to="/product/$uid"
								params={{ uid: product.uid }}
								className="block h-full"
							>
								<div
									className="flex h-full transition-transform duration-300 ease-out"
									style={{ transform: `translateX(-${activeIndex * 100}%)` }}
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

							{/* Arrows */}
							{images.length > 1 && (
								<>
									<button
										type="button"
										onClick={prev}
										className="absolute left-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md border border-border bg-background/85 text-foreground opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100"
									>
										<ChevronLeft className="h-4 w-4" />
									</button>
									<button
										type="button"
										onClick={next}
										className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md border border-border bg-background/85 text-foreground opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100"
									>
										<ChevronRight className="h-4 w-4" />
									</button>
								</>
							)}

							{/* Dots */}
							{images.length > 1 && (
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
													? "w-5 bg-primary"
													: "w-1.5 bg-white/55"
											}`}
										/>
									))}
								</div>
							)}
						</>
					) : (
						<Link
							to="/product/$uid"
							params={{ uid: product.uid }}
							className="block h-full"
						>
							<div className="h-full w-full" style={{ background: gradient }} />
						</Link>
					)}
				</div>

				{/* Content */}
				<div className="p-5 sm:p-6">
					<p className="text-[11px] font-medium uppercase tracking-[0.24em] text-muted-foreground">
						Atelier Made
					</p>
					<Link
						to="/product/$uid"
						params={{ uid: product.uid }}
						className="block"
					>
						<h3
							className="mt-2 font-display text-lg font-semibold leading-tight hover:underline"
							data-editable-entity="product"
							data-editable-id={product.uid}
							data-editable-field="name"
						>
							{product.name}
						</h3>
					</Link>

					{product.tagline && (
						<p
							className="mt-2 text-sm leading-6 text-muted-foreground line-clamp-2"
							data-editable-entity="product"
							data-editable-id={product.uid}
							data-editable-field="tagline"
						>
							{product.tagline}
						</p>
					)}

					<div className="mt-5 flex items-center justify-between gap-3 border-t border-border pt-4">
						<p
							className="text-base font-semibold tracking-[0.08em] text-gray-900"
							data-editable-entity="product"
							data-editable-id={product.uid}
							data-editable-field="price"
						>
							{product.formattedPrice}
						</p>

						<Button
							variant="outline"
							size="sm"
							className="gap-2 cursor-pointer border-primary/35 bg-background/90 px-3 text-[11px] font-semibold uppercase tracking-[0.18em] hover:bg-secondary"
							onClick={() => onAddToCart?.(product.uid)}
						>
							<ShoppingBag className="h-3.5 w-3.5" />
							Add to Bag
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
