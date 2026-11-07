# Authoring documents

The model owns content and section order. A Typst template owns page layout.
Doc42 delegates parsing, resolution, exposure and filtering to Spec42.

```sysml
package ProductDocs {
    private import Elan8::Documents::*;
    private import StandardViewDefinitions::*;
    view srs {
        @Document {
            title = "Product System Requirements";
            number = "PRD-SRS-001";
            revision = "A";
            status = "Draft";
            template = "srs";
        }
        view purpose {
            @Section { title = "Purpose and scope"; }
            doc /* Define the system boundary and baseline here. */
            @Prose { file = "prose/purpose.md"; }
        }
        view requirements : GeneralView {
            @Section { title = "Requirements"; }
            @RequirementTable;
            expose Product::ResponseRequirement;
        }
    }
}
```

`Product::ResponseRequirement` must exist in your model. A document is an untyped
view usage annotated `@Document`; its nested views become sections in authored order.
Nested views add heading levels. `@Section` supplies a heading; without it the view's
declared name is used. Reusable workspace-defined document/view types are currently
unsupported and produce diagnostics.

`@Document` fields: required string `title`; optional strings `subtitle`, `organization`,
`number`, `revision`, `status`, `template`. The organization that issues the document is
shown as "Prepared by" on the title page and in the page footer. `--template` overrides the model's template choice.
The default is `elan8-standard`. `template` is the name of a built-in template or the directory of
your own, relative to the model file; see [Templates](templates.md).

Section `doc` comments appear before `@Prose` file content. Prose paths are relative
to the annotation's source file, must remain within the workspace, and are checked
against traversal and symlink escapes.

## Writing text

A `doc` comment and a prose file are both Markdown, with the same rules. Supported are
paragraphs, emphasis, strong text, inline code, links, bullet and numbered lists, tables,
block quotes and fenced code blocks. A heading (`## Procedure`) becomes a run-in heading
without a number: numbered sections come from views, so that the model owns the structure.
Images and HTML are not supported and produce diagnostics.

Put a short text in the `doc` of its section, where it is reviewed together with the tables
and diagrams it introduces. Use a prose file for a long text: it is easier to edit and to
preview. In a `doc` comment, start bullets with `-`, because a leading `*` on a line belongs
to the comment, and never write `*/`.
Use `{{Qualified::ModelElement}}` for a resolved model reference in model or Markdown
prose. Missing and ambiguous references are diagnosed; do not replace them with guessed labels.

## Values from the model

`{{= Qualified::feature}}` shows the value of a feature, so that a number in the text cannot
disagree with the model:

```markdown
The robot weighs at most {{= DesignLimits::maxRobotMass}} and stops within
{{= DesignLimits::maxSafeStopReactionTime}}.
```

A quantity is shown with its unit as written in the model (`4 kg`, `100 ms`). After the
qualified name, feature names separated by dots follow the features of an element, including a
value a usage redefines: `{{= Robot::DriveTrain::gear.mass}}`.

The value is the one Spec42 evaluates. A feature without a value, or with an expression that
Spec42 does not fold to a constant, is an error and is never replaced by a guess. Literals and
arithmetic over plain numbers are evaluated today. Sums of quantities, `sum(...)`, values
reached through a feature chain inside an expression, and units written as an expression
(`[m^2]`) are not, so write those numbers in the text until Spec42 evaluates them.

## Tables

`@Table` presents the elements a section exposes, one row for each element:

```sysml
view verificationMatrix {
    @Section { title = "Verification matrix"; }
    @Table {
        columns = "ID = id, Requirement = name, Satisfied by = satisfied-by, Verified by = verified-by";
        kind = "requirement";
        sort = "id";
    }
    expose Product::specification::*;
}
```

The rows are what Spec42 evaluates the section's `expose` and `filter` statements to;
`expose Package::*` exposes the members of a package or of a requirement group. `kind` keeps
only elements of one kind (`"requirement"`, `"part"`, `"connection"`, `"part def"`, ...).
Rows are in the order the elements are written in the model, or ordered by the column `sort`
names. `caption` adds a caption. A section can have several `@Table` annotations.

