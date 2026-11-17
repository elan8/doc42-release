import DefaultTheme from 'vitepress/theme';
import VersionSwitcher from '@viteplus/versions/components/version-switcher.component.vue';
import { installVersionFallback } from '@viteplus/versions/fallback';
import './style.css';
export default {
  extends: DefaultTheme,
  enhanceApp({ app, router, siteData }) {
    app.component('VersionSwitcher', VersionSwitcher);
    installVersionFallback(router, siteData);
  }
};
