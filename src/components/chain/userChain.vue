<template>
  <ion-header :translucent="true">
    <ion-toolbar style="--background:#f4f4f5;">
      <ion-buttons slot="start">
        <ion-menu-button color="primary"></ion-menu-button>
        <ion-back-button></ion-back-button>
      </ion-buttons>
      <ion-title>用户上链明细</ion-title>
    </ion-toolbar>
  </ion-header>
  <ion-content>
    <ion-item>
      <ion-label slot="start">用户Id：</ion-label>
      <ion-input placeholder="请输入您要查询的用户Id..." v-model="userId"></ion-input>
      <ion-button expand="block" slot="end" size="default" @click="getChain">查询</ion-button>
    </ion-item>

    <v-app>
      <v-container>
        <div style="width: 100px; margin: 0 auto" v-if="noInfo">没有相关信息</div>
        <ion-progress-bar v-if="getting" type="indeterminate" color="medium"></ion-progress-bar>
        <v-data-table
            v-model:items-per-page="itemsPerPage"
            :headers="headers"
            :items="chains"
            item-value="name"
            class="elevation-1"
        >
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
    // this.getTrades()
  },
  data () {
    return {
      getting:false,
      progressingTip:false,
      chains:[],
      userId:'',
      noInfo:false,

      itemsPerPage: 10,
      headers: [
        {
          title: 'Id',
          align: 'middle',
          sortable: false,
          key: 'id',
        },
        { title: '事务类型', align: 'middle', key: 'type' },
        { title: '事务描述', align: 'middle', key: 'desc' },
        { title: '交易哈希', align: 'middle', key: 'chainId' },
        { title: '上链时间', align: 'middle', key: 'time' },
      ],

    }
  },
  methods: {
    getChain(){
      if(this.userId == ''){
        this.noId();
        return;
      }

      this.getting = true;
      let _this = this;
      $.ajax({
        url: 'https://tanmi-api.rexue.plus/stats/chain/user/'+_this.userId,
        type: 'get',
        data: {
        },
        beforeSend: function (request) {
          request.setRequestHeader("Authorization", Cookies.get('adminToken'));
        },
        success: function (data) {
          for (let i = 0; i < data.length; i++) {
            let info = {
              id:'',
              type:'',
              desc:'',
              chainId:'',
              time:'',
            }
            info.id = data[i].id;
            if (data[i].type == "C0") {
              info.type = "用户完成低碳行为";
            } else if (data[i].type == "B0") {
              info.type = "用户被授予勋章";
            } else if (data[i].type == "D0") {
              info.type = "用户成功兑换权益";
            } else if (data[i].type == "E0") {
              info.type = "用户成功完成任务";
            } else if (data[i].type == "A0") {
              info.type = "用户注册";
            } else if (data[i].type == "A2") {
              info.type = "用户所属组织修改";
            } else if (data[i].type == "A3") {
              info.type = "用户名称修改";
            } else if (data[i].type == "F0") {
              info.type = "用户新建交易订单";
            } else if (data[i].type == "F1") {
              info.type = "用户成功完成交易";
            } else if (data[i].type == "F2") {
              info.type = "买家撤销交易订单";
            } else if (data[i].type == "F3") {
              info.type = "卖家撤销交易订单";
            }
            info.desc = data[i].desc;
            info.chainId = data[i].tx_id;
            info.time = data[i].timestamp;
            _this.chains.push(info);
          }
          _this.getting = false;
          if(_this.chains.length == 0){
            _this.noInfoTip();
            _this.noInfo =true;
          }
        },
        error: function (error) {
          _this.getting = false;
          console.log(error)
          if(_this.chains.length == 0){
            _this.noInfoTip();
          }
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
  },
  setup() {
    return {informationOutline}
  }
}
</script>

<style scoped>

</style>