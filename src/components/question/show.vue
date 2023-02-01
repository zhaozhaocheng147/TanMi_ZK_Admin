<template>
  <ion-header :translucent="true">
    <ion-toolbar style="--background:#f4f4f5;">
      <ion-buttons slot="start">
        <ion-menu-button color="primary"></ion-menu-button>
        <ion-back-button></ion-back-button>
      </ion-buttons>
      <ion-title>题目信息</ion-title>
    </ion-toolbar>
  </ion-header>
  <!--  搜索-->
  <ion-content>
    <div style="position: relative">
      <ion-searchbar placeholder="查询题目" v-model="searchInfo"
                     style=" --border-radius: 0 20px 20px 0; padding-left: 80px" @ionChange="getTasks">
      </ion-searchbar>
      <ion-select placeholder="类别" v-model="type"
                  style="width: 90px; height:42px; position: absolute; top: 8px; background-color:#ffffff; box-shadow:-1px 1px 1px 0px #969d98; border-radius: 20px 0 0 20px">
        <ion-select-option value="1">关键词</ion-select-option>
        <ion-select-option value="2">Id</ion-select-option>
      </ion-select>
    </div>

    <!--  提示框-->
    <div style="width: 100px; margin: 0 auto;" v-if="getting">获取中...</div>
    <div style="width: 120px; margin: 0 auto;" v-if="noInfo">没有相关问题</div>

    <ion-grid>
      <ion-row>
        <ion-col size="6" v-for="item in tasks" :key="item.id">
          <ion-card>
            <ion-card-content>
              <!--            权益展示-->
              <ion-grid>
                <ion-row>
                  <ion-col size="4">Id</ion-col>
                  <ion-col size="8" class="rolStyle">{{ item.id }}</ion-col>
                </ion-row>
                <ion-row>
                  <ion-col size="4">题干</ion-col>
                  <ion-col size="8" class="rolStyle">{{ item.subject }}</ion-col>
                </ion-row>
                <ion-row>
                  <ion-col size="4">A选项</ion-col>
                  <ion-col size="8" class="rolStyle">{{ item.a }}</ion-col>
                </ion-row>
                <ion-row>
                  <ion-col size="4">B选项</ion-col>
                  <ion-col size="8" class="rolStyle">{{ item.b }}</ion-col>
                </ion-row>
                <ion-row>
                  <ion-col size="4">C选项</ion-col>
                  <ion-col size="8" class="rolStyle" v-if="item.c!=''">{{ item.c }}</ion-col>
                  <ion-col size="8" class="rolStyle" v-if="item.c==''">无</ion-col>
                </ion-row>
                <ion-row>
                  <ion-col size="4">D选项</ion-col>
                  <ion-col size="8" class="rolStyle" v-if="item.d!=''">{{ item.d }}</ion-col>
                  <ion-col size="8" class="rolStyle" v-if="item.d==''">无</ion-col>
                </ion-row>
                <ion-row>
                  <ion-col size="4">答案</ion-col>
                  <ion-col size="8" class="rolStyle" v-if="item.answer!=''">{{ item.answer }}</ion-col>
                  <ion-col size="8" class="rolStyle" v-if="item.answer==''">无</ion-col>
                </ion-row>
                <ion-row>
                  <ion-col size="4">关键词</ion-col>
                  <ion-col size="8" class="rolStyle" v-if="item.key!=''">{{ item.key }}</ion-col>
                  <ion-col size="8" class="rolStyle" v-if="item.key==''">无</ion-col>
                </ion-row>

              </ion-grid>

              <!--            按钮-->
              <ion-grid>
                <ion-row>
                  <ion-col><ion-button expand="block" style="font-size: 8px" :id="item.id">修改题目</ion-button></ion-col>
                  <ion-col><ion-button expand="block" style="font-size: 8px" color="warning" @click="banVerify(item.id)">删除题目</ion-button></ion-col>
                </ion-row>
              </ion-grid>

              <!--            修改信息模态框-->
              <ion-modal :breakpoints="[0, 0.8,  0.9]"
                         :initial-breakpoint="0.8"
                         handle-behavior="cycle"
                         :trigger="item.id" >
                <ion-header>
                  <ion-toolbar>
                    <ion-title style=text-align:center>修改题目</ion-title>
                  </ion-toolbar>
                </ion-header>
                <ion-content class="ion-padding">
                  <form @submit="modify($event,item)">
                    <ion-item>
                      <ion-label position="floating">题干</ion-label>
                      <ion-input :clear-input="true"  placeholder='请输入题干' required  v-model="modifySubject"></ion-input>
                    </ion-item>
                    <ion-item>
                      <ion-label position="floating">选项A</ion-label>
                      <ion-input :clear-input="true"  placeholder='请输入选项A' required  v-model="modifyA"></ion-input>
                    </ion-item>
                    <ion-item>
                      <ion-label position="floating">选项B</ion-label>
                      <ion-input :clear-input="true"  placeholder='请输入选项B' required :value="item.b" v-model="modifyB"></ion-input>
                    </ion-item>
                    <ion-item>
                      <ion-label position="floating">选项C</ion-label>
                      <ion-input :clear-input="true"  placeholder='选填' :value="item.c" v-model="modifyC"></ion-input>
                    </ion-item>
                    <ion-item>
                      <ion-label position="floating">选项D</ion-label>
                      <ion-input :clear-input="true"  placeholder='选填' :value="item.d" v-model="modifyD"></ion-input>
                    </ion-item>
                    <ion-item>
                      <ion-label position="floating">解析</ion-label>
                      <ion-input :clear-input="true"  placeholder='选填' :value="item.desc" v-model="modifyDesc"></ion-input>
                    </ion-item>
                    <ion-item>
                      <ion-label position="floating">答案</ion-label>
                      <ion-input :clear-input="true"  placeholder='请输答案 ' required :value="item.answer" v-model="modifyAnswer"></ion-input>
                    </ion-item>
                    <ion-button type="submit" expand="block" fill="outline" style="margin-top: 15px">修改</ion-button>
                    <ion-progress-bar type="indeterminate" v-show="progressingTip"></ion-progress-bar>
                  </form>
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
      amount:'',
      modifySubject:'',
      modifyA:'',
      modifyB:'',
      modifyC:'',
      modifyD:'',
      modifyDesc:'',
      modifyAnswer:'',

    }
  },
  mounted() {
    this.getTasks();
  },
  methods: {
    async banVerify(uid){
      const alert = await alertController.create({
        header: '确认删除?',
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
        url: 'https://tanmi-api.rexue.plus/questions/'+uid+'/delete',
        type: 'delete',
        data: {
        },
        beforeSend: function (request) {
          request.setRequestHeader("Authorization", Cookies.get('adminToken'));
        },
        success: function (data) {
          _this.unBanSuccess();
          _this.getTasks();
        },
        error: function (error) {
          console.log(error)
        }
      });
    },

    modify(e,item){
      e.preventDefault();//阻止提交
      this.progressingTip = true;
      let _this = this;
      $.ajax({
        url: 'https://tanmi-api.rexue.plus/questions/'+item.id+'/modify',
        type: 'patch',
        data: {
          subject:_this.modifySubject,
          optionA:_this.modifyA,
          optionB:_this.modifyB,
          optionC:_this.modifyC,
          optionD:_this.modifyD,
          answer:_this.modifyAnswer,
          desc:_this.modifyDesc,
        },
        beforeSend: function (request) {
          request.setRequestHeader("Authorization", Cookies.get('adminToken'));
        },
        success: function (data) {
          _this.modifySuccess();
          _this.progressingTip = false;

          modalController.dismiss();
          _this.getTasks();
        },
        error: function (error) {
          _this.wrongTip();
          _this.progressingTip = false;

        }
      });
    },

    getTasks(){
      let key='';
      if(this.type == 1){
        key = this.searchInfo;
      }else if(this.type == 2  && this.searchInfo !=''){
        this.getTaskById(this.searchInfo);
        return;
      }

      this.noInfo = false;
      this.tasks=[];
      this.getting = true;
      let _this = this;
      $.ajax({
        url: 'https://tanmi-api.rexue.plus/questions',
        type: 'get',
        data: {
          key:key,
        },
        beforeSend: function (request) {
          request.setRequestHeader("Authorization", Cookies.get('adminToken'));
        },
        success: function (data) {
          for (let i = 0; i < data.length; i++) {
            let info = {
              id:'',
              subject:'',
              a:'',
              b:'',
              c:'',
              d:'',
              answer:'',
              desc:'',
              key:'',
            }
            info.id = data[i].id;
            info.subject = data[i].subject;
            info.a = data[i].option_a;
            info.b = data[i].option_b;
            info.c = data[i].option_c;
            info.d = data[i].option_d;
            info.answer = data[i].answer;
            info.desc = data[i].desc;
            info.key = data[i].key;
            _this.tasks.push(info);
          }
          console.log(_this.tasks)
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
        url: 'https://tanmi-api.rexue.plus/questions/'+tid,
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
            subject:'',
            a:'',
            b:'',
            c:'',
            d:'',
            answer:'',
            desc:'',
            key:'',
          }
          info.id = data.id;
          info.subject = data.subject;
          info.a = data.option_a;
          info.b = data.option_b;
          info.c = data.option_c;
          info.d = data.option_d;
          info.answer = data.answer;
          info.desc = data.desc;
          info.key = data.key;
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
        message: '删除成功!',
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