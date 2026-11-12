import DefaultTheme from 'vitepress/theme';
import { h } from 'vue';
import VersionNotice from './VersionNotice.vue';
import VersionPicker from './VersionPicker.vue';
import './style.css';
export default {
  extends: DefaultTheme,
  Layout: () => h(DefaultTheme.Layout, null, {
    'nav-bar-content-after': () => h(VersionPicker),
    'doc-before': () => h(VersionNotice)
  })
};
