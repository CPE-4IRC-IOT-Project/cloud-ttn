function u32be(bytes, offset) {
  return (
    (bytes[offset] << 24) |
    (bytes[offset + 1] << 16) |
    (bytes[offset + 2] << 8) |
    bytes[offset + 3]
  ) >>> 0;
}

function i16le(bytes, offset) {
  let v = bytes[offset] | (bytes[offset + 1] << 8);
  if (v & 0x8000) {
    v -= 0x10000;
  }
  return v;
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
  const base = {
    ver: ver,
    msg_type: msgType,
    msg_type_name:
      msgType === 0x01
        ? "heartbeat"
        : (msgType === 0x02 ? "occupancy_changed" : (msgType === 0x03 ? "temperature" : "unknown")),
    node_id: nodeId,
    flags: flags,
    counter: u32be(bytes, 8),
    uptime_s: u32be(bytes, 12),
  };

  if (msgType === 0x03) {
    const tempCenti = i16le(bytes, 4);
    return {
      data: {
        ...base,
        temp_c: tempCenti / 100.0,
      },
    };
  }

  return {
    data: {
      ...base,
      low_light: (flags & 0x01) !== 0,
      luma: bytes[4],
      occupied: bytes[5],
      stable_count: bytes[6],
      raw_count: bytes[7],
    },
  };
}

if (typeof module !== "undefined") {
  module.exports = { decodeUplink };
}
