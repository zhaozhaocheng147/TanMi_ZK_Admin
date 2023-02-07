<template>
  <!--              管理员登录模态框-->
  <ion-modal :breakpoints="[0, 0.5,  0.75]"
             :initial-breakpoint="0.50"
             handle-behavior="cycle"
             trigger="resetPwd">
    <ion-header>
      <ion-toolbar>
        <ion-title style=text-align:center>重置密码</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <ion-item>
        <ion-label position="floating">密码</ion-label>
        <ion-input placeholder='请输入密码' v-model="pwd"></ion-input>
      </ion-item>
      <ion-button expand="block" fill="outline" style="margin-top: 15px" @click="reset">重置</ion-button>
      <ion-progress-bar type="indeterminate" v-show="progressingTip"></ion-progress-bar>
    </ion-content>
  </ion-modal>
</template>

<script>
import {
  IonHeader, IonTitle, IonToolbar, IonContent, IonNavLink,
  IonButton, IonButtons, IonBackButton,
  IonInput, IonIcon,
  IonList, IonItem, IonLabel,
  toastController,
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
  name: "resetPwd",
  components: {
    IonHeader, IonTitle, IonToolbar, IonContent, IonNavLink,
    IonButton, IonButtons, IonBackButton,
    IonInput, IonIcon,
    IonList, IonItem, IonLabel,
    toastController,
    IonProgressBar,
    IonGrid, IonCol, IonRow,
    IonCard, IonCardHeader, IonCardContent, IonCardTitle, IonCardSubtitle,
    IonSearchbar, IonSelect, IonSelectOption,
    IonModal, modalController
  },
  data() {
    return {
      progressingTip:false,
    }
  },
  mounted() {
    console.log("mounted测试语句")
  },
  methods: {
    async showTip() {
      const toast = await toastController.create({
        message: '请先进行登录!',
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

</style>