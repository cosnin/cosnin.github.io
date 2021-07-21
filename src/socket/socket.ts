export const EventType = {
  // direct calling events

  SENSOR_DATA: "SENSOR_DATA",
  RECORDING_DATA: "RECORDING_DATA",

  ERROR: "ERROR",
  DISCONNECT: "disconnect"
};

export var s: any = null;

export function init(io) {
  io.on("connection", function (socket) {
    console.log("Socket IO Ready");
  });
}

export function sendSensorData(io, data) {
  try {
    console.log("sending sensor data");
    io.sockets.emit(EventType.SENSOR_DATA, data);
  } catch (err) {
    console.log(EventType.SENSOR_DATA + " error: " + err);
  }
}

export function sendRecording(io, data) {
  try {
    console.log("sending recording data");
    io.sockets.emit(EventType.RECORDING_DATA, data);
  } catch (err) {
    console.log(EventType.RECORDING_DATA + " error: " + err);
  }
}
