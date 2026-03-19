import { ProductCard } from "./product-card";

export interface Product {
	uid: string;
	name: string;
	tagline?: string | null;
	formattedPrice: string;
	price: number;
	imageUrl?: string;
	images?: string[];
}

interface ProductGridProps {
	products: Product[];
	onAddToCart?: (productUid: string) => void;
}

export function ProductGrid({ products, onAddToCart }: ProductGridProps) {
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
		<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
			{products.map((product, index) => (
				<ProductCard
					key={product.uid}
					product={product}
					onAddToCart={onAddToCart}
					index={index}
				/>
			))}
		</div>
	);
}
