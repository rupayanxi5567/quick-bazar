import { useAuth } from "@clerk/react";
import { useCart } from "../store/cart";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "../lib/api";
import { useState } from "react";

export default function useCartPage() {
    let { getToken } = useAuth();
    let [checkoutLoading, setCheckoutLoading] = useState(false);
    let [checkoutError, setCheckoutError] = useState("");

    let items = useCart((s) => s.items);
    let setQty = useCart((s) => s.setQty);
    let removeItem = useCart((s) => s.removeItem);

    let {
        data,
        isLoading: productsLoading,
        isError: productsError,
    } = useQuery({
        queryKey: ["products"],
        queryFn: () => apiFetch("/api/products"),
        enabled: items.length > 0,
    });

    let products = data?.products ?? [];
    let byId = new Map(products.map((p) => [p.id, p]));

    let lines = items.map((line) => ({
        line,
        product: byId.get(line.productId) ?? null,
    }));

    let subtotal = lines.reduce((sum, { line, product: p }) => {
        if (!p) {
            return sum;
        }
        return sum + p.priceCents * line.quantity;
    }, 0);

    async function checkout() {
        setCheckoutLoading(true);
        setCheckoutError("");

        let body = {
            items: items.map((i) => ({
                productId: i.productId,
                quantity: i.quantity,
            })),
        };

        try {
            let res = await apiFetch("/api/checkout", {
                getToken,
                method: "POST",
                body,
            });

            if (res?.checkoutUrl) {
                window.location.href = res.checkoutUrl;
                return;
            }
            setCheckoutError("Checkout could not be started. Please try again.");
        } catch (error) {
            console.error("Checkout failed:", error);
            setCheckoutError(error instanceof Error ? error.message : "Checkout failed. Please try again.");
        } finally {
            setCheckoutLoading(false);
        }
    }

    return {
        items,
        setQty,
        removeItem,
        productsLoading,
        productsError,
        lines,
        subtotal, 
        checkout,
        checkoutLoading,
        checkoutError,
    };
}
