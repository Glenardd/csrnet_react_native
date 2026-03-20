import { useMemo } from "react";
import type { GetDailyCounts } from "./dataTypes";

export const useDailyCount = (filterType: "daily" | "weekly", dates: GetDailyCounts[]) => {

    const filteredData = useMemo(() => {
        if (filterType === "daily") return dates;
        if (filterType === "weekly") return dates;
        if (filterType === "accuracy test") return dates;
        return [];
    }, [filterType]);

    const groupedDaily = useMemo(() => {
        if (filterType !== "daily") return [];

        // const sorted = [...filteredData].sort(
        //     (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        // );

        return filteredData.map((item, index) => {
            const previous = filteredData[index - 1];

            let trend: "increase" | "decrease" | "no change" = "no change";
            let percentage = 0;

            if (previous && previous.particles !== 0) {
                const diff = item.particles - previous.particles;
                percentage = (diff / previous.particles) * 100;
                if (diff > 0) trend = "increase";
                else if (diff < 0) trend = "decrease";
            }

            return {
                id: item.id,
                date: item.date,
                particles: item.particles,
                liters: item.liters,
                trend,
                percentage: Math.abs(Math.round(percentage)),
                original_img: item.original_img,
                density_map_img: item.density_map_img
            };
        });
    }, [filteredData, filterType]);

    const groupedWeekly = useMemo(() => {
        if (filterType !== "weekly") return [];
        if (filteredData.length === 0) return [];

        // const sorted = [...filteredData].sort(
        //     (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        // );

        // Assign each unique recorded date a sequential day number
        const dayNumbers = new Map<string, number>();
        filteredData.forEach((item) => {
            const dateKey = new Date(item.date).toDateString();

            if (!dayNumbers.has(dateKey)) {
                dayNumbers.set(dateKey, dayNumbers.size);
            }
        });

        const grouped: Record<number, { particles: number; liters: number }> = {};

        filteredData.forEach((item) => {
            const dateKey = new Date(item.date).toDateString();
            const dayNumber = dayNumbers.get(dateKey)!;
            const weekIndex = Math.floor(dayNumber / 7);

            if (!grouped[weekIndex]) {
                grouped[weekIndex] = { particles: 0, liters: 0 };
            }

            grouped[weekIndex].particles += item.particles ?? 0;
            grouped[weekIndex].liters += item.liters ?? 0;
        });

        const weeks = Object.entries(grouped)
            .map(([weekIndex, total]) => ({
                weekIndex: parseInt(weekIndex),
                total,
            }))
            .sort((a, b) => a.weekIndex - b.weekIndex);

        return weeks.map((item, index) => {
            const previous = weeks[index - 1];

            let trend: "increase" | "decrease" | "no change" = "no change";
            let percentage = 0;

            if (previous && previous.total.particles !== 0) {
                const diff = item.total.particles - previous.total.particles;
                percentage = (diff / previous.total.particles) * 100;
                if (diff > 0) trend = "increase";
                else if (diff < 0) trend = "decrease";
            }

            return {
                id: index,
                week: `Week ${index + 1}`,
                totalParticles: item.total.particles,
                totalLiters: item.total.liters,
                trend,
                percentage: Math.abs(Math.round(percentage))
            };
        });
    }, [filteredData, filterType]);

    const listData = filterType === "weekly" ? groupedWeekly : groupedDaily;

    return { listData };
}