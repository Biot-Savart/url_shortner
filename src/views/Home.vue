<template>
  <div class="home">
    <img alt="URL Shortner logo" src="../assets/shorter.gif">
    <Shrinker/>
  </div>
</template>

<script>
// @ is an alias to /src
import Shrinker from '@/components/Shrinker.vue'

export default {
  name: 'Home',
  components: {
    Shrinker
  }
}
</script>
