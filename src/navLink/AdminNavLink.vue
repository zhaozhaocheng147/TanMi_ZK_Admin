<template>
  <ion-header :translucent="true">
    <ion-toolbar>
      <ion-buttons slot="start">
        <ion-menu-button color="primary"></ion-menu-button>
      </ion-buttons>
      <ion-title>管理员管理</ion-title>
    </ion-toolbar>
  </ion-header>


  <ion-content>
    <ion-grid>
      <ion-row>
        <ion-col size="4">
          <ion-nav-link router-direction="forward" :component="register">
            <ion-card button>
              <ion-card-header>
                <ion-card-title>新增管理员</ion-card-title>
              </ion-card-header>
              <ion-card-content>仅管理员拥有该权限</ion-card-content>
            </ion-card>
          </ion-nav-link>
        </ion-col>
        <ion-col size="4" >
          <ion-nav-link router-direction="forward" :component="info">
            <ion-card button>
              <ion-card-header>
                <ion-card-title>查看个人信息</ion-card-title>
              </ion-card-header>
              <ion-card-content>可查看基本信息并进行更改</ion-card-content>
            </ion-card>
          </ion-nav-link>
        </ion-col>
        <ion-col size="4" >
          <ion-card button id="openFindPwd">
            <ion-card-header>
              <ion-card-title>修改密码</ion-card-title>
            </ion-card-header>
            <ion-card-content>即重置密码</ion-card-content>
          </ion-card>
          <find-pwd></find-pwd>
        </ion-col>
        <ion-col size="4">
          <ion-card  button @click="confirmCancel">
            <ion-card-header>
              <ion-card-title>注销账号</ion-card-title>
            </ion-card-header>
            <ion-card-content>注销账号后不可恢复</ion-card-content>
          </ion-card>
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
  IonRefresher
} from '@ionic/vue';
import {defineComponent, ref} from 'vue';
import register from "@/components/admin/register";
import findPwd from "@/components/admin/findPwd";
import info from "@/components/admin/info";
import Cookies from "js-cookie";
import $ from "jquery";

export default defineComponent({
  name: "AdminNavLink",
  components: {
    findPwd,
    IonHeader, IonTitle, IonToolbar, IonContent, IonNavLink,
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
      register:register,
      info:info,
    };
  },
  mounted() {
    console.log("mounted测试语句")
  },
  methods: {
    confirmCancel() {
      this.presentConfirm();
    },
    async presentConfirm() {
      const alert = await alertController.create({
        header: '确认注销?注销后账号无法恢复',
        buttons: [
          {
            text: '确认',
            handler: () => {
              this.cancelAdmin();
            },
          },
          {
            text: '返回',
            handler: () => {
              console.log(1)
            },
          },
        ],
      });
      await alert.present();
    },
    cancelAdmin(){
      let id = JSON.parse(Cookies.get('adminInfo')).adminId;
      let _this = this;
      $.ajax({
        url: 'https://tanmi-api.rexue.plus/admins/'+id+'/del',
        type: 'delete',
        data: '',
        beforeSend: function (request) {
          request.setRequestHeader("Authorization", Cookies.get('token'));
        },
        success: function (data) {
          _this.cancelSuccess();
        },
        error: function (error) {
          console.log(error)
        }
      });
    },
    async cancelSuccess() {
      const alert = await alertController.create({
        header: '注销成功!',
        message: '感谢您的贡献!',
        buttons: [
          {
            text: 'OK',
            handler: () => {
              Cookies.remove('adminToken')
              Cookies.remove('adminInfo')
              window.opener = null;
              window.open("about:blank", "_top").close()
              // this.TestifyLogged();
            }
          }],
      });
      await alert.present();
    },
  },
  setup() {
    return {}
  }

})
</script>

<style scoped>

</style>