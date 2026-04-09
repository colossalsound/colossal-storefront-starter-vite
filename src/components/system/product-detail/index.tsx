import { useStoreProduct } from "@colossal-sh/storefront-sdk";
import { Link, useParams } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { ProductAddToCart } from "./product-add-to-cart";
import { ProductGallery } from "./product-gallery";
import { ProductInfo } from "./product-info";
import { ProductPrice } from "./product-price";

export function ProductDetails() {
	const { uid } = useParams({ strict: false }) as { uid: string };
	const { data, isLoading } = useStoreProduct(uid);
	const product = data?.product;

	if (isLoading) {
		return <ProductDetailSkeleton />;
	}

	if (!product) {
		return (
			<div className="mx-auto max-w-[1400px] px-4 py-20 text-center sm:px-6 lg:px-8">
				<p className="text-lg text-muted-foreground">Product not found.</p>
				<Link
					to="/"
					className="mt-4 inline-block text-sm text-muted-foreground hover:text-foreground"
				>
					&larr; Back to store
				</Link>
			</div>
		);
	}

	return (
		<div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6 lg:px-8">
			<Link
				to="/"
				className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
			>
				<ArrowLeft className="h-4 w-4" />
				Back to store
			</Link>

			<div
				style={{
					display: "grid",
					gridTemplateColumns: "7fr 5fr",
					gap: "3rem",
					alignItems: "start",
				}}
			>
				<ProductGallery variant="stack" />
				<div className="flex flex-col gap-6 lg:sticky lg:top-24">
					<ProductInfo />
					<ProductPrice />
					<ProductAddToCart />
				</div>
			</div>
		</div>
	);
}

function ProductDetailSkeleton() {
	return (
		<div className="mx-auto max-w-[1400px] px-4 py-20 sm:px-6 lg:px-8">
			<div className="animate-pulse space-y-8">
				<div className="h-4 w-32 rounded bg-muted" />
				<div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
					<div className="grid grid-cols-2 gap-3 lg:col-span-7">
						<div className="aspect-square bg-muted" />
						<div className="aspect-square bg-muted" />
						<div className="aspect-square bg-muted" />
						<div className="aspect-square bg-muted" />
					</div>
					<div className="space-y-4 lg:col-span-5">
						<div className="h-8 w-3/4 rounded bg-muted" />
						<div className="h-4 w-1/2 rounded bg-muted" />
						<div className="h-6 w-1/4 rounded bg-muted" />
						<div className="h-20 w-full rounded bg-muted" />
						<div className="h-11 w-full bg-muted" />
					</div>
				</div>
			</div>
		</div>
	);
}
