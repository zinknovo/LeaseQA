"use client";

import {useRouter, useSearchParams} from "next/navigation";
import {SCENARIO_OPTIONS} from "../constants";

export default function ScenarioFilter() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const activeScenario = searchParams.get("scenario") || "all";

    const handleSelect = (value: string) => {
        if (value === "all") {
            router.push("/qa");
        } else {
            router.push(`/qa?scenario=${value}`);
        }
    };

    return (
        <div className="scenario-filter">
            {SCENARIO_OPTIONS.map((opt) => (
                <button
                    key={opt.value}
                    className={`scenario-chip ${activeScenario === opt.value ? "active" : ""}`}
                    onClick={() => handleSelect(opt.value)}
                >
                    {opt.label}
                </button>
            ))}
        </div>
    );
}
