<template>
  <ion-header :translucent="true">
    <ion-toolbar>
      <ion-buttons slot="start">
        <ion-menu-button color="primary"></ion-menu-button>
        <ion-back-button></ion-back-button>
      </ion-buttons>
      <ion-title>徽章信息</ion-title>
    </ion-toolbar>
  </ion-header>
  <!--  搜索-->
  <ion-content>
    <div style="position: relative">
      <ion-searchbar placeholder="模糊查询徽章" v-model="searchInfo"
                     style=" --border-radius: 0 20px 20px 0; padding-left: 80px" @ionChange="getBadges">
      </ion-searchbar>
      <ion-select placeholder="类别" v-model="type"
                  style="width: 90px; height:42px; position: absolute; top: 8px; background-color:#ffffff; box-shadow:-1px 1px 1px 0px #969d98; border-radius: 20px 0 0 20px">
        <ion-select-option value="1">名称</ion-select-option>
        <ion-select-option value="2">描述</ion-select-option>
      </ion-select>
    </div>

    <!--  提示框-->
    <div style="width: 100px; margin: 0 auto;" v-if="getting">获取中...</div>
    <div style="width: 130px; margin: 0 auto;" v-if="noInfo">没有相关徽章</div>

    <ion-grid>
      <ion-row>
        <ion-col size="4" v-for="item in badges" :key="item.id">
          <ion-card>
            <ion-card-content>
              <!--            展示-->
              <ion-grid>
                <ion-row>
                  <ion-col size="4">名称</ion-col>
                  <ion-col size="8" class="rolStyle">{{ item.name }}</ion-col>
                </ion-row>
                <ion-row>
                  <ion-col size="4">描述</ion-col>
                  <ion-col size="8" class="rolStyle">{{ item.desc }}</ion-col>
                </ion-row>
                <ion-row>
                  <ion-col size="4">状态</ion-col>
                  <ion-col size="8" class="rolStyle" v-if="item.state == 1" style="color: green">已启用</ion-col>
                  <ion-col size="8" class="rolStyle" v-if="item.state == 0" style="color: darkred">已禁用</ion-col>
                </ion-row>
                <ion-row>
                  <ion-col size="3">附件</ion-col>
                  <div>
                    <img :src="item.addr">
                  </div>
                </ion-row>
              </ion-grid>

              <!--            按钮-->
              <ion-grid>
                <ion-row>
                  <ion-col><ion-button expand="block" style="font-size: 8px" :id="item.name">修改徽章</ion-button></ion-col>
                  <ion-col><ion-button expand="block" style="font-size: 8px" color="warning" @click="banVerify(item.name)">禁用徽章</ion-button></ion-col>
                  <ion-col><ion-button expand="block" style="font-size: 8px" color="success" @click="unBanVerify(item.name)">启用徽章</ion-button></ion-col>
                </ion-row>
              </ion-grid>

              <!--            修改信息模态框-->
              <ion-modal
                         :trigger="item.name" >
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

            </ion-card-content>
          </ion-card>
        </ion-col>
      </ion-row>
    </ion-grid>
  </ion-content>

</template>

<script>
import {
  IonHeader, IonTitle, IonToolbar, IonContent, IonNavLink,
  IonButton, IonButtons, IonBackButton,
  IonInput, IonIcon,
  IonList, IonItem, IonLabel,
  toastController,alertController,
  IonProgressBar,
  IonGrid, IonCol, IonRow,
  IonCard, IonCardHeader, IonCardContent, IonCardTitle, IonCardSubtitle,
  IonSearchbar, IonSelect, IonSelectOption,
  IonModal, modalController,
  IonPopover,IonFab,IonFabButton,
} from '@ionic/vue';
import {defineComponent, ref} from 'vue';
import Cookies from "js-cookie";
import $ from "jquery";
import {Camera, CameraResultType} from '@capacitor/camera';
import {defineCustomElements} from '@ionic/pwa-elements/loader';

import {informationOutline} from 'ionicons/icons'



