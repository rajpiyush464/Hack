export function generateAlerts(vehicle) {
  const alerts = [];

  if (vehicle.battery_temp > 70) {
    alerts.push({
      id: "ALT-BATT-TEMP",
      vehicleId: vehicle.vehicle_id,
      title: "High Battery Temperature",
      message: `Battery temperature ${vehicle.battery_temp}°C exceeded safe threshold`,
      severity: "warning",
      status: "active",
      metric: "battery_temp",
      value: vehicle.battery_temp,
      threshold: 70,
      unit: "°C",
      timestamp: new Date().toISOString(),
      category: "battery",
    });
  }

  if (vehicle.motor_temp > 85) {
    alerts.push({
      id: "ALT-MOTOR-TEMP",
      vehicleId: vehicle.vehicle_id,
      title: "High Motor Temperature",
      message: `Motor temperature ${vehicle.motor_temp}°C exceeded safe threshold`,
      severity: "critical",
      status: "active",
      metric: "motor_temp",
      value: vehicle.motor_temp,
      threshold: 85,
      unit: "°C",
      timestamp: new Date().toISOString(),
      category: "motor",
    });
  }

  if (vehicle.voltage < 360) {
    alerts.push({
      id: "ALT-VOLTAGE",
      vehicleId: vehicle.vehicle_id,
      title: "Low Battery Voltage",
      message: `Voltage dropped to ${vehicle.voltage}V below safe range`,
      severity: "critical",
      status: "active",
      metric: "voltage",
      value: vehicle.voltage,
      threshold: 360,
      unit: "V",
      timestamp: new Date().toISOString(),
      category: "electrical",
    });
  }

  if (vehicle.soc < 10) {
    alerts.push({
      id: "ALT-SOC",
      vehicleId: vehicle.vehicle_id,
      title: "Low Battery Charge",
      message: `SOC is critically low at ${vehicle.soc}%`,
      severity: "critical",
      status: "active",
      metric: "soc",
      value: vehicle.soc,
      threshold: 10,
      unit: "%",
      timestamp: new Date().toISOString(),
      category: "battery",
    });
  }

  if (Number(vehicle.failure_probability) > 70) {
    alerts.push({
      id: "ALT-FAILURE-PROB",
      vehicleId: vehicle.vehicle_id,
      title: "High Failure Probability",
      message: `Predicted failure probability is ${vehicle.failure_probability}%`,
      severity: "critical",
      status: "active",
      metric: "failure_probability",
      value: Number(vehicle.failure_probability),
      threshold: 70,
      unit: "%",
      timestamp: new Date().toISOString(),
      category: "system",
    });
  }

  return alerts;
}
