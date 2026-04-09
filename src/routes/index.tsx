import { useCartContext, useProducts } from "@colossal-sh/storefront-sdk";
import { createFileRoute } from "@tanstack/react-router";
import { ProductGrid } from "#/components/store/product-grid";
import { STORE_UID } from "#/lib/constants";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
	const { products } = useProducts(STORE_UID);
	const { addItem } = useCartContext();

	return (
		<section className="px-4 pb-24 pt-16 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-350">
				<div className="mb-10 flex items-end justify-between">
					<h2 className="font-display font-bold text-3xl">Our Collection</h2>
					<p className="text-muted-foreground text-sm font-medium">
						{products.length} products
					</p>
				</div>
				<ProductGrid products={products} onAddToCart={addItem} />
			</div>
		</section>
	);
}
