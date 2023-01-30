<template>
  <ion-page>
    <ion-content>
      <ion-nav :root="RightNavLink"></ion-nav>
    </ion-content>
  </ion-page>
</template>



<script>
import {defineComponent, ref } from 'vue';
import RightNavLink from "@/navLink/RightNavLink";
import {IonPage, IonHeader, IonToolbar, IonTitle, IonContent,IonNav} from '@ionic/vue';
import $ from "jquery";
import Cookies from "js-cookie";

export default defineComponent({
  name: "User",
  components: {IonHeader, IonToolbar, IonTitle, IonContent, IonPage, IonNav},
  data(){
    return{
      RightNavLink:RightNavLink,
    }
  },

})
</script>

<style scoped>

</style>