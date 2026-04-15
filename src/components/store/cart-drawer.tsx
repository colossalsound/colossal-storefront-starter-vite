import {
	useCartContext,
	useCreateCheckoutSession,
} from "@colossal-sh/storefront-sdk";
import { Loader2, Minus, Plus, ShoppingBag, X } from "lucide-react";
import { useState } from "react";
import { Button } from "#/components/ui/button";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
} from "#/components/ui/drawer";

interface CartDrawerProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onUpdateQuantity?: (lineItemUid: string, quantity: number) => void;
	onRemoveItem?: (lineItemUid: string) => void;
	cartId?: string | null;
}

export function CartDrawer(_props: CartDrawerProps) {
	const { items, cartId, isOpen, closeCart, updateQuantity, removeItem } =
		useCartContext();
	const createSession = useCreateCheckoutSession();
	const [checkoutLoading, setCheckoutLoading] = useState(false);
	const itemCount = items.length;
	const subtotal = items.reduce(
		(sum, item) => sum + item.price * item.quantity,
		0,
	);

	return (
		<Drawer
			open={isOpen}
			onOpenChange={(val) => !val && closeCart()}
			direction="right"
		>
			<DrawerContent className="sm:max-w-md">
				<DrawerHeader className="border-b pb-4">
					<DrawerTitle className="font-display text-lg font-bold">
						Your Cart{itemCount > 0 ? ` (${itemCount})` : ""}
					</DrawerTitle>
					<DrawerDescription>
						{itemCount === 0
							? "Your cart is empty"
							: "Review your items before checkout"}
					</DrawerDescription>
				</DrawerHeader>

				{itemCount === 0 ? (
					<div className="flex flex-1 flex-col items-center justify-center gap-4 px-4 py-16">
						<div className="bg-muted p-6">
							<ShoppingBag className="h-8 w-8 text-muted-foreground" />
						</div>
						<div className="text-center">
							<p className="text-sm font-medium">Nothing here yet</p>
							<p className="mt-1 max-w-[220px] text-sm text-muted-foreground">
								Browse our collection and add items to get started.
							</p>
						</div>
						<DrawerClose asChild>
							<Button variant="outline" size="sm" className="mt-2">
								Continue Shopping
							</Button>
						</DrawerClose>
					</div>
				) : (
					<div className="flex flex-1 flex-col overflow-y-auto px-4">
						{items.map((item) => (
							<div
								key={item.uid}
								className="flex gap-4 border-b py-4 last:border-0"
							>
								<div
									className="h-20 w-20 flex-shrink-0 bg-muted"
									style={
										item.imageUrl
											? {
													backgroundImage: `url(${item.imageUrl})`,
													backgroundSize: "cover",
													backgroundPosition: "center",
												}
											: undefined
									}
								/>
								<div className="flex min-w-0 flex-1 flex-col justify-between">
									<div className="flex items-start justify-between gap-2">
										<p className="truncate text-sm font-medium">{item.name}</p>
										<Button
											variant="ghost"
											size="icon-xs"
											onClick={() => removeItem?.(item.uid)}
											className="text-muted-foreground hover:text-foreground"
										>
											<X className="h-4 w-4" />
										</Button>
									</div>
									<div className="flex items-center justify-between">
										<div className="flex items-center gap-2">
											<Button
												variant="outline"
												size="icon-sm"
												onClick={() =>
													updateQuantity?.(item.uid, item.quantity - 1)
												}
												className="text-muted-foreground hover:text-foreground"
											>
												<Minus className="h-3 w-3" />
											</Button>
											<span className="w-6 text-center text-sm">
												{item.quantity}
											</span>
											<Button
												variant="outline"
												size="icon-sm"
												onClick={() =>
													updateQuantity?.(item.uid, item.quantity + 1)
												}
												className="text-muted-foreground hover:text-foreground"
											>
												<Plus className="h-3 w-3" />
											</Button>
										</div>
										<p className="text-sm font-medium">${(item.price * item.quantity).toFixed(2)}</p>
									</div>
								</div>
							</div>
						))}
					</div>
				)}

				{items.length > 0 && (
					<DrawerFooter className="border-t pt-4">
						<div className="flex items-center justify-between py-1">
							<span className="font-medium">Subtotal</span>
							<span className="font-semibold">${subtotal.toFixed(2)}</span>
						</div>
						<Button
							className="w-full cursor-pointer"
							size="lg"
							disabled={checkoutLoading || !cartId}
							onClick={async () => {
								if (!cartId) return;
								setCheckoutLoading(true);
								try {
									const session = await createSession.mutateAsync({
										cartUid: cartId,
									});
									const url = session.data?.checkoutUrl;
									if (url) {
										closeCart();
										window.location.href = url;
									}
								} finally {
									setCheckoutLoading(false);
								}
							}}
						>
							{checkoutLoading ? (
								<Loader2 className="h-4 w-4 animate-spin" />
							) : (
								"Checkout"
							)}
						</Button>
						<DrawerClose asChild>
							<Button variant="outline" className="w-full cursor-pointer">
								Continue Shopping
							</Button>
						</DrawerClose>
					</DrawerFooter>
				)}
			</DrawerContent>
		</Drawer>
	);
}
