<script setup>
import { useData, withBase } from 'vitepress';
const { frontmatter } = useData();
</script>
<template>
  <aside v-if="frontmatter.docVersion" class="version-notice" :class="{ preview: frontmatter.docStatus === 'preview' }" aria-label="Applicable Doc42 version">
    <strong>Doc42 {{ frontmatter.docRelease }}{{ frontmatter.docStatus === 'preview' ? ' — unreleased preview' : '' }}</strong>
    <p v-if="frontmatter.docStatus === 'preview'">These instructions require the upcoming release. For the current executable, use <a :href="withBase('/latest/')">released-version documentation</a>.</p>
    <p v-else>Use these instructions with Doc42 {{ frontmatter.docVersion }}. Check your executable with <code>doc42 --version</code>.</p>
  </aside>
</template>
