# XUNIA Mission Telemetry Twin

This adapter turns public SpaceX REST API data into provenance-bearing XUNIA ontology objects for simulation, analytics, dashboards, and Palantir-style ontology workflows.

## Pipeline

`PUBLIC API → XUNIA NORMALIZE → GLASS ONION PROVENANCE → VIRGINIA QUERY → MISSION TWIN → HUMAN-REVIEWED OUTPUT`

Supported read entities: launches, rockets, launchpads, payloads, capsules, ships, and Starlink records.

The adapter is **read/simulation only**. `FLIGHT_COMMAND`, `VEHICLE_COMMAND`, `TELECOMMAND`, `CONTROL`, and `ACTUATE` are explicitly blocked. It does not connect to SpaceX operational systems and does not imply SpaceX affiliation or endorsement.

## Example

```js
import { fetchLatestLaunch } from "./mission-intel.js";
const launch = await fetchLatestLaunch();
console.log(launch);
```

## XUNIAverse visual layer

<p align="center"><a href="https://github.com/sonoxo/NASA-3D-ResourcesXUNIA-"><img src="https://raw.githubusercontent.com/sonoxo/NASA-3D-ResourcesXUNIA-/master/Images%20and%20Textures/Hipparcos%20Star%20Map/preview.webp" alt="XUNIAverse star-map visual" width="100%" /></a></p>

Source visual: NASA 3D Resources / Hipparcos Star Map preview. No NASA endorsement or affiliation implied.
