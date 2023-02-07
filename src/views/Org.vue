<template>
  <ion-page>
    <ion-content>
      <ion-nav :root="OrgNavLink"></ion-nav>
    </ion-content>
  </ion-page>
</template>



<script>
import {defineComponent, ref } from 'vue';
import {IonPage, IonHeader, IonToolbar, IonTitle, IonContent,IonNav} from '@ionic/vue';
import $ from "jquery";
import Cookies from "js-cookie";
import OrgNavLink from "@/navLink/OrgNavLink";

export default defineComponent({
  name: "Org",
  components: {IonHeader, IonToolbar, IonTitle, IonContent, IonPage, IonNav},
  data(){
    return{
      OrgNavLink:OrgNavLink,
    }
  },

})
</script>

<style scoped>

</style>