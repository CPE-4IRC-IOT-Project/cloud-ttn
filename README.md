# cloud-ttn

Use `ttn-uplink-decoder.js` as the uplink formatter in The Things Stack.

- Expected payload: 16 bytes (UART payload v1 only, no UART framing).
- Suggested FPort: `15`.
- Supported `msg_type`:
  - `0x01`: heartbeat
  - `0x02`: occupancy_changed
  - `0x03`: temperature (`temp_c` decoded from bytes 4..5, signed centi-degC, little-endian)
