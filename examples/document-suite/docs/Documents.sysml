package MonitorDocs {
    private import Elan8::Documents::*;
    private import StandardViewDefinitions::*;

    view crs {
        @Document { title = "Temperature Monitor Customer Requirements";
            number = "MON-CRS-001"; revision = "A"; status = "Sample draft"; template = "crs"; }
        view scope {
            @Section { title = "Purpose and stakeholder scope"; }
            doc /* Capture the operator's need for {{Monitor::monitor}}. The monitor and its
                 * local display are in scope; remote notification is excluded. */
        }
        view needs : GeneralView {
            @Section { title = "Customer requirements"; }
            @RequirementTable;
            expose Monitor::VisibleAlarm;
        }
        view disposition {
            @Section { title = "Assumptions and open decisions"; }
            doc /* The customer must approve the alarm visibility conditions. Allocation to
                 * system requirements and validation coverage require an engineering review. */
        }
    }
    view srs {
        @Document { title = "Temperature Monitor System Requirements";
            number = "MON-SRS-001"; revision = "A"; status = "Sample draft"; template = "srs"; }
        view scope {
            @Section { title = "System boundary and baseline"; }
            doc /* Specify {{Monitor::monitor}} and its local alarm response. Publish this
                 * document together with a controlled model baseline. */
        }
        view requirements : GeneralView {
            @Section { title = "System requirements"; }
            @RequirementTable;
            expose Monitor::AlarmResponse;
        }
        view traceability {
            @Section { title = "Traceability and planned verification"; }
            doc /* {{Monitor::AlarmResponse}} addresses the alarm need described by
                 * {{Monitor::VisibleAlarm}}. This sentence is editorial rationale, not a
                 * projected derivation relationship. Automated derivation and verification
                 * coverage matrices are not yet supported. */
        }
    }
    view test {
        @Document { title = "Temperature Monitor Test Specification";
            number = "MON-TEST-001"; revision = "A"; status = "Sample draft"; template = "test"; }
        view purpose {
            @Section { title = "Objective and test configuration"; }
            doc /* Plan verification of {{Monitor::AlarmResponse}} on {{Monitor::monitor}}.
                 * Record hardware configuration, software revision and instrument calibration
                 * before executing this procedure. This document contains no executed results. */
        }
        view procedure {
            @Section { title = "Procedure and acceptance criteria"; }
            @Prose { file = "prose/procedure.md"; }
        }
        view records {
            @Section { title = "Required execution records"; }
            doc /* Record the case and run identifiers, tested configuration, procedure revision,
                 * operator, execution time, measurements with units and uncertainty, deviations,
                 * raw evidence references and content hashes, and reviewer disposition. */
        }
    }
    view verificationReport {
        @Document { title = "Temperature Monitor Verification Report";
            number = "MON-VR-001"; revision = "A"; status = "Not executed"; template = "verification-report"; }
        view baseline {
            @Section { title = "Scope and evidence baseline"; }
            doc /* Planned verification target: {{Monitor::AlarmResponse}}. No execution record
                 * or measurement has been supplied for this sample. Result: no evidence.
                 * Model satisfaction and planned verification do not establish a pass verdict. */
        }
        view assessment {
            @Section { title = "Results, deviations and assessment"; }
            @Prose { file = "prose/assessment.md"; }
        }
        view conclusion {
            @Section { title = "Coverage and release conclusion"; }
            doc /* Verification coverage is not established. Release approval remains open.
                 * Customer validation must be assessed separately against
                 * {{Monitor::VisibleAlarm}}; it cannot be inferred from system verification. */
        }
    }
}
