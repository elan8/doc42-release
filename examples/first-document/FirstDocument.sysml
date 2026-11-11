package FirstDocument {
    private import Elan8::Documents::*;
    view overview {
        @Document {
            title = "My first engineering document";
            number = "FIRST-001";
            revision = "A";
            status = "Sample draft";
            template = "elan8-standard";
        }
        view purpose {
            @Section { title = "Purpose"; }
            doc /* This PDF was generated from a SysML v2 document view. */
        }
        view nextSteps {
            @Section { title = "Next steps"; }
            doc /* Replace this prose with your project content, then add model-backed tables and diagrams. */
        }
    }
}
