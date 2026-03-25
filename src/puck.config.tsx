import { useCartContext, useProducts } from "@colossal-sh/storefront-sdk";
import type { Config, Slot } from "@puckeditor/core";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { ProductGrid } from "#/components/store/product-grid";
import { ProductDetailRenderer } from "#/components/system/product-detail";
import { ProductAddToCartRenderer } from "#/components/system/product-detail/product-add-to-cart";
import { ProductContentRenderer } from "#/components/system/product-detail/product-content";
import { ProductGallery } from "#/components/system/product-detail/product-gallery";
import { ProductInfoRenderer } from "#/components/system/product-detail/product-info";
import { ProductPriceRenderer } from "#/components/system/product-detail/product-price";
import { STORE_UID } from "#/lib/constants";

function ProductCollectionRenderer({ title }: { title: string }) {
	const { products } = useProducts(STORE_UID);
	const { addItem } = useCartContext();
	return (
		<section className="px-4 pb-24 pt-16 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-[1400px]">
				<div className="mb-10 flex items-end justify-between">
					<h2 className="font-display text-2xl font-bold sm:text-3xl">
						{title}
					</h2>
					<p className="text-sm text-muted-foreground">
						{products.length} products
					</p>
				</div>
				<ProductGrid products={products} onAddToCart={addItem} />
			</div>
		</section>
	);
}

type Props = {
	ProductCollection: {
		title: string;
	};
	TextSection: {
		heading: string;
		body: string;
	};
	ImageBlock: {
		src: string;
		alt: string;
	};
	BlockQuote: {
		quote: string;
		attribution: string;
	};
	CTABanner: {
		title: string;
		description: string;
		buttonText: string;
		href: string;
	};
	ProductDetail: {
		layoutType: "two-column" | "single-column";
		columns: Slot;
	};
	ProductGallery: {
		galleryStyle: "grid-2x2" | "carousel" | "single-hero" | "stacked";
		enableLightbox: boolean;
	};
	ProductContent: {
		items: Slot;
	};
	ProductInfo: Record<string, never>;
	ProductPrice: Record<string, never>;
	ProductAddToCart: Record<string, never>;
};

const SLOT_ONLY_COMPONENTS: (keyof Props)[] = [
	"ProductGallery",
	"ProductContent",
	"ProductInfo",
	"ProductPrice",
	"ProductAddToCart",
];

