<template>
	<div class="header clearfix">
        <div class="logo fl">
            <!-- <img src="images/logo.png" alt=""> -->
        </div>
        <div class="topright fr">
            <ul class="clearfix">
              <li class="user fl"><span>{{userName}}</span></li>
              <li class="out fr"><em>|</em><a @click="logout" href="javascript:;" style="color:#222;">退出</a></li>
            </ul>

        </div>
    </div>
</template>
<script>
	import axios from 'axios';
	import Cookies from 'js-cookie';
	import { login_url } from '../../api/url.js';
	export default {
		name:"headercus",
		data: function(){
			return{
				userName:''
			}
		},
		methods:{
			logout:function(){
				var _this=this;
				
				axios({
				  	method: 'delete',
				  	url: login_url(),
				  	data: {
				    	access_token:"Bearer+"+Cookies.get('Authorization')
				  	},
				  	headers: {'Authorization': 'Basic dnVlOnZ1ZQ=='}
				})
				.then(function (response) {
					var data=response.data;
				    if(data.status==200){
			   			Cookies.remove('Authorization',{ path: '' });
			   			_this.$router.push('/');
			   		}
				})
				.catch(function (error) {
				    console.log(error);
				});

			}
		},
		mounted:function(){
			this.userName=Cookies.get('userName');

			var authFl=Cookies.get('Authorization');
			if(!Boolean(authFl)){
				this.$router.push('/');
			}
		}
    }
</script>
<style scoped>
	.header{
		width:100%;
		height: 72px;
		background-size: 100% 100%;
		/* background: url(../../assets/images/header.png) no-repeat left top; */
		background: #fff;
	}
	.header .logo{
		width:225px;
		height:100%;
		background: #1bc3b4 url(../../assets/images/logo4.png) no-repeat left center;
		border-bottom:2px solid #006e63;
	}

	.header .navs li{
		float:left;
		text-align: center;
	}
	.header .navs li:hover{
		background: #308bc5;
	}
	.header .navs li a{
		display: block;
		padding-top:10px;
		width: 87px;
		height:88px;
	}
	.header .navs li a.selected{
		/* background: url(../../assets/images/navbg.png); */
	}
	.header .navs li a h2{
		color:#d6e8f1;
		height: 20px;
		line-height: 20px;
	}

	.header .topright{
		height: 70px;
	}
	.header .topright ul .user{
		/* width:158px; */
		height:70px;
		line-height: 70px;
		padding:0 20px 0 40px;
		color:#222;
		font-size: 14px;
		background: url(../../assets/images/userinfo.png) no-repeat left center;
	}
	.header .topright ul .out{
		width: 100px;
		height:70px;
		line-height: 70px;
	}
	.header .topright ul li em{
		color: #222;
		font-weight: bold;
		padding-right: 24px;
	}
	.header .topright ul li a{
		display: inline-block;
		padding-left:40px;
		background: url(../../assets/images/logout.png) no-repeat left center;
	}
</style>