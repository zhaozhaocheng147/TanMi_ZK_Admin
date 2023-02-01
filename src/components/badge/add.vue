<template>
  <ion-modal
      trigger="openAddBadges" >
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
        <ion-label position="floating">徽章名称</ion-label>
        <ion-input :clear-input="true"  placeholder='请输入徽章名称' v-model="bName"></ion-input>
      </ion-item>
      <ion-item>
        <ion-label position="floating">徽章描述</ion-label>
        <ion-input :clear-input="true"  placeholder='请输入徽章描述' v-model="bDesc"></ion-input>
      </ion-item>
      <div style="width: 75px; margin: 30px auto 0px auto">上传图片</div>
      <ion-item lines="none">
        <img src="../../../public/assets/pictures/imageup.png" class="uploadPic" @click="takeProfilePicture"
             v-if="upPhotoTip">
        <img :src="myImageUrl" class="uploadPic" v-if="userPhoto">
      </ion-item>
      <ion-button expand="block" fill="outline" style="margin-top: 15px" @click="upload">添加</ion-button>
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
      bName:'',
      bDesc:'',
    }
  },
  mounted() {
    console.log("mounted测试语句")
  },
  methods: {
    upload() {
      if (this.bName == '' ||this.bDesc == '' || this.myImageUrl == '') {
        this.noInfo();
        return;
      }

      //创建一个新的图片
      let tempImage = new Image();
      tempImage.src = this.myImageUrl;

      //转换成base64
      let canvas = document.createElement("canvas");
      canvas.width = tempImage.width;
      canvas.height = tempImage.height;
      let ctx = canvas.getContext("2d");
      ctx.drawImage(tempImage, 0, 0, tempImage.width, tempImage.height);
      let dataURL = canvas.toDataURL("image/png");

      //二进制文件流
      // const file = fetch(this.myImageUrl).then(r => r.blob()).then(blobFile => new File([blobFile], "11111", { type: blobFile.type }));
      // console.log("file=="+file)
      let arr = dataURL.split(',')
      let mime = arr[0].match(/:(.*?);/)[1]
      let suffix = mime.split('/')[1]
      let bstr = atob(arr[1])
      let n = bstr.length
      let u8arr = new Uint8Array(n)
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }
      let file = new File([u8arr], "myFile." + suffix, {
        type: mime
      })

      this.progressingTip = true;
      const formData = new FormData();
      formData.append('file', file);
      let _this = this;
      $.ajax({
        url: 'https://tanmi-api.rexue.plus/files/upload',
        type: 'post',
        data: formData,
        contentType: false,
        processData: false,
        beforeSend: function (request) {
          request.setRequestHeader("Authorization", Cookies.get('adminToken'));
        },
        success: function (data) {
          _this.add(data.Hash);
        },
        error: function (error) {
          _this.progressingTip = false;
          _this.photoError();
          return;
        }
      });
    },
    add(hash){
      let _this = this;
      $.ajax({
        url: 'https://tanmi-api.rexue.plus/insignias/add',
        type: 'post',
        data: {
          name:_this.bName,
          desc:_this.bDesc,
          addr: hash,
        },
        beforeSend: function (request) {
          request.setRequestHeader("Authorization", Cookies.get('adminToken'));
        },
        success: function (data) {
          _this.progressingTip = false;
          _this.dismiss();
          _this.PresentSuccessAlert();
        },
        error: function (error) {
          _this.progressingTip = false;
          _this.PresentFalseAlert();
        }
      });
    },
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
    async noInfo() {
      const toast = await toastController.create({
        message: '请填写全部信息并上传附件!',
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
    async photoError() {
      const toast = await toastController.create({
        message: '图片审查失败，请更换正确的图片!',
        duration: 1000,
        position: 'bottom',
        color: 'warning'
      });
      return toast.present();
    },
  },
  setup(){
    return{

    }
  }
})
</script>

<style scoped>
.uploadPic {
  width: 200px;
  margin: 0 auto;
}
</style>