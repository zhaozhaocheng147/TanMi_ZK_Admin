<template>
  <ion-modal :breakpoints="[0, 0.5,  0.75]"
             :initial-breakpoint="0.50"
             handle-behavior="cycle"
             trigger="openAddBehavior">
    <ion-header>
      <ion-toolbar>
        <ion-title style=text-align:center>新增低碳行为</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <ion-item>
        <ion-label position="floating">低碳行为名称</ion-label>
        <ion-input placeholder='请输入任务名称' v-model="tName"></ion-input>
      </ion-item>
      <ion-item>
        <ion-label position="floating">低碳行为描述</ion-label>
        <ion-input  placeholder='请输入描述' v-model="tDesc" required></ion-input>
      </ion-item>
      <ion-button expand="block" fill="outline" style="margin-top: 15px" @click="addTask">新增</ion-button>
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
  IonModal, modalController,
  IonPopover, IonFab, IonFabButton, alertController,
} from '@ionic/vue';
import {defineComponent, ref} from 'vue';
import Cookies from "js-cookie";
import $ from "jquery";



export default defineComponent({
  name: "add",
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
    IonModal, modalController,
    IonPopover,IonFab,IonFabButton,
  },
  data() {
    return {
      tName:'',
      tDesc:'',
      progressingTip:false,
    }
  },
  mounted() {
    console.log("mounted测试语句")
  },
  methods: {
    addTask(){
      if(this.tName == ''){
        this.noNameTip();
        return;
      }else if(this.tDesc == ''){
        this.noDescTip();
        return;
      }

      let _this = this;
      this.progressingTip = true;
      $.ajax({
        url: 'https://tanmi-api.rexue.plus/behaviors/add',
        type: 'post',
        contentType: 'application/x-www-form-urlencoded',
        data: {
          name:_this.tName,
          desc:_this.tDesc,
        },
        beforeSend: function (request) {
          request.setRequestHeader("Authorization", Cookies.get('adminToken'));
        },
        success: function () {
          _this.progressingTip = false;
          _this.PresentSuccessAlert();
          modalController.dismiss();
          _this.tName = '';
          _this.tDesc = '';
        },
        error: function () {
          _this.progressingTip = false;
          _this.PresentFalseAlert();
        }
      })
    },
    async noDescTip() {
      const toast = await toastController.create({
        message: '请输入行为描述!',
        duration: 1000,
        position: 'bottom',
        color: 'warning'
      });
      return toast.present();
    },
    async noNameTip() {
      const toast = await toastController.create({
        message: '请输入行为名称!',
        duration: 1000,
        position: 'bottom',
        color: 'warning'
      });
      return toast.present();
    },
    async showTip() {
      const toast = await toastController.create({
        message: '请先进行登录!',
        duration: 1000,
        position: 'bottom',
        color: 'warning'
      });
      return toast.present();
    },
    async PresentSuccessAlert() {
      const alert = await alertController.create({
        header: '新增成功！',
        buttons: [
          {
            text: 'OK',
          }],
      });
      await alert.present();
    },
    async PresentFalseAlert() {
      const alert = await alertController.create({
        header: '新增失败！',
        message: '请检查信息是否正确！',
        buttons: ['OK'],
      });
      await alert.present();
    },
  },
  setup(){
    return{

    }
  }
})
</script>

<style scoped>

</style>