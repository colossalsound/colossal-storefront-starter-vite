import { useCartContext } from "@colossal-sh/storefront-sdk";
import { Link } from "@tanstack/react-router";
import { Search, ShoppingBag } from "lucide-react";
import type { CSSProperties } from "react";
import { Button } from "#/components/ui/button";
import { STORE_UID } from "#/lib/constants";

export type ButtonStyle = "default" | "icon";
export type HeaderSize = "default" | "large";
export type HeaderLayout = "standard" | "centered";

export interface HeaderLink {
	label: string;
	href: string;
}

export interface HeaderColors {
	/** Header background color */
	bg?: string;
	/** Primary text color (store name, icon buttons) */
	text?: string;
	/** Muted text color (nav links, secondary elements) */
	mutedText?: string;
	/** Border color, or false to remove border entirely */
	border?: string | false;
	/** Cart badge background */
	badgeBg?: string;
	/** Cart badge text color */
	badgeText?: string;
}

export interface HeaderProps {
	storeName: string;
	onSearchClick?: () => void;
	buttonStyle?: ButtonStyle;
	size?: HeaderSize;
	layout?: HeaderLayout;
	links?: HeaderLink[];
	floating?: boolean;
	colors?: HeaderColors;
}

export function Header({
	storeName,
	onSearchClick,
	buttonStyle = "default",
	size = "default",
	layout = "standard",
	links = [],
	floating = false,
	colors,
}: HeaderProps) {
	const isLarge = size === "large";
	const isCentered = layout === "centered";

	const heightClass = isLarge ? "h-16" : "h-14";
	const paddingClass = isLarge
		? "px-6 sm:px-8 lg:px-10"
		: "px-4 sm:px-6 lg:px-8";
	const gapClass = isLarge ? "gap-3" : "gap-1.5";

	const hasColors = colors && Object.keys(colors).length > 0;
	const noBorder = colors?.border === false;

	const colorVars: CSSProperties | undefined = hasColors
		? ({
				"--header-bg": colors.bg,
				"--header-text": colors.text,
				"--header-muted": colors.mutedText,
				"--header-border":
					colors.border === false ? "transparent" : colors.border,
				"--header-badge-bg": colors.badgeBg,
				"--header-badge-text": colors.badgeText,
			} as CSSProperties)
		: undefined;

	const bgStyle = hasColors
		? "bg-[var(--header-bg,var(--background))]"
		: "bg-background";

	const borderStyle = noBorder
		? "border-transparent"
		: hasColors
			? "border-[var(--header-border,var(--border))]"
			: "border-border";

	const storeNameEl = (
		<Link
			to="/"
			className={`font-display text-2xl font-semibold italic tracking-wide ${
				hasColors
					? "text-[var(--header-text,var(--foreground))]"
					: "text-foreground"
			}`}
			data-editable-entity="store"
			data-editable-id={STORE_UID}
			data-editable-field="name"
		>
			{storeName}
		</Link>
	);

	const linkTextClass = hasColors
		? "text-[var(--header-muted,var(--muted-foreground))] hover:text-[var(--header-text,var(--foreground))]"
		: "text-muted-foreground hover:text-foreground";

	const linksEl = links.length > 0 && (
		<nav className="hidden items-center gap-6 md:flex">
			{links.map((link) => (
				<Link
					key={link.href}
					to={link.href}
					className={`text-sm font-medium transition-colors ${linkTextClass}`}
				>
					{link.label}
				</Link>
			))}
		</nav>
	);

	const actionsEl = (
		<div className={`flex items-center ${gapClass}`}>
			<SearchButton
				onClick={onSearchClick}
				style={buttonStyle}
				hasColors={!!hasColors}
			/>
			<CartButton style={buttonStyle} hasColors={!!hasColors} />
		</div>
	);

	const innerContent = isCentered ? (
		<>
			<div className="flex min-w-0 flex-1 items-center">{linksEl}</div>
			<div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
				{storeNameEl}
			</div>
			<div className="flex min-w-0 flex-1 items-center justify-end">
				{actionsEl}
			</div>
		</>
	) : (
		<>
			{storeNameEl}
			{linksEl}
			<div className="flex flex-1 items-center justify-end">{actionsEl}</div>
		</>
	);

	if (floating) {
		return (
			<div
				className="fixed top-0 z-40 w-full px-4 pt-3 sm:px-6 lg:px-8"
				style={colorVars}
			>
				<header
					className={`mx-auto max-w-[1400px] rounded-lg ${noBorder ? "" : "border"} ${borderStyle} ${bgStyle}`}
				>
					<div
						className={`relative flex ${heightClass} items-center ${paddingClass} ${isCentered ? "justify-between" : "gap-6"}`}
					>
						{innerContent}
					</div>
				</header>
			</div>
		);
	}

	return (
		<header
			className={`sticky top-0 z-40 w-full ${noBorder ? "" : "border-b"} ${borderStyle} ${bgStyle}`}
			style={colorVars}
		>
			<div
				className={`relative mx-auto flex ${heightClass} max-w-[1400px] items-center ${paddingClass} ${isCentered ? "justify-between" : "gap-6"}`}
			>
				{innerContent}
			</div>
		</header>
	);
}

