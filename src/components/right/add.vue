<template>
  <ion-modal :breakpoints="[0, 0.65,  0.8]"
             :initial-breakpoint="0.65"
             handle-behavior="cycle"
             trigger="openAddRight">
    <ion-header>
      <ion-toolbar>
        <ion-title style=text-align:center>新增权益</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <ion-item>
        <ion-label position="floating">权益名称</ion-label>
        <ion-input :clear-input="true" placeholder='请输入任务名称' v-model="tName"></ion-input>
      </ion-item>
      <ion-item>
        <ion-label position="floating">提供者</ion-label>
        <ion-input :clear-input="true" placeholder='请输入任务名称' v-model="tProvider"></ion-input>
      </ion-item>
      <ion-item>
        <ion-label position="floating">描述</ion-label>
        <ion-input :clear-input="true"  placeholder='请输入描述' v-model="tDesc" required></ion-input>
      </ion-item>
      <ion-item>
        <ion-label position="floating">所需积分</ion-label>
        <ion-input :clear-input="true" placeholder='请输入所需积分' v-model="tPoint" required></ion-input>
      </ion-item>
      <ion-item>
        <ion-label position="floating">库存</ion-label>
        <ion-input :clear-input="true" placeholder='请输入库存' v-model="tAmount" required></ion-input>
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
      tPoint:'',
      tProvider:'',
      tAmount:'',
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
      }else if(this.tProvider == ''){
        this.noProvider();
        return;
      }else if(this.tAmount == ''){
        this.noAmountTip();
        return;
      }


      let _this = this;
      this.progressingTip = true;
      $.ajax({
        url: 'https://tanmi-api.rexue.plus/rights/add',
        type: 'post',
        contentType: 'application/x-www-form-urlencoded',
        data: {
          name:_this.tName,
          provider:_this.tProvider,
          desc:_this.tDesc,
          point:_this.tPoint,
          amount:_this.tAmount,
        },
        beforeSend: function (request) {
          request.setRequestHeader("Authorization", Cookies.get('adminToken'));
        },
        success: function () {
          _this.progressingTip = false;
          _this.PresentSuccessAlert();
          modalController.dismiss();
          _this.tName = '';
          _this.tProvider = '';
          _this.tDesc = '';
          _this.tPoint = '';
          _this.tAmount = '';
        },
        error: function () {
          _this.progressingTip = false;
          _this.PresentFalseAlert();
        }
      })
    },
    async noNameTip() {
      const toast = await toastController.create({
        message: '请输入权益名称!',
        duration: 1000,
        position: 'bottom',
        color: 'warning'
      });
      return toast.present();
    },
    async noDescTip() {
      const toast = await toastController.create({
        message: '请输入权益描述!',
        duration: 1000,
        position: 'bottom',
        color: 'warning'
      });
      return toast.present();
    },
    async noPointTip() {
      const toast = await toastController.create({
        message: '请输入所需碳积分!',
        duration: 1000,
        position: 'bottom',
        color: 'warning'
      });
      return toast.present();
    },
    async noAmountTip() {
      const toast = await toastController.create({
        message: '请输入库存!',
        duration: 1000,
        position: 'bottom',
        color: 'warning'
      });
      return toast.present();
    },
    async noProvider() {
      const toast = await toastController.create({
        message: '请输入提供者!',
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