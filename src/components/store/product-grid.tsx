import type { SimpleProduct } from "@colossal-sh/storefront-sdk";
import type {
	CardCartButton,
	CardCartButtonIcon,
	CardCarousel,
	CardHoverEffect,
} from "./product-card";
import { ProductCard } from "./product-card";

interface ProductGridProps {
	products: SimpleProduct[];
	onAddToCart?: (productUid: string) => void;
	hoverEffect?: CardHoverEffect;
	cartButton?: CardCartButton;
	cartButtonIcon?: CardCartButtonIcon;
	carousel?: CardCarousel;
}

export function ProductGrid({
	products,
	onAddToCart,
	hoverEffect,
	cartButton,
	cartButtonIcon,
	carousel,
}: ProductGridProps) {
	if (products.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center py-20 text-center">
				<p className="text-lg text-muted-foreground">
					No products available yet.
				</p>
				<p className="mt-1 text-sm text-muted-foreground">
					Check back soon for new arrivals.
				</p>
			</div>
		);
	}

	return (
		<div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
			{products.map((product, index) => (
				<ProductCard
					key={product.uid}
					product={product}
					onAddToCart={onAddToCart}
					index={index}
					hoverEffect={hoverEffect}
					cartButton={cartButton}
					cartButtonIcon={cartButtonIcon}
					carousel={carousel}
				/>
			))}
		</div>
	);
}
