<template>
  <ion-header :translucent="true">
    <ion-toolbar>
      <ion-buttons slot="start">
        <ion-menu-button color="primary"></ion-menu-button>
      </ion-buttons>
      <ion-title>管理员管理</ion-title>
    </ion-toolbar>
  </ion-header>


  <ion-content>
    <ion-grid>
      <ion-row>
        <ion-col size="4" >
          <ion-nav-link router-direction="forward" :component="show">
            <ion-card button>
              <ion-card-header>
                <ion-card-title>查看全部任务</ion-card-title>
              </ion-card-header>
              <ion-card-content>可查看全部任务并修改任务信息</ion-card-content>
            </ion-card>
          </ion-nav-link>
        </ion-col>
        <ion-col size="4">
          <ion-card button id="openAdd">
            <ion-card-header>
              <ion-card-title>新增任务</ion-card-title>
            </ion-card-header>
            <ion-card-content>即新增任务</ion-card-content>
          </ion-card>
        </ion-col>
<!--        添加任务模态框-->
        <add></add>


        <ion-col size="4" >
          <ion-nav-link router-direction="forward" :component="userTask">
            <ion-card button id="openFindPwd">
              <ion-card-header>
                <ion-card-title>查看用户任务提交</ion-card-title>
              </ion-card-header>
              <ion-card-content>通过用户任务或驳回</ion-card-content>
            </ion-card>
            <find-pwd></find-pwd>
          </ion-nav-link>
        </ion-col>
      </ion-row>
    </ion-grid>

    <ion-fab slot="fixed" vertical="bottom" horizontal="start" id="info">
      <ion-fab-button>
        <ion-icon :icon="informationOutline"></ion-icon>
      </ion-fab-button>
    </ion-fab>

    <!--      帮助信息-->
    <ion-popover trigger="info" trigger-action="click" side="top">
      <ion-content class="ion-padding">
        <div>
          <div>
            新增任务模板：
          </div>
          <div style="font-size: 12px; color: grey">
            任务名称：完成一次“随手拍”低碳行为
          </div>
          <div style="font-size: 12px; color: grey">
            关联任务：随手拍 (关联任务应与低碳行为名称对应)
          </div>
          <div style="font-size: 12px; color: grey">
            可获积分：5
          </div>
        </div>
      </ion-content>
    </ion-popover>
  </ion-content>
</template>

<script>
import {
  IonHeader, IonTitle, IonToolbar, IonContent, IonNavLink,
  IonButton, IonButtons, IonBackButton,IonMenuButton,
  IonInput, IonIcon,
  IonList, IonItem, IonLabel,
  toastController,
  IonProgressBar,
  IonGrid, IonCol, IonRow,
  IonCard, IonCardHeader, IonCardContent, IonCardTitle, IonCardSubtitle,
  alertController,
  IonRefresher,
  IonPopover,IonFab,IonFabButton,
} from '@ionic/vue';
import {defineComponent, ref} from 'vue';
import Cookies from "js-cookie";
import $ from "jquery";
import show from "@/components/task/show";
import add from "@/components/task/add"
import userTask from "@/components/task/userTask";
import {informationOutline} from 'ionicons/icons'


export default defineComponent({
  name: "AdminNavLink",
  components: {
    add,
    IonHeader, IonTitle, IonToolbar, IonContent, IonNavLink,
    IonButton, IonButtons, IonBackButton,IonMenuButton,
    IonInput, IonIcon,
    IonList, IonItem, IonLabel,
    toastController,
    IonProgressBar,
    IonGrid, IonCol, IonRow,
    IonCard, IonCardHeader, IonCardContent, IonCardTitle, IonCardSubtitle,
    alertController,
    IonRefresher,
    IonPopover,IonFab,IonFabButton,
  },
  data() {
    return {
      show:show,
      userTask:userTask,
    };
  },
  mounted() {
    console.log("mounted测试语句")
  },
  methods: {
    confirmCancel() {
      this.presentConfirm();
    },
    async presentConfirm() {
      const alert = await alertController.create({
        header: '确认注销?注销后账号无法恢复',
        buttons: [
          {
            text: '确认',
            handler: () => {
              this.cancelAdmin();
            },
          },
          {
            text: '返回',
            handler: () => {
              console.log(1)
            },
          },
        ],
      });
      await alert.present();
    },
    cancelAdmin(){
      let id = JSON.parse(Cookies.get('adminInfo')).adminId;
      let _this = this;
      $.ajax({
        url: 'https://tanmi-api.rexue.plus/admins/'+id+'/del',
        type: 'delete',
        data: '',
        beforeSend: function (request) {
          request.setRequestHeader("Authorization", Cookies.get('token'));
        },
        success: function (data) {
          _this.cancelSuccess();
        },
        error: function (error) {
          console.log(error)
        }
      });
    },
    async cancelSuccess() {
      const alert = await alertController.create({
        header: '注销成功!',
        message: '感谢您的贡献!',
        buttons: [
          {
            text: 'OK',
            handler: () => {
              Cookies.remove('adminToken')
              Cookies.remove('adminInfo')
              window.opener = null;
              window.open("about:blank", "_top").close()
              // this.TestifyLogged();
            }
          }],
      });
      await alert.present();
    },
  },
  setup() {
    return {informationOutline}
  }

})
</script>

<style scoped>

</style>