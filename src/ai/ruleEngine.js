import knowledgeBase from "../config/vehicleKnowledgeBase.json" with { type: "json" };
import rules from "../config/rules.json" with { type: "json" };

class RuleEngine {

    static analyze(probability, telemetry) {

        const probabilityPercent = Number((probability * 100).toFixed(2));

        //--------------------------------------------
        // HEALTH STATUS
        //--------------------------------------------

        let healthStatus;
        let riskLevel;

        if (probabilityPercent < rules.healthy) {

            healthStatus = "Healthy";
            riskLevel = "Low";

        } else if (probabilityPercent < rules.warning) {

            healthStatus = "Warning";
            riskLevel = "Medium";

        } else {

            healthStatus = "Critical";
            riskLevel = "High";

        }

        //--------------------------------------------
        // COMPONENT DETECTION
        //--------------------------------------------

        let atRiskComponent = "General Vehicle";

        if (
            telemetry.Battery_Health <=
            knowledgeBase.Battery.warningHealth
        ) {

            atRiskComponent = "Battery";

        }
        else if (

            telemetry.Motor_Temperature >=
                knowledgeBase.Motor.warningTemperature &&

            telemetry.Motor_Vibration >=
                knowledgeBase.Motor.warningVibration

        ) {

            atRiskComponent = "Motor";

        }
        else if (

            telemetry.Brake_Risk >=
            knowledgeBase.Brake.warningRisk

        ) {

            atRiskComponent = "Brake System";

        }
        else if (

            telemetry.Diagnostic_Trouble_Code_Count >=
            knowledgeBase.Electrical.warningDTC

        ) {

            atRiskComponent = "Electrical System";

        }

        //--------------------------------------------
        // KNOWLEDGE BASE LOOKUP
        //--------------------------------------------

        const componentRules =
            knowledgeBase[
                atRiskComponent.replace(" System", "")
            ];

        const failureType =
            componentRules?.failureType ??
            "No Major Issue";

        const recommendedAction =
            componentRules?.recommendation ??
            "Continue monitoring vehicle telemetry.";

        //--------------------------------------------
        // RETURN
        //--------------------------------------------

        return {

            failureProbability: probabilityPercent,

            predictedFailure: probabilityPercent >= 50,

            healthStatus,

            riskLevel,

            confidence: probabilityPercent,

            atRiskComponent,

            failureType,

            recommendedAction

        };

    }

}

export default RuleEngine;