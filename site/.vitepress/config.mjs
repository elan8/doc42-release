import { defineConfig } from 'vitepress';
import { readFileSync } from 'node:fs';
const manifest = JSON.parse(readFileSync(new URL('../.generated/version-manifest.json', import.meta.url)));
const titles = { index: 'Overview', installation: 'Installation', 'getting-started': 'Your first PDF', authentication: 'Accounts and API tokens', authoring: 'Authoring documents', templates: 'Templates', examples: 'Examples', automation: 'Automation', cli: 'CLI reference', troubleshooting: 'Troubleshooting', migration: 'Migrate from 0.6' };
const order = Object.keys(titles);
const base = process.env.DOCS_BASE || '/doc42-release/';
export default defineConfig({
  title: 'Doc42', description: 'Engineering documents from SysML v2 models — guides and CLI reference.',
  base, srcDir: '.generated', cleanUrls: true, lastUpdated: false,
  head: [['link', { rel: 'icon', href: base + 'logo.svg' }]],
  markdown: { languages: ['yaml', 'sh', 'powershell'], languageAlias: { sysml: 'text', typ: 'text', typst: 'text' } },
  themeConfig: {
    logo: '/logo.svg', siteTitle: 'Doc42 docs',
    nav: [{ text: 'Elan8', link: 'https://www.elan8.com' }, { text: 'Product', link: 'https://www.elan8.com/products/doc42' }, { text: 'Downloads', link: 'https://github.com/elan8/doc42-release/releases' }],
    sidebar: Object.fromEntries(manifest.channels.map(v => [`/${v.channel}/`, [{ text: `Doc42 ${v.id}${v.status === 'preview' ? ' · Preview' : ''}`, items: order.filter(p => v.pages.includes(p)).map(p => ({ text: titles[p], link: `/${v.channel}/${p === 'index' ? '' : p}` })) }]])),
    search: { provider: 'local' }, outline: [2, 3],
    socialLinks: [{ icon: 'github', link: 'https://github.com/elan8/doc42-release' }],
    footer: { message: 'Models and documents stay local. License retrieval and refresh require online access in 0.7.', copyright: 'Elan8' }
  },
  transformHead({ pageData }) {
    const fm = pageData.frontmatter;
    return fm.docStatus === 'preview' || ['latest', 'next'].includes(fm.docChannel) ? [['meta', { name: 'robots', content: 'noindex, follow' }]] : [];
  }
});
