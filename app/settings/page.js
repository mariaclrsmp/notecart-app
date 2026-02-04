"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Settings() {
    const router = useRouter();

    useEffect(() => {
        router.replace("/profile");
    }, [router]);

    return (
        <div className="min-h-screen bg-gray-50" />
    );
}
