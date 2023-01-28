<template>
  <ion-page>
    <ion-content>
      <ion-nav :root="BehaviorNavLink"></ion-nav>
    </ion-content>
  </ion-page>
</template>



<script>
import {defineComponent, ref } from 'vue';
import UserNavLink from "@/navLink/UserNavLink";
import {IonPage, IonHeader, IonToolbar, IonTitle, IonContent,IonNav} from '@ionic/vue';
import $ from "jquery";
import Cookies from "js-cookie";
import BehaviorNavLink from "@/navLink/BehaviorNavLink";

export default defineComponent({
  name: "Task",
  components: {IonHeader, IonToolbar, IonTitle, IonContent, IonPage, IonNav},
  data(){
    return{
      BehaviorNavLink:BehaviorNavLink,
    }
  },

})
</script>

<style scoped>

</style>