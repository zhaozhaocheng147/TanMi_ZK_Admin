<template>
  <ion-header :translucent="true">
    <ion-toolbar style="--background:#f4f4f5;">
      <ion-buttons slot="start">
        <ion-menu-button color="primary"></ion-menu-button>
      </ion-buttons>
      <ion-title>权益管理</ion-title>
    </ion-toolbar>
  </ion-header>


  <ion-content>
    <ion-grid>
      <ion-row>
        <ion-col size="4" >
          <ion-nav-link router-direction="forward" :component="show">
            <ion-card button>
              <ion-card-header>
                <ion-card-title>查看全部权益</ion-card-title>
              </ion-card-header>
              <ion-card-content>可查看全部权益并修改权益信息</ion-card-content>
            </ion-card>
          </ion-nav-link>
        </ion-col>
        <ion-col size="4">
          <ion-card button id="openAddRight">
            <ion-card-header>
              <ion-card-title>新增权益</ion-card-title>
            </ion-card-header>
            <ion-card-content>即新增权益</ion-card-content>
          </ion-card>
        </ion-col>
        <!--        添加任务模态框-->
        <add></add>


        <ion-col size="4" >
          <ion-nav-link router-direction="forward" :component="userRight">
            <ion-card button id="openFindPwd">
              <ion-card-header>
                <ion-card-title>查看用户申请权益提交</ion-card-title>
              </ion-card-header>
              <ion-card-content>通过用户申请权益或驳回</ion-card-content>
            </ion-card>
            <find-pwd></find-pwd>
          </ion-nav-link>
        </ion-col>

        <ion-col size="4" >
          <ion-nav-link router-direction="forward" :component="UserTrade">
            <ion-card button id="openFindPwd">
              <ion-card-header>
                <ion-card-title>查看用户闲置交易日志</ion-card-title>
              </ion-card-header>
              <ion-card-content>总览用户之间的闲置交易</ion-card-content>
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
import show from "@/components/right/show";
import add from "@/components/right/add";
import userRight from "@/components/right/userRight";
import {informationOutline} from 'ionicons/icons'
import UserTrade from "@/components/right/UserTrade";


export default defineComponent({
  name: "RightNavLink",
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
      UserTrade:UserTrade,
      show:show,
      userRight:userRight,
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