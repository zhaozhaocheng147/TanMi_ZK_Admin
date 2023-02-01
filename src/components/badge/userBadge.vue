<template>
  <ion-header :translucent="true">
    <ion-toolbar style="--background:#f4f4f5;">
      <ion-buttons slot="start">
        <ion-menu-button color="primary"></ion-menu-button>
        <ion-back-button></ion-back-button>
      </ion-buttons>
      <ion-title>颁发勋章</ion-title>
    </ion-toolbar>
  </ion-header>
  <ion-content>
    <v-app>
      <v-container>

        <ion-progress-bar v-if="getting" type="indeterminate" color="medium"></ion-progress-bar>
        <v-data-table
            v-model="selectedUser"
            :headers="headers"
            :items="allUsers"
            class="elevation-1"
            item-value="id"
            show-select
        >
          <template v-slot:item.point="{ item }">
            <v-chip :style="{'background-color' : getBgc(item.raw.point),'color':getColor(item.raw.point)}">
              {{ item.raw.point }}
            </v-chip>
          </template>
        </v-data-table>
        <div style="width: 300px; float: right">
          <ion-list>
            <ion-item lines="none">
              <ion-select placeholder="选择徽章" v-model="selectedBadge">
                <ion-select-option v-for="item in badges" :key="item.name" :value="item.name">{{ item.name }}</ion-select-option>
              </ion-select>
              <ion-button expand="block" shape="round" fill="outline" size="default" style="margin-left: 50px" id="openBadgeDesc">授予</ion-button>
            </ion-item>
          </ion-list>
        </div>

      </v-container>
    </v-app>

    <ion-modal
        trigger="openBadgeDesc" style="--height: 250px">
      <ion-header>
        <ion-toolbar>
          <ion-title >授予勋章</ion-title>
          <ion-buttons slot="end">
            <ion-button color="dark" @click="dismiss()">关闭</ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>
      <ion-content class="ion-padding">
        <ion-item>
          <ion-label position="floating">授予描述/说明</ion-label>
          <ion-input :clear-input="true"  placeholder='请输入徽章描述' v-model="myDesc"></ion-input>
        </ion-item>
        <ion-button expand="block" fill="outline" style="margin-top: 50px" @click="sendBadges">授予</ion-button>
        <ion-progress-bar type="indeterminate" v-if="openLoading"></ion-progress-bar>
      </ion-content>
    </ion-modal>


    <ion-alert
        :is-open="openLoading"
        sub-header="授予中，请稍候..."
    ></ion-alert>

    <ion-fab slot="fixed" vertical="bottom" horizontal="start" id="info">
      <ion-fab-button>
        <ion-icon :icon="informationOutline"></ion-icon>
      </ion-fab-button>
    </ion-fab>

    <!--      帮助信息-->
    <ion-popover trigger="info" trigger-action="click" side="top">
      <ion-content class="ion-padding">
        <div>
          单击表头可进行排序;
          <br>
          可批量管理;
        </div>
      </ion-content>
    </ion-popover>
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


export default {
  components:{
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
    this.getUsers();
    this.getBadges();
  },
  computed:{
    getBgc:()=>{
      return (color)=>(color>30 ? '#fbdad1' :color>20 ? '#fdecd2' : color>15 ? '#e1efd8':color>10 ? '#d1cde6' : color>5 ? '#d3edfa' :'#f8f6f6');
    },
    getColor:()=>{
      return (color)=>(color>30 ? '#c70029' :color>20 ? '#f39801' : color>15 ? '#009b6b':color>10 ? '#4c4298' : color>5 ? '#008dcb' :'#2a2a2a');
    },
  },
  data () {
    return {
      getting:false,
      progressingTip:false,
      allUsers:[],
      badges:[],
      openLoading:false,

      selectedUser: [],
      selectedBadge:'',
      myDesc:'',
      wrongUser:[],

      itemsPerPage: 5,
      headers: [
        {
          title: '用户Id',
          align: 'middle',
          sortable: false,
          key: 'id',
        },
        { title: '用户姓名', align: 'middle', key: 'name' },
        { title: '累积碳积分', align: 'middle', key: 'point' },
      ],

    }
  },
  methods: {
      sendBadges(){
      this.wrongUser = [];
      if(this.myDesc == ''){
         this.noDesc();
        return;
      }else if(this.selectedUser.length == 0){
         this.noUser();
        return;
      }else if(this.selectedBadge == ''){
         this.noBadge();
        return;
      }
      modalController.dismiss();
      this.openLoading = true;

       let _this = this;

      if(this.openLoading == true){
        for(let i = 0; i<_this.selectedUser.length; i++){
            $.ajax({
            url: 'https://tanmi-api.rexue.plus/insignias/user/'+_this.selectedUser[i]+'/grant',
            type: 'post',
            async:false,
            data: {
              name:_this.selectedBadge,
              desc:_this.myDesc,
            },
            beforeSend: function (request) {
              request.setRequestHeader("Authorization", Cookies.get('adminToken'));
            },
            success: function (data) {
              _this.sendSuccess(_this.selectedUser[i]);
            },
            error: function (error) {
              _this.wrongUser.push(_this.selectedUser[i]);
            }
          });
        }
      }
      this.openLoading = false;
      if(this.wrongUser.length == 0){
         this.allSuccess();
      }else{
        let wrongUserIds = "";
        for(let i = 0; i<this.wrongUser.length; i++){
          wrongUserIds+="/"+this.wrongUser[i];
        }
          this.someFail(wrongUserIds);
      }

    },
    getBadges(){
      this.noInfo = false;
      this.badges=[];
      this.getting = true;
      let _this = this;
      $.ajax({
        url: 'https://tanmi-api.rexue.plus/insignias',
        type: 'get',
        data: {
          name:name,
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
    getUsers(){
      this.noInfo = false;
      this.users=[];
      this.getting = true;
      let _this = this;
      $.ajax({
        url: 'https://tanmi-api.rexue.plus/users',
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
            if(data[i].is_verified == 1){
              let info = {
                id:'',
                name:'',
                point:'',
              }
              info.id = data[i].id;
              info.name = data[i].name;
              info.point = data[i].point;
              _this.allUsers.push(info);
            }
          }
          console.log(_this.allUsers)
          _this.getting = false;
        },
        error: function (error) {
          _this.getting = false;
          console.log(error)
          _this.noInfo = true;
        }
      });
    },
    dismiss(){
      this.myDesc = '';
      modalController.dismiss();
    },
    async allSuccess(){
      const alert = await alertController.create({
        header: '授予成功!',
        buttons: [
          {
            text: '确认',
          },
          {
            text: '返回',
          },
        ],
      });
      await alert.present();
    },
    async someFail(ids){
      const alert = await alertController.create({
        header:"用户:",
        subHeader:ids+"  已拥有该徽章，请勿重复授予",
        buttons: [
          {
            text: '确认',
          },
          {
            text: '返回',
          },
        ],
      });
      await alert.present();
    },
    async sendSuccess(id) {
      const toast = await toastController.create({
        message: "用户"+id+'授予成功!',
        duration: 800,
        position: 'bottom',
        color: 'success'
      });
      return toast.present();
    },
    async noDesc() {
      const toast = await toastController.create({
        message: '请输入授予描述',
        duration: 1000,
        position: 'bottom',
        color: 'warning'
      });
      return toast.present();
    },
    async noUser() {
      const toast = await toastController.create({
        message: '请选择需要授予的用户',
        duration: 1000,
        position: 'bottom',
        color: 'warning'
      });
      return toast.present();
    },
    async noBadge() {
      const toast = await toastController.create({
        message: '请选择徽章',
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