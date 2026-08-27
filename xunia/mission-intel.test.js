import assert from "node:assert/strict";
import test from "node:test";
import { evaluateMissionAction, normalizeLaunch, toOntologyObjects } from "./mission-intel.js";

test("normalizes launch data with provenance", () => {
  const launch = normalizeLaunch({ id: "abc", name: "Demo", flight_number: 42, payloads: ["p1"] });
  assert.equal(launch.objectType, "MissionLaunch");
  assert.equal(launch.id, "abc");
  assert.deepEqual(launch.payloadIds, ["p1"]);
  assert.equal(launch.source.rightsBasis, "public-api");
});

test("blocks real-world flight control", () => {
  assert.deepEqual(evaluateMissionAction({ op: "FLIGHT_COMMAND" }), {
    decision: "BLOCK",
    reason: "REAL_WORLD_FLIGHT_CONTROL_DISABLED",
  });
});

test("allows read-only ontology conversion", () => {
  const rows = toOntologyObjects("rocket", [{ id: "r1", name: "Example" }]);
  assert.equal(rows[0].objectType, "MissionRocket");
});
