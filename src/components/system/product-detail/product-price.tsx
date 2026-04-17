import {
	getFormattedProductPrice,
	useStoreProduct,
} from "@colossal-sh/storefront-sdk";
import { useParams } from "@tanstack/react-router";

export function ProductPrice() {
	const { uid } = useParams({ strict: false }) as { uid: string };
	const { data } = useStoreProduct(uid);
	const product = data?.product;

	if (!product) return null;

	const formattedPrice = getFormattedProductPrice(product);
	if (!formattedPrice) return null;

	return (
		<div>
			<p
				className="text-2xl font-semibold"
				data-editable-entity="product"
				data-editable-id={product.uid}
				data-editable-field="price"
			>
				{formattedPrice}
			</p>
		</div>
	);
}
