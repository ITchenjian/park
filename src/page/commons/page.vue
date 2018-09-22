<template>
	<div>
		<el-pagination
	      	@current-change="currentChange"
	      	@prev-click="handPrev"
	      	@next-click="handNext"
	      	:current-page="curIndex"
	      	:page-size="pageSize"
	      	:pager-count="5"
	      	layout="total, prev, pager, next, jumper"
	      	:total="rowsCount">
	    </el-pagination>
	</div>
</template>
<script>
	import { mapState } from 'vuex';

	export default{
		data(){
			return{
				
			}
		},
		props:{
		  	pageSize: Number
		},
		methods:{
			currentChange(curPage){
				// console.log(curPage);
				this.$parent.tableList(curPage);
			},
			handPrev(){
				// console.log('prev')
			},
			handNext(){
				// console.log('next')
			}
		},
		computed:mapState({
			curIndex: state => state.page.curIndex,
			rowsCount: state => state.page.rowsCount
		})
	}
</script>
<style scoped>
	
</style>