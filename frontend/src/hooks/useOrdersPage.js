import { useAuth } from "@clerk/react";
import { apiFetch } from "../lib/api.js";
import { useQuery } from "@tanstack/react-query";

import React from "react";

const useOrdersPage = () => {
    let { getToken, isSignedIn } = useAuth();

    let { data, isLoading, error } = useQuery({
        queryKey: ["orders"],
        queryFn: () => apiFetch("/api/orders", { getToken }),
        enabled: isSignedIn,
    });

    let { data: meData } = useQuery({
        queryKey: ["me"],
        queryFn: () => apiFetch("/api/me", { getToken }),
        enabled: isSignedIn,
    });

    let staff =
        meData?.user?.role === "support" || meData?.user?.role === "admin";

    let orders = data?.orders ?? [];

    return {
        isLoading,
        error,
        orders,
        staff,
    };
};

export default useOrdersPage;
