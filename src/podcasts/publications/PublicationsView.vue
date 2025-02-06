<template> 
  
  
  <div  v-for="plugin in plugins" v-bind:key="plugin.id">
     <div v-text="plugin" style="border: 1px solid red;"></div>
  </div>
</template>

<script lang="ts" setup>
/*
 * todo
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
 *
 */

function kebabToPascal(str: string): string {
  const words = str.split('-')
  const capitalizedWords = words.map((word) => {
    const firstLetter = word.charAt(0).toUpperCase()
    const restOfWord = word.slice(1)
    return firstLetter + restOfWord
  })
  return capitalizedWords.join('')
}

const plugins = ['podcast-episode-audio-file', 'podcast-episode-blog-post', 'podbean', 'mock']
const components = plugins.map((plugin) => kebabToPascal(plugin))
console.log('components: ', components)
</script>
