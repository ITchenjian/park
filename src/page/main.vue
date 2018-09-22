<template>
	<div class="board">
		<!-- <div>你猜：<input type="text" v-focus></div> -->
		<Headercus></Headercus>
		<div class="main">
			<Sidecus></Sidecus>
				
			<div class="content" :class={activeContent:isCollapse} id="content">
				<Bread></Bread>
				
                <router-view></router-view>
            	
            </div>
		</div>
	</div>
</template>
<script>
	import {mapState,mapActions} from 'vuex';

	import Headercus from './commons/header.vue';
	import Sidecus from './commons/side.vue';
	import Bread from './commons/bread.vue';

	export default {
		name:"maincus",
		data:function(){
			return{
				sss:"good"
			}
		},
		methods:{
			...mapActions(['getAdminData'])
		},
		computed: {
			...mapState({
				isCollapse:state=>state.menu.isCollapse
			})
		},
		mounted:function(){
			// this.getAdminData();
		},
		components:{
	        Headercus,
	        Sidecus,
	        Bread
	    }/*,
	    directives: {
		  	focus: {
		    	inserted: function (el) {
		      		el.focus()
		    	}
		  	}
		}*/
    }

</script>
<style scoped>
	.main {
		position: relative;
		overflow: auto;
		overflow-y:hidden;
	}
	
	.main .content{
		position: absolute;
		/* padding:12px 0; */
		padding:0;
		top: 12px;
		bottom: 0;
		left:225px;
		right:0;
		background: #fff;
		overflow: auto;
		/* z-index: 10000; */
		min-width: 1160px;
		/* min-width: 1240px; */

		transition: width .3s ease;
	}

	.main .activeContent{
		left:64px;
		transition: all .3s ease;
	}
</style>
