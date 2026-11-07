package DroneDocs {
    doc /* The golden Doc42 document (design §11.1): the Surveillance Drone SRS. */

    private import Elan8::Documents::*;
    private import StandardViewDefinitions::*;

    view droneSrs {
        @Document {
            title = "Surveillance Drone System Requirements Specification";
            number = "DRN-SRS-001";
            revision = "A";
        }

        view introduction {
            @Section { title = "Introduction"; }
            view purpose {
                @Section { title = "Purpose"; }
                doc /* This document specifies the system-level requirements of the
                 * {{SurveillanceDroneStructure::SurveillanceQuadrotorDrone}}, a quadrotor platform
                 * that streams live video to a ground control station during patrol, inspection,
                 * and search missions. */
            }
            view scope {
                @Section { title = "Scope"; }
                doc /* The requirements cover flight performance, safety functions, the
                 * communication link, and the camera gimbal. Ground-station software and
                 * maintenance procedures are outside the scope of this document. */
            }
        }

        view systemOverview {
            @Section { title = "System Overview"; }
            doc /* The system consists of the airframe and propulsion, the flight control and
             * sensing subsystem, the communication subsystem, and a stabilized camera gimbal.
             * The system instance considered throughout this document is
             * {{SurveillanceDrone::droneInstance}}. */

            view operationalConcept {
                @Section { title = "Concept of Operations"; }
                @Prose { file = "prose/conops.md"; }
            }
            view architecture : InterconnectionView {
                @Section { title = "System Interconnection"; }
                doc /* The parts of the drone and the connections between their ports. */
                expose SurveillanceDrone::droneInstance;
            }
        }

        view requirements {
            @Section { title = "Requirements"; }
            doc /* Each requirement is identified by its short name and is satisfied by an
             * element of {{SurveillanceDrone::droneInstance}}. */

            view flightPerformance : GeneralView {
                @Section { title = "Flight Performance"; }
                @RequirementTable;
                doc /* Requirements on endurance, altitude, wind tolerance, and the operating
                 * temperature envelope. */
                expose SurveillanceDroneRequirements::EnduranceReq;
                expose SurveillanceDroneRequirements::MaxAltitudeAGLReq;
                expose SurveillanceDroneRequirements::WindToleranceReq;
                expose SurveillanceDroneRequirements::OperatingTempReq;
            }
            view flightControl : GeneralView {
                @Section { title = "Flight Control"; }
                @RequirementTable;
                doc /* Requirements on the flight modes the pilot can select. */
                expose SurveillanceDroneRequirements::ControlModesReq;
            }
            view safetyAndCompliance : GeneralView {
                @Section { title = "Safety and Compliance"; }
                @RequirementTable;
                doc /* Requirements on failsafe behaviour, geofencing, and Remote ID. The
                 * failsafe behaviour is allocated to
                 * {{SurveillanceDroneStructure::FlightController}}. */
                expose SurveillanceDroneRequirements::FailsafeReq;
                expose SurveillanceDroneRequirements::GeofencingReq;
                expose SurveillanceDroneRequirements::RemoteIDReq;
            }
            view communicationAndPayload : GeneralView {
                @Section { title = "Communication and Payload"; }
                @RequirementTable;
                doc /* Requirements on video latency and on the pan and tilt range of the
                 * camera gimbal. */
                expose SurveillanceDroneRequirements::VideoLatencyReq;
                expose SurveillanceDroneRequirements::GimbalPanTiltReq;
            }
        }
    }
}
