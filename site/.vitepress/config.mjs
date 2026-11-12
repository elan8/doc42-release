import { defineConfig } from 'vitepress';
const pages = { index: 'Overview', installation: 'Installation', 'getting-started': 'Your first PDF', authentication: 'Accounts and API tokens', capabilities: 'Permissions and capabilities', authoring: 'Authoring documents', templates: 'Templates', examples: 'Examples', automation: 'Automation', cli: 'CLI reference', troubleshooting: 'Troubleshooting' };
const base = process.env.DOCS_BASE || '/doc42-release/';
export default defineConfig({
  title: 'Doc42', description: 'Engineering documents from SysML v2 models — guides and CLI reference.',
  base, srcDir: '.generated', cleanUrls: true, lastUpdated: false,
  head: [['link', { rel: 'icon', href: base + 'logo.svg' }]],
  markdown: { languages: ['yaml', 'sh', 'powershell'], languageAlias: { sysml: 'text', typ: 'text', typst: 'text' } },
  themeConfig: {
    logo: '/logo.svg', siteTitle: 'Doc42 0.8 docs',
    nav: [{ text: 'Elan8', link: 'https://www.elan8.com' }, { text: 'Product', link: 'https://www.elan8.com/products/doc42' }, { text: 'Download 0.8.0', link: 'https://github.com/elan8/doc42-release/releases/tag/v0.8.0' }],
    sidebar: [{ text: 'Doc42 0.8.0', items: Object.entries(pages).map(([page, text]) => ({ text, link: page === 'index' ? '/' : `/${page}` })) }],
    search: { provider: 'local' }, outline: [2, 3],
    socialLinks: [{ icon: 'github', link: 'https://github.com/elan8/doc42-release' }],
    footer: { message: 'Models and documents stay local. License retrieval and refresh require online access.', copyright: 'Elan8' }
  }
});