export const config: Config<Props> = {
	root: {
		resolveFields: () => ({
			content: {
				type: "slot" as const,
				disallow: SLOT_ONLY_COMPONENTS,
			},
		}),
	},
	categories: {
		"Page Sections": {
			components: [
				"ProductCollection",
				"ProductDetail",
				"TextSection",
				"ImageBlock",
				"BlockQuote",
				"CTABanner",
			],
			defaultExpanded: true,
		},
		"Product Parts": {
			components: SLOT_ONLY_COMPONENTS,
			visible: false,
		},
	},
	components: {
		ProductCollection: {
			label: "Product Collection",
			fields: {
				title: {
					type: "text",
					contentEditable: true,
					label: "Section Title",
				},
			},
			defaultProps: { title: "Our Collection" },
			render: ({ title }) => <ProductCollectionRenderer title={title} />,
		},

		TextSection: {
			label: "Text Section",
			fields: {
				heading: {
					type: "text",
					contentEditable: true,
					label: "Heading",
				},
				body: {
					type: "textarea",
					contentEditable: true,
					label: "Body Text",
				},
			},
			defaultProps: {
				heading: "Section Title",
				body: "Add your content here.",
			},
			render: ({ heading, body }) => (
				<section className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6 lg:px-8">
					<div className="mx-auto max-w-3xl">
						<h2 className="mb-8 font-display text-3xl font-bold sm:text-4xl">
							{heading}
						</h2>
						<div className="space-y-6 text-base leading-[1.8] text-foreground/80 sm:text-[17px]">
							<p>{body}</p>
						</div>
					</div>
				</section>
			),
		},

		ImageBlock: {
			label: "Image",
			fields: {
				src: { type: "text", label: "Image URL" },
				alt: { type: "text", label: "Alt Text" },
			},
			defaultProps: {
				src: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2000&auto=format&fit=crop",
				alt: "Image",
			},
			render: ({ src, alt }) => (
				<section className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6 lg:px-8">
					<div className="overflow-hidden rounded-lg">
						<img
							src={src}
							alt={alt}
							className="aspect-[21/9] w-full object-cover"
						/>
					</div>
				</section>
			),
		},

		BlockQuote: {
			label: "Quote",
			fields: {
				quote: {
					type: "textarea",
					contentEditable: true,
					label: "Quote Text",
				},
				attribution: {
					type: "text",
					contentEditable: true,
					label: "Attribution",
				},
			},
			defaultProps: { quote: "Add your quote here.", attribution: "— Author" },
			render: ({ quote, attribution }) => (
				<section className="mx-auto max-w-[1400px] px-4 py-20 sm:px-6 lg:px-8">
					<blockquote className="mx-auto max-w-3xl text-center">
						<p className="font-display text-2xl leading-relaxed italic sm:text-3xl md:text-4xl">
							&ldquo;{quote}&rdquo;
						</p>
						<footer className="mt-8 text-sm text-muted-foreground">
							{attribution}
						</footer>
					</blockquote>
				</section>
			),
		},

		CTABanner: {
			label: "Call to Action",
			fields: {
				title: {
					type: "text",
					contentEditable: true,
					label: "Title",
				},
				description: {
					type: "textarea",
					contentEditable: true,
					label: "Description",
				},
				buttonText: {
					type: "text",
					contentEditable: true,
					label: "Button Text",
				},
				href: { type: "text", label: "Button Link" },
			},
			defaultProps: {
				title: "See for yourself",
				description:
					"Browse the collection and discover pieces built to become the foundation of your wardrobe.",
				buttonText: "Shop Now",
				href: "/",
			},
			render: ({ title, description, buttonText, href }) => (
				<section className="mx-auto max-w-[1400px] px-4 pb-24 sm:px-6 lg:px-8">
					<div className="flex flex-col items-center border border-border bg-card p-12 text-center sm:p-16">
						<h2 className="font-display text-3xl font-bold sm:text-4xl">
							{title}
						</h2>
						<p className="mt-4 max-w-md text-muted-foreground">{description}</p>
						<Link
							to={href}
							className="mt-8 inline-flex items-center gap-2 bg-primary px-8 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
						>
							{buttonText}
							<ArrowRight className="h-4 w-4" />
						</Link>
					</div>
				</section>
			),
		},

		ProductDetail: {
			label: "Product Detail",
			fields: {
				layoutType: {
					type: "select",
					label: "Layout",
					options: [
						{ label: "Two Column", value: "two-column" },
						{ label: "Single Column", value: "single-column" },
					],
				},
				columns: {
					type: "slot",
					allow: ["ProductGallery", "ProductContent"],
				},
			},
			defaultProps: {
				layoutType: "two-column",
				columns: [
					{
						type: "ProductGallery",
						props: {
							id: "pg-1",
							galleryStyle: "grid-2x2",
							enableLightbox: true,
						},
					},
					{
						type: "ProductContent",
						props: {
							id: "pc-1",
							items: [
								{ type: "ProductInfo", props: { id: "pi-1" } },
								{ type: "ProductPrice", props: { id: "pp-1" } },
								{ type: "ProductAddToCart", props: { id: "pac-1" } },
							],
						},
					},
				],
			},
			render: ({ layoutType, columns }) => (
				<ProductDetailRenderer layoutType={layoutType} columns={columns} />
			),
		},

		ProductGallery: {
			label: "Product Gallery",
			inline: true,
			fields: {
				galleryStyle: {
					type: "select",
					label: "Gallery Style",
					options: [
						{ label: "Grid 2x2", value: "grid-2x2" },
						{ label: "Carousel", value: "carousel" },
						{ label: "Single Hero", value: "single-hero" },
						{ label: "Stacked", value: "stacked" },
					],
				},
				enableLightbox: {
					type: "radio",
					label: "Enable Lightbox",
					options: [
						{ label: "Yes", value: true },
						{ label: "No", value: false },
					],
				},
			},
			defaultProps: { galleryStyle: "grid-2x2", enableLightbox: true },
			render: ({ puck }) => <ProductGallery puck={puck} />,
		},

		ProductContent: {
			label: "Product Content",
			inline: true,
			fields: {
				items: {
					type: "slot",
					allow: [
						"ProductInfo",
						"ProductPrice",
						"ProductAddToCart",
						"TextSection",
						"ImageBlock",
						"BlockQuote",
						"CTABanner",
					],
				},
			},
			defaultProps: {
				items: [
					{ type: "ProductInfo", props: { id: "pi-1" } },
					{ type: "ProductPrice", props: { id: "pp-1" } },
					{ type: "ProductAddToCart", props: { id: "pac-1" } },
				],
			},
			render: ({ items, puck }) => (
				<ProductContentRenderer items={items} puck={puck} />
			),
		},

		ProductInfo: {
			label: "Product Info",
			fields: {},
			render: () => <ProductInfoRenderer />,
		},

		ProductPrice: {
			label: "Product Price",
			fields: {},
			render: () => <ProductPriceRenderer />,
		},

		ProductAddToCart: {
			label: "Add to Cart",
			fields: {},
			render: () => <ProductAddToCartRenderer />,
		},
	},
};

export default config;
