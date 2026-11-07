/*
 * Surveillance Quadrotor Drone — aggregator: instance, requirement satisfaction, imports.
 */
package SurveillanceDrone {
	doc /* Root package for a broad surveillance-drone teaching example. */

	private import SurveillanceDronePorts::*;
	private import SurveillanceDroneStructure::*;
	private import SurveillanceDroneBehavior::*;
	private import SurveillanceDroneRequirements::*;

	part droneInstance : SurveillanceQuadrotorDrone;

	satisfy requirement enduranceSatisfied : EnduranceReq by droneInstance;
	satisfy requirement maxAltitudeAGLSatisfied : MaxAltitudeAGLReq by droneInstance;
	satisfy requirement windToleranceSatisfied : WindToleranceReq by droneInstance;
	satisfy requirement videoLatencySatisfied : VideoLatencyReq by droneInstance.communication;
	satisfy requirement failsafeSatisfied : FailsafeReq by droneInstance.flightControl.flightController;
	satisfy requirement geofencingSatisfied : GeofencingReq by droneInstance.flightControl;
	satisfy requirement remoteIDSatisfied : RemoteIDReq by droneInstance;
	satisfy requirement gimbalPanTiltSatisfied : GimbalPanTiltReq by droneInstance.gimbal;
	satisfy requirement controlModesSatisfied : ControlModesReq by droneInstance.flightControl.flightController;
	satisfy requirement operatingTempSatisfied : OperatingTempReq by droneInstance;
}
