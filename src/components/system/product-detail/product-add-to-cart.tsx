import { useCartContext, useStoreProduct } from "@colossal-sh/storefront-sdk";
import { useParams } from "@tanstack/react-router";
import { ShoppingBag } from "lucide-react";
import { Button } from "#/components/ui/button";

export function ProductAddToCartRenderer() {
	const { uid } = useParams({ strict: false }) as { uid: string };
	const { data } = useStoreProduct(uid);
	const { addItem } = useCartContext();
	const product = data?.product;

	if (!product) return null;

	return (
		<div>
			<Button
				size="lg"
				className="w-full gap-2 text-sm cursor-pointer"
				onClick={() => addItem(product.uid)}
			>
				<ShoppingBag className="h-4 w-4" />
				Add to Bag
			</Button>
		</div>
	);
}
