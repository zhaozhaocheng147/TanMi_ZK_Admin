<template>
  <ion-page>
    <ion-content>
      <ion-nav :root="BadgeNavLink"></ion-nav>
    </ion-content>
  </ion-page>
</template>



<script>
import {defineComponent, ref } from 'vue';
import BadgeNavLink from "@/navLink/BadgeNavLink";
import {IonPage, IonHeader, IonToolbar, IonTitle, IonContent,IonNav} from '@ionic/vue';
import $ from "jquery";
import Cookies from "js-cookie";

export default defineComponent({
  name: "User",
  components: {IonHeader, IonToolbar, IonTitle, IonContent, IonPage, IonNav},
  data(){
    return{
      BadgeNavLink:BadgeNavLink,
    }
  },

})
</script>

<style scoped>

</style>