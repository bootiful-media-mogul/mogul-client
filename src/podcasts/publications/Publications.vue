<template>
  <component
    v-for="(comp, name) in publicationComponents"
    :key="name"
    :is="comp"
    class="publication-component"
  />
</template>
<style scoped>
.publication-component {
  border: 1px solid red;
}
</style>
<script lang="ts" setup>
/*
 * todo
 *
 * // todo we can make this view a component , to handle displaying ALL publication duties.
// todo the names of plugins will be sent from the server
// todo plugins will be passed in as a parameter
// todo setup a conventions here a Notification with a header of type 'redirect' or something forces the browser
//  to redirect (good for things like audio files and transcripts that we want to the browser to download)
// todo the path to the publication components - which will of course change depending on whether
//    we're doing podcasts, blogs, etc. -  should be a paramter, as well
// todo define some functions which nested components can inject and use to determine whether to 'show' themselves or not.
// todo
 * the idea is that we'll enumerate a bunch of plugin names (provided by the server) and then dynamically transform them
 * into components rendered in the UI
 *
 * we'll define a few key functions that each component will inject:
 * 1.) isPluginReady (plugin:string, context : Map<string,string>)
 * 2.) publish( plugin: string , context : Map<string,string>)
 *
 * each plugin can communicate client side state as they need to, but need to
 * marshall everything into a JSON payload (the context) that is sent to the service.
 * 
 * // todo each publication component will have a slot for an icon and the controls to display 
 *     // so well need one Publication.vue component that Mock, Podbean, etc., can all use. 
 * // theyll each inject the above functions and use them to decide whether to show the component's controls, 
 * // and whether to 'enable' the publish button that theyll all have (provided by Publication.vue)
 */

import { onMounted, shallowRef } from 'vue'

function kebabToPascal(str: string): string {
  const words = str.split('-')
  const capitalizedWords = words.map((word) => {
    const firstLetter = word.charAt(0).toUpperCase()
    const restOfWord = word.slice(1)
    return firstLetter + restOfWord
  })
  return capitalizedWords.join('')
}


const props = defineProps<{ plugins: Array<string> }>()


const plugins =  props.plugins ;
// ['podcast-episode-audio-file', 'podcast-episode-blog-post', 'podbean', 'mock']¡

const publicationComponentNames = plugins.map((plugin) => kebabToPascal(plugin))

const publicationComponents = shallowRef<Record<string, any>>({}) // storage for the components

onMounted(async () => {
  const build: Record<string, any> = {}
  for (const component of publicationComponentNames) {
    const componentFile = './' + component + '.vue'
    build[component] = (await import(componentFile)).default
  }
  publicationComponents.value = build
})
</script>
