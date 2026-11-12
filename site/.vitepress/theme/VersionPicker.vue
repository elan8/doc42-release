<script setup>
import { computed } from 'vue';
import { useData, useRouter, withBase } from 'vitepress';
import manifest from '../../.generated/version-manifest.json';
const { frontmatter } = useData();
const router = useRouter();
const current = computed(() => frontmatter.value.docChannel || 'latest');
function change(event) {
  const version = manifest.channels.find(v => v.channel === event.target.value);
  const page = version.pages.includes(frontmatter.value.docPage) ? frontmatter.value.docPage : 'index';
  router.go(withBase(`/${version.channel}/${page === 'index' ? '' : page}`));
}
</script>
<template>
  <select class="doc-version" aria-label="Documentation version" :value="current" @change="change">
    <option v-for="version in manifest.channels" :key="version.channel" :value="version.channel">
      {{ version.channel === 'latest' ? `Latest (${version.id})` : version.channel === 'next' ? `Next (${version.id} preview)` : `${version.id}${version.status === 'preview' ? ' preview' : ''}` }}
    </option>
  </select>
</template>
