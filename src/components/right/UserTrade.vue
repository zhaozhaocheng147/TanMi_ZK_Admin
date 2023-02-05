<template>
  <ion-header :translucent="true">
    <ion-toolbar style="--background:#f4f4f5;">
      <ion-buttons slot="start">
        <ion-menu-button color="primary"></ion-menu-button>
        <ion-back-button></ion-back-button>
      </ion-buttons>
      <ion-title>总览闲置交易</ion-title>
    </ion-toolbar>
  </ion-header>
  <ion-content>
    <v-app>
      <v-container>
        <ion-progress-bar v-if="getting" type="indeterminate" color="medium"></ion-progress-bar>
        <v-data-table
            v-model:items-per-page="itemsPerPage"
            :headers="headers"
            :items="trades"
            item-value="name"
            class="elevation-1"
        >
          <template v-slot:item.i_attach="{ item }">
            <viewer :images="item">
              <img :key="item.raw.i_attach " :src="item.raw.i_attach" style="width: 100px">
            </viewer>
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
    this.getTrades()
  },
  data () {
    return {
      getting:false,
      progressingTip:false,
      trades:[],

      itemsPerPage: 5,
      headers: [
        {
          title: '订单号',
          align: 'middle',
          sortable: false,
          key: 'id',
        },
        { title: '上传者Id', align: 'middle', key: 'o_id' },
        { title: '上传时间', align: 'middle', key: 'o_time' },
        { title: '书籍名称', align: 'middle', key: 'i_name' },
        { title: '书籍图片', align: 'middle', key: 'i_attach' },
        { title: '兑换者Id', align: 'middle', key: 'b_id' },
        { title: '兑换时间', align: 'middle', key: 'b_time' },
        { title: '订单状态', align: 'middle', key: 'state' },
      ],

    }
  },
  methods: {
    getTrades(){
      this.noInfo = false;
      this.trades=[];
      this.getting = true;
      let _this = this;
      $.ajax({
        url: 'https://tanmi-api.rexue.plus/tradings/item/log/admin',
        type: 'get',
        data: {
          id:'',
          name:'',
          point:'',
        },
        beforeSend: function (request) {
          request.setRequestHeader("Authorization", Cookies.get('adminToken'));
        },
        success: function (data) {
          for (let i = 0; i < data.length; i++) {
            let info = {
              id:'',
              o_id:'',
              i_name:'',
              i_attach:'',
              o_time:'',
              b_id:'',
              b_time:'',
              state:'',
            }
            info.id = data[i].id;
            info.o_id = data[i].item.owner.id;
            info.i_name = data[i].item.name;
            info.i_attach = data[i].item.attachment;
            if (info.i_attach != undefined) {
              let index = info.i_attach.indexOf("\"");
              info.i_attach = "https://ipfs.rexue.plus/" + info.i_attach.substr(index + 1, 46);
            }
            info.o_time = data[i].item.upd_time;
            info.b_id = data[i].buyer.id;
            info.b_time = data[i].purchase_time;
            info.state = data[i].state;
            if(info.state == 0){
              info.state ="交易中"
            }else if(info.state == 1){
              info.state = "交易成功";
            }else if(info.state == 2){
              info.state = "物品下架";
            }else if(info.state == -1){
              info.state = "未售出";
            }else if(info.state == -2){
              info.state = "买方撤销";
            }else if(info.state == -3){
              info.state = "卖方撤销";
            }

            _this.trades.push(info);
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
  },
  setup() {
    return {informationOutline}
  }
}
</script>

<style scoped>

</style>