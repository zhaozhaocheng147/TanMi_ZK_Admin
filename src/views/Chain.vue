<template>
  <ion-page>
    <ion-content>
      <ion-nav :root="ChainNavLink"></ion-nav>
    </ion-content>
  </ion-page>
</template>



<script>
import {defineComponent, ref } from 'vue';
import {IonPage, IonHeader, IonToolbar, IonTitle, IonContent,IonNav} from '@ionic/vue';
import $ from "jquery";
import Cookies from "js-cookie";
import ChainNavLink from "@/navLink/ChainNavLink";

export default defineComponent({
  name: "Chain",
  components: {IonHeader, IonToolbar, IonTitle, IonContent, IonPage, IonNav},
  data(){
    return{
      ChainNavLink:ChainNavLink,
    }
  },

})
</script>

<style scoped>

</style>