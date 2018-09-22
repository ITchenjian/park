// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import store from './store/';

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import layer from 'vue-layer';

import axios from 'axios';
import {get,post,deleteRequest,postRequest,putRequest} from './api/http';

import  VueQuillEditor from 'vue-quill-editor'
// require styles 引入样式
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';

import './assets/lib/bootstrap.css';
import './assets/css/reset.css';
import './assets/css/baselist.css';
import './assets/css/ele-reset.css';

Vue.use(VueQuillEditor);

Vue.use(ElementUI);


Vue.prototype.$layer = layer(Vue, {
    msgtime: 3
});

Vue.prototype.$post=post;
Vue.prototype.$get=get;

Vue.prototype.$postRequest=postRequest;
Vue.prototype.$putRequest=putRequest;
Vue.prototype.$deleteRequest=deleteRequest;

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})

