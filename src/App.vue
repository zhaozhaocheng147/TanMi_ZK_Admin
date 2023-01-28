<template>
  <ion-app>
      <ion-split-pane content-id="main-content" style="--side-width: 300px;">
        <ion-menu content-id="main-content" type="overlay" >
          <ion-content>
            <ion-list id="inbox-list">
  <!--            账号相关显示-->
              <div>
                <ion-list-header v-if="noLog" id="OpenLogin" onmouseover="this.style.color='#a40e1b'" onmouseout="this.style.color='#808080'">登录</ion-list-header>
                <ion-list-header v-if="isLog" >{{ adminId }}</ion-list-header>
                <ion-item lines="full" v-if="isLog">
<!--                  <ion-label style="color: grey; font-size: 14px; " v-if="noLog" router-direction="root" router-link="/Administrator/adminRegister">注册账号</ion-label>-->
                  <span onmouseover="this.style.color='#a40e1b'" onmouseout="this.style.color='#808080'" style=" color: grey; font-size: 14px; "  @click="logOut">退出登录</span>
                </ion-item>
              </div>

<!--              管理员登录模态框-->
              <ion-modal :breakpoints="[0, 0.5,  0.75]"
                         :initial-breakpoint="0.50"
                         handle-behavior="cycle"
                         trigger="OpenLogin">
                <ion-header>
                  <ion-toolbar>
                    <ion-title style=text-align:center>欢迎登录碳觅</ion-title>
                  </ion-toolbar>
                </ion-header>
                <ion-content class="ion-padding">
                  <ion-item>
                    <ion-label position="floating">管理员Id</ion-label>
                    <ion-input placeholder='请输入用户ID' v-model="adminId"></ion-input>
                  </ion-item>
                  <ion-item>
                    <ion-label position="floating">密码</ion-label>
                    <ion-input :type="PWShow" placeholder='请输入密码' v-model="adminPwd"></ion-input>
                    <a href="javascript:;" rel="external nofollow" @click="ParsePWshow" slot="end" style="margin-top: 20px">
                      <ion-icon :icon="eyeOutline" color="dark" style="font-size: 20px" v-show="PWShow == 'password'"></ion-icon>
                      <!--睁眼-->
                      <ion-icon :icon="eyeOffOutline" color="dark" style="font-size: 20px" v-show="PWShow == 'text'"></ion-icon>
                      <!--闭眼-->
                    </a>
                  </ion-item>
                  <ion-button expand="block" fill="outline" style="margin-top: 15px" @click="Login">登录</ion-button>
                  <ion-progress-bar type="indeterminate" v-show="progressingTip"></ion-progress-bar>
                </ion-content>
              </ion-modal>


              <ion-menu-toggle auto-hide="false" >
                <ion-item button router-direction="root" router-link="/Administrator/Admin" lines="none" detail="false" class="hydrated" :disabled="noLog">
                  <!--                <ion-icon slot="start" :ios="p.iosIcon" :md="p.mdIcon"></ion-icon>-->
                  <ion-label>管理员</ion-label>
                </ion-item>
                <ion-item button router-direction="root" router-link="/Administrator/User" lines="none" detail="false" class="hydrated" :disabled="noLog">
  <!--                <ion-icon slot="start" :ios="p.iosIcon" :md="p.mdIcon"></ion-icon>-->
                  <ion-label>用户</ion-label>
                </ion-item>
                <ion-item button router-direction="root" router-link="/Administrator/Task" lines="none" detail="false" class="hydrated" :disabled="noLog">
                  <ion-label>任务</ion-label>
                </ion-item>
<!--                <ion-item button lines="none" detail="false" class="hydrated" :disabled="noLog">-->
<!--                  <ion-label>碳积分</ion-label>-->
<!--                </ion-item>-->
                <ion-item button lines="none" router-link="/Administrator/Behavior" detail="false" class="hydrated" :disabled="noLog">
                  <ion-label>低碳行为</ion-label>
                </ion-item>
                <ion-item button lines="none" detail="false" class="hydrated" :disabled="noLog">
                  <ion-label>权益</ion-label>
                </ion-item>
                <ion-item button lines="none" detail="false" class="hydrated" :disabled="noLog">
                  <ion-label>科普问答</ion-label>
                </ion-item>
                <ion-item button lines="none" detail="false" class="hydrated" :disabled="noLog">
                  <ion-label>徽章</ion-label>
                </ion-item>
                <ion-item button router-direction="root" router-link="/Administrator/Hello" lines="none" detail="false" class="hydrated" >
                  <ion-label>应用信息</ion-label>
                </ion-item>
              </ion-menu-toggle>
            </ion-list>
          </ion-content>
        </ion-menu>

        <ion-router-outlet id="main-content"></ion-router-outlet>

      </ion-split-pane>
  </ion-app>
</template>

<script >
import {
  IonApp,
  IonContent,
  IonIcon,
  IonItem, IonLabel,IonInput,
  IonList, IonListHeader,
  IonMenu,
  IonMenuToggle,
  IonNote,
  IonRouterOutlet,
  IonSplitPane,
  IonNav,
  IonModal,
  alertController,
  IonProgressBar,
} from '@ionic/vue';
import {defineComponent, ref } from 'vue';
import UserNavLink from "@/navLink/UserNavLink";
import Cookies from "js-cookie";
import $ from "jquery";
import {eyeOutline, eyeOffOutline} from "ionicons/icons";

