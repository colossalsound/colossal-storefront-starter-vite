import { useStoreProduct } from "@colossal-sh/storefront-sdk";
import { useParams } from "@tanstack/react-router";

export function ProductInfoRenderer() {
	const { uid } = useParams({ strict: false }) as { uid: string };
	const { data } = useStoreProduct(uid);
	const product = data?.product;

	if (!product) return null;

	return (
		<div>
			<h1 className="font-display text-3xl font-bold sm:text-4xl">
				{product.name}
			</h1>

			{product.tagline && (
				<p className="mt-3 text-base text-muted-foreground">
					{product.tagline}
				</p>
			)}

			{product.description && (
				<p className="mt-6 leading-relaxed text-muted-foreground">
					{product.description}
				</p>
			)}
		</div>
	);
}
