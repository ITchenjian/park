<template>
	 <div class="bread_container">
	 	<span class="bars" @click="handleLeftMenu"> 
		    <i class="el-icon-menu"></i>
		</span>
		<el-breadcrumb class='nav-bread' separator-class="el-icon-arrow-right">
		  	<!-- <el-breadcrumb-item :to="{ path: '/main' }">首页</el-breadcrumb-item> -->
            <el-breadcrumb-item 
            	:to="{ path: item.path }" 
                v-for='(item,index) in levelList'
                :key='index'
				v-if='item.name'>
				{{item.name}}
			</el-breadcrumb-item>
		</el-breadcrumb>
	</div>
</template>


<script>
import {mapMutations} from 'vuex';

export default {
	data(){
		return {
			levelList: null,
			changeBarDirection:false
		}
	},
	created() {
        this.getBreadcrumb()
    },
	methods:{
		...mapMutations(['handleMenuStore']),
		getBreadcrumb() {
			
			let matched = this.$route.matched;
			// console.log(matched)
			var breadArr=[];
			
			for (var i = 0; i < matched.length; i++) {
				var breadObj={};
				breadObj.name=matched[i].name;
				breadObj.path=matched[i].path;

				/*if(matched[i].path=="/main/equip/readcard"){
					breadArr.push({name:"区域",path:"/main/equip/area"})
				}*/
				breadArr.push(breadObj)
			};
			this.levelList = breadArr;
      	},
      	handleLeftMenu(){
      		this.changeBarDirection = !this.changeBarDirection;
      		this.handleMenuStore(this.changeBarDirection);
      	}
	},
	watch: {
      $route() {
           this.getBreadcrumb();
      }
    }
}



</script>

<style scoped>
	.bread_container{
    	padding:10px 16px;
	}
	.nav-bread{
		line-height: 18px;
	}
	.bars{
			float: left;
            margin: 0px 6px;
			cursor: pointer;
	}
		
</style>


