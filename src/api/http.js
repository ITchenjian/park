/*
* @Author: Administrator
* @Date:   2018-08-27 09:38:51
* @Last Modified by:   Administrator
* @Last Modified time: 2018-09-17 10:33:08
*/
// import Router from 'vue-router'
import Cookies from 'js-cookie';
import axios from 'axios';
import {Message,MessageBox,Notification,Loading} from 'element-ui';
import store from '@/store';

var mainAxios = axios.create();

mainAxios.defaults.timeout=10000;
mainAxios.defaults.baseURI='';

let loading;
//http request 拦截器
mainAxios.interceptors.request.use(
  config => {

    // console.log(config)
    config.data = JSON.stringify(config.data);
    config.headers = {
      'Content-Type':'application/x-www-form-urlencoded;charset=utf-8'
    }

    if (Cookies.get('Authorization')) {
  	    config.headers.Authorization ='Bearer '+Cookies.get('Authorization'); 
  	} else {
  	    config.headers.Authorization = 'Basic dnVlOnZ1ZQ=='; 
  	}


    // loading=Loading.service();
    return config;
  },
  error => {
    return Promise.reject(err);
  }
);

//http response 拦截器
mainAxios.interceptors.response.use(
  response => {

  	const res = response.data

    /*if(response.data.status ==2){
    	console.log(this)
      	router.push({
        	path:"/login",
        	querry:{redirect:router.currentRoute.fullPath}//从哪个页面跳转
      	})
    }
    // loading.close();
    return response;*/

    if (response.status !== 200 && res.status !== 200) {
      	Message({
        	message: res.message,
        	type: 'error',
        	duration: 3 * 1000
      	})
    } else {
      	return response.data
    }

  },
  error => {

    const response = error.response;
    if (response === undefined) {
      Message({
        message: '服务请求超时！',
        type: 'error',
        duration: 3 * 1000
      })
      return Promise.reject(error)
    }
    if (response.status === 400  && response.data.error == 'invalid_grant') {
      Message({
        message: '账户或密码错误！',
        type: 'warning'
      })
      return Promise.reject('error')
    }

    const info = response.data;
    if (response.status === 401 && info.status === 40101) {
      MessageBox.confirm('认证过期，可以取消继续留在该页面，或者重新登录', '确定退出', {
        confirmButtonText: '重新登录',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
          Cookies.remove('Authorization');
          location.reload();
        /*store.dispatch('LogOut').then(() => {
          Cookies.remove('userName');
          location.reload()
        })*/
      })
    }
    if (response.status === 401 && info.status === 40001) {
      Notification.warning({
        title: '禁止',
        message: info.message,
        type: 'error',
        duration: 2 * 1000
      })
      return Promise.reject('error')
    }

    if (response.status === 500 && info.status === 500) {
      Message({
        message: '后端服务异常，请联系管理员！',
        type: 'error',
        duration: 3 * 1000
      })
      return Promise.reject(error)
    }

    if (response.status === 403) {
      Notification.warning({
        title: '禁止',
        message: info.message,
        type: 'error',
        duration: 2 * 1000
      })
      return Promise.reject('error')
    }
    if (info.status === 30101) {
      Notification.warning({
        title: '失败',
        message: info.message,
        type: 'error',
        duration: 2 * 1000
      })
      return Promise.reject('error')
    }
    if (response.status === 504) {
      Message({
        message: '后端服务异常，请联系管理员！',
        type: 'error',
        duration: 3 * 1000
      })
      return Promise.reject(error)
    }
    /*Message({
      message: info.message,
      type: 'error',
      duration: 5 * 1000
    })*/

    return Promise.reject(error)
  }
);


var parkAxios = axios.create();

parkAxios.defaults.timeout=10000;
parkAxios.defaults.baseURI='';

