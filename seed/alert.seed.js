import dbConnection from '../config/dbConnection.js';
import AlertsTable from '../db/alerts.js'; // Ensure the path points to your database module

export async function seedAlerts() {
  try {
    // ⚡ FIX: Explicitly build the table if it hasn't been created yet
    console.log('Checking alerts table schema status...');
    await dbConnection.query(AlertsTable.getSchemaQuery());

    // Check if alerts already exist
    const [rows] = await dbConnection.query('SELECT COUNT(*) as count FROM alerts');
    if (rows[0].count > 0) {
      console.log('ℹ️ Alerts already exist, skipping seed.');
      return;
    }

    // Insert sample alerts
    const alerts = [
      {
        vehicle_id: 'EV-001',
        title: 'Battery Overheating',
        message: 'Battery temperature exceeded safe threshold',
        severity: 'critical',
        status: 'active',
        rca_data: { sensor: 'battery_temp', threshold: 60 }
      },
      {
        vehicle_id: 'EV-002',
        title: 'Low Voltage',
        message: 'Voltage dropped below minimum level',
        severity: 'warning',
        status: 'active',
        rca_data: { sensor: 'voltage', threshold: 320 }
      },
      {
        vehicle_id: 'EV-003',
        title: 'Maintenance Due',
        message: 'Scheduled maintenance overdue by 10 days',
        severity: 'normal',
        status: 'resolved',
        rca_data: { schedule: 'oil_change' }
      }
    ];

    for (const alert of alerts) {
      await dbConnection.query(
        `INSERT INTO alerts (vehicle_id, title, message, severity, status, rca_data)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          alert.vehicle_id,
          alert.title,
          alert.message,
          alert.severity,
          alert.status,
          JSON.stringify(alert.rca_data)
        ]
      );
    }

    console.log('✅ Alerts seeded successfully');
  } catch (err) {
    console.error('❌ Error seeding alerts:', err);
  }
}