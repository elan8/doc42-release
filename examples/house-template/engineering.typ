// A house template made from Doc42's `elan8-standard`: A4, title page, outline, numbered
// headings. The changes from the built-in template are marked `House style:`.
// Uses only the fonts bundled with Doc42, so every build is reproducible.

#import "/doc42.typ": doc42-body, doc42-ink, doc42-muted, doc42-rule

// House style: the two colours of the house identity, used for headings, rules and the cover.
#let house-primary = rgb("#7c2d12")
#let house-accent = rgb("#c2410c")

#let engineering-document(doc, kind: none) = [
#let meta = doc.meta
#let field(name) = meta.at(name, default: none)

#set document(title: meta.title)
#set text(font: "Libertinus Serif", size: 10.5pt, fill: doc42-ink, lang: "en")
#set par(justify: true, leading: 0.65em)
#set heading(numbering: "1.1")
#show heading.where(level: 1): set text(size: 16pt, weight: "bold", fill: house-primary)
#show heading.where(level: 2): set text(size: 12pt, weight: "bold", fill: house-accent)
#show heading.where(level: 3): set text(size: 11pt, weight: "bold", fill: house-primary)
#show raw: set text(font: "DejaVu Sans Mono", size: 9pt)
#show figure.caption: set text(size: 9pt, fill: doc42-muted)
// A table may continue on the next page; its header row repeats there.
#show figure.where(kind: table): set block(breakable: true)

#set page(
  paper: "a4",
  margin: (top: 20mm, bottom: 18mm, x: 18mm),
  header: context {
    if counter(page).get().first() > 1 {
      set text(size: 8pt, fill: doc42-muted)
      // House style: the logo beside the title in the running header.
      grid(
        columns: (1fr, auto),
        align: horizon,
        [#box(image("/assets/logo.svg", height: 4mm), baseline: 20%) #h(2mm) #meta.title],
        [
          #if field("number") != none { field("number") }
          #if field("revision") != none [ · Rev #field("revision")]
        ],
      )
      line(length: 100%, stroke: 0.6pt + house-accent)
    }
  },
  footer: context {
    if counter(page).get().first() > 1 {
      set text(size: 8pt, fill: doc42-muted)
      line(length: 100%, stroke: 0.5pt + doc42-rule)
      grid(
        columns: (1fr, auto),
        [
          #if field("organization") != none { field("organization") }
          #if field("organization") != none and field("status") != none [ · ]
          #if field("status") != none { field("status") }
        ],
        [Page #counter(page).display()],
      )
    }
  },
)

// Title page. The cover is A4, like every following page.
// House style: a left-aligned cover with the logo and a band in the house colour.
#page(header: none, footer: none, margin: (top: 0mm, x: 18mm, bottom: 18mm))[
  #set par(justify: false)
  #set text(hyphenate: false)
  #pad(x: -18mm, block(width: 100%, inset: (x: 18mm, top: 18mm, bottom: 10mm), fill: house-primary.lighten(90%), spacing: 0pt)[
    #image("/assets/logo.svg", height: 12mm)
  ])
  #v(30mm)
  #if kind != none {
    text(size: 11pt, weight: "bold", fill: house-accent, tracking: 0.06em, upper(kind))
    v(6mm)
  }
  #text(size: 28pt, weight: "bold", fill: house-primary, meta.title)
  #if field("subtitle") != none {
    v(4mm)
    text(size: 14pt, fill: doc42-muted, field("subtitle"))
  }
  #v(8mm)
  #line(length: 40%, stroke: 2pt + house-accent)
  #v(14mm)
  #let rows = (
    ("Prepared by", field("organization")),
    ("Document number", field("number")),
    ("Revision", field("revision")),
    ("Status", field("status")),
  ).filter(row => row.at(1) != none)
  #grid(
    columns: (42mm, 1fr),
    row-gutter: 4mm,
    ..rows.map(row => (text(weight: "bold", fill: house-primary, row.at(0)), row.at(1))).flatten(),
  )
]

#outline(depth: 3)
#pagebreak()

#doc42-body(doc)

]
