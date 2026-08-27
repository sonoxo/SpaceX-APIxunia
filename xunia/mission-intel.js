const ALLOWED_ENTITY_TYPES = new Set(["launch", "rocket", "launchpad", "payload", "capsule", "ship", "starlink"]);

export function normalizeLaunch(launch, sourceUrl = "https://api.spacexdata.com/v5/launches/latest") {
  if (!launch || typeof launch !== "object") throw new TypeError("launch object required");
  return {
    objectType: "MissionLaunch",
    id: String(launch.id ?? "unknown"),
    name: String(launch.name ?? "Unnamed launch"),
    flightNumber: Number.isFinite(launch.flight_number) ? launch.flight_number : null,
    dateUtc: launch.date_utc ?? null,
    success: typeof launch.success === "boolean" ? launch.success : null,
    upcoming: Boolean(launch.upcoming),
    rocketId: launch.rocket ?? null,
    launchpadId: launch.launchpad ?? null,
    payloadIds: Array.isArray(launch.payloads) ? [...launch.payloads] : [],
    crewIds: Array.isArray(launch.crew) ? [...launch.crew] : [],
    source: {
      url: sourceUrl,
      rightsBasis: "public-api",
      retrievedAt: new Date().toISOString(),
      provider: "r-spacex/SpaceX-API",
      affiliationClaim: false,
    },
  };
}

export function toOntologyObjects(entityType, rows, sourceUrl) {
  const normalizedType = String(entityType || "").toLowerCase();
  if (!ALLOWED_ENTITY_TYPES.has(normalizedType)) throw new Error("UNSUPPORTED_READ_ENTITY");
  if (!Array.isArray(rows)) throw new TypeError("rows must be an array");
  if (normalizedType === "launch") return rows.map((row) => normalizeLaunch(row, sourceUrl));
  return rows.map((row) => ({
    objectType: `Mission${normalizedType[0].toUpperCase()}${normalizedType.slice(1)}`,
    id: String(row?.id ?? "unknown"),
    properties: row,
    source: {
      url: sourceUrl ?? `https://api.spacexdata.com/v4/${normalizedType}s`,
      rightsBasis: "public-api",
      retrievedAt: new Date().toISOString(),
      provider: "r-spacex/SpaceX-API",
      affiliationClaim: false,
    },
  }));
}

export function evaluateMissionAction(action) {
  const op = String(action?.op ?? "").toUpperCase();
  if (["READ", "QUERY", "NORMALIZE", "EXPORT", "SIMULATE"].includes(op)) {
    return { decision: "ALLOW", reason: "READ_OR_SIMULATION_ONLY" };
  }
  if (["FLIGHT_COMMAND", "VEHICLE_COMMAND", "TELECOMMAND", "CONTROL", "ACTUATE"].includes(op)) {
    return { decision: "BLOCK", reason: "REAL_WORLD_FLIGHT_CONTROL_DISABLED" };
  }
  return { decision: "REVIEW", reason: "UNCLASSIFIED_ACTION_REQUIRES_HUMAN_REVIEW" };
}

export async function fetchLatestLaunch(fetchImpl = globalThis.fetch) {
  if (typeof fetchImpl !== "function") throw new Error("fetch implementation required");
  const url = "https://api.spacexdata.com/v5/launches/latest";
  const response = await fetchImpl(url, { headers: { accept: "application/json" } });
  if (!response.ok) throw new Error(`SpaceX API HTTP ${response.status}`);
  return normalizeLaunch(await response.json(), url);
}
