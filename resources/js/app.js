/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

require('./bootstrap');
window.Vue = require('vue');
import { Form } from 'vform';
import Swal from 'sweetalert2';
import VueProgressBar from 'vue-progressbar';
import Vue from 'vue';

// Vue.component(HasError.name, HasError);
// Vue.component(AlertError.name, AlertError);
Vue.component('pagination', require('laravel-vue-pagination'));
Vue.component('product-component', require('./components/ProductComponent.vue').default);

//Progress Bar
const options = {
    color: '#3490dc',
    failedColor: '#874b4b',
    thickness: '5px',
    transition: {
      speed: '1s',
      opacity: '0.6s',
      termination: 1000
    },
    autoRevert: true,
    location: 'top',
    inverse: false
  }

  Vue.use(VueProgressBar, options)


//Toast Message Alert
const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  })


  //Global Variable
window.Swal = Swal;
window.Toast = Toast;
window.Form = Form;

const app = new Vue({
    el: '#app',
});
