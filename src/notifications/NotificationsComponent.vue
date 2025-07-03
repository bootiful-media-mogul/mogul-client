<script lang="ts" setup>
import { onMounted } from 'vue'
import * as Ably from 'ably'
import { mogul } from '@/services'

async function one() {

  // we need to connect to and read from ably.
  const realtimeClient = new Ably.Realtime({
    key: 'API_KEY_GOES_HERE',
    clientId: 'my-first-client'
  })

  const realtimeChannel = realtimeClient.channels.get('notifications')
  const history = await realtimeChannel.history()
  console.log(history.items.map((message) => message.data))

  await realtimeChannel.subscribe(e => console.log('event:' + e))

  await realtimeClient.connection.once('connected')

  console.log(`Made my first connection!`)

}

/**
 * this works! and there's history above.
 *
 * TODO: figure out how to constrain the capabilities of the client and then tell the client
 *     to which topic it should be listening
 */
async function two() {
  const channelName = (await (await window.fetch('/api/notifications/ably/channel')).json())['channel']
  console.log('channel name is ' + channelName)

  const ably = new Ably.Realtime({ authUrl: '/api/notifications/ably/token' })
  const channel = ably.channels.get(channelName)
  await channel.subscribe(channelName, (message) => console.log(message))

}

onMounted(async () => {
  // await one()
  await two()
})
</script>
<!--
this component will show the latest notifications, and toggle the containing panel when
there are new notifications. basically, this thing's job is to make sure the user can
see all activity <em>without</em> it blocking their progression forward.
-->
<template>
  <div></div>
</template>
