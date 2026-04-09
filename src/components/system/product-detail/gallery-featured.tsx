import { useState } from "react";

interface Props {
	images: string[];
	productName: string;
	onImageClick: (index: number) => void;
}

export function GalleryFeatured({ images, productName, onImageClick }: Props) {
	const [activeIndex, setActiveIndex] = useState(0);

	return (
		<div>
			<button
				type="button"
				onClick={() => onImageClick(activeIndex)}
				className="group/img relative w-full overflow-hidden rounded-lg bg-muted"
			>
				<img
					src={images[activeIndex]}
					alt={`${productName} - ${activeIndex + 1}`}
					className="aspect-square w-full object-cover transition-transform duration-500 group-hover/img:scale-[1.03]"
				/>
				<div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover/img:bg-black/10" />
			</button>

			{images.length > 1 && (
				<div className="mt-3 flex gap-2 overflow-x-auto">
					{images.map((src, i) => (
						<button
							type="button"
							key={`${src}-${i}`}
							onClick={() => setActiveIndex(i)}
							className={`h-16 w-16 shrink-0 overflow-hidden rounded-md border-2 transition-all ${
								i === activeIndex
									? "border-primary opacity-100"
									: "border-transparent opacity-50 hover:opacity-80"
							}`}
						>
							<img
								src={src}
								alt={`Thumbnail ${i + 1}`}
								className="h-full w-full object-cover"
							/>
						</button>
					))}
				</div>
			)}
		</div>
	);
}
