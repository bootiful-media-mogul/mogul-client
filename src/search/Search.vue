<style>
.search-outer-box {
}

.search-outer-box .pure-form input {
  scale: 150%;
  opacity: 40%;
}
.search-outer-box {
  .pure-form {
    input {
      text-align: center;
    }
    input::placeholder {
      text-align: center;
    }
    input:hover,
    input:focus,
    input:active {
      opacity: 1;
    }
  }
}
</style>
<template>
  <div class="search-outer-box">
    <form class="pure-form">
      <input
        type="text"
        :value="search"
        class="search-input"
        :placeholder="$t('search.prompt')"
        @keydown.enter.prevent="openSearchPage"
      />
    </form>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const search = ref('')

async function openSearchPage() {
  await router.push({ name: 'search' })
}
</script>
