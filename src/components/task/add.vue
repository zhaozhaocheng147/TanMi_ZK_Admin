<template>
  <ion-modal :breakpoints="[0, 0.5,  0.75]"
             :initial-breakpoint="0.50"
             handle-behavior="cycle"
             trigger="openAdd">
    <ion-header>
      <ion-toolbar>
        <ion-title style=text-align:center>新增任务</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <ion-item>
        <ion-label position="floating">任务名称</ion-label>
        <ion-input placeholder='请输入任务名称' v-model="tName"></ion-input>
      </ion-item>
      <ion-item>
        <ion-label position="floating">关联任务</ion-label>
        <ion-input  placeholder='请输入关联任务名称' v-model="tDesc" required></ion-input>
      </ion-item>
      <ion-item>
        <ion-label position="floating">可获积分</ion-label>
        <ion-input placeholder='请输入积分' v-model="tPoint" required></ion-input>
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
    IonModal, modalController,
    IonPopover,IonFab,IonFabButton,
  },
  data() {
    return {
      tName:'',
      tDesc:'',
      tPoint:'',
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
      }else if(this.tPoint == ''){
        this.noPointTip();
        return;
      }
      let _this = this;
      this.progressingTip = true;
      $.ajax({
        url: 'https://tanmi-api.rexue.plus/tasks/add',
        type: 'post',
        contentType: 'application/x-www-form-urlencoded',
        data: {
          name:_this.tName,
          desc:_this.tDesc,
          point:_this.tPoint,
        },
        beforeSend: function (request) {
          request.setRequestHeader("Authorization", Cookies.get('adminToken'));
        },
        success: function () {
          _this.progressingTip = false;
          _this.PresentSuccessAlert();
          modalController.dismiss();
          _this.tName = '';
          _this.tDesc='';
          _this.tPoint = '';
        },
        error: function () {
          _this.progressingTip = false;
          _this.PresentFalseAlert();
        }
      })
    },
    async noNameTip() {
      const toast = await toastController.create({
        message: '请输入任务名称!',
        duration: 1000,
        position: 'bottom',
        color: 'warning'
      });
      return toast.present();
    },
    async noDescTip() {
      const toast = await toastController.create({
        message: '请输入任务描述!',
        duration: 1000,
        position: 'bottom',
        color: 'warning'
      });
      return toast.present();
    },
    async noPointTip() {
      const toast = await toastController.create({
        message: '请输入可获碳积分!',
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