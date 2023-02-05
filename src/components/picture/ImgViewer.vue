<template>
  <viewer :images="item" :options="{navbar:true,title:false,loop:false}">
    <img :key="item.attach" :src="item.attach" style="width: 100px">
  </viewer>
</template>

<script>
import 'viewerjs/dist/viewer.css'
import {component as Viewer} from "v-viewer"

export default {
  name: "ImgViewer",
  props: ['item'],
  components: {
    Viewer,
  }
}
</script>

<style scoped>

</style>