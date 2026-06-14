import type { PaperCredibility } from "@/types/research";

export type CredibilityMetadata = {
  abstract?: string | null;
  citations: number;
  publicationType: string;
  venue: string;
  year: number;
};

const CURRENT_YEAR = new Date().getFullYear();

export function assessPaperCredibility({
  abstract,
  citations,
  publicationType,
  venue,
  year,
}: CredibilityMetadata): PaperCredibility {
  const citationStrength = getCitationStrength(citations);
  const recency = getRecency(year);
  const methodology = getMethodologySignal(publicationType, abstract);
  const venueQuality = getVenueSignal(venue);
  const score = calculateCredibilityScore({
    abstract,
    citationStrength,
    recency,
    venueQuality,
  });

  return {
    score,
    citationStrength,
    recency,
    methodology,
    venueQuality,
    limitations: getLimitations({ abstract, publicationType, venue }),
    whyTrust: getCredibilitySummary({
      citationStrength,
      methodology,
      recency,
      score,
      venueQuality,
    }),
  };
}

function calculateCredibilityScore({
  abstract,
  citationStrength,
  recency,
  venueQuality,
}: {
  abstract?: string | null;
  citationStrength: string;
  recency: string;
  venueQuality: string;
}) {
  let score = 50;

  if (citationStrength === "High") {
    score += 18;
  } else if (citationStrength === "Moderate") {
    score += 10;
  } else if (citationStrength === "Early signal") {
    score += 4;
  }

  if (recency === "Recent") {
    score += 12;
  } else if (recency === "Established") {
    score += 8;
  } else if (recency === "Older but potentially foundational") {
    score += 5;
  }

  if (venueQuality === "Named venue") {
    score += 10;
  } else if (venueQuality === "Unknown venue") {
    score -= 4;
  }

  if (abstract && abstract.trim().length > 0) {
    score += 8;
  } else {
    score -= 5;
  }

  return Math.min(95, Math.max(35, score));
}

function getCitationStrength(citations: number) {
  if (citations >= 500) {
    return "High";
  }

  if (citations >= 100) {
    return "Moderate";
  }

  if (citations >= 20) {
    return "Early signal";
  }

  return "Limited so far";
}

function getRecency(year: number) {
  const age = CURRENT_YEAR - year;

  if (age <= 5) {
    return "Recent";
  }

  if (age <= 12) {
    return "Established";
  }

  return "Older but potentially foundational";
}

function getMethodologySignal(
  publicationType: string,
  abstract: string | null | undefined,
) {
  const searchableText = `${publicationType} ${abstract ?? ""}`.toLowerCase();

  if (searchableText.includes("systematic review")) {
    return "Systematic review";
  }

  if (searchableText.includes("review")) {
    return "Review or synthesis";
  }

  if (
    searchableText.includes("experiment") ||
    searchableText.includes("survey") ||
    searchableText.includes("cross-sectional") ||
    searchableText.includes("empirical")
  ) {
    return "Empirical study";
  }

  if (searchableText.includes("case")) {
    return "Case study";
  }

  if (publicationType && publicationType !== "Academic paper") {
    return publicationType;
  }

  return "Method unclear from metadata";
}

function getVenueSignal(venue: string) {
  return venue && venue !== "Unknown venue" ? "Named venue" : "Unknown venue";
}

function getLimitations({
  abstract,
  publicationType,
  venue,
}: Pick<CredibilityMetadata, "abstract" | "publicationType" | "venue">) {
  const limitations = [];

  if (!abstract) {
    limitations.push("abstract is missing");
  }

  if (!venue || venue === "Unknown venue") {
    limitations.push("venue metadata is missing");
  }

  if (!publicationType || publicationType === "Academic paper") {
    limitations.push("publication type is broad");
  }

  if (limitations.length === 0) {
    return "Use with caution until you inspect the full paper's methods, sample, and limitations.";
  }

  return `Use with caution because ${limitations.join(", ")}. Inspect the full paper before relying on it.`;
}

function getCredibilitySummary({
  citationStrength,
  methodology,
  recency,
  score,
  venueQuality,
}: Pick<
  PaperCredibility,
  "citationStrength" | "methodology" | "recency" | "score" | "venueQuality"
>) {
  if (score >= 80) {
    return `Stronger signal: ${citationStrength.toLowerCase()} citation activity, ${recency.toLowerCase()} publication timing, and ${venueQuality.toLowerCase()} metadata. Still inspect the methods before relying on it.`;
  }

  if (score >= 65) {
    return `Worth reading: this paper has a ${methodology.toLowerCase()} signal and ${citationStrength.toLowerCase()} citation activity, but it should be checked against stronger sources.`;
  }

  return `Use with caution: the metadata gives a weaker signal, so read the full paper and compare it with higher-cited or more recent sources.`;
}
