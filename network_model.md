Placeholder for proper documentation.

- This game uses geckos.io, which in turn uses WebRTC data channel for packet transmission
- WebRTC is unreliable (UDP) by nature but geckos.io allows sending reliable packets (TODO investigate their approach)

All simulation is run on the server-side and client-side. Server is authoritative and clients shall correct their simulation to match server simulation.

First approach taken for syncing such behavior is as follows:

- Server sends all entities and all necessary components to each player
- Player entity id matches socket id thus it can identify it's own entity

Approach shall be designed to allow progress towards next steps, which are

- Delta compression (only send deltas)

  - If player misses the package, also keep first approach to be done in larger intervals (e.g. once per second)

- Delta compression against client known state
  - Can get rid of the first approach completely
