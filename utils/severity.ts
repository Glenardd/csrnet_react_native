type SeverityResult = {
  level: "Low" | "Moderate" | "High" | "Very High";
  color: string;
  mpPerLiter: number;
};

export function microplasticSeverity(
  particles: number,
  liters: number
): SeverityResult {
  if (liters === 0) {
    throw new Error("Liters cannot be zero");
  }

  const mpPerLiter = particles / liters;

  if (mpPerLiter <= 1) {
    return {
      level: "Low",
      color: "#22C55E", // Green
      mpPerLiter,
    };
  }

  if (mpPerLiter <= 5) {
    return {
      level: "Moderate",
      color: "#EAB308", // Yellow
      mpPerLiter,
    };
  }

  if (mpPerLiter <= 10) {
    return {
      level: "High",
      color: "#F97316", // Orange
      mpPerLiter,
    };
  }

  return {
    level: "Very High",
    color: "#EF4444", // Red
    mpPerLiter,
  };
}