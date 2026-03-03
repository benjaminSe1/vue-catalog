<script setup lang="ts">
import Banner from './components/Banner.vue';

</script>

<template>
  <v-app>
    <Banner />
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>