import { describe, expect, test } from "@jest/globals";
import { evaluateMissionAction, normalizeLaunch, toOntologyObjects } from "./mission-intel.js";

describe("XUNIA mission intelligence adapter", () => {
  test("normalizes launch data with provenance", () => {
    const launch = normalizeLaunch({ id: "abc", name: "Demo", flight_number: 42, payloads: ["p1"] });
    expect(launch.objectType).toBe("MissionLaunch");
    expect(launch.id).toBe("abc");
    expect(launch.payloadIds).toEqual(["p1"]);
    expect(launch.source.rightsBasis).toBe("public-api");
  });

  test("blocks real-world flight control", () => {
    expect(evaluateMissionAction({ op: "FLIGHT_COMMAND" })).toEqual({
      decision: "BLOCK",
      reason: "REAL_WORLD_FLIGHT_CONTROL_DISABLED",
    });
  });

  test("allows read-only ontology conversion", () => {
    const rows = toOntologyObjects("rocket", [{ id: "r1", name: "Example" }]);
    expect(rows[0].objectType).toBe("MissionRocket");
  });
});
