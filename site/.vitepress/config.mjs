import { defineConfig } from 'vitepress';
const pages = { index: 'Overview', installation: 'Installation', 'getting-started': 'Your first PDF', authentication: 'Accounts and API tokens', authoring: 'Authoring documents', templates: 'Templates', examples: 'Examples', automation: 'Automation', cli: 'CLI reference', troubleshooting: 'Troubleshooting' };
const base = process.env.DOCS_BASE || '/doc42-release/';
export default defineConfig({
  title: 'Doc42', description: 'Engineering documents from SysML v2 models — guides and CLI reference.',
  base, srcDir: '.generated', cleanUrls: true, lastUpdated: false,
  head: [['link', { rel: 'icon', href: base + 'logo.svg' }]],
  markdown: { languages: ['yaml', 'sh', 'powershell'], languageAlias: { sysml: 'text', typ: 'text', typst: 'text' } },
  themeConfig: {
    logo: '/logo.svg', siteTitle: 'Doc42 docs',
    nav: [{ text: 'Versions', items: [{ text: '0.8.0 — current release', link: '/' }, { text: '0.8.1 — unreleased preview', link: '/next/' }] }, { text: 'Elan8', link: 'https://www.elan8.com' }, { text: 'Product', link: 'https://www.elan8.com/products/doc42' }, { text: 'Download 0.8.0', link: 'https://github.com/elan8/doc42-release/releases/tag/v0.8.0' }],
    sidebar: Object.fromEntries([['/next/', 'Doc42 0.8.1 preview'], ['/', 'Doc42 0.8.0']].map(([prefix, text]) => [prefix, [{ text, items: Object.entries(pages).map(([page, title]) => ({ text: title, link: page === 'index' ? prefix : `${prefix}${page}` })) }]])),
    search: { provider: 'local' }, outline: [2, 3],
    socialLinks: [{ icon: 'github', link: 'https://github.com/elan8/doc42-release' }],
    footer: { message: 'Models and documents stay local. License retrieval and refresh require online access.', copyright: 'Elan8' }
  }
});
