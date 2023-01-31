<template>
  <ion-modal
      trigger="openAdd" >
    <ion-header>
      <ion-toolbar>
        <ion-title >修改徽章</ion-title>
        <ion-buttons slot="end">
          <ion-button color="dark" @click="dismiss()">关闭</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <ion-item>
        <ion-label position="floating">徽章描述</ion-label>
        <ion-input :clear-input="true"  placeholder='请输入修改后的徽章描述' v-model="modifyDesc"></ion-input>
      </ion-item>
      <div style="width: 75px; margin: 30px auto 0px auto">上传图片</div>
      <ion-item lines="none">
        <img src="../../../public/assets/pictures/imageup.png" class="uploadPic" @click="takeProfilePicture"
             v-if="upPhotoTip">
        <img :src="myImageUrl" class="uploadPic" v-if="userPhoto">
      </ion-item>
      <ion-button expand="block" fill="outline" style="margin-top: 15px" @click="upload(item.name)">修改</ion-button>
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
import {defineCustomElements} from "@ionic/pwa-elements/loader";
import {Camera, CameraResultType} from "@capacitor/camera";



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

      upPhotoTip:true,
      userPhoto:false,
      myImageUrl:'',
    }
  },
  mounted() {
    console.log("mounted测试语句")
  },
  methods: {
    dismiss() {
      modalController.dismiss();
      this.modifyDesc = '';
      this.upPhotoTip = true;
      this.userPhoto = false;
    },
    async takeProfilePicture() {
      await defineCustomElements(window);
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.Uri
      });
      this.myImageUrl = image.webPath;
      this.upPhotoTip = false;
      this.userPhoto = true;
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