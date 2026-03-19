import { useCartContext, useProducts } from "@colossal-sh/storefront-sdk";
import { createFileRoute } from "@tanstack/react-router";
import { ProductGrid } from "#/components/store/product-grid";
import { STORE_SLUG } from "#/lib/constants";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
	const { products } = useProducts(STORE_SLUG);
	const { addItem } = useCartContext();

	return (
		<section className="px-4 pb-24 pt-16 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-[1400px]">
				<div className="mb-10 flex items-end justify-between">
					<h2 className="font-display text-2xl font-bold sm:text-3xl">
						Our Collection
					</h2>
					<p className="text-sm text-muted-foreground">
						{products.length} products
					</p>
				</div>
				<ProductGrid products={products} onAddToCart={addItem} />
			</div>
		</section>
	);
}
