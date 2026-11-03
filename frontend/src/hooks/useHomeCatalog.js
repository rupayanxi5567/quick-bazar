import { useSearchParams } from "react-router";
import { apiFetch } from "../lib/api.js";
import { useQuery } from "@tanstack/react-query";

export function useHomeCatalog() {
    let [searchParams, setSearchParams] = useSearchParams();
    let categoryFilter = searchParams.get("category")?.trim() ?? "";

    let setCategory = (category) => {
        let next = new URLSearchParams(searchParams);

        if (!category) {
            next.delete("category");
        } else {
            next.set("category", category);
        }

        setSearchParams(next, { replace: true });
    };

    let { data: categoriesData, isLoading: loadingCategories } = useQuery({
        queryKey: ["product-categories"],
        queryFn: () => apiFetch("/api/products/categories"),
    });

    let {
        data: productsData,
        isLoading: loadingList,
        error,
    } = useQuery({
        queryKey: ["products", categoryFilter],
        queryFn: () =>
            apiFetch(
                categoryFilter
                    ? `/api/products?category=${encodeURI(categoryFilter)}`
                    : "/api/products",
            ),
    });

    let categories = categoriesData?.categories ?? [];
    let products = productsData?.products ?? [];
    let categoryChipsLoading = loadingCategories && categories.length === 0;

    return {
        categoryFilter,
        setCategory,
        categories,
        products,
        categoryChipsLoading,
        loadingCategories,
        loadingList,
        error,
    };
}
