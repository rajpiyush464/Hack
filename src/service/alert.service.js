import AlertsTable from '../../db/alerts.js';

/**
 * AlertService
 * ------------
 * Business logic for alerts. Decides when to create alerts from RCA,
 * and exposes functions for listing, resolving, and fetching alerts.
 */
const AlertService = {
  /**
   * Generate an alert from RCA output.
   * Creates alerts only if severity is "Critical" or "Warning".
   */
  async generateFromRCA(vehicleId, rca) {
    try {
      if (!rca) return null;

      if (rca.severity === 'Critical' && rca.confidence === 'High') {
        return await AlertsTable.createAlert({
          vehicle_id: vehicleId,
          title: 'Critical Health Alert',
          message: rca.executiveSummary,
          severity: 'critical',
          rca_data: JSON.stringify(rca)
        });
      }

      if (rca.severity === 'Warning') {
        return await AlertsTable.createAlert({
          vehicle_id: vehicleId,
          title: 'Warning Alert',
          message: rca.executiveSummary,
          severity: 'warning',
          rca_data: JSON.stringify(rca)
        });
      }

      return null;
    } catch (err) {
      console.error("Error generating alert from RCA:", err.message);
      throw err;
    }
  },

  /** Fetch all active alerts */
  async listActive() {
    try {
      return await AlertsTable.getActiveAlerts();
    } catch (err) {
      console.error("Error listing active alerts:", err.message);
      throw err;
    }
  },

  /** Resolve an alert by ID */
  async resolve(id) {
    try {
      return await AlertsTable.resolveAlert(id);
    } catch (err) {
      console.error(`Error resolving alert ${id}:`, err.message);
      throw err;
    }
  },

  /** Fetch a single alert by ID */
  async getById(id) {
    try {
      return await AlertsTable.getAlertById(id);
    } catch (err) {
      console.error(`Error fetching alert ${id}:`, err.message);
      throw err;
    }
  }
};

export default AlertService;
