<template>
  <ion-modal :breakpoints="[0, 0.8,  0.9]"
             :initial-breakpoint="0.8"
             handle-behavior="cycle"
             trigger="openAdd">
    <ion-header>
      <ion-toolbar>
        <ion-title style=text-align:center>新增题目</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <form @submit="add($event)">
        <ion-item>
          <ion-label position="floating">题干</ion-label>
          <ion-input :clear-input="true"  placeholder='请输入题干' required  v-model="modifySubject"></ion-input>
        </ion-item>
        <ion-item>
          <ion-label position="floating">选项A</ion-label>
          <ion-input :clear-input="true"  placeholder='请输入选项A' required  v-model="modifyA"></ion-input>
        </ion-item>
        <ion-item>
          <ion-label position="floating">选项B</ion-label>
          <ion-input :clear-input="true"  placeholder='请输入选项B' required  v-model="modifyB"></ion-input>
        </ion-item>
        <ion-item>
          <ion-label position="floating">选项C</ion-label>
          <ion-input :clear-input="true"  placeholder='选填'  v-model="modifyC"></ion-input>
        </ion-item>
        <ion-item>
          <ion-label position="floating">选项D</ion-label>
          <ion-input :clear-input="true"  placeholder='选填'  v-model="modifyD"></ion-input>
        </ion-item>
        <ion-item>
          <ion-label position="floating">解析</ion-label>
          <ion-input :clear-input="true"  placeholder='选填'  v-model="modifyDesc"></ion-input>
        </ion-item>
        <ion-item>
          <ion-label position="floating">答案</ion-label>
          <ion-input :clear-input="true"  placeholder='请输答案 ' required  v-model="modifyAnswer"></ion-input>
        </ion-item>
        <ion-button type="submit" expand="block" fill="outline" style="margin-top: 15px">添加</ion-button>
        <ion-progress-bar type="indeterminate" v-show="progressingTip"></ion-progress-bar>
      </form>
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
      progressingTip:false,
      modifySubject:'',
      modifyA:'',
      modifyB:'',
      modifyC:'',
      modifyD:'',
      modifyDesc:'',
      modifyAnswer:'',
    }
  },
  mounted() {
    console.log("mounted测试语句")
  },
  methods: {
    add(e){
      e.preventDefault();//阻止提交


      let _this = this;
      this.progressingTip = true;
      $.ajax({
        url: 'https://tanmi-api.rexue.plus/questions/add',
        type: 'post',
        contentType: 'application/x-www-form-urlencoded',
        data: {
          subject:_this.modifySubject,
          optionA:_this.modifyA,
          optionB:_this.modifyB,
          optionC:_this.modifyC,
          optionD:_this.modifyD,
          answer:_this.modifyAnswer,
          desc:_this.modifyDesc,
        },
        beforeSend: function (request) {
          request.setRequestHeader("Authorization", Cookies.get('adminToken'));
        },
        success: function () {
          _this.progressingTip = false;
          _this.PresentSuccessAlert();
          modalController.dismiss();
        },
        error: function () {
          _this.progressingTip = false;
          _this.PresentFalseAlert();
        }
      })
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