//http request 拦截器
parkAxios.interceptors.request.use(
  config => {

    // console.log(config)
    config.data = JSON.stringify(config.data);
    config.headers = {
      'Content-Type':'application/json;charset=utf-8'
    }

    if (Cookies.get('Authorization')) {
        config.headers.Authorization ='Bearer '+Cookies.get('Authorization'); 
    } else {
        config.headers.Authorization = 'Basic dnVlOnZ1ZQ=='; 
    }


    // loading=Loading.service();
    return config;
  },
  error => {
    return Promise.reject(err);
  }
);

//http response 拦截器
parkAxios.interceptors.response.use(
  response => {

    const res = response.data

    /*if(response.data.status ==2){
      console.log(this)
        router.push({
          path:"/login",
          querry:{redirect:router.currentRoute.fullPath}//从哪个页面跳转
        })
    }
    // loading.close();
    return response;*/

    if (response.status !== 200 && res.status !== 200) {
        Message({
          message: res.message,
          type: 'error',
          duration: 3 * 1000
        })
    } else {
        return response.data
    }

  },
  error => {
    const response = error.response;
    if (response === undefined) {
      Message({
        message: '服务请求超时！',
        type: 'error',
        duration: 3 * 1000
      })
      return Promise.reject(error)
    }
    if (response.status === 400) {
      Message({
        message: '账户或密码错误！',
        type: 'warning'
      })
      return Promise.reject('error')
    }

    const info = response.data;
    if (response.status === 401 && info.status === 40101) {
      MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
        confirmButtonText: '重新登录',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
          Cookies.remove('Authorization');
          location.reload();
        /*store.dispatch('LogOut').then(() => {
          Cookies.remove('userName');
          location.reload()
        })*/
      })
    }
    if (response.status === 401 && info.status === 40001) {
      Notification.warning({
        title: '禁止',
        message: info.message,
        type: 'error',
        duration: 2 * 1000
      })
      return Promise.reject('error')
    }

    if (response.status === 500 && info.status === 500 && info.message.indexOf('赋值异常')==-1) {
      Message({
        message: '后端服务异常，请联系管理员！',
        type: 'error',
        duration: 3 * 1000
      })
      return Promise.reject(error)
    }else{
      Message({
        message: '数值格式不正确,设置失败',
        type: 'error',
        duration: 3 * 1000
      })
    }

    if (response.status === 403) {
      Notification.warning({
        title: '禁止',
        message: info.message,
        type: 'error',
        duration: 2 * 1000
      })
      return Promise.reject('error')
    }
    if (info.status === 30101) {
      Notification.warning({
        title: '失败',
        message: info.message,
        type: 'error',
        duration: 2 * 1000
      })
      return Promise.reject('error')
    }
    if (response.status === 504) {
      Message({
        message: '后端服务异常，请联系管理员！',
        type: 'error',
        duration: 3 * 1000
      })
      return Promise.reject(error)
    }
    /*Message({
      message: info.message,
      type: 'error',
      duration: 5 * 1000
    })*/

    return Promise.reject(error)
  }
);

/**
 * 封装post请求
 * @param url
 * @param data
 * @returns {Promise}
 */

 /*export function post(url,data = {}){
   return new Promise((resolve,reject) => {
     mainAxios.post(url,data)
          .then(response => {
            resolve(response.data);
          },err => {
            reject(err)
          })
   })
 }*/

/* login side */

export const get = (url,params) => {
  return mainAxios({
    method: 'get',
    url: `${url}`,
    params: params
  });
}

export const post = (url, params) => {
  return mainAxios({
    method: 'post',
    url: `${url}`,
    data: params,
    responseType: 'json',
    transformRequest: [function (data) {
      let ret = ''
      var data=JSON.parse(data);
      for (let it in data) {
        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
      }
      return ret
    }],
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
}


/* other */
export const postRequest = (url, params) => {
  return parkAxios({
    method: 'post',
    url: `${url}`,
    data: params,
    responseType: 'json'
  });
}

export const putRequest = (url, params) => {
  return parkAxios({
    method: 'put',
    url: `${url}`,
    data: params,
    responseType: 'json'
  });
}

export const deleteRequest = (url,params) => {
  return parkAxios({
    method: 'delete',
    url: `${url}`,
    data: params
  });
}