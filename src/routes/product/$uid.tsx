import { createFileRoute } from "@tanstack/react-router";
import { ProductDetailRenderer } from "#/components/system/product-detail";

export const Route = createFileRoute("/product/$uid")({
	component: ProductPage,
});

function ProductPage() {
	return <ProductDetailRenderer />;
}
