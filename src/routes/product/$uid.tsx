import { createFileRoute } from "@tanstack/react-router";
import { ProductDetails } from "#/components/system/product-detail";

export const Route = createFileRoute("/product/$uid")({
	component: ProductPage,
});

function ProductPage() {
	return <ProductDetails />;
}
