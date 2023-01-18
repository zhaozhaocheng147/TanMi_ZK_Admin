<template>
  <ion-modal :breakpoints="[0, 0.5,  0.75]"
             :initial-breakpoint="0.50"
             handle-behavior="cycle"
             trigger="openFindPwd">
    <ion-header>
      <ion-toolbar>
        <ion-title style=text-align:center>重置密码</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <ion-item>
        <ion-label position="floating">管理员Id</ion-label>
        <ion-input placeholder='请输入用户ID' v-model="adminId"></ion-input>
      </ion-item>
      <ion-item>
        <ion-label position="floating">密码</ion-label>
        <ion-input type="password" placeholder='请输入密码' v-model="adminPwd" required></ion-input>
      </ion-item>

      <ion-item @blur="ConfirmPwd">
        <ion-label position="floating">确认密码</ion-label>
        <ion-input enterkeyhint="enter" type="password" v-model="adminPwdConfirm" placeholder="请再次输入密码"
                   @ionBlur="ConfirmPwd" required></ion-input>
        <ion-note slot="end">
          <ion-icon size="small" :icon="close" v-show="pwdConfirmTip"></ion-icon>
        </ion-note>
      </ion-item>
      <ion-button expand="block" fill="outline" style="margin-top: 15px" @click="modifyPwd">重置</ion-button>
      <!--        进度条-->
      <ion-progress-bar type="indeterminate" v-show="progressingTip"></ion-progress-bar>
    </ion-content>
  </ion-modal>
</template>

<script>
import {
  IonHeader, IonTitle, IonToolbar, IonContent, IonNavLink,
  IonButton, IonButtons, IonBackButton,
  IonInput, IonIcon,
  IonList, IonItem, IonLabel,
  toastController,
  IonProgressBar,
  IonGrid, IonCol, IonRow,
  IonCard, IonCardHeader, IonCardContent, IonCardTitle, IonCardSubtitle,
  IonSearchbar, IonSelect, IonSelectOption,
  IonModal, modalController, alertController,
} from '@ionic/vue';
import {defineComponent, ref} from 'vue';
import {close} from 'ionicons/icons'
import Cookies from "js-cookie";
import $ from "jquery";



export default defineComponent({
  name: "PointsShowRights",
  components: {
    IonHeader, IonTitle, IonToolbar, IonContent, IonNavLink,
    IonButton, IonButtons, IonBackButton,
    IonInput, IonIcon,
    IonList, IonItem, IonLabel,
    toastController,
    IonProgressBar,
    IonGrid, IonCol, IonRow,
    IonCard, IonCardHeader, IonCardContent, IonCardTitle, IonCardSubtitle,
    IonSearchbar, IonSelect, IonSelectOption,
    IonModal, modalController
  },
  data() {
    return {
      adminId:'',
      adminPwd:'',
      adminPwdConfirm:'',
      pwdConfirmTip:false,
      progressingTip:false,
    }
  },
  mounted() {
    console.log("mounted测试语句")
  },
  methods: {
    modifyPwd(){
      let _this = this;
      if (this.pwdConfirmTip == true) {
        this.pwdTipShow();
      } else {
        this.progressingTip = true;
        $.ajax({
          url: 'https://tanmi-api.rexue.plus/admins/'+_this.adminId+'/modify/pwd',
          type: 'patch',
          contentType: 'application/x-www-form-urlencoded',
          data: {
            password: _this.adminPwd,
          },
          beforeSend: function (request) {
            request.setRequestHeader("Authorization", Cookies.get('adminToken'));
          },
          success: function () {
            _this.progressingTip = false;
            _this.PresentSuccessAlert();
          },
          error: function () {
            _this.progressingTip = false;
            _this.PresentFalseAlert();
          }
        })
      }
    },
    ConfirmPwd() {
      if (!(this.adminPwd == this.adminPwdConfirm)) {
        this.pwdTipShow();
        this.pwdConfirmTip = true;
      } else {
        this.pwdConfirmTip = false;
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
        header: '修改成功！',
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
        header: '修改失败！',
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