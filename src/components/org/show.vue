<template>
  <ion-content>
    <div style="position: relative">
      <ion-searchbar placeholder="模糊查询组织" v-model="searchInfo"
                     style=" --border-radius: 0 20px 20px 0; padding-left: 80px" @ionChange="getOrgs">
      </ion-searchbar>
      <ion-select placeholder="类别" v-model="type"
                  style="width: 90px; height:42px; position: absolute; top: 8px; background-color:#ffffff; box-shadow:-1px 1px 1px 0px #969d98; border-radius: 20px 0 0 20px">
        <ion-select-option value="1">Id</ion-select-option>
        <ion-select-option value="2">组织名称</ion-select-option>
        <ion-select-option value="3">组织邮箱</ion-select-option>
      </ion-select>
    </div>

    <v-app>
      <v-container>
        <div style="width: 100px; margin: 0 auto" v-if="noInfo">没有相关信息</div>
        <ion-progress-bar v-if="getting" type="indeterminate" color="medium"></ion-progress-bar>
        <v-data-table
            v-model:items-per-page="itemsPerPage"
            :headers="headers"
            :items="orgs"
            item-value="id"
            class="elevation-1"
        >
          <template v-slot:item.action="{ item }">
            <ion-grid>
              <ion-row>
                <ion-col><ion-button fill="outline" size="small" @click="verifyReset(item.raw.id)">重置密码</ion-button></ion-col>
                <ion-col><ion-button fill="outline" size="small" @click="verifyModify(item.raw.id)">修改信息</ion-button></ion-col>
                <ion-col><ion-button fill="outline" size="small" color="danger" @click="verifyBan(item.raw.id)">封禁组织</ion-button></ion-col>
                <ion-col><ion-button fill="outline" size="small" color="tertiary" @click="verifyUnBan(item.raw.id)">解禁组织</ion-button></ion-col>
              </ion-row>
            </ion-grid>
          </template>
        </v-data-table>
      </v-container>
    </v-app>

  </ion-content>
</template>

<script>
import {
  IonPage, IonHeader, IonTitle, IonToolbar, IonContent, IonNavLink,
  IonButton, IonButtons, IonBackButton, IonMenuButton,
  IonInput, IonIcon,
  IonList, IonItem, IonLabel,
  toastController,
  IonProgressBar,
  IonGrid, IonCol, IonRow,
  IonCard, IonCardHeader, IonCardContent, IonCardTitle, IonCardSubtitle,
  alertController, IonAlert,
  IonRefresher,
  IonSearchbar, IonSelect, IonSelectOption,
  IonModal, modalController,
  IonPopover, IonFab, IonFabButton
} from '@ionic/vue';
import {defineComponent, ref} from 'vue';
import $ from "jquery";
import Cookies from "js-cookie";
import {informationOutline} from 'ionicons/icons'
import 'viewerjs/dist/viewer.css'
import { component as Viewer } from "v-viewer"


