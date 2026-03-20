import { useMemo } from "react";
import { GetAccuracyTest } from "./dataTypes";

export const useAccuracyTest = (dates: GetAccuracyTest[]) => {
    // accuracy test
    const accuracyTest = useMemo(() => {
        return dates.map((item) => {
            const real = item.real_count ?? 0;
            const predicted = item.predicted_count ?? 0;

            const accuracy =
                real === 0 ? 0 : (1 - Math.abs(real - predicted) / real) * 100;

            return {
                id: item.id,
                date: item.date,
                real_count: real,
                predicted: predicted,
                accuracy: Math.round(accuracy),
                original_img: item.original_img,
                density_map_img: item.density_map_img
            };
        });
    }, [dates])

    const listData = accuracyTest;

    return { listData }
}