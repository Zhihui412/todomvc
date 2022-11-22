import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import VueAxios from 'vue-axios'

Vue.config.productionTip = false

Vue.use(VueAxios,axios)
// axios.defaults.baseURL = '/api';
axios.defaults.baseURL = 'http://175.178.174.164:8090';

new Vue({
  render: h => h(App),
}).$mount('#app')
