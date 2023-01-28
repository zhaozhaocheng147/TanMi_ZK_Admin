<template>
  <ion-header :translucent="true">
    <ion-toolbar>
      <ion-buttons slot="start">
        <ion-menu-button color="primary"></ion-menu-button>
        <ion-back-button></ion-back-button>
      </ion-buttons>
      <ion-title>任务信息</ion-title>
    </ion-toolbar>
  </ion-header>
  <!--  搜索-->
  <ion-content>
    <div style="position: relative">
      <ion-searchbar placeholder="模糊查询任务" v-model="searchInfo"
                     style=" --border-radius: 0 20px 20px 0; padding-left: 80px" @ionChange="getTasks">
      </ion-searchbar>
      <ion-select placeholder="类别" v-model="type"
                  style="width: 90px; height:42px; position: absolute; top: 8px; background-color:#ffffff; box-shadow:-1px 1px 1px 0px #969d98; border-radius: 20px 0 0 20px">
        <ion-select-option value="1">名称</ion-select-option>
        <ion-select-option value="2">描述</ion-select-option>
        <ion-select-option value="3">Id</ion-select-option>
      </ion-select>
    </div>

    <!--  提示框-->
    <div style="width: 100px; margin: 0 auto;" v-if="getting">获取中...</div>
    <div style="width: 120px; margin: 0 auto;" v-if="noInfo">没有相关任务</div>

    <ion-grid>
      <ion-row>
        <ion-col size="4" v-for="item in tasks" :key="item.id">
          <ion-card>
            <ion-card-content>
              <!--            任务展示-->
              <ion-grid>
                <ion-row>
                  <ion-col size="4">Id</ion-col>
                  <ion-col size="8" class="rolStyle">{{ item.id }}</ion-col>
                </ion-row>
                <ion-row>
                  <ion-col size="4">名称</ion-col>
                  <ion-col size="8" class="rolStyle">{{ item.name }}</ion-col>
                </ion-row>
                <ion-row>
                  <ion-col size="4">描述</ion-col>
                  <ion-col size="8" class="rolStyle">{{ item.desc }}</ion-col>
                </ion-row>
                <ion-row>
                  <ion-col size="4">任务状态</ion-col>
                  <ion-col size="8" class="rolStyle" v-if="item.verified == 1" style="color: green">已启用</ion-col>
                  <ion-col size="8" class="rolStyle" v-if="item.verified == 0" style="color: darkred">已禁用</ion-col>
                </ion-row>
                <ion-row>
                  <ion-col size="4">碳积分</ion-col>
                  <ion-col size="8" class="rolStyle">{{ item.point }}</ion-col>
                </ion-row>
              </ion-grid>

              <!--            按钮-->
              <ion-grid>
                <ion-row>
                  <ion-col><ion-button expand="block" style="font-size: 8px" :id="item.id">修改积分</ion-button></ion-col>
                  <ion-col><ion-button expand="block" style="font-size: 8px" :id="item.name">修改信息</ion-button></ion-col>
                  <ion-col><ion-button expand="block" style="font-size: 8px" color="warning" @click="banVerify(item.id)">禁用任务</ion-button></ion-col>
                  <ion-col><ion-button expand="block" style="font-size: 8px" color="success" @click="unBanVerify(item.id)">启用任务</ion-button></ion-col>
                </ion-row>
              </ion-grid>

              <!--            修改积分模态框-->
              <ion-modal :breakpoints="[0, 0.5,  0.75]"
                         :initial-breakpoint="0.50"
                         handle-behavior="cycle"
                         :trigger="item.id" >
                <ion-header>
                  <ion-toolbar>
                    <ion-title style=text-align:center>修改可获得积分</ion-title>
                  </ion-toolbar>
                </ion-header>
                <ion-content class="ion-padding">
                  <ion-item>
                    <ion-label position="floating">积分</ion-label>
                    <ion-input :clear-input="true"  placeholder='请输入积分' v-model="point"></ion-input>
                  </ion-item>
                  <ion-button expand="block" fill="outline" style="margin-top: 15px" @click="reset(item.id)">修改</ion-button>
                  <ion-progress-bar type="indeterminate" v-show="progressingTip"></ion-progress-bar>
                </ion-content>
              </ion-modal>

              <!--            修改信息模态框-->
              <ion-modal :breakpoints="[0, 0.5,  0.75]"
                         :initial-breakpoint="0.50"
                         handle-behavior="cycle"
                         :trigger="item.name" >
                <ion-header>
                  <ion-toolbar>
                    <ion-title style=text-align:center>修改信息</ion-title>
                  </ion-toolbar>
                </ion-header>
                <ion-content class="ion-padding">
                  <ion-item>
                    <ion-label position="floating">名称</ion-label>
                    <ion-input :clear-input="true"  placeholder='请输入姓名' v-model="modifyName"></ion-input>
                  </ion-item>
                  <ion-item>
                    <ion-label position="floating">描述</ion-label>
                    <ion-input :clear-input="true"  placeholder='请输入描述' v-model="modifyDesc"></ion-input>
                  </ion-item>
                  <ion-button expand="block" fill="outline" style="margin-top: 15px" @click="modify(item.id)">修改</ion-button>
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
      tasks:[],
      type:'',
      searchInfo:'',
      getting:false,
      noInfo:false,
      progressingTip:false,
      point:'',
      modifyName:'',
      modifyDesc:'',
    }
  },
  mounted() {
    this.getTasks();
  },
  methods: {
    async unBanVerify(uid){
      const alert = await alertController.create({
        header: '确认启用?',
        buttons: [
          {
            text: '确认',
            handler: () => {
              this.unBan(uid);
            },
          },
          {
            text: '返回',
          },
        ],
      });
      await alert.present();
    },
    unBan(uid){
      let _this = this;
      $.ajax({
        url: 'https://tanmi-api.rexue.plus/tasks/'+uid+'/enable',
        type: 'patch',
        data: {
        },
        beforeSend: function (request) {
          request.setRequestHeader("Authorization", Cookies.get('adminToken'));
        },
        success: function (data) {
          console.log(data)
          _this.unBanSuccess();
          _this.getTasks();
        },
        error: function (error) {
          console.log(error)
        }
      });
    },
    async banVerify(uid) {
      const alert = await alertController.create({
        header: '确认禁用?',
        buttons: [
          {
            text: '确认',
            handler: () => {
              this.ban(uid);
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
        url: 'https://tanmi-api.rexue.plus/tasks/'+uid+'/disable',
        type: 'patch',
        data: {
        },
        beforeSend: function (request) {
          request.setRequestHeader("Authorization", Cookies.get('adminToken'));
        },
        success: function (data) {
          console.log(data)
          _this.banSuccess();
          _this.getTasks();
        },
        error: function (error) {
          console.log(error)
        }
      });
    },
    modify(taskId){
      if(this.modifyName == '' && this.modifyDesc == '' ){
        this.noModifyInfo();
        return;
      }

      this.progressingTip = true;
      let _this = this;
      $.ajax({
        url: 'https://tanmi-api.rexue.plus/tasks/'+taskId+'/modify',
        type: 'patch',
        data: {
          name:_this.modifyName,
          desc:_this.modifyDesc,
        },
        beforeSend: function (request) {
          request.setRequestHeader("Authorization", Cookies.get('adminToken'));
        },
        success: function (data) {
          _this.modifySuccess();
          _this.progressingTip = false;
          _this.modifyName = '';
          _this.modifyDesc = '';
          modalController.dismiss();
          _this.getTasks();
        },
        error: function (error) {
          console.log(error)
          _this.wrongTip();
          _this.progressingTip = false;
          _this.modifyName = '';
          _this.modifyDesc = '';
        }
      });
    },
    reset(taskId){
      if(this.point == ''){
        this.noPwdInfo();
        return;
      }

      this.progressingTip = true;
      let _this = this;
      $.ajax({
        url: 'https://tanmi-api.rexue.plus/tasks/'+taskId+'/modify/point',
        type: 'patch',
        data: {
          point:_this.point,
        },
        beforeSend: function (request) {
          request.setRequestHeader("Authorization", Cookies.get('adminToken'));
        },
        success: function (data) {
          _this.modifySuccess();
          _this.getTasks();
          modalController.dismiss();
          _this.progressingTip = false;
          _this.point = '';
        },
        error: function (error) {
          console.log(error)
          _this.wrongTip();
          _this.progressingTip = false;
          _this.point = '';
        }
      });
    },
    getTasks(){
      let name='';
      let desc='';
      if(this.type == 1){
        name = this.searchInfo;
      }else if(this.type == 2){
        desc = this.searchInfo;
      }else if(this.type == 3  && this.searchInfo !=''){
        this.getTaskById(this.searchInfo);
        return;
      }

      this.noInfo = false;
      this.tasks=[];
      this.getting = true;
      let _this = this;
      $.ajax({
        url: 'https://tanmi-api.rexue.plus/tasks',
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
              id:'',
              name:'',
              desc:'',
              verified:'',
              point:'',
            }
            info.id = data[i].id;
            info.name = data[i].name;
            info.desc = data[i].desc;
            info.verified = data[i].state;
            info.point = data[i].point;
            _this.tasks.push(info);
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
    getTaskById(tid){
      if(this.searchInfo == ''){
        this.getTasks();
        return
      }
      this.noInfo = false;
      this.tasks=[];
      this.getting = true;
      let _this = this;
      $.ajax({
        url: 'https://tanmi-api.rexue.plus/tasks/'+tid,
        type: 'get',
        data: {
          name:'',
          desc:'',
        },
        beforeSend: function (request) {
          request.setRequestHeader("Authorization", Cookies.get('adminToken'));
        },
        success: function (data) {
          let info = {
            id:'',
            name:'',
            desc:'',
            verified:'',
            point:'',
          }
          info.id = data.id;
          info.name = data.name;
          info.desc = data.desc;
          info.verified = data.state;
          info.point = data.point;
          _this.tasks.push(info);

          _this.getting = false;
        },
        error: function (error) {
          _this.getting = false;
          console.log(error)
          _this.noInfo = true;
        }
      });
    },
    async noPwdInfo() {
      const toast = await toastController.create({
        message: '请输入修改后的积分!',
        duration: 1000,
        position: 'bottom',
        color: 'warning'
      });
      return toast.present();
    },
    async noModifyInfo() {
      const toast = await toastController.create({
        message: '请输入要修改的信息!',
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
    }
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
</style>