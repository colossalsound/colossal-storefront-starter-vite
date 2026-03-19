import type { Data } from "@puckeditor/core";

const homePageData: Data = {
	content: [
		{
			type: "ProductCollection",
			props: {
				id: "products-1",
				title: "Products",
			},
		},
	],
	root: { props: {} },
};

const productPageData: Data = {
	content: [
		{
			type: "ProductDetail",
			props: {
				id: "pd-1",
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
		},
	],
	root: { props: {} },
};

const defaults: Record<string, Data> = {
	"/": homePageData,
	"/product/$uid": productPageData,
};

export function getDefaultData(pathname: string): Data {
	if (defaults[pathname]) return defaults[pathname];

	if (/^\/product\/[^/]+$/.test(pathname)) {
		return defaults["/product/$uid"];
	}

	return {
		content: [],
		root: { props: {} },
	};
}
