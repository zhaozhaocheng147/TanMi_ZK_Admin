<template>
  <ion-header :translucent="true">
    <ion-toolbar>
      <ion-buttons slot="start">
        <ion-menu-button color="primary"></ion-menu-button>
      </ion-buttons>
      <ion-title>徽章管理</ion-title>
    </ion-toolbar>
  </ion-header>


  <ion-content>
    <ion-grid>
      <ion-row>
        <ion-col size="4" >
          <ion-nav-link router-direction="forward" :component="show">
            <ion-card button>
              <ion-card-header>
                <ion-card-title>查看全部徽章</ion-card-title>
              </ion-card-header>
              <ion-card-content>可查看、修改、启用、下架徽章</ion-card-content>
            </ion-card>
          </ion-nav-link>
        </ion-col>

        <ion-col size="4">
          <ion-card button id="openAdd">
            <ion-card-header>
              <ion-card-title>新增徽章</ion-card-title>
            </ion-card-header>
            <ion-card-content>即新增徽章</ion-card-content>
          </ion-card>
        </ion-col>
        <!--        添加行为模态框-->
        <add></add>


        <ion-col size="4" >
          <ion-nav-link router-direction="forward" :component="userBehavior">
            <ion-card button id="openFindPwd">
              <ion-card-header>
                <ion-card-title>颁发徽章</ion-card-title>
              </ion-card-header>
              <ion-card-content>颁发徽章给用户</ion-card-content>
            </ion-card>
            <find-pwd></find-pwd>
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
import show from "@/components/badge/show";
import add from "@/components/badge/add";
import {informationOutline} from 'ionicons/icons'


export default defineComponent({
  name: "BadgeNavLink",
  components: {
    add,
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
      show:show,
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