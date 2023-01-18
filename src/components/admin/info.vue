<template>
  <ion-header :translucent="true">
    <ion-toolbar>
      <ion-buttons slot="start">
        <ion-menu-button color="primary"></ion-menu-button>
        <ion-back-button></ion-back-button>
      </ion-buttons>
      <ion-title>个人信息</ion-title>
    </ion-toolbar>
  </ion-header>

  <ion-content>
    <div style="width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #c2c1c1; border-bottom-left-radius: 20px; border-bottom-right-radius: 20px;">
      <ion-list lines="full">
        <ion-item>
          <ion-label>Id</ion-label>
          <ion-note slot="end" style="font-size: 15px" id="MyId">{{ MyId }}</ion-note>
        </ion-item>
        <ion-item>
          <ion-label>姓名</ion-label>
          <ion-note slot="end" style="font-size: 15px" id="MyName">{{ MyName }}</ion-note>
        </ion-item>
        <ion-item>
          <ion-label>邮箱</ion-label>
          <ion-note slot="end" style="font-size: 15px" id="MyEmail">{{ MyEmail }}</ion-note>
        </ion-item>
      </ion-list>
      <ion-button expand="block" fill="outline" id="modifyInfo">修改信息</ion-button>
    </div>


    <!--    修改信息-->
    <ion-modal :breakpoints="[0, 0.5,  0.75]"
               :initial-breakpoint="0.50"
               handle-behavior="cycle"
               trigger="modifyInfo">
      <ion-header>
        <ion-toolbar>
          <ion-title style=text-align:center>修改信息</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-content class="ion-padding">
        <ion-item>
          <ion-label position="floating">姓名</ion-label>
          <ion-input placeholder='请输入用户姓名' v-model="modifyName"></ion-input>
        </ion-item>
        <ion-item>
          <ion-label position="floating">Email</ion-label>
          <ion-input placeholder='请输入Email' v-model="modifyEmail"></ion-input>
        </ion-item>
        <ion-button expand="block" fill="outline" style="margin-top: 15px" @click="modify">修改</ion-button>
        <!--        进度条-->
        <ion-progress-bar type="indeterminate" v-show="ProgessingTip"></ion-progress-bar>
      </ion-content>
    </ion-modal>
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
      MyId: '获取中...',
      MyName: '获取中...',
      MyEmail: '获取中...',
      modifyName:'',
      modifyEmail:'',
      ProgessingTip:false,
    };
  },
  mounted() {
    this.getInfo();
  },
  methods: {
    modify() {
      if (this.modifyName == '' && this.modifyEmail == '') {
        this.noModifyInfoTip();
        return;
      }
      this.ProgessingTip = true;
      let _this = this;
      let id = JSON.parse(Cookies.get('adminInfo')).adminId;
      $.ajax({
        url: 'https://tanmi-api.rexue.plus/admins/'+id+'/modify',
        type: 'patch',
        data: {
          name:_this.modifyName,
          email:_this.modifyEmail,
        },
        beforeSend: function (request) {
          request.setRequestHeader("Authorization", Cookies.get('token'));
        },
        success: function (data) {
          _this.ProgessingTip = false;
          _this.modifySuccess();
          _this.getInfo();
        },
        error: function (error) {
          console.log('error')
        }
      });
    },
    async noModifyInfoTip() {
      const toast = await toastController.create({
        message: '请输入要修改的信息!',
        duration: 1000,
        position: 'bottom',
        color: 'warning'
      });
      return toast.present();
    },
    getInfo() {//获取个人信息
      let id = JSON.parse(Cookies.get('adminInfo')).adminId;
      this.MyName = '获取中...';
      this.MyEmail = '获取中...';
      let _this = this;
      $.ajax({
        url: 'https://tanmi-api.rexue.plus/admins/'+id,
        type: 'get',
        data: '',
        beforeSend: function (request) {
          request.setRequestHeader("Authorization", Cookies.get('token'));
        },
        success: function (data) {
          _this.MyId = data.id;
          _this.MyName = data.name;
          _this.MyEmail = data.email;
          console.log(data)
        },
        error: function (error) {
          console.log('error')
        }
      });
    },
    async modifySuccess() {
      const toast = await toastController.create({
        message: '修改成功!',
        duration: 1000,
        position: 'bottom',
        color: 'success'
      });
      return toast.present();
    },
  },
  setup() {
    return {}
  }
})
</script>

<style scoped>

</style>