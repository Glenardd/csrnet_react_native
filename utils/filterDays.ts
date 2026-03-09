import { useMemo } from "react";

interface DateTypes {
    id: string
    date: string
    particles: number
    real_count?: number
    predicted_count?: number
}

export const useFilterDays = (filterType: "daily" | "weekly" | "accuracy test", dates: DateTypes[]) => {

    // filter
    const filteredData = useMemo(() => {
        if (filterType === "daily") {
            return dates
        }

        if (filterType === "weekly") {
            return dates
        }

        if (filterType === "accuracy test") {
            return dates
        }

        return [];
    }, [filterType]);

    //daily 
    const groupedDaily = useMemo(() => {
        if (filterType !== "daily") return [];

        const sorted = [...filteredData].sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );

        return sorted.map((item, index) => {
            const previous = sorted[index - 1];

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
                total: item.particles,
                trend,
                percentage: Math.abs(Math.round(percentage)),
            };
        });
    }, [filteredData, filterType]);

    //weekly
    const groupedWeekly = useMemo(() => {
        if (filterType !== "weekly") return [];

        const grouped: Record<number, number> = {};

        if (filteredData.length === 0) return [];

        const first = new Date(
            Math.min(...filteredData.map((item) => new Date(item.date).getTime()))
        );

        filteredData.forEach((item) => {
            const d = new Date(item.date);

            const diffDays = Math.floor(
                (d.getTime() - first.getTime()) / (1000 * 60 * 60 * 24)
            );

            const weekIndex = Math.floor(diffDays / 7);

            if (!grouped[weekIndex]) grouped[weekIndex] = 0;

            grouped[weekIndex] += item.particles;
        });

        const weeks = Object.entries(grouped)
            .map(([weekIndex, totalParticles]) => ({
                weekIndex: Number(weekIndex),
                totalParticles,
            }))
            .sort((a, b) => a.weekIndex - b.weekIndex);

        return weeks.map((item, index) => {
            const previous = weeks[index - 1];

            let trend: "increase" | "decrease" | "no change" = "no change";
            let percentage = 0;

            if (previous && previous.totalParticles !== 0) {
                const diff = item.totalParticles - previous.totalParticles;
                percentage = (diff / previous.totalParticles) * 100;

                if (diff > 0) trend = "increase";
                else if (diff < 0) trend = "decrease";
            }

            return {
                id: String(index),
                week: `Week ${item.weekIndex + 1}`,
                total: item.totalParticles,
                trend,
                percentage: Math.abs(Math.round(percentage)),
            };
        });
    }, [filteredData, filterType]);

    // accuracy test
    const accuracyTest = useMemo(() => {
        return filteredData.map((item) => {
            const real = item.real_count ?? 0;
            const predicted = item.predicted_count ?? 0;

            const accuracy =
                real === 0 ? 0 : (1 - Math.abs(real - predicted) / real) * 100;

            return {
                id: item.id,
                date: item.date,
                total: real,
                predicted: predicted,
                accuracy: Math.round(accuracy),
            };
        });
    }, [filteredData, filterType])
    const listData = filterType === "accuracy test" ? accuracyTest : filterType === "weekly" ? groupedWeekly : groupedDaily;

    return { listData }
}