function SearchButton({
	onClick,
	style,
	hasColors,
}: { onClick?: () => void; style: ButtonStyle; hasColors: boolean }) {
	const colorClass = hasColors
		? "text-[var(--header-muted,var(--muted-foreground))] hover:text-[var(--header-text,var(--foreground))] hover:bg-white/10"
		: "text-muted-foreground hover:text-foreground";

	if (style === "icon") {
		return (
			<Button
				variant="ghost"
				size="icon"
				onClick={onClick}
				className={`cursor-pointer ${colorClass}`}
				aria-label="Search"
			>
				<Search className="h-5 w-5" strokeWidth={1.5} />
			</Button>
		);
	}

	const outlineClass = hasColors
		? "border-white/20 bg-transparent text-[var(--header-text,var(--foreground))] hover:bg-white/10 hover:text-[var(--header-text,var(--foreground))]"
		: "";

	return (
		<Button
			variant="outline"
			onClick={onClick}
			className={`cursor-pointer ${outlineClass}`}
		>
			<Search
				className="mr-1 h-4 w-4"
				data-icon="inline-start"
				strokeWidth={1.75}
			/>
			Search
		</Button>
	);
}

function CartButton({
	style,
	hasColors,
}: { style: ButtonStyle; hasColors: boolean }) {
	const { items, openCart } = useCartContext();
	const cartItemCount = items.length;

	const colorClass = hasColors
		? "text-[var(--header-muted,var(--muted-foreground))] hover:text-[var(--header-text,var(--foreground))] hover:bg-white/10"
		: "text-muted-foreground hover:text-foreground";

	const badgeBgClass = hasColors
		? "bg-[var(--header-badge-bg,var(--foreground))]"
		: "bg-foreground";
	const badgeTextClass = hasColors
		? "text-[var(--header-badge-text,var(--background))]"
		: "text-background";

	if (style === "icon") {
		return (
			<Button
				variant="ghost"
				size="icon"
				onClick={() => openCart?.()}
				className={`relative cursor-pointer ${colorClass}`}
				aria-label={`Shopping cart${cartItemCount > 0 ? `, ${cartItemCount} items` : ""}`}
			>
				<ShoppingBag className="h-5 w-5" strokeWidth={1.5} />
				{cartItemCount > 0 && (
					<span
						data-editor-ignore
						className={`absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-button px-1 text-[10px] font-semibold ${badgeBgClass} ${badgeTextClass}`}
					>
						{cartItemCount}
					</span>
				)}
			</Button>
		);
	}

	const outlineClass = hasColors
		? "border-white/20 bg-transparent text-[var(--header-text,var(--foreground))] hover:bg-white/10 hover:text-[var(--header-text,var(--foreground))]"
		: "";

	const inlineBadgeBgClass = hasColors
		? "bg-[var(--header-badge-bg,var(--primary))]"
		: "bg-primary";
	const inlineBadgeTextClass = hasColors
		? "text-[var(--header-badge-text,var(--primary-foreground))]"
		: "text-primary-foreground";

	return (
		<Button
			variant="outline"
			onClick={() => openCart?.()}
			className={`cursor-pointer gap-1.5 ${outlineClass}`}
			aria-label={`Shopping cart${cartItemCount > 0 ? `, ${cartItemCount} items` : ""}`}
		>
			Cart
			<span
				data-editor-ignore
				className={`flex h-5 min-w-5 items-center justify-center rounded-button px-1 text-xs font-semibold ${inlineBadgeBgClass} ${inlineBadgeTextClass}`}
			>
				{cartItemCount}
			</span>
		</Button>
	);
}
