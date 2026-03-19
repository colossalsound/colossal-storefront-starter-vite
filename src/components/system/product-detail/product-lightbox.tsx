import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

interface ProductLightboxProps {
	images: string[];
	initialIndex: number;
	productName: string;
	onClose: () => void;
}

export function ProductLightbox({
	images,
	initialIndex,
	productName,
	onClose,
}: ProductLightboxProps) {
	const [index, setIndex] = useState(initialIndex);

	const prevImage = useCallback(() => {
		setIndex((i) => (i === 0 ? images.length - 1 : i - 1));
	}, [images.length]);

	const nextImage = useCallback(() => {
		setIndex((i) => (i === images.length - 1 ? 0 : i + 1));
	}, [images.length]);

	useEffect(() => {
		function onKeyDown(e: KeyboardEvent) {
			if (e.key === "Escape") onClose();
			if (e.key === "ArrowLeft") prevImage();
			if (e.key === "ArrowRight") nextImage();
		}
		window.addEventListener("keydown", onKeyDown);
		return () => window.removeEventListener("keydown", onKeyDown);
	}, [onClose, prevImage, nextImage]);

	return (
		<div
			role="dialog"
			aria-modal="true"
			aria-label={`${productName} image gallery`}
			className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
			onClick={onClose}
			onKeyDown={(e) => {
				if (e.key === "Enter" || e.key === " ") onClose();
			}}
		>
			<button
				type="button"
				onClick={onClose}
				className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center bg-white/10 text-white transition-colors hover:bg-white/20"
			>
				<X className="h-5 w-5" />
			</button>

			<div className="absolute left-1/2 top-4 -translate-x-1/2 text-sm text-white/70">
				{index + 1} / {images.length}
			</div>

			<img
				src={images[index]}
				alt={`${productName} - ${index + 1}`}
				className="max-h-[85vh] max-w-[90vw] object-contain"
				onClick={(e) => e.stopPropagation()}
				onKeyDown={(e) => e.stopPropagation()}
			/>

			{images.length > 1 && (
				<>
					<button
						type="button"
						onClick={(e) => {
							e.stopPropagation();
							prevImage();
						}}
						className="absolute left-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center bg-white/10 text-white transition-colors hover:bg-white/20"
					>
						<ChevronLeft className="h-6 w-6" />
					</button>
					<button
						type="button"
						onClick={(e) => {
							e.stopPropagation();
							nextImage();
						}}
						className="absolute right-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center bg-white/10 text-white transition-colors hover:bg-white/20"
					>
						<ChevronRight className="h-6 w-6" />
					</button>
				</>
			)}

			{images.length > 1 && (
				<div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
					{images.map((src, i) => (
						<button
							type="button"
							key={src}
							onClick={(e) => {
								e.stopPropagation();
								setIndex(i);
							}}
							className={`h-14 w-14 flex-shrink-0 overflow-hidden transition-all ${
								i === index
									? "ring-2 ring-white"
									: "opacity-40 hover:opacity-80"
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
