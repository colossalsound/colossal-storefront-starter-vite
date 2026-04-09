interface Props {
	images: string[];
	productName: string;
	onImageClick: (index: number) => void;
}

export function GalleryGrid({ images, productName, onImageClick }: Props) {
	return (
		<div className="grid grid-cols-2 gap-3 sm:gap-4">
			{images.map((src, i) => (
				<button
					type="button"
					key={`${src}-${i}`}
					onClick={() => onImageClick(i)}
					className="group/img relative overflow-hidden rounded-lg bg-muted"
				>
					<img
						src={src}
						alt={`${productName} - ${i + 1}`}
						className="aspect-square w-full object-cover transition-transform duration-500 group-hover/img:scale-[1.03]"
					/>
					<div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover/img:bg-black/10" />
				</button>
			))}
		</div>
	);
}
