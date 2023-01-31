<template>
  <ion-header :translucent="true">
    <ion-toolbar>
      <ion-buttons slot="start">
        <ion-menu-button color="primary"></ion-menu-button>
        <ion-back-button></ion-back-button>
      </ion-buttons>
      <ion-title>用户任务提交信息</ion-title>
    </ion-toolbar>
  </ion-header>

  <!--  搜索-->
  <ion-content>
    <div style="position: relative">
      <ion-searchbar placeholder="任务提交日志Id检索任务" v-model="searchInfo"
                      @ionChange="getIdTasks()">
      </ion-searchbar>
<!--      <ion-select placeholder="类别" v-model="type"-->
<!--                  style="width: 90px; height:42px; position: absolute; top: 8px; background-color:#ffffff; box-shadow:-1px 1px 1px 0px #969d98; border-radius: 20px 0 0 20px">-->
<!--        <ion-select-option value="1">名称</ion-select-option>-->
<!--        <ion-select-option value="2">描述</ion-select-option>-->
<!--      </ion-select>-->
    </div>
    <ion-grid>
      <ion-row>
        <ion-col><ion-button expand="block" shape="round" fill="outline" @click="getUserTasks">全部</ion-button></ion-col>
        <ion-col><ion-button expand="block" shape="round" fill="outline" @click="getNoTasks">未审核</ion-button></ion-col>
        <ion-col><ion-button expand="block" shape="round" fill="outline" @click="getFailTasks">已驳回</ion-button></ion-col>
        <ion-col><ion-button expand="block" shape="round" fill="outline" @click="getSuccessTasks">已通过</ion-button></ion-col>
      </ion-row>
    </ion-grid>

    <!--  提示框-->
    <div style="width: 100px; margin: 0 auto;" v-if="getting">获取中...</div>
    <div style="width: 120px; margin: 0 auto;" v-if="noInfo">没有相关任务</div>

    <ion-grid>
      <ion-row>
        <ion-col size="4" v-for="item in allTask" :key="item.id">
          <ion-card>
            <ion-card-content>
              <!--            任务展示-->
              <ion-grid>
                <ion-row>
                  <ion-col size="4">用户Id</ion-col>
                  <ion-col size="8" class="rolStyle">{{ item.uId }}</ion-col>
                </ion-row>
                <ion-row>
                  <ion-col size="4">提交日志Id</ion-col>
                  <ion-col size="8" class="rolStyle">{{ item.tId }}</ion-col>
                </ion-row>
                <ion-row>
                  <ion-col size="4">任务名称</ion-col>
                  <ion-col size="8" class="rolStyle">{{ item.tName }}</ion-col>
                </ion-row>
                <ion-row>
                  <ion-col size="4" style="font-size: 12px">关联低碳行为提交记录Id</ion-col>
                  <ion-col size="8" class="rolStyle">{{ item.tBId }}</ion-col>
                </ion-row>
                <ion-row>
                  <ion-col size="4">提交时间</ion-col>
                  <ion-col size="8" class="rolStyle">{{ item.tATime }}</ion-col>
                </ion-row>
                <ion-row>
                  <ion-col size="4">审核状态</ion-col>
                  <ion-col size="8" class="rolStyle" v-if="item.tState == 1" style="color: green">已通过</ion-col>
                  <ion-col size="8" class="rolStyle" v-if="item.tState == 0" style="color: grey">未审核</ion-col>
                  <ion-col size="8" class="rolStyle" v-if="item.tState == 2" style="color: darkred">已驳回</ion-col>
                </ion-row>
                <ion-row v-if="item.rTime != undefined">
                  <ion-col size="4">审核时间</ion-col>
                  <ion-col size="8" class="rolStyle">{{ item.rTime }}</ion-col>
                </ion-row>
                <ion-row v-if="item.rDesc != undefined">
                  <ion-col size="4">审核描述</ion-col>
                  <ion-col size="8" class="rolStyle">{{ item.rDesc }}</ion-col>
                </ion-row>
                <ion-row>
                  <ion-col size="3">附件:</ion-col>
                  <div>
                    <img :src="item.tAttach">
                  </div>
                </ion-row>

              </ion-grid>

              <ion-grid>
                <ion-row>
                  <ion-col><ion-button expand="block" color="success"  :disabled="item.tState!=0" :id="item.tId">通过</ion-button></ion-col>
                  <ion-col><ion-button expand="block" color="warning"  :disabled="item.tState!=0" :id="item.tATime">驳回</ion-button></ion-col>
                </ion-row>
              </ion-grid>

              <!--            通过模态框-->
              <ion-modal :breakpoints="[0, 0.3,  0.5]"
                         :initial-breakpoint="0.3"
                         handle-behavior="cycle"
                         :trigger="item.tId" >
                <ion-header>
                  <ion-toolbar>
                    <ion-title style=text-align:center>审核通过</ion-title>
                  </ion-toolbar>
                </ion-header>
                <ion-content class="ion-padding">
                  <ion-item>
                    <ion-label position="floating">审核描述</ion-label>
                    <ion-input :clear-input="true"  placeholder='请输入描述' v-model="desc"></ion-input>
                  </ion-item>
                  <ion-button expand="block" fill="outline" style="margin-top: 15px" @click="successTask(item.tId)">确认</ion-button>
                  <ion-progress-bar type="indeterminate" v-show="progressingTip"></ion-progress-bar>
                </ion-content>
              </ion-modal>

              <!--            未通过模态框-->
              <ion-modal :breakpoints="[0, 0.3,  0.5]"
                         :initial-breakpoint="0.3"
                         handle-behavior="cycle"
                         :trigger="item.tATime" >
                <ion-header>
                  <ion-toolbar>
                    <ion-title style=text-align:center>审核驳回</ion-title>
                  </ion-toolbar>
                </ion-header>
                <ion-content class="ion-padding">
                  <ion-item>
                    <ion-label position="floating">审核描述</ion-label>
                    <ion-input :clear-input="true"  placeholder='请输入描述' v-model="desc"></ion-input>
                  </ion-item>
                  <ion-button expand="block" fill="outline" style="margin-top: 15px" @click="unSuccessTask(item.tId)">确认</ion-button>
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
  IonPage,IonHeader, IonTitle, IonToolbar, IonContent, IonNavLink,
  IonButton, IonButtons, IonBackButton,IonMenuButton,
  IonInput, IonIcon,
  IonList, IonItem, IonLabel,
  toastController,
  IonProgressBar,
  IonGrid, IonCol, IonRow,
  IonCard, IonCardHeader, IonCardContent, IonCardTitle, IonCardSubtitle,
  alertController,
  IonRefresher,
  IonSearchbar, IonSelect, IonSelectOption,
  IonModal,modalController,
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
    IonRefresher,
    IonSearchbar, IonSelect, IonSelectOption,
    IonModal,modalController,
  },
  data() {
    return {
      getting:false,
      noInfo:false,
      allTask:[],
      searchInfo:'',
      desc:'',
      progressingTip:false,
    };
  },
  mounted() {
    this.getUserTasks();
  },
  methods: {
    unSuccessTask(tid){
      if(this.desc == ''){
        this.wrongTip();
        return;
      }
      let _this = this;
      this.progressingTip = true;
      $.ajax({
        url: 'https://tanmi-api.rexue.plus/tasks/log/'+tid+'/audit/reject',
        type: 'patch',
        data: {
          desc:_this.desc,
        },
        beforeSend: function (request) {
          request.setRequestHeader("Authorization", Cookies.get('adminToken'));
        },
        success: function (data) {
          _this.unSuccessTip();
          _this.progressingTip = false;
          for(let i =0; i<_this.allTask.length; i++){
            if(_this.allTask[i].tId == tid){
              _this.allTask[i].tState = 2;
              _this.allTask[i].rDesc = _this.desc;
            }
          }
          modalController.dismiss();
        },
        error: function (error) {
          _this.progressingTip = false;
        }
      });
    },
    successTask(tid){
      if(this.desc == ''){
        this.wrongTip();
        return;
      }
      let _this = this;
      this.progressingTip = true;
      $.ajax({
        url: 'https://tanmi-api.rexue.plus/tasks/log/'+tid+'/audit/pass',
        type: 'patch',
        data: {
          desc:_this.desc,
        },
        beforeSend: function (request) {
          request.setRequestHeader("Authorization", Cookies.get('adminToken'));
        },
        success: function (data) {
          _this.successTip();
          _this.progressingTip = false;
          for(let i =0; i<_this.allTask.length; i++){
            if(_this.allTask[i].tId == tid){
              _this.allTask[i].tState = 1;
              _this.allTask[i].rDesc = _this.desc;
            }
          }
          modalController.dismiss();

        },
        error: function (error) {
          _this.progressingTip = false;
        }
      });
    },
    getFailTasks(){
      this.noInfo = false;
      this.allTask=[];
      this.getting = true;
      let _this = this;
      $.ajax({
        url: 'https://tanmi-api.rexue.plus/tasks/log/all',
        type: 'get',
        data: {
        },
        beforeSend: function (request) {
          request.setRequestHeader("Authorization", Cookies.get('adminToken'));
        },
        success: function (data) {
          for (let i = 0; i < data.length; i++) {
            if(data[i].state == 2){
              let info = {
                uId:'',
                tId:'',
                tName:'',
                tBId:'',
                tATime:'',
                tAttach:'',
                tState:'',
                rDesc:'',
                rTime:'',
              }
              info.uId = data[i].user.id;
              info.tId = data[i].id;
              info.tName = data[i].task.name;
              info.tBId = data[i].appl_desc;
              info.tATime = data[i].appl_time;
              info.tAttach = data[i].attachment;
              info.rDesc=data[i].review_desc;
              info.rTime=data[i].review_time;
              if (info.tAttach != undefined) {
                let index = info.tAttach.indexOf("\"");
                info.tAttach = "https://ipfs.rexue.plus/" + info.tAttach.substr(index + 1, 46);
              }
              info.tState = data[i].state;
              _this.allTask.push(info);
            }
          }
          _this.allTask.reverse();
          _this.getting = false;
        },
        error: function (error) {
          _this.getting = false;
          console.log(error)
          _this.noInfo = true;
        }
      });
    },
    getSuccessTasks(){
      this.noInfo = false;
      this.allTask=[];
      this.getting = true;
      let _this = this;
      $.ajax({
        url: 'https://tanmi-api.rexue.plus/tasks/log/all',
        type: 'get',
        data: {
        },
        beforeSend: function (request) {
          request.setRequestHeader("Authorization", Cookies.get('adminToken'));
        },
        success: function (data) {
          for (let i = 0; i < data.length; i++) {
            if(data[i].state == 1){
              let info = {
                uId:'',
                tId:'',
                tName:'',
                tBId:'',
                tATime:'',
                tAttach:'',
                tState:'',
                rDesc:'',
                rTime:'',
              }
              info.uId = data[i].user.id;
              info.tId = data[i].id;
              info.tName = data[i].task.name;
              info.tBId = data[i].appl_desc;
              info.tATime = data[i].appl_time;
              info.tAttach = data[i].attachment;
              info.rDesc=data[i].review_desc;
              info.rTime=data[i].review_time;
              if (info.tAttach != undefined) {
                let index = info.tAttach.indexOf("\"");
                info.tAttach = "https://ipfs.rexue.plus/" + info.tAttach.substr(index + 1, 46);
              }
              info.tState = data[i].state;
              _this.allTask.push(info);
            }
          }
          _this.allTask.reverse();
          _this.getting = false;
        },
        error: function (error) {
          _this.getting = false;
          console.log(error)
          _this.noInfo = true;
        }
      });
    },
    getNoTasks(){
      this.noInfo = false;
      this.allTask=[];
      this.getting = true;
      let _this = this;
      $.ajax({
        url: 'https://tanmi-api.rexue.plus/tasks/log/all',
        type: 'get',
        data: {
        },
        beforeSend: function (request) {
          request.setRequestHeader("Authorization", Cookies.get('adminToken'));
        },
        success: function (data) {
          for (let i = 0; i < data.length; i++) {
            if(data[i].state == 0){
              let info = {
                uId:'',
                tId:'',
                tName:'',
                tBId:'',
                tATime:'',
                tAttach:'',
                tState:'',
                rDesc:'',
                rTime:'',
              }
              info.uId = data[i].user.id;
              info.tId = data[i].id;
              info.tName = data[i].task.name;
              info.tBId = data[i].appl_desc;
              info.tATime = data[i].appl_time;
              info.tAttach = data[i].attachment;
              info.rDesc=data[i].review_desc;
              info.rTime=data[i].review_time;
              if (info.tAttach != undefined) {
                let index = info.tAttach.indexOf("\"");
                info.tAttach = "https://ipfs.rexue.plus/" + info.tAttach.substr(index + 1, 46);
              }
              info.tState = data[i].state;
              _this.allTask.push(info);
            }
          }
          _this.allTask.reverse();
          _this.getting = false;
        },
        error: function (error) {
          _this.getting = false;
          console.log(error)
          _this.noInfo = true;
        }
      });
    },
    getIdTasks(){
      if(this.searchInfo == ''){
        this.getUserTasks();
        return;
      }
      this.noInfo = false;
      this.allTask=[];
      this.getting = true;
      let _this = this;
      $.ajax({
        url: 'https://tanmi-api.rexue.plus/tasks/log/'+_this.searchInfo,
        type: 'get',
        data: {
        },
        beforeSend: function (request) {
          request.setRequestHeader("Authorization", Cookies.get('adminToken'));
        },
        success: function (data) {
          let info = {
            uId:'',
            tId:'',
            tName:'',
            tBId:'',
            tATime:'',
            tAttach:'',
            tState:'',
            rDesc:'',
            rTime:'',
          }
          info.uId = data.user.id;
          info.tId = data.id;
          info.tName = data.task.name;
          info.tBId = data.appl_desc;
          info.tATime = data.appl_time;
          info.tAttach = data.attachment;
          info.rDesc=data.review_desc;
          info.rTime=data.review_time;
          if (info.tAttach != undefined) {
            let index = info.tAttach.indexOf("\"");
            info.tAttach = "https://ipfs.rexue.plus/" + info.tAttach.substr(index + 1, 46);
          }
          info.tState = data.state;
          _this.allTask.push(info);
          _this.getting = false;
        },
        error: function (error) {
          _this.getting = false;
          console.log(error)
          _this.noInfo = true;
        }
      });
    },
    getUserTasks(){
      this.noInfo = false;
      this.allTask=[];
      this.getting = true;
      let _this = this;
      $.ajax({
        url: 'https://tanmi-api.rexue.plus/tasks/log/all',
        type: 'get',
        data: {
        },
        beforeSend: function (request) {
          request.setRequestHeader("Authorization", Cookies.get('adminToken'));
        },
        success: function (data) {
          for (let i = 0; i < data.length; i++) {
            let info = {
              uId:'',
              tId:'',
              tName:'',
              tBId:'',
              tATime:'',
              tAttach:'',
              tState:'',
              rDesc:'',
              rTime:'',
            }
            info.uId = data[i].user.id;
            info.tId = data[i].id;
            info.tName = data[i].task.name;
            info.tBId = data[i].appl_desc;
            info.tATime = data[i].appl_time;
            info.tAttach = data[i].attachment;
            info.rDesc=data[i].review_desc;
            info.rTime=data[i].review_time;
            if (info.tAttach != undefined) {
              let index = info.tAttach.indexOf("\"");
              info.tAttach = "https://ipfs.rexue.plus/" + info.tAttach.substr(index + 1, 46);
            }
            info.tState = data[i].state;
            _this.allTask.push(info);
          }
          _this.allTask.reverse();
          _this.getting = false;
        },
        error: function (error) {
          _this.getting = false;
          console.log(error)
          _this.noInfo = true;
        }
      });
    },
    async wrongTip() {
      const toast = await toastController.create({
        message: '请输入描述!',
        duration: 1000,
        position: 'bottom',
        color: 'warning'
      });
      return toast.present();
    },
    async successTip() {
      const toast = await toastController.create({
        message: '通过成功!',
        duration: 1000,
        position: 'bottom',
        color: 'success'
      });
      return toast.present();
    },
    async unSuccessTip() {
      const toast = await toastController.create({
        message: '驳回成功!',
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
.rolStyle{
  color: black;
}
</style>