<template>
  <ion-page>
    <ion-content>
      <ion-nav :root="UserNavLink"></ion-nav>
    </ion-content>
  </ion-page>
</template>



<script>
import {defineComponent, ref } from 'vue';
import UserNavLink from "@/navLink/UserNavLink";
import {IonPage, IonHeader, IonToolbar, IonTitle, IonContent,IonNav} from '@ionic/vue';

export default defineComponent({
  name: "User",
  components: {IonHeader, IonToolbar, IonTitle, IonContent, IonPage, IonNav},
  data(){
    return{
      UserNavLink:UserNavLink,
    }
  },

})
</script>

<style scoped>

</style>