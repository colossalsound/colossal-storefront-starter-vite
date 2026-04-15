import type { CSSProperties } from "react";
import { STORE_UID } from "#/lib/constants";

export type FooterColorScheme = "default" | "inverted" | "custom";

export interface FooterLink {
	label: string;
	href: string;
}

export interface FooterColumn {
	title: string;
	links?: FooterLink[];
	lines?: string[];
}

export interface FooterColors {
	/** Footer background color */
	bg?: string;
	/** Primary text color (store name, headings) */
	text?: string;
	/** Muted text color (descriptions, links, copyright) */
	mutedText?: string;
	/** Border color, or false to remove */
	border?: string | false;
}

export interface FooterProps {
	storeName: string;
	/** Optional store description shown below the store name in expanded layout */
	description?: string;
	/** Additional columns rendered beside the store name column. When empty, renders minimal single-row footer */
	columns?: FooterColumn[];
	/** Color scheme: "default" uses page bg/text, "inverted" swaps foreground/background, "custom" uses the colors prop */
	colorScheme?: FooterColorScheme;
	/** Custom color overrides (only used when colorScheme="custom") */
	colors?: FooterColors;
}

export function Footer({
	storeName,
	description,
	columns = [],
	colorScheme = "default",
	colors,
}: FooterProps) {
	const isExpanded = columns.length > 0;
	const hasCustomColors = colorScheme === "custom" && colors;

	const colorVars: CSSProperties | undefined = hasCustomColors
		? ({
				"--footer-bg": colors.bg,
				"--footer-text": colors.text,
				"--footer-muted": colors.mutedText,
				"--footer-border":
					colors.border === false ? "transparent" : colors.border,
			} as CSSProperties)
		: undefined;

	const noBorder =
		hasCustomColors && colors.border === false;

	// Color classes based on scheme
	let bgClass: string;
	let textClass: string;
	let mutedClass: string;
	let borderClass: string;
	let borderDividerClass: string;

	if (hasCustomColors) {
		bgClass = "bg-[var(--footer-bg,var(--background))]";
		textClass = "text-[var(--footer-text,var(--foreground))]";
		mutedClass = "text-[var(--footer-muted,var(--muted-foreground))]";
		borderClass = noBorder
			? "border-transparent"
			: "border-[var(--footer-border,var(--border))]";
		borderDividerClass = noBorder
			? "border-transparent"
			: "border-[var(--footer-border,var(--border))]/20";
	} else if (colorScheme === "inverted") {
		bgClass = "bg-foreground";
		textClass = "text-background";
		mutedClass = "text-background/60";
		borderClass = "border-background/10";
		borderDividerClass = "border-background/10";
	} else {
		bgClass = "bg-background";
		textClass = "text-foreground";
		mutedClass = "text-muted-foreground";
		borderClass = "border-border";
		borderDividerClass = "border-border";
	}

	if (!isExpanded) {
		return (
			<footer
				className={`border-t ${borderClass} ${bgClass}`}
				style={colorVars}
			>
				<div className="mx-auto flex max-w-[1400px] items-center justify-between px-4 py-6 sm:px-6 lg:px-8">
					<span
						className={`text-sm font-semibold uppercase tracking-widest ${textClass}`}
						data-editable-entity="store"
						data-editable-id={STORE_UID}
						data-editable-field="name"
					>
						{storeName}
					</span>
					<span className={`text-xs ${mutedClass}`}>
						&copy; {new Date().getFullYear()}
					</span>
				</div>
			</footer>
		);
	}

	// Determine grid columns: store info + columns
	const totalCols = 1 + columns.length;
	const gridClass =
		totalCols === 2
			? "md:grid-cols-2"
			: totalCols === 3
				? "md:grid-cols-3"
				: "md:grid-cols-4";

	return (
		<footer
			className={`${noBorder ? "" : "border-t"} ${borderClass} ${bgClass}`}
			style={colorVars}
		>
			<div className="mx-auto max-w-[1400px] px-6 py-16 sm:px-8 lg:px-10">
				<div className={`grid grid-cols-1 gap-12 ${gridClass}`}>
					{/* Store info column */}
					<div>
						<span
							className={`font-display text-2xl font-semibold italic tracking-wide ${textClass}`}
							data-editable-entity="store"
							data-editable-id={STORE_UID}
							data-editable-field="name"
						>
							{storeName}
						</span>
						{description && (
							<p
								className={`mt-4 max-w-xs text-sm leading-relaxed ${mutedClass}`}
							>
								{description}
							</p>
						)}
					</div>

					{/* Dynamic columns */}
					{columns.map((col) => (
						<div key={col.title}>
							<h4
								className={`text-xs font-semibold uppercase tracking-[0.2em] ${mutedClass} opacity-60`}
							>
								{col.title}
							</h4>
							<div className="mt-4 space-y-2">
								{col.links?.map((link) => (
									<a
										key={link.href}
										href={link.href}
										className={`block text-sm ${mutedClass} underline-offset-4 transition-opacity hover:underline hover:opacity-80`}
									>
										{link.label}
									</a>
								))}
								{col.lines?.map((line) => (
									<p key={line} className={`text-sm ${mutedClass}`}>
										{line}
									</p>
								))}
							</div>
						</div>
					))}
				</div>

				{/* Bottom bar */}
				<div
					className={`mt-16 flex items-center justify-between border-t ${borderDividerClass} pt-8`}
				>
					<span className={`text-xs ${mutedClass} opacity-60`}>
						&copy; {new Date().getFullYear()} {storeName}
					</span>
					<span className={`text-xs ${mutedClass} opacity-60`}>
						All rights reserved
					</span>
				</div>
			</div>
		</footer>
	);
}
