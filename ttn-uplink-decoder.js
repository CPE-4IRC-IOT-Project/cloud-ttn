function u32be(bytes, offset) {
  return (
    (bytes[offset] << 24) |
    (bytes[offset + 1] << 16) |
    (bytes[offset + 2] << 8) |
    bytes[offset + 3]
  ) >>> 0;
}

function decodeUplink(input) {
  const bytes = input.bytes || [];
  if (bytes.length !== 16) {
    return {
      errors: [`invalid payload length: expected 16, got ${bytes.length}`],
    };
  }

  const ver = bytes[0];
  const msgType = bytes[1];
  const nodeId = bytes[2];
  const flags = bytes[3];

  return {
    data: {
      ver: ver,
      msg_type: msgType,
      msg_type_name: msgType === 0x01 ? "heartbeat" : (msgType === 0x02 ? "occupancy_changed" : "unknown"),
      node_id: nodeId,
      flags: flags,
      low_light: (flags & 0x01) !== 0,
      luma: bytes[4],
      occupied: bytes[5],
      stable_count: bytes[6],
      raw_count: bytes[7],
      counter: u32be(bytes, 8),
      uptime_s: u32be(bytes, 12),
    },
  };
}

if (typeof module !== "undefined") {
  module.exports = { decodeUplink };
}
