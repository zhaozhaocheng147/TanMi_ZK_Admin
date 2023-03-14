<template>
<!--  搜索-->
  <div style="position: relative">
    <ion-searchbar placeholder="模糊查询用户" v-model="searchInfo"
                   style=" --border-radius: 0 20px 20px 0; padding-left: 80px" @ionChange="getUsers" debounce="1200">
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
<!--  <div style="width: 100px; margin: 0 auto;" v-if="getting">获取中...</div>-->
<!--  <div style="width: 120px; margin: 0 auto;" v-if="noInfo">没有相关用户</div>-->

  <v-app>
    <v-container>
      <div style="width: 120px; margin: 0 auto;" v-if="noInfo">没有相关用户</div>
      <ion-progress-bar v-if="getting" type="indeterminate" color="medium"></ion-progress-bar>
      <v-data-table
          v-model:items-per-page="itemsPerPage"
          :headers="headers"
          :items="users"
          item-value="id"
          class="elevation-1"
      >
        <template v-slot:item.action="{ item }">
          <ion-grid style="width:200px; padding: 10px 0 10px 0">
            <ion-row>
              <ion-col><ion-button fill="outline" size="small" @click="verifyReset(item.raw.id)">重置密码</ion-button></ion-col>
              <ion-col><ion-button fill="outline" size="small" @click="verifyModify(item.raw.id)">修改信息</ion-button></ion-col>
            </ion-row>
            <ion-row>
              <ion-col><ion-button fill="outline" size="small" color="danger" @click="verifyBan(item.raw.id)">封禁用户</ion-button></ion-col>
              <ion-col><ion-button fill="outline" size="small" color="tertiary" @click="verifyUnBan(item.raw.id)">解禁用户</ion-button></ion-col>
            </ion-row>
          </ion-grid>
        </template>
      </v-data-table>
    </v-container>
  </v-app>
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

      itemsPerPage: 5,
      headers: [
        {
          title: 'Id',
          align: 'middle',
          sortable: false,
          key: 'id',
        },
        { title: '姓名', align: 'middle', key: 'name' },
        { title: '邮箱', align: 'middle', key: 'email' },
        { title: '状态', align: 'middle', key: 'verified' },
        { title: '碳积分', align: 'middle', key: 'point' },
        { title: '组织Id', align: 'middle', key: 'orgId' },
        { title: ' ', align: 'middle', key:'action' },
      ],
    }
  },
  mounted() {
    this.getUsers();
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
        url: 'https://tanmi-api.rexue.plus/users/'+id+'/unban',
        type: 'patch',
        data: {
        },
        beforeSend: function (request) {
          request.setRequestHeader("Authorization", Cookies.get('adminToken'));
        },
        success: function (data) {
          _this.successUnBan();
          _this.getting = false;
          for(let i = 0; i<_this.users.length; i++){
            if(_this.users[i].id === id){
              _this.users[i].verified = "未验证";
            }
          }
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
        url: 'https://tanmi-api.rexue.plus/users/'+id+'/ban',
        type: 'patch',
        data: {
        },
        beforeSend: function (request) {
          request.setRequestHeader("Authorization", Cookies.get('adminToken'));
        },
        success: function (data) {
          _this.successBan();
          _this.getting = false;
          for(let i = 0; i<_this.users.length; i++){
            if(_this.users[i].id === id){
              _this.users[i].verified = "已封禁";
            }
          }
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
            placeholder: '请输入修改后的姓名...',
          },
          {
            type: 'text',
            placeholder: '请输入修改后的组织Id...',
          },
          {
            type: 'text',
            placeholder: '请输入修改后的邮箱...',
          },
        ],
      });
      await alert.present();
    },
    modify(alertData, id){
      let name = alertData[0];
      let orgId = alertData[1];
      let email = alertData[2];
      console.log(alertData)

      if(name == '' &&email == '' &&orgId == ''){
        this.noInfoTip2();
        return;
      }
      alertController.dismiss();
      this.getting = true;
      let _this = this;
      $.ajax({
        url: 'https://tanmi-api.rexue.plus/users/'+id+'/modify',
        type: 'patch',
        data: {
          name:name,
          orgId:orgId,
          email:email,
        },
        beforeSend: function (request) {
          request.setRequestHeader("Authorization", Cookies.get('adminToken'));
        },
        success: function (data) {
          _this.successModify();
          _this.getting = false;
          _this.getUsers();
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
            placeholder: '请输入重置后的密码...',
          },
        ],
      });
      await alert.present();
    },
    resetPwd(alertData,id){
      let pwd = alertData[0];
      if(pwd == ''){
        this.noInfoTip2();
        return;
      }

      this.getting = true;
      let _this = this;
      alertController.dismiss();
      $.ajax({
        url: 'https://tanmi-api.rexue.plus/users/'+id+'/modify/pwd',
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
    // async unBanVerify(uid){
    //   const alert = await alertController.create({
    //     header: '确认解禁?',
    //     buttons: [
    //       {
    //         text: '确认',
    //         handler: () => {
    //           this.unBan(uid);
    //         },
    //       },
    //       {
    //         text: '返回',
    //       },
    //     ],
    //   });
    //   await alert.present();
    // },
    // unBan(uid){
    //   for(let i = 0; i<this.users.length; i++){
    //     if(this.users[i].id == uid){
    //       this.users[i].flag = true;
    //     }
    //   }
    //
    //   let _this = this;
    //   $.ajax({
    //     url: 'https://tanmi-api.rexue.plus/users/'+uid+'/unban',
    //     type: 'patch',
    //     data: {
    //     },
    //     beforeSend: function (request) {
    //       request.setRequestHeader("Authorization", Cookies.get('adminToken'));
    //     },
    //     success: function (data) {
    //       console.log(data)
    //       _this.unBanSuccess();
    //       for(let i = 0; i<_this.users.length; i++){
    //         if(_this.users[i].id == uid){
    //           _this.users[i].flag = false;
    //           _this.users[i].verified = 0;
    //         }
    //       }
    //     },
    //     error: function (error) {
    //       console.log(error)
    //     }
    //   });
    // },
    // async banVerify(uid) {
    //   const alert = await alertController.create({
    //     header: '确认封禁?',
    //     buttons: [
    //       {
    //         text: '确认',
    //         handler: () => {
    //           this.ban(uid);
    //         },
    //       },
    //       {
    //         text: '返回',
    //       },
    //     ],
    //   });
    //   await alert.present();
    // },
    // ban(uid){
    //   for(let i = 0; i<this.users.length; i++){
    //     if(this.users[i].id == uid){
    //       this.users[i].flag = true;
    //     }
    //   }
    //
    //   let _this = this;
    //   $.ajax({
    //     url: 'https://tanmi-api.rexue.plus/users/'+uid+'/ban',
    //     type: 'patch',
    //     data: {
    //     },
    //     beforeSend: function (request) {
    //       request.setRequestHeader("Authorization", Cookies.get('adminToken'));
    //     },
    //     success: function (data) {
    //       console.log(data)
    //       _this.banSuccess();
    //       for(let i = 0; i<_this.users.length; i++){
    //         if(_this.users[i].id == uid){
    //           _this.users[i].flag = false;
    //           _this.users[i].verified = -1;
    //         }
    //       }
    //     },
    //     error: function (error) {
    //       console.log(error)
    //     }
    //   });
    // },
    // modify(userId){
    //   if(this.modifyName == '' && this.modifyEmail == '' && this.modifyOrgId == ''){
    //     this.noModifyInfo();
    //     return;
    //   }
    //
    //   this.progressingTip = true;
    //   let _this = this;
    //   $.ajax({
    //     url: 'https://tanmi-api.rexue.plus/users/'+userId+'/modify',
    //     type: 'patch',
    //     data: {
    //       name:_this.modifyName,
    //       orgId:_this.modifyOrgId,
    //       email:_this.modifyEmail,
    //     },
    //     beforeSend: function (request) {
    //       request.setRequestHeader("Authorization", Cookies.get('adminToken'));
    //     },
    //     success: function (data) {
    //       _this.modifySuccess();
    //       _this.progressingTip = false;
    //       modalController.dismiss();
    //       for(let i = 0; i<_this.users.length; i++){
    //         if(_this.users[i].id == userId){
    //           if(_this.modifyName !== ''){
    //             _this.users[i].name  = _this.modifyName;
    //           }
    //           if(_this.modifyEmail !== ''){
    //             _this.users[i].email  = _this.modifyEmail;
    //           }
    //           if(_this.modifyOrgId !== ''){
    //             _this.users[i].orgId  = _this.modifyOrgId;
    //           }
    //         }
    //       }
    //       _this.modifyName = '';
    //       _this.modifyOrgId = '';
    //       _this.modifyEmail = '';
    //     },
    //     error: function (error) {
    //       console.log(error)
    //       _this.wrongTip();
    //       _this.progressingTip = false;
    //       _this.modifyName = '';
    //       _this.modifyOrgId = '';
    //       _this.modifyEmail = '';
    //     }
    //   });
    // },
    // reset(userId){
    //   if(this.pwd == ''){
    //     this.noPwdInfo();
    //     return;
    //   }
    //
    //   this.progressingTip = true;
    //   let _this = this;
    //   $.ajax({
    //     url: 'https://tanmi-api.rexue.plus/users/'+userId+'/reset',
    //     type: 'patch',
    //     data: {
    //       password:_this.pwd,
    //     },
    //     beforeSend: function (request) {
    //       request.setRequestHeader("Authorization", Cookies.get('adminToken'));
    //     },
    //     success: function (data) {
    //       _this.resetSuccess();
    //       _this.progressingTip = false;
    //       _this.pwd = '';
    //       modalController.dismiss();
    //     },
    //     error: function (error) {
    //       console.log(error)
    //       _this.wrongTip();
    //       _this.progressingTip = false;
    //       _this.pwd = '';
    //     }
    //   });
    // },
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
              index:'',
              id:'',
              name:'',
              email:'',
              verified:'',
              point:'',
              orgId:'',
              flag:false,
            }
            info.index = i;
            info.id = data[i].id;
            info.name = data[i].name;
            info.email = data[i].email;
            info.verified = data[i].is_verified;
            if(info.verified === 1){
              info.verified = "已验证"
            }
            if(info.verified === 0){
              info.verified = "未验证"
            }
            if(info.verified === -1){
              info.verified = "已封禁"
            }

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
  }
})
</script>

<style scoped>
.rolStyle{
  color: black;
}

.my_class td{
  font-size: small!important;
  height: 0!important;
  padding: 1px!important;
}
</style>