export default defineComponent({
  name: 'App',
  components: {
    IonApp,
    IonContent,
    IonIcon,
    IonItem, IonLabel,IonInput,
    IonList, IonListHeader,
    IonMenu, IonMenuToggle, IonNote,
    IonRouterOutlet,
    IonSplitPane,
    IonNav,
    IonModal,
    alertController,
    IonProgressBar
  },
  data() {
    return {
      UserNavLink:UserNavLink,
      noLog:true,
      isLog:false,
      adminId:'',
      adminPwd:'',
      progressingTip: false,
      PWShow: 'password',
    };
  },
  mounted() {
    this.TestifyLogged(Cookies.get('token'));
    if (Cookies.get('adminToken') !== undefined || Cookies.get('adminInfo') !== undefined) {
      this.adminId = JSON.parse(Cookies.get('adminInfo')).adminId;
    }
  },
  methods:{
    Login(){
      const params = new URLSearchParams();
      params.append('id', this.adminId);
      params.append('password', this.adminPwd);
      this.progressingTip = true;
      this.$axios.post('https://tanmi-api.rexue.plus/admins/login', params)
          .then(res => {
            if (res.status == 200) {
              this.progressingTip = false;
              Cookies.set('adminToken', res.headers['authorization'], {expires: 30});
              console.log(Cookies.get('token'))
              Cookies.set('adminInfo', JSON.stringify({
                'adminId': this.adminId,
                'adminPwd': this.adminPwd
              }), {expires: 30});
              this.PresentSuccessAlert();
            }
          }, err => {
            this.progressingTip = false;
            this.PresentFalseAlert();
            console.log(err);
          })
    },

    async PresentSuccessAlert() {
      const alert = await alertController.create({
        header: '登录成功',
        message: this.adminId + ' 欢迎！',
        buttons: [
          {
            text: 'OK',
            handler: () => {
              location.reload();
              // this.TestifyLogged();
            }
          }],
      });
      await alert.present();
    },
    async logOut() {
      const warnAlert = await alertController.create({
        header: '确定退出吗？',
        buttons: [
          '取消',
          {
            text: '确定',
            handler: async () => {
              this.adminId = "";
              this.adminPwd = "";
              Cookies.remove('adminToken')
              Cookies.remove('adminInfo')
              this.TestifyLogged();
              const alert = await alertController.create({
                header: '退出成功',
                message: '期待下次与您相遇。',
                buttons: [
                  {
                    text: 'OK',
                    handler: () => {
                      location.href="/Administrator/Hello";
                    }
                  }
                ],
              });
              await alert.present();
            }
          }
        ],
      });
      await warnAlert.present();
    },
    async PresentFalseAlert() {
      const alert = await alertController.create({
        header: '登录失败',
        message: '请检查管理员Id/密码是否正确！',
        buttons: ['OK'],
      });
      await alert.present();
    },
    TestifyLogged() {
      if (Cookies.get('adminToken') !== undefined || Cookies.get('adminInfo') !== undefined) {
        this.isLog = true;
        this.noLog = false;
      } else {
        // 未登录
        this.isLog = false;
        this.noLog = true;
      }
    },
    //显示、隐藏密码
    ParsePWshow() {
      if (this.PWShow == 'password')
        this.PWShow = 'text';
      else
        this.PWShow = 'password';
    },
  },
  setup() {
    return {eyeOutline, eyeOffOutline};
  }

})
</script>

<style scoped>
ion-menu ion-content {
  --background: var(--ion-item-background, var(--ion-background-color, #fff));
}

ion-menu.md ion-content {
  --padding-start: 8px;
  --padding-end: 8px;
  --padding-top: 20px;
  --padding-bottom: 20px;
}

ion-menu.md ion-list {
  padding: 20px 0;
}

ion-menu.md ion-note {
  margin-bottom: 30px;
}

ion-menu.md ion-list-header,
ion-menu.md ion-note {
  padding-left: 10px;
}

ion-menu.md ion-list#inbox-list {
  border-bottom: 1px solid var(--ion-color-step-150, #d7d8da);
}

ion-menu.md ion-list#inbox-list ion-list-header {
  font-size: 22px;
  font-weight: 600;

  min-height: 20px;
}

ion-menu.md ion-list#labels-list ion-list-header {
  font-size: 16px;

  margin-bottom: 18px;

  color: #757575;

  min-height: 26px;
}

ion-menu.md ion-item {
  --padding-start: 10px;
  --padding-end: 10px;
  border-radius: 4px;
}

ion-menu.md ion-item.selected {
  --background: rgba(var(--ion-color-primary-rgb), 0.14);
}

ion-menu.md ion-item.selected ion-icon {
  color: var(--ion-color-primary);
}

ion-menu.md ion-item ion-icon {
  color: #616e7e;
}

ion-menu.md ion-item ion-label {
  font-weight: 500;
}

ion-menu.ios ion-content {
  --padding-bottom: 20px;
}

ion-menu.ios ion-list {
  padding: 20px 0 0 0;
}

ion-menu.ios ion-note {
  line-height: 24px;
  margin-bottom: 20px;
}

ion-menu.ios ion-item {
  --padding-start: 16px;
  --padding-end: 16px;
  --min-height: 50px;
}

ion-menu.ios ion-item.selected ion-icon {
  color: var(--ion-color-primary);
}

ion-menu.ios ion-item ion-icon {
  font-size: 24px;
  color: #73849a;
}

ion-menu.ios ion-list#labels-list ion-list-header {
  margin-bottom: 8px;
}

ion-menu.ios ion-list-header,
ion-menu.ios ion-note {
  padding-left: 16px;
  padding-right: 16px;
}

ion-menu.ios ion-note {
  margin-bottom: 8px;
}

ion-note {
  display: inline-block;
  font-size: 16px;

  color: var(--ion-color-medium-shade);
}

ion-item.selected {
  --color: var(--ion-color-primary);
}
</style>
