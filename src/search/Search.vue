<style></style>
<template>
  <PopupPage>
    <template #default="{ open }">

      <form class="pure-form" >
      <input type="text" :value="search"
             :placeholder="$t('search.prompt')"
             @keydown.enter.prevent="open" />

      </form>
    </template>
  </PopupPage>
</template>
<script setup lang="ts">

import PopupPage from '@/layout/PopupPage.vue'

import { ref } from 'vue'

const search = ref('')


</script>