export default defineComponent({
  name: "show",
  components: {
    IonHeader, IonTitle, IonToolbar, IonContent, IonNavLink,
    IonButton, IonButtons, IonBackButton,
    IonInput, IonIcon,
    IonList, IonItem, IonLabel,
    toastController,alertController,
    IonProgressBar,
    IonGrid, IonCol, IonRow,
    IonCard, IonCardHeader, IonCardContent, IonCardTitle, IonCardSubtitle,
    IonSearchbar, IonSelect, IonSelectOption,
    IonModal, modalController,
    IonPopover,IonFab,IonFabButton,
  },
  data() {
    return {
      badges:[],
      type:'',
      searchInfo:'',
      getting:false,
      noInfo:false,
      progressingTip:false,

      modifyDesc:'',
      upPhotoTip:true,
      userPhoto:false,
      myImageUrl:'',
    }
  },
  mounted() {
    this.getBadges();
  },
  methods: {
    async unBanVerify(name){
      const alert = await alertController.create({
        header: '确认启用?',
        buttons: [
          {
            text: '确认',
            handler: () => {
              this.unBan(name);
            },
          },
          {
            text: '返回',
          },
        ],
      });
      await alert.present();
    },
    unBan(name){
      let _this = this;
      $.ajax({
        url: 'https://tanmi-api.rexue.plus/insignias/'+name+'/enable',
        type: 'patch',
        data: {
        },
        beforeSend: function (request) {
          request.setRequestHeader("Authorization", Cookies.get('adminToken'));
        },
        success: function (data) {
          _this.unBanSuccess();
          _this.getBadges();
        },
        error: function (error) {
          console.log(error)
        }
      });
    },
    async banVerify(name) {
      const alert = await alertController.create({
        header: '确认禁用?',
        buttons: [
          {
            text: '确认',
            handler: () => {
              this.ban(name);
            },
          },
          {
            text: '返回',
          },
        ],
      });
      await alert.present();
    },
    ban(uid){
      let _this = this;
      $.ajax({
        url: 'https://tanmi-api.rexue.plus/insignias/'+uid+'/disable',
        type: 'patch',
        data: {
        },
        beforeSend: function (request) {
          request.setRequestHeader("Authorization", Cookies.get('adminToken'));
        },
        success: function (data) {
          console.log(data)
          _this.banSuccess();
          _this.getBadges();
        },
        error: function (error) {
          console.log(error)
        }
      });
    },
    upload(itemname) {
      if (this.modifyDesc == '' && this.myImageUrl == '') {
        this.noModifyInfo();
        return;
      }

      if(this.myImageUrl !=''){
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
            request.setRequestHeader("Authorization", Cookies.get('token'));
          },
          success: function (data) {
            _this.modify(itemname,data.Hash);
          },
          error: function (error) {
            _this.progressingTip = false;
            _this.photoError();
            return;
          }
        });
      }else{
        this.modify(itemname,'');
        this.progressingTip = true;
      }

    },
    modify(iname,hash){
      let _this = this;
      $.ajax({
        url: 'https://tanmi-api.rexue.plus/insignias/'+iname+'/modify',
        type: 'patch',
        data: {
          desc:_this.modifyDesc,
          addr: hash,
        },
        beforeSend: function (request) {
          request.setRequestHeader("Authorization", Cookies.get('adminToken'));
        },
        success: function (data) {
          _this.progressingTip = false;
          _this.dismiss();
          _this.getBadges();
          _this.modifySuccess();
        },
        error: function (error) {
          console.log(error)
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
    getBadges(){
      let name='';
      let desc='';
      if(this.type == 1){
        name = this.searchInfo;
      }else if(this.type == 2){
        desc = this.searchInfo;
      }

      this.noInfo = false;
      this.badges=[];
      this.getting = true;
      let _this = this;
      $.ajax({
        url: 'https://tanmi-api.rexue.plus/insignias',
        type: 'get',
        data: {
          name:name,
          desc:desc,
        },
        beforeSend: function (request) {
          request.setRequestHeader("Authorization", Cookies.get('adminToken'));
        },
        success: function (data) {
          for (let i = 0; i < data.length; i++) {
            let info = {
              name:'',
              desc:'',
              state:'',
              addr:'',
            }
            info.name = data[i].name;
            info.desc = data[i].desc;
            info.state = data[i].state;
            info.addr = data[i].file.addr;
            if (info.addr != undefined) {
              let index = info.addr.indexOf("\"");
              info.addr = "https://ipfs.rexue.plus/" + info.addr.substr(index + 1, 46);
            }
            _this.badges.push(info);
          }
          _this.getting = false;
        },
        error: function (error) {
          _this.getting = false;
          console.log(error)
          _this.noInfo = true;
        }
      });
    },
    async noModifyInfo() {
      const toast = await toastController.create({
        message: '修改信息不能为空!',
        duration: 1000,
        position: 'bottom',
        color: 'warning'
      });
      return toast.present();
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
    async unBanSuccess() {
      const toast = await toastController.create({
        message: '启用成功!',
        duration: 1000,
        position: 'bottom',
        color: 'success'
      });
      return toast.present();
    },
    async banSuccess() {
      const toast = await toastController.create({
        message: '禁用成功!',
        duration: 1000,
        position: 'bottom',
        color: 'success'
      });
      return toast.present();
    },
    async wrongTip() {
      const toast = await toastController.create({
        message: '请检查信息是否正确!',
        duration: 1000,
        position: 'bottom',
        color: 'warning'
      });
      return toast.present();
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
      informationOutline,
    }
  }
})
</script>

<style scoped>
.rolStyle{
  color: black;
}

.uploadPic {
  width: 200px;
  margin: 0 auto;
}
</style>