export default {
  components:{
    Viewer,
    IonPage,IonHeader, IonTitle, IonToolbar, IonContent, IonNavLink,
    IonButton, IonButtons, IonBackButton,IonMenuButton,
    IonInput, IonIcon,
    IonList, IonItem, IonLabel,
    toastController,
    IonProgressBar,
    IonGrid, IonCol, IonRow,
    IonCard, IonCardHeader, IonCardContent, IonCardTitle, IonCardSubtitle,
    alertController,IonAlert,
    IonRefresher,
    IonSearchbar, IonSelect, IonSelectOption,
    IonModal,modalController,
    IonPopover,IonFab,IonFabButton,
  },
  mounted() {
    this.getOrgs();
  },
  data () {
    return {
      getting:false,
      progressingTip:false,
      orgs:[],
      userId:'',
      noInfo:false,
      searchInfo:'',
      type:'',

      itemsPerPage: 10,
      headers: [
        {
          title: 'Id',
          align: 'middle',
          sortable: false,
          key: 'id',
        },
        { title: '组织名称', align: 'middle', key: 'name' },
        { title: '邮箱', align: 'middle', key: 'email' },
        { title: '状态', align: 'middle', key: 'is_verified' },
        { title: '碳积分', align: 'middle', key: 'point' },
        { title: ' ', align: 'middle', key:'action' },
      ],

    }
  },
  methods: {
    async verifyUnBan(id){
      let _this = this;
      const alert = await alertController.create({
        header: "确认解禁"+id+"?",
        buttons: [
          {
            text: '解禁',
            handler: () => {
              _this.UnBan(id);
              return false;
            }
          },
          {
            text: '返回',
            handler: () => {
              return true;
            }
          }
        ],
      });
      await alert.present();
    },
    UnBan(id){
      alertController.dismiss();
      this.getting = true;
      let _this = this;
      $.ajax({
        url: 'https://tanmi-api.rexue.plus/orgs/'+id+'/unban',
        type: 'patch',
        data: {
        },
        beforeSend: function (request) {
          request.setRequestHeader("Authorization", Cookies.get('adminToken'));
        },
        success: function (data) {
          _this.successUnBan();
          _this.getting = false;
          _this.getOrgs();
        },
        error: function (error) {
          _this.getting = false;
          console.log(error)
        }
      });
    },
    async verifyBan(id){
      let _this = this;
      const alert = await alertController.create({
        header: "确认封禁"+id+"?",
        buttons: [
          {
            text: '封禁',
            handler: () => {
              _this.ban(id);
              return false;
            }
          },
          {
            text: '返回',
            handler: () => {
              return true;
            }
          }
        ],
      });
      await alert.present();
    },
    ban(id){
      alertController.dismiss();
      this.getting = true;
      let _this = this;
      $.ajax({
        url: 'https://tanmi-api.rexue.plus/orgs/'+id+'/ban',
        type: 'patch',
        data: {
        },
        beforeSend: function (request) {
          request.setRequestHeader("Authorization", Cookies.get('adminToken'));
        },
        success: function (data) {
          _this.successBan();
          _this.getting = false;
          _this.getOrgs();
        },
        error: function (error) {
          _this.getting = false;
          console.log(error)
        }
      });
    },
    async verifyModify(id){
      let _this = this;
      const alert = await alertController.create({
        header: id,
        buttons: [
          {
            text: '修改',
            handler: (alertData) => {
              _this.modify(alertData, id);
              return false;
            }
          },
          {
            text: '关闭',
            handler: () => {
              return true;
            }
          }
        ],
        inputs: [
          {
            type: 'text',
            placeholder: '请输入组织名称...',
          },
          {
            type: 'text',
            placeholder: '请输入组织email...',
          },
        ],
      });
      await alert.present();
    },
    modify(alertData, id){
      let name = alertData[0];
      let email = alertData[1];

      if(name == '' ||email == ''){
        this.noInfoTip2();
        return;
      }
      alertController.dismiss();
      this.getting = true;
      let _this = this;
      $.ajax({
        url: 'https://tanmi-api.rexue.plus/orgs/'+id+'/modify',
        type: 'patch',
        data: {
          name:name,
          email:email,
        },
        beforeSend: function (request) {
          request.setRequestHeader("Authorization", Cookies.get('adminToken'));
        },
        success: function (data) {
          _this.successModify();
          _this.getting = false;
          _this.getOrgs();
        },
        error: function (error) {
          _this.getting = false;
          console.log(error)
        }
      });
    },
    async verifyReset(id) {
      let _this = this;
      const alert = await alertController.create({
        header: id,
        buttons: [
          {
            text: '重置',
            handler: (alertData) => {
              _this.resetPwd(alertData, id);
              return false;
            }
          },
          {
            text: '关闭',
            handler: () => {
              return true;
            }
          }
        ],
        inputs: [
          {
            type: 'text',
            placeholder: '请输入密码...',
          },
        ],
      });
      await alert.present();
    },
    resetPwd(alertData,id){
      let pwd = alertData[0];
      this.getting = true;
      let _this = this;
      alertController.dismiss();
      $.ajax({
        url: 'https://tanmi-api.rexue.plus/orgs/'+id+'/modify/pwd',
        type: 'patch',
        data: {
          password:pwd,
        },
        beforeSend: function (request) {
          request.setRequestHeader("Authorization", Cookies.get('adminToken'));
        },
        success: function (data) {
          _this.successModify();
          _this.getting = false;
          alertController.dismiss();
        },
        error: function (error) {
          _this.getting = false;
          console.log(error)
        }
      });
    },
    getOrgs(){
      let id = '';
      let name = '';
      let email = '';
      if(this.type == 1){
        id = this.searchInfo;
      }else if(this.type == 2){
        name = this.searchInfo;
      }else if(this.type == 3){
        email = this.searchInfo;
      }


      this.orgs = [];
      this.getting = true;
      let _this = this;
      $.ajax({
        url: 'https://tanmi-api.rexue.plus/orgs',
        type: 'get',
        data: {
          id:id,
          name:name,
          email:email,
        },
        beforeSend: function (request) {
          request.setRequestHeader("Authorization", Cookies.get('adminToken'));
        },
        success: function (data) {
          for (let i = 0; i < data.length; i++) {
            let info = {
              id:'',
              name:'',
              email:'',
              is_verified:'',
              point:'',
            }
            info.id = data[i].id;
            info.name = data[i].name;
            if(data[i].is_verified == 0){
              info.is_verified = "未验证";
            }else if(data[i].is_verified == 1){
              info.is_verified = "已验证"
            }else if(data[i].is_verified == -1){
              info.is_verified = "已封禁"
            }
            info.email = data[i].email;
            info.point = data[i].point;
            _this.orgs.push(info);
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
    async noId() {
      const toast = await toastController.create({
        message: '请输入Id后查询!',
        duration: 1000,
        position: 'bottom',
        color: 'warning'
      });
      return toast.present();
    },
    async noInfoTip() {
      const toast = await toastController.create({
        message: '没有相关信息!',
        duration: 1000,
        position: 'bottom',
        color: 'warning'
      });
      return toast.present();
    },
    async successModify() {
      const toast = await toastController.create({
        message: '修改成功!',
        duration: 1000,
        position: 'bottom',
        color: 'success'
      });
      return toast.present();
    },
    async successBan() {
      const toast = await toastController.create({
        message: '封禁成功!',
        duration: 1000,
        position: 'bottom',
        color: 'success'
      });
      return toast.present();
    },
    async successUnBan() {
      const toast = await toastController.create({
        message: '解禁成功!',
        duration: 1000,
        position: 'bottom',
        color: 'success'
      });
      return toast.present();
    },
    async noInfoTip2() {
      const toast = await toastController.create({
        message: '请输入要修改的信息!',
        duration: 1000,
        position: 'bottom',
        color: 'warning'
      });
      return toast.present();
    },
  },
  setup() {
    return {informationOutline}
  }
}
</script>

<style scoped>

</style>