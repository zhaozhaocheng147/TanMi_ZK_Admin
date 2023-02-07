<template>
  <ion-header :translucent="true">
    <ion-toolbar style="--background:#f4f4f5;">
      <ion-buttons slot="start">
        <ion-menu-button color="primary"></ion-menu-button>
      </ion-buttons>
      <ion-title>上链信息管理</ion-title>
    </ion-toolbar>
  </ion-header>


  <ion-content>
    <ion-grid>
      <ion-row>
        <ion-col size="4" >
          <ion-nav-link router-direction="forward" :component="userChain">
            <ion-card button>
              <ion-card-header>
                <ion-card-title>用户上链明细</ion-card-title>
              </ion-card-header>
              <ion-card-content>显示用户所有操作的上链信息</ion-card-content>
            </ion-card>
          </ion-nav-link>
        </ion-col>

        <ion-col size="4">
          <ion-nav-link router-direction="forward" :component="OrgChain">
            <ion-card button id="openAddBehavior">
              <ion-card-header>
                <ion-card-title>组织上链明细</ion-card-title>
              </ion-card-header>
              <ion-card-content>显示组织所有操作的上链信息</ion-card-content>
            </ion-card>
          </ion-nav-link>
        </ion-col>

      </ion-row>
    </ion-grid>


  </ion-content>
</template>

<script>
import {
  IonHeader, IonTitle, IonToolbar, IonContent, IonNavLink,
  IonButton, IonButtons, IonBackButton,IonMenuButton,
  IonInput, IonIcon,
  IonList, IonItem, IonLabel,
  toastController,
  IonProgressBar,
  IonGrid, IonCol, IonRow,
  IonCard, IonCardHeader, IonCardContent, IonCardTitle, IonCardSubtitle,
  alertController,
  IonRefresher,
  IonPopover,IonFab,IonFabButton,
} from '@ionic/vue';
import {defineComponent, ref} from 'vue';
import Cookies from "js-cookie";
import $ from "jquery";
import {informationOutline} from 'ionicons/icons'
import userChain from "@/components/chain/userChain";
import OrgChain from "@/components/chain/OrgChain";


export default defineComponent({
  name: "ChainNavLink",
  components: {
    IonHeader, IonTitle, IonToolbar, IonContent, IonNavLink,
    IonButton, IonButtons, IonBackButton,IonMenuButton,
    IonInput, IonIcon,
    IonList, IonItem, IonLabel,
    toastController,
    IonProgressBar,
    IonGrid, IonCol, IonRow,
    IonCard, IonCardHeader, IonCardContent, IonCardTitle, IonCardSubtitle,
    alertController,
    IonRefresher,
    IonPopover,IonFab,IonFabButton,
  },
  data() {
    return {
      userChain:userChain,
      OrgChain:OrgChain,
    };
  },
  mounted() {
    console.log("mounted测试语句")
  },
  methods: {

  },
  setup() {
    return {informationOutline}
  }

})
</script>

<style scoped>

</style>