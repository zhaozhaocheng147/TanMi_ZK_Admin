<template>
  <ion-page>
    <ion-content>
      <ion-nav :root="AdminNavLink"></ion-nav>
    </ion-content>
  </ion-page>
</template>



<script>
import {defineComponent, ref } from 'vue';
import AdminNavLink from "@/navLink/AdminNavLink";
import {IonPage, IonHeader, IonToolbar, IonTitle, IonContent,IonNav} from '@ionic/vue';

export default defineComponent({
  name: "User",
  components: {IonHeader, IonToolbar, IonTitle, IonContent, IonPage, IonNav},
  data(){
    return{
      AdminNavLink:AdminNavLink,
    }
  },

})
</script>

<style scoped>

</style>