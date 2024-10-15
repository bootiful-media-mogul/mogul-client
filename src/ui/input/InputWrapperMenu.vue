<template>
  <div class="menu">
    <div class="unselectable arrow up">⬆</div>
    <div class="icons">
      <slot> the buttons should go here otherwise this will look like crap!</slot>
    </div>
    <div class="unselectable  arrow down">⬇</div>
  </div>
</template>
<style scoped>
.menu {
  display: grid;
  grid-template-areas:
    'icons up'
    'icons down';

  grid-template-columns:  auto    auto;
  grid-template-rows:  var(--icon-width) var(--icon-width);
  align-items: center;
  justify-content: center;
}

.down {
  grid-area: down;
  border: 1px solid yellow;
}

.icons {
  grid-area: icons;
  border: 1px solid olivedrab;
}

.up {
  grid-area: up;
  border: 1px solid #0078e7;
}

.arrow {
  text-align: center;
  font-size: 0.7em;
  cursor: pointer;
}

.arrow:first-of-type {
  padding-bottom: calc(var(--icon-width) / 3);
}

.arrow:last-of-type {
  padding-top: calc(var(--icon-width) / 3);
}
</style>
