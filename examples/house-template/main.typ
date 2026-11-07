// House style: the colours of the tables, quotes and code blocks Doc42 generates. Set them
// before the body is rendered; see docs/templates.md for every theme field.
#import "/doc42.typ": doc42-theme
#doc42-theme.update(theme => {
  theme.table-header = rgb("#7c2d12")
  theme.table-stripe = rgb("#fdf4ee")
  theme.quote-rule = rgb("#c2410c")
  theme
})

#import "/engineering.typ": engineering-document
#engineering-document(json("/doc42.json"))
