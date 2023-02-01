<template>
  <ion-header :translucent="true">
    <ion-toolbar style="--background:#f4f4f5;">
      <ion-buttons slot="start">
        <ion-menu-button color="primary"></ion-menu-button>
        <ion-back-button></ion-back-button>
      </ion-buttons>
      <ion-title>用户权益申请信息</ion-title>
    </ion-toolbar>
  </ion-header>

  <!--  搜索-->
  <ion-content>
    <div style="position: relative">
      <ion-searchbar placeholder="权益提交日志Id检索" v-model="searchInfo"
                     @ionChange="getIdTasks()">
      </ion-searchbar>
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
    <div style="width: 120px; margin: 0 auto;" v-if="noInfo">没有相关权益</div>

    <ion-grid>
      <ion-row>
        <ion-col size="4" v-for="item in allTask" :key="item.id">
          <ion-card>
            <ion-card-content>
              <!--            低碳行为展示-->
              <ion-grid>
                <ion-row>
                  <ion-col size="4">提交日志Id</ion-col>
                  <ion-col size="8" class="rolStyle">{{ item.rlId }}</ion-col>
                </ion-row>
                <ion-row>
                  <ion-col size="4">用户Id</ion-col>
                  <ion-col size="8" class="rolStyle">{{ item.uId }}</ion-col>
                </ion-row>
                <ion-row>
                  <ion-col size="4">申请权益名称</ion-col>
                  <ion-col size="8" class="rolStyle">{{ item.rName }}</ion-col>
                </ion-row>
                <ion-row>
                  <ion-col size="4">申请权益数量</ion-col>
                  <ion-col size="8" class="rolStyle">{{ item.aAmount }}</ion-col>
                </ion-row>
                <ion-row>
                  <ion-col size="4">所需积分</ion-col>
                  <ion-col size="8" class="rolStyle">{{ item.rPoint }}</ion-col>
                </ion-row>
                <ion-row v-if="item.state == 0">
                  <ion-col size="4">用户积分</ion-col>
                  <ion-col size="8" class="rolStyle" >{{ item.uPoint }}</ion-col>
                </ion-row>
                <ion-row>
                  <ion-col size="4" >提交描述</ion-col>
                  <ion-col size="8" class="rolStyle" v-if="item.aDesc!=''">{{ item.aDesc }}</ion-col>
                  <ion-col size="8" class="rolStyle" v-if="item.aDesc==''">无</ion-col>
                </ion-row>
                <ion-row>
                  <ion-col size="4">提交时间</ion-col>
                  <ion-col size="8" class="rolStyle">{{ item.aTime }}</ion-col>
                </ion-row>
                <ion-row>
                  <ion-col size="4">审核状态</ion-col>
                  <ion-col size="8" class="rolStyle" v-if="item.state == 1" style="color: green">已通过</ion-col>
                  <ion-col size="8" class="rolStyle" v-if="item.state == 0" style="color: grey">未审核</ion-col>
                  <ion-col size="8" class="rolStyle" v-if="item.state == 2" style="color: darkred">已驳回</ion-col>
                  <ion-col size="8" class="rolStyle" v-if="item.state == -1" style="color: green">用户已撤回</ion-col>
                </ion-row>
                <ion-row v-if="item.rTime != undefined">
                  <ion-col size="4">审核时间</ion-col>
                  <ion-col size="8" class="rolStyle">{{ item.rTime }}</ion-col>
                </ion-row>
                <ion-row v-if="item.rDesc != undefined">
                  <ion-col size="4">审核描述</ion-col>
                  <ion-col size="8" class="rolStyle" v-if="item.rDesc!=''">{{ item.rDesc }}</ion-col>
                  <ion-col size="8" class="rolStyle" v-if="item.rDesc==''">无</ion-col>
                </ion-row>

              </ion-grid>

              <ion-grid>
                <ion-row>
                  <ion-col><ion-button expand="block" color="success"  :disabled="item.state!=0" :id="item.rlId">通过</ion-button></ion-col>
                  <ion-col><ion-button expand="block" color="warning"  :disabled="item.state!=0" :id="item.aTime">驳回</ion-button></ion-col>
                </ion-row>
              </ion-grid>

              <!--            通过模态框-->
              <ion-modal :breakpoints="[0, 0.35,  0.5]"
                         :initial-breakpoint="0.35"
                         handle-behavior="cycle"
                         :trigger="item.rlId" >
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
                  <ion-button expand="block" fill="outline" style="margin-top: 15px" @click="successTask(item.rlId)">确认</ion-button>
                  <ion-progress-bar type="indeterminate" v-show="progressingTip"></ion-progress-bar>
                </ion-content>
              </ion-modal>

              <!--            未通过模态框-->
              <ion-modal :breakpoints="[0, 0.3,  0.5]"
                         :initial-breakpoint="0.3"
                         handle-behavior="cycle"
                         :trigger="item.aTime" >
                <ion-header>
                  <ion-toolbar>
                    <ion-title style=text-align:center>审核驳回</ion-title>
                  </ion-toolbar>
                </ion-header>
                <ion-content class="ion-padding">
                  <ion-item>
                    <ion-label position="floating">驳回理由</ion-label>
                    <ion-input :clear-input="true"  placeholder='请输入描述' v-model="desc"></ion-input>
                  </ion-item>
                  <ion-button expand="block" fill="outline" style="margin-top: 15px" @click="unSuccessTask(item.rlId)">确认</ion-button>
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
  name: "userBehavior",
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
        url: 'https://tanmi-api.rexue.plus/rights/log/'+tid+'/audit/reject',
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
            if(_this.allTask[i].rlId == tid){
              _this.allTask[i].state = 2;
              _this.allTask[i].rDesc = _this.desc;
            }
          }
          modalController.dismiss();
        },
        error: function (error) {
          console.log(error)
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
        url: 'https://tanmi-api.rexue.plus/rights/log/'+tid+'/audit/pass',
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
            if(_this.allTask[i].rlId == tid){
              _this.allTask[i].state = 1;
              _this.allTask[i].rDesc = _this.desc;
            }
          }
          modalController.dismiss();

        },
        error: function (error) {
          if(error.responseJSON.msg == "用户积分不足以兑换权益"){
            _this.noPointTip();
          }
          if(error.responseJSON.msg == "权益剩余库存不足"){
            _this.noStockTip();
          }
          modalController.dismiss();
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
        url: 'https://tanmi-api.rexue.plus/rights/log/all',
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
                rlId:'',
                rName:'',
                uId:'',
                aDesc:'',
                aTime:'',
                rDesc:'',
                rTime:'',
                state:'',
                aAmount:'',
                rAmount:'',
                uPoint:'',
                rPoint:'',
              }
              info.uId = data[i].user.id;
              info.rlId = data[i].id;
              info.rName = data[i].right.name;
              info.aDesc = data[i].appl_desc;
              info.aTime = data[i].appl_time;
              info.rDesc = data[i].review_desc;
              info.rTime = data[i].review_time;
              info.state = data[i].state;
              info.aAmount = data[i].appl_amount;
              info.uPoint = data[i].user.point;
              info.rPoint= (info.aAmount)*data[i].right.point;
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
        url: 'https://tanmi-api.rexue.plus/rights/log/all',
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
                rlId:'',
                rName:'',
                uId:'',
                aDesc:'',
                aTime:'',
                rDesc:'',
                rTime:'',
                state:'',
                aAmount:'',
                rAmount:'',
                uPoint:'',
                rPoint:'',
              }
              info.uId = data[i].user.id;
              info.rlId = data[i].id;
              info.rName = data[i].right.name;
              info.aDesc = data[i].appl_desc;
              info.aTime = data[i].appl_time;
              info.rDesc = data[i].review_desc;
              info.rTime = data[i].review_time;
              info.state = data[i].state;
              info.aAmount = data[i].appl_amount;
              info.uPoint = data[i].user.point;
              info.rPoint= (info.aAmount)*data[i].right.point;
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
        url: 'https://tanmi-api.rexue.plus/rights/log/all',
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
                rlId:'',
                rName:'',
                uId:'',
                aDesc:'',
                aTime:'',
                rDesc:'',
                rTime:'',
                state:'',
                aAmount:'',
                rAmount:'',
                uPoint:'',
                rPoint:'',
              }
              info.uId = data[i].user.id;
              info.rlId = data[i].id;
              info.rName = data[i].right.name;
              info.aDesc = data[i].appl_desc;
              info.aTime = data[i].appl_time;
              info.rDesc = data[i].review_desc;
              info.rTime = data[i].review_time;
              info.state = data[i].state;
              info.aAmount = data[i].appl_amount;
              info.uPoint = data[i].user.point;
              info.rPoint= (info.aAmount)*data[i].right.point;
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
        url: 'https://tanmi-api.rexue.plus/rights/log/'+_this.searchInfo,
        type: 'get',
        data: {
        },
        beforeSend: function (request) {
          request.setRequestHeader("Authorization", Cookies.get('adminToken'));
        },
        success: function (data) {
          let info = {
            rlId:'',
            rName:'',
            uId:'',
            aDesc:'',
            aTime:'',
            rDesc:'',
            rTime:'',
            state:'',
            aAmount:'',
            rAmount:'',
            uPoint:'',
            rPoint:'',
          }
          info.uId = data.user.id;
          info.rlId = data.id;
          info.rName = data.right.name;
          info.aDesc = data.appl_desc;
          info.aTime = data.appl_time;
          info.rDesc = data.review_desc;
          info.rTime = data.review_time;
          info.state = data.state;
          info.aAmount = data.appl_amount;
          info.uPoint = data.user.point;
          info.rPoint= (info.aAmount)*data.right.point;
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
        url: 'https://tanmi-api.rexue.plus/rights/log/all',
        type: 'get',
        data: {
        },
        beforeSend: function (request) {
          request.setRequestHeader("Authorization", Cookies.get('adminToken'));
        },
        success: function (data) {
          for (let i = 0; i < data.length; i++) {
            let info = {
              rlId:'',
              rName:'',
              uId:'',
              aDesc:'',
              aTime:'',
              rDesc:'',
              rTime:'',
              state:'',
              aAmount:'',
              rAmount:'',
              uPoint:'',
              rPoint:'',
            }
            info.uId = data[i].user.id;
            info.rlId = data[i].id;
            info.rName = data[i].right.name;
            info.aDesc = data[i].appl_desc;
            info.aTime = data[i].appl_time;
            info.rDesc = data[i].review_desc;
            info.rTime = data[i].review_time;
            info.state = data[i].state;
            info.aAmount = data[i].appl_amount;
            info.uPoint = data[i].user.point;
            info.rPoint= (info.aAmount)*data[i].right.point;
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
        message: '请填写全部字段!',
        duration: 1000,
        position: 'bottom',
        color: 'warning'
      });
      return toast.present();
    },
    async noPointTip() {
      const toast = await toastController.create({
        message: '用户积分不足以兑换权益!',
        duration: 2000,
        position: 'bottom',
        color: 'warning'
      });
      return toast.present();
    },
    async noStockTip() {
      const toast = await toastController.create({
        message: '权益剩余库存不足，请驳回请求，或增加库存后再通过!',
        duration: 2000,
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