`columns` lists the columns, separated by commas, each as `Title = content` or as the content
alone:

| Content | Shows |
| --- | --- |
| `id`, `name`, `qualified-name`, `kind` | The identifier (short name), name, qualified name or kind of the element |
| `text` | The element's documentation |
| `type`, `owner` | The definitions that type the element; the element that owns it |
| `satisfied-by`, `verified-by` | For a requirement: the elements that satisfy it; the verification cases whose objective verifies it |
| `verifies` | For a verification case: the requirements its objective verifies |
| `derived-from`, `derives` | For a requirement: the requirements it was derived from; those derived from it |
| `original`, `derived` | For a derivation connection: its original requirement; its derived requirements |
| `.feature`, `.a.b` | The value of a feature of the element, as in `{{= ...}}` |
| `@Metadata.feature` | A value of a metadata annotation of the element, e.g. `@Rationale.text` |
| `relation / content` | The content for each element a relation column names, each distinct line once: `verified-by / @VerificationMethod.kind` lists the methods of the cases that verify a requirement, `derived-from / id` the identifiers of its parents. One step only. |

An element without the feature or the annotation has an empty cell. A feature whose value
Spec42 does not fold to a constant leaves the cell empty and produces a warning. A column of
numbers is right-aligned. Unknown column content, an unknown kind and a `sort` that names no
column are errors.

A traceability table is a table of derivation connections:

```sysml
@Table {
    columns = "Customer requirement = original, System requirements = derived, Why complete = @Rationale.text";
    kind = "connection";
}
expose Product::Traceability::*;
```

## Figures and Markdown tables

`@Figure { file = "figures/stack.svg"; caption = "The physical stack"; }` places an authored
SVG drawing after a section's prose, under the same path rules as prose files. Use it where a
generated diagram does not explain enough. An authored figure is not checked against the model:
when the model changes, update the drawing by hand.

A Markdown table in a prose file becomes a table in the document. Use it for content that is
generated outside Doc42, such as a bill of materials, or for a small hand-written table.
A column marked right-aligned (`---:`) is set as a column of numbers. Short columns take the width
of their content; columns of running text share the remaining width in proportion to their
longest cell.

A `GeneralView` with `@RequirementTable` selects requirements through `expose` and
Spec42's view semantics. Table columns are identifier, name, documentation and
satisfying elements. Rows sort by controlled identifier. Non-requirements in the selection
produce warnings. A resolved feature chain is published as the full Spec42-authored
chain, rather than its terminal declaration. A `satisfy` that names its requirement through
the owning specification (`satisfy spec.requirement by element`) counts for that nested
requirement. Satisfaction is a design claim, not a test result.

A section typed by a supported standard diagram view, such as `InterconnectionView`,
uses Spec42's diagram projection and native schema-5 product. An incomplete projection
or unsupported selection produces a diagnostic. Read the drone SRS for a working example.

By default a diagram draws every level its view exposes. `@Diagram { depth = 1; }` draws the
exposed elements with their direct members as closed boxes, and `depth = 0` the exposed
elements alone, as `spec42 diagram --depth` does. Use it to keep an overview of a whole
product, or of one module, readable on a page:

```sysml
view interconnection : InterconnectionView {
    @Section { title = "Module interconnection"; }
    @Diagram { depth = 0; }
    expose Robot::robot.base;
    expose Robot::robot.top;
}
```

Large SVG diagrams are placed on native-size drawing sheets rather than reduced to
tiny labels on an A4 page. The diagram's native 96 dpi dimensions determine the sheet
size; report text remains on standard pages. Standalone bold paragraphs are kept with
the following content, which is useful for procedure IDs in prose files.

`doc42 ir` exports document, section, table, row and figure provenance. Preserve this IR
with the model baseline when reviewing generated content. Prose statements are authored
content; a prose-only requirement is not an automatically evaluated acceptance predicate.

Document metadata is supplied by `sysml-domain-libraries/model` through
`--library-path`. Import `Elan8::Documents::*` in document packages and use the
same library version in your editor. The former `Doc42::*` import and
`doc42 library export` command are replaced by this shared library.
