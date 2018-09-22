<template>
  	<div class="loginbody" id="loginbody">
        <form action="#" method="post">            
            <div class="loginbox clearfix">
                <div class="input">
                    <h1 class="systemlogo"></h1>
                    <div class="form_tip" id="tips">
                        
                    </div>
                    <ul>
                        <li class="logins">
                            <input type="text" autofocus="autofocus" class="loginuser" id="username" name="" v-model="loginForm.username"/>
                        </li>
                        <li class="form_tip" id=""></li>
                        <li class="logins loginpsd">
                            <input type="password" class="loginpwd" id="password" name="password" v-model="loginForm.password"/>

                        </li>
                        <li class="reset clearfix dn">
                            <div class="fl backpsd">
                                <a href="./code.html">找回密码</a>
                            </div>
                            <div class="fr register">
                                <a href="./register.html">新用户注册</a>
                            </div>
                        </li>
                        <li class="form_tip" id=""></li>
                        <li style="text-align:center;">
                            <button type="button" class="btnlogin" id="login" name="#" @click="submitForm" @keyup="handleKeydown($event)">登&nbsp;&nbsp;录</button>
                        </li>
                    </ul>
                </div>
            </div>
        </form>
    </div>
</template>

<script>
	import {Message} from 'element-ui';
	import Cookies from 'js-cookie';

	import md5 from 'js-md5';
	import {mapActions, mapState} from 'vuex';
	import {login_url} from '../api/url.js';

	export default {
	    data(){
			return {
				loginForm: {
					username: '',
					password: '',
				},
				msg:{
					error:"用户名或密码错误",
					empty:"用户名或密码为空"
				}
			}
		},
		created:function(){
			let _this = this;
			document.onkeydown = function(e){
				let _key = window.event.keyCode;
				if(_key === 13){
					document.onkeydown ='';
					_this.submitForm();

				}
			}
		},
		mounted(){
			// console.log(md5);
			// this.getAdminData();
			
		},
		computed: {
			
		},
		methods: {
			...mapActions(['getAdminData']),
			submitForm(){
				var _this=this;
				if(this.loginForm.username==""||this.loginForm.password==""){
			        Message({
				        message: this.msg.empty,
				        type: 'warning'
				    })

			    }else{

					this.$post(login_url(),{grant_type:'password',
			                username:this.loginForm.username,
			                password:this.loginForm.password
			            }).then((data) => {

        				Cookies.set('Authorization', data.access_token,{ path: '' });
	                    Cookies.set('userName', data.userName,{ path: '' });

	                    _this.$router.push('main');
      				}).catch(function(error){
      					
      					console.log(error)
      				});

			    }
			},
			handleKeydown:function(ev){
				// alert('你按回车键了');  
				if(ev.keyCode == 13){  
                    this.submitForm()
                }
			}
		},
		watch: {
			
		}
	}
</script>

<style scoped>
	@import '../assets/css/login.css';
	
</style>