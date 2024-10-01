<template>

  <h1>{{ $t('about.title') }}</h1>

  
  <span
    v-html="
          $t('app.made-with-love', {
            josh: '<a href=\'https://youtube.com/@coffeesoftware\'>Josh Long</a>'
          })
        "
  ></span>

</template>
