<template>
<!--  ion-page一定不能少，否则报错-->
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar style="--background:#f4f4f5;">
        <ion-buttons slot="start">
          <ion-menu-button color="primary"></ion-menu-button>
        </ion-buttons>
        <ion-title>应用信息</ion-title>
      </ion-toolbar>
    </ion-header>


    <ion-content>
      <div style="margin: 0 auto; width: 260px; background-color:#989898; color: white; padding: 20px; border-bottom-left-radius: 20px; border-bottom-right-radius: 20px">
        应用名称：碳觅 <small>TanMi </small>管理员端 <br>
        版本：V1.0 <small>2023-02-01 23:10:32</small> <br>
        前端：赵天成 <br>
        后端：吴昊 <br>
      </div>

    </ion-content>

  </ion-page>
</template>

<script>
import {
  IonPage,IonHeader, IonTitle, IonToolbar, IonContent, IonNavLink,
  IonButton, IonButtons, IonBackButton,IonMenuButton,
  IonInput, IonIcon,
  IonList, IonItem, IonLabel,
  toastController,
  IonProgressBar,
  IonGrid, IonCol, IonRow,
  IonCard, IonCardHeader, IonCardContent, IonCardTitle, IonCardSubtitle,
  alertController,
  IonRefresher
} from '@ionic/vue';
import {defineComponent, ref} from 'vue';

export default defineComponent({
  name: "UserNavLink",
  components: {
    IonPage,IonHeader, IonTitle, IonToolbar, IonContent, IonNavLink,
    IonButton, IonButtons, IonBackButton,IonMenuButton,
    IonInput, IonIcon,
    IonList, IonItem, IonLabel,
    toastController,
    IonProgressBar,
    IonGrid, IonCol, IonRow,
    IonCard, IonCardHeader, IonCardContent, IonCardTitle, IonCardSubtitle,
    alertController,
    IonRefresher
  },
  data() {
    return {

    };
  },
  mounted() {
    console.log("mounted测试语句")
  },
  methods: {},
  setup() {
    return {}
  }

})
</script>

<style scoped>

</style>