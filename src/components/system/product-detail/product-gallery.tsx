import { useStoreProduct } from "@colossal-sh/storefront-sdk";
import { useParams } from "@tanstack/react-router";
import { useState } from "react";
import { ProductLightbox } from "./product-lightbox";

interface ProductGalleryProps {
	puck?: { dragRef: ((element: Element | null) => void) | null };
}

export function ProductGallery({ puck }: ProductGalleryProps = {}) {
	const { uid } = useParams({ strict: false }) as { uid: string };
	const { data } = useStoreProduct(uid);
	const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

	const product = data?.product;

	const images =
		product?.defaultVariant?.media
			?.filter((m) => m.type === "IMAGE" && m.status === "READY" && m.url)
			.map((m) => m.url as string) ?? [];

	const galleryImages =
		images.length === 1 ? [images[0], images[0], images[0]] : images;

	const handleClick = (i: number) => {
		setLightboxIndex(i);
	};

	if (galleryImages.length === 0) {
		return (
			<div className="flex aspect-square items-center justify-center bg-muted text-muted-foreground">
				No images
			</div>
		);
	}

	return (
		<div ref={puck?.dragRef as React.Ref<HTMLDivElement>}>
			<div className="grid grid-cols-2 gap-3 sm:gap-4">
				{galleryImages.map((src, i) => (
					<button
						type="button"
						key={src}
						onClick={() => handleClick(i)}
						className="group/img relative overflow-hidden rounded-lg bg-muted"
					>
						<img
							src={src}
							alt={`${product?.name ?? "Product"} - ${i + 1}`}
							className="aspect-square w-full object-cover transition-transform duration-500 group-hover/img:scale-[1.03]"
						/>
						<div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover/img:bg-black/10" />
					</button>
				))}
			</div>

			{lightboxIndex !== null && galleryImages.length > 0 && (
				<ProductLightbox
					images={galleryImages}
					initialIndex={lightboxIndex}
					productName={product?.name ?? "Product"}
					onClose={() => setLightboxIndex(null)}
				/>
			)}
		</div>
	);
}
