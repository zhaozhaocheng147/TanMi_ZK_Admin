<template>
<!--  搜索-->
  <div style="position: relative">
    <ion-searchbar placeholder="模糊查询用户" v-model="searchInfo"
                   style=" --border-radius: 0 20px 20px 0; padding-left: 80px" @ionChange="getUsers">
    </ion-searchbar>
    <ion-select placeholder="类别" v-model="type"
                style="width: 90px; height:42px; position: absolute; top: 8px; background-color:#ffffff; box-shadow:-1px 1px 1px 0px #969d98; border-radius: 20px 0 0 20px">
      <ion-select-option value="1">用户Id</ion-select-option>
      <ion-select-option value="2">姓名</ion-select-option>
      <ion-select-option value="3">邮箱</ion-select-option>
      <ion-select-option value="4">组织Id</ion-select-option>
    </ion-select>
  </div>

<!--  提示框-->
  <div style="width: 100px; margin: 0 auto;" v-if="getting">获取中...</div>
  <div style="width: 120px; margin: 0 auto;" v-if="noInfo">没有相关用户</div>

  <ion-grid>
    <ion-row>
      <ion-col size="4" v-for="item in users" :key="item.id">
        <ion-card>
          <ion-card-content>
<!--            用户信息展示-->
            <ion-grid>
              <ion-row>
                <ion-col size="4">Id</ion-col>
                <ion-col size="8" class="rolStyle">{{ item.id }}</ion-col>
              </ion-row>
              <ion-row>
                <ion-col size="4">姓名</ion-col>
                <ion-col size="8" class="rolStyle">{{ item.name }}</ion-col>
              </ion-row>
              <ion-row>
                <ion-col size="4">Email</ion-col>
                <ion-col size="8" class="rolStyle">{{ item.email }}</ion-col>
              </ion-row>
              <ion-row>
                <ion-col size="4">用户状态</ion-col>
                <ion-col size="8" class="rolStyle" v-if="item.verified == 0">未验证</ion-col>
                <ion-col size="8" class="rolStyle" v-if="item.verified == 1" style="color: green">已验证</ion-col>
                <ion-col size="8" class="rolStyle" v-if="item.verified == -1" style="color: darkred">已封禁</ion-col>
              </ion-row>
              <ion-row>
                <ion-col size="4">碳积分</ion-col>
                <ion-col size="8" class="rolStyle">{{ item.point }}</ion-col>
              </ion-row>
              <ion-row>
                <ion-col size="4">组织Id</ion-col>
                <ion-col size="8" class="rolStyle">{{ item.orgId }}</ion-col>
              </ion-row>
            </ion-grid>

<!--            按钮-->
            <ion-grid>
              <ion-row>
                <ion-col><ion-button expand="block" style="font-size: 8px" :id="item.id">重置密码</ion-button></ion-col>
                <ion-col><ion-button expand="block" style="font-size: 8px" :id="item.name">修改信息</ion-button></ion-col>
                <ion-col><ion-button expand="block" style="font-size: 8px" color="warning" @click="banVerify(item.id)">封禁用户</ion-button></ion-col>
                <ion-col><ion-button expand="block" style="font-size: 8px" color="success" @click="unBanVerify(item.id)">解禁用户</ion-button></ion-col>
              </ion-row>
            </ion-grid>

