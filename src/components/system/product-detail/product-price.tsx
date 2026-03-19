import { useStoreProduct } from "@colossal-sh/storefront-sdk";
import { useParams } from "@tanstack/react-router";

export function ProductPriceRenderer() {
	const { uid } = useParams({ strict: false }) as { uid: string };
	const { data } = useStoreProduct(uid);
	const product = data?.product;

	const price = product?.defaultVariant?.prices?.find((p) => p.isDefault);
	const unitPrice =
		price?.price?.__typename === "LinearProductPriceConfig"
			? price.price.unitPrice
			: null;
	const formattedPrice =
		unitPrice != null ? `$${(unitPrice / 100).toFixed(2)}` : null;

	if (!formattedPrice) return null;

	return (
		<div>
			<p className="text-2xl font-semibold">{formattedPrice}</p>
		</div>
	);
}
