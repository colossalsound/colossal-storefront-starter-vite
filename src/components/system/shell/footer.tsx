export function Footer({ storeName }: { storeName: string }) {
	return (
		<footer className="border-t border-border bg-background">
			<div className="mx-auto flex max-w-[1400px] items-center justify-between px-4 py-6 sm:px-6 lg:px-8">
				<span className="text-sm font-semibold uppercase tracking-widest">
					{storeName}
				</span>
				<span className="text-xs text-muted-foreground">
					&copy; {new Date().getFullYear()}
				</span>
			</div>
		</footer>
	);
}
