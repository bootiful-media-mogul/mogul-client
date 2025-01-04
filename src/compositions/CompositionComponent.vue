<script lang="ts" setup>
import { onMounted } from 'vue'
import { compositions } from '@/services'

const props = defineProps<{
  compositionId: number
}>()

onMounted(async () => {
  
  console.log('composition mounted for composition # ' + props.compositionId)
  const composition = await compositions.getCompositionById(props.compositionId)
  
  console.log('loaded composition' , composition  , 'and i am glad i did.')
   
  console.log( composition.attachments)
  
})
</script>
<template>
  <div>
    <p>Composition ID: {{ compositionId }}</p>
  </div>
</template>
<style></style>
