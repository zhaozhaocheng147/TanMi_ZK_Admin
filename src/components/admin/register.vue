<template>
    <ion-header :translucent="true">
      <ion-toolbar style="--background:#f4f4f5;">
        <ion-buttons slot="start">
          <ion-menu-button color="primary"></ion-menu-button>
          <ion-back-button></ion-back-button>
        </ion-buttons>
        <ion-title>管理员账号注册</ion-title>
      </ion-toolbar>
    </ion-header>


    <ion-content>
      <div style="width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #c2c1c1; border-bottom-left-radius: 20px; border-bottom-right-radius: 20px;">
        <form @submit="Regist">
          <ion-list>
            <ion-item>
              <ion-label position="floating">用户ID</ion-label>
              <ion-input v-model="adminId" placeholder="请输入您的ID..." required></ion-input>
            </ion-item>
            <ion-item>
              <ion-label position="floating">密码</ion-label>
              <ion-input type="password" v-model="adminPwd" placeholder="请输入您的密码..." required></ion-input>
            </ion-item>
            <ion-item @blur="ConfirmPwd">
              <ion-label position="floating">确认密码</ion-label>
              <ion-input enterkeyhint="enter" type="password" v-model="adminPwdConfirm" placeholder="请再次输入密码..."
                         @ionBlur="ConfirmPwd" required></ion-input>
              <ion-note slot="end">
                <ion-icon size="small" :icon="close" v-show="pwdConfirmTip"></ion-icon>
              </ion-note>
            </ion-item>
            <ion-item>
              <ion-label position="floating">用户姓名</ion-label>
              <ion-input v-model="adminName" placeholder="请输入您的姓名..." required></ion-input>
            </ion-item>
            <ion-item>
              <ion-label position="floating">个人邮箱</ion-label>
              <ion-input type="email" v-model="adminEmail" placeholder="请输入您的邮箱..." required></ion-input>
            </ion-item>
          </ion-list>
          <ion-button type="submit" expand="block" fill="outline" style="margin-top: 15px">注册</ion-button>
          <ion-progress-bar type="indeterminate" v-show="ProgessingTip"></ion-progress-bar>
        </form>
      </div>

    </ion-content>

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
import {close} from 'ionicons/icons'
import $ from "jquery";
import Cookies from "js-cookie";

export default defineComponent({
  name: "register",
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
      adminId: '',
      adminPwd: '',
      adminPwdConfirm: '',
      pwdConfirmTip: false,
      adminName: '',
      adminEmail: '',
      ProgessingTip: false,
    };
  },
  mounted() {
    console.log("mounted测试语句")
  },
  methods: {
    ConfirmPwd() {
      if (!(this.adminPwd == this.adminPwdConfirm)) {
        this.pwdTipShow();
        this.pwdConfirmTip = true;
      } else {
        this.pwdConfirmTip = false;
      }
    },
    Regist(e) {
      const _this = this;
      e.preventDefault();//阻止提交
      if (this.pwdConfirmTip == true) {
        this.pwdTipShow();
      } else {
        this.ProgessingTip = true;
        $.ajax({
          url: 'https://tanmi-api.rexue.plus/admins/add',
          type: 'post',
          contentType: 'application/x-www-form-urlencoded',

          data: {
            id: _this.adminId,
            password: _this.adminPwd,
            name: _this.adminName,
            email: _this.adminEmail
          },
          beforeSend: function (request) {
            request.setRequestHeader("Authorization", Cookies.get('adminToken'));
          },
          success: function () {
            _this.ProgessingTip = false;
            _this.PresentSuccessAlert();
            _this.getInfo();
          },
          error: function () {
            _this.ProgessingTip = false;
            _this.PresentFalseAlert();
          }
        })
      }
    },
    async pwdTipShow() {
      const toast = await toastController.create({
        message: '两次密码输入不一致!',
        duration: 1000,
        position: 'bottom',
        color: 'warning'
      });
      return toast.present();
    },
    async PresentSuccessAlert() {
      const alert = await alertController.create({
        header: '注册成功！',
        buttons: [
          {
            text: 'OK',
            handler: () => {
              location.reload();
            }
          }],
      });
      await alert.present();
    },
    async PresentFalseAlert() {
      const alert = await alertController.create({
        header: '注册失败！',
        message: '请检查信息是否正确！',
        buttons: ['OK'],
      });
      await alert.present();
    },
  },
  setup() {
    return {close}
  }

})
</script>

<style scoped>

</style>