<!--            重置密码模态框-->
            <ion-modal :breakpoints="[0, 0.5,  0.75]"
                       :initial-breakpoint="0.50"
                       handle-behavior="cycle"
                       :trigger="item.id" >
              <ion-header>
                <ion-toolbar>
                  <ion-title style=text-align:center>重置密码</ion-title>
                </ion-toolbar>
              </ion-header>
              <ion-content class="ion-padding">
                <ion-item>
                  <ion-label position="floating">密码</ion-label>
                  <ion-input :clear-input="true"  placeholder='请输入密码' v-model="pwd"></ion-input>
                </ion-item>
                <ion-button expand="block" fill="outline" style="margin-top: 15px" @click="reset(item.id)">重置</ion-button>
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
                  <ion-label position="floating">姓名</ion-label>
                  <ion-input :clear-input="true"  placeholder='请输入姓名' v-model="modifyName"></ion-input>
                </ion-item>
                <ion-item>
                  <ion-label position="floating">Email</ion-label>
                  <ion-input :clear-input="true"  placeholder='请输入Email' v-model="modifyEmail"></ion-input>
                </ion-item>
                <ion-item>
                  <ion-label position="floating">组织Id</ion-label>
                  <ion-input :clear-input="true"  placeholder='请输入组织Id' v-model="modifyOrgId"></ion-input>
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
} from '@ionic/vue';
import {defineComponent, ref} from 'vue';
import Cookies from "js-cookie";
import $ from "jquery";



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
  },
  data() {
    return {
      users:[],
      type:'',
      searchInfo:'',
      getting:false,
      noInfo:false,
      progressingTip:false,
      pwd:'',
      modifyName:'',
      modifyEmail:'',
      modifyOrgId:'',
    }
  },
  mounted() {
    this.getUsers();
  },
  methods: {
    async unBanVerify(uid){
      const alert = await alertController.create({
        header: '确认解禁?',
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
        url: 'https://tanmi-api.rexue.plus/users/'+uid+'/unban',
        type: 'patch',
        data: {
        },
        beforeSend: function (request) {
          request.setRequestHeader("Authorization", Cookies.get('adminToken'));
        },
        success: function (data) {
          console.log(data)
          _this.unBanSuccess();
          _this.getUsers();
        },
        error: function (error) {
          console.log(error)
        }
      });
    },
    async banVerify(uid) {
      const alert = await alertController.create({
        header: '确认封禁?',
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
        url: 'https://tanmi-api.rexue.plus/users/'+uid+'/ban',
        type: 'patch',
        data: {
        },
        beforeSend: function (request) {
          request.setRequestHeader("Authorization", Cookies.get('adminToken'));
        },
        success: function (data) {
          console.log(data)
          _this.banSuccess();
          _this.getUsers();
        },
        error: function (error) {
          console.log(error)
        }
      });
    },
    modify(userId){
      if(this.modifyName == '' && this.modifyEmail == '' && this.modifyOrgId == ''){
        this.noModifyInfo();
        return;
      }

      this.progressingTip = true;
      let _this = this;
      $.ajax({
        url: 'https://tanmi-api.rexue.plus/users/'+userId+'/modify',
        type: 'patch',
        data: {
          name:_this.modifyName,
          orgId:_this.modifyOrgId,
          email:_this.modifyEmail,
        },
        beforeSend: function (request) {
          request.setRequestHeader("Authorization", Cookies.get('adminToken'));
        },
        success: function (data) {
          _this.modifySuccess();
          _this.progressingTip = false;
          _this.modifyName = '';
          _this.modifyOrgId = '';
          _this.modifyEmail = '';
          modalController.dismiss();
          _this.getUsers();
        },
        error: function (error) {
          console.log(error)
          _this.wrongTip();
          _this.progressingTip = false;
          _this.modifyName = '';
          _this.modifyOrgId = '';
          _this.modifyEmail = '';
        }
      });
    },
    reset(userId){
      if(this.pwd == ''){
        this.noPwdInfo();
        return;
      }

      this.progressingTip = true;
      let _this = this;
      $.ajax({
        url: 'https://tanmi-api.rexue.plus/users/'+userId+'/reset',
        type: 'patch',
        data: {
          password:_this.pwd,
        },
        beforeSend: function (request) {
          request.setRequestHeader("Authorization", Cookies.get('adminToken'));
        },
        success: function (data) {
          _this.resetSuccess();
          _this.progressingTip = false;
          _this.pwd = '';
          modalController.dismiss();
        },
        error: function (error) {
          console.log(error)
          _this.wrongTip();
          _this.progressingTip = false;
          _this.pwd = '';
        }
      });
    },
    getUsers(){
      let id='';
      let name='';
      let email='';
      let orgId='';
      if(this.type == 1){
        id = this.searchInfo;
      }else if(this.type == 2){
        name = this.searchInfo;
      }else if(this.type == 3){
        email = this.searchInfo;
      }else if(this.type == 4){
        orgId = this.searchInfo;
      }

      this.noInfo = false;
      this.users=[];
      this.getting = true;
      let _this = this;
      $.ajax({
        url: 'https://tanmi-api.rexue.plus/users',
        type: 'get',
        data: {
          id:id,
          orgId:orgId,
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
              verified:'',
              point:'',
              orgId:'',
            }
            info.id = data[i].id;
            info.name = data[i].name;
            info.email = data[i].email;
            info.verified = data[i].is_verified;

            info.point = data[i].point;
            info.orgId = data[i].org.id;
            _this.users.push(info);
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
    async noPwdInfo() {
      const toast = await toastController.create({
        message: '请输入密码!',
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
    async resetSuccess() {
      const toast = await toastController.create({
        message: '重置成功!',
        duration: 1000,
        position: 'bottom',
        color: 'success'
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
        message: '解禁成功!',
        duration: 1000,
        position: 'bottom',
        color: 'success'
      });
      return toast.present();
    },
    async banSuccess() {
      const toast = await toastController.create({
        message: '封禁成功!',
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
  }
})
</script>

<style scoped>
.rolStyle{
  color: black;
}
</style>