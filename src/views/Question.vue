<template>
  <ion-page>
    <ion-content>
      <ion-nav :root="QuestionNavLink"></ion-nav>
    </ion-content>
  </ion-page>
</template>



<script>
import {defineComponent, ref } from 'vue';
import QuestionNavLink from "@/navLink/QuestionNavLink";
import {IonPage, IonHeader, IonToolbar, IonTitle, IonContent,IonNav} from '@ionic/vue';
import $ from "jquery";
import Cookies from "js-cookie";

export default defineComponent({
  name: "Question",
  components: {IonHeader, IonToolbar, IonTitle, IonContent, IonPage, IonNav},
  data(){
    return{
      QuestionNavLink:QuestionNavLink,
    }
  },

})
</script>

<style scoped>

</style>