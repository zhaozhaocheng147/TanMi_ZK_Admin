<template>
  <ion-header :translucent="true">
    <ion-toolbar>
      <ion-buttons slot="start">
        <ion-menu-button color="primary"></ion-menu-button>
      </ion-buttons>
      <ion-title>低碳行为管理</ion-title>
    </ion-toolbar>
  </ion-header>


  <ion-content>
    <ion-grid>
      <ion-row>
        <ion-col size="4" >
          <ion-nav-link router-direction="forward" :component="show">
            <ion-card button>
              <ion-card-header>
                <ion-card-title>查看全部行为</ion-card-title>
              </ion-card-header>
              <ion-card-content>可查看全部行为并修改行为信息</ion-card-content>
            </ion-card>
          </ion-nav-link>
        </ion-col>

        <ion-col size="4">
          <ion-card button id="openAddBehavior">
            <ion-card-header>
              <ion-card-title>新增行为</ion-card-title>
            </ion-card-header>
            <ion-card-content>即新增行为</ion-card-content>
          </ion-card>
        </ion-col>
        <!--        添加行为模态框-->
        <add></add>


        <ion-col size="4" >
          <ion-nav-link router-direction="forward" :component="userBehavior">
            <ion-card button id="openFindPwd">
              <ion-card-header>
                <ion-card-title>查看用户低碳行为提交</ion-card-title>
              </ion-card-header>
              <ion-card-content>通过用户提交的行为或驳回</ion-card-content>
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
import show from "@/components/behavior/show";
import add from "@/components/behavior/add";
import userBehavior from "@/components/behavior/userBehavior";
import {informationOutline} from 'ionicons/icons'


export default defineComponent({
  name: "BehaviorNavLink",
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
      userBehavior:userBehavior,
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