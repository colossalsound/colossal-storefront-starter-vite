import type { SimpleProduct } from "@colossal-sh/storefront-sdk";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

export interface FeaturedProductsProps {
	/** Products to display */
	products: SimpleProduct[];
	/** Small label above the heading */
	label?: string;
	/** Section heading */
	heading?: string;
}

export function FeaturedProducts({
	products,
	label = "Staff Picks",
	heading = "Notable Selections",
}: FeaturedProductsProps) {
	if (products.length === 0) return null;

	return (
		<section className="border-y border-border/60 bg-background px-6 py-24 sm:px-8 lg:px-10">
			<div className="mx-auto max-w-[1400px]">
				<div className="mb-16 text-center">
					<p className="text-xs font-semibold uppercase tracking-[0.35em] text-muted-foreground">
						{label}
					</p>
					<h2 className="mt-3 font-display text-4xl font-bold sm:text-5xl">
						{heading}
					</h2>
				</div>

				<div className="grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-border/60 bg-border/60 md:grid-cols-3">
					{products.map((product) => (
						<Link
							key={product.uid}
							to="/product/$uid"
							params={{ uid: product.uid }}
							className="group relative flex flex-col bg-background p-8 transition-colors hover:bg-secondary/50 sm:p-10"
						>
							<div className="aspect-[3/4] w-full overflow-hidden rounded-md bg-muted/30">
								{product.images.length > 0 ? (
									<img
										src={product.images[0]}
										alt={product.name}
										className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
									/>
								) : (
									<div className="flex h-full items-center justify-center bg-gradient-to-br from-secondary to-muted">
										<span className="font-display text-6xl italic text-muted-foreground/30">
											{product.name.charAt(0)}
										</span>
									</div>
								)}
							</div>
							<div className="mt-6">
								<h3
									className="font-display text-xl font-semibold"
									data-editable-entity="product"
									data-editable-id={product.uid}
									data-editable-field="name"
								>
									{product.name}
								</h3>
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
								<p
									className="mt-4 text-sm font-medium"
									data-editable-entity="product"
									data-editable-id={product.uid}
									data-editable-field="price"
								>
									{product.formattedPrice}
								</p>
							</div>
							<div className="mt-4 flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground transition-colors group-hover:text-foreground">
								View Details
								<ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
							</div>
						</Link>
					))}
				</div>
			</div>
		</section>
	);
}
