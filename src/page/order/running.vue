<template>
  	<div class="boxbgcolor">
		<div class="searchbox">
			<form action="#" method="get" class="form-inline">
				
                <div class="form-group">
                    <label for="">订单类型</label>
                    <el-select style="width:150px;" v-model="search.type" placeholder="请选择">
					    <el-option
					      v-for="(item,index) in allOrderType"
					      :key="index"
					      :label="item.labelZhCh"
					      :value="item.value">
					    </el-option>
					</el-select>
                </div>
				<div class="form-group">
                    <label for="bdate">时间</label>
                    <el-date-picker
                    	value-format="yyyy-MM-dd HH:mm:ss"
						:editable="false"
				      	v-model="search.startTime"
				      	type="datetime"
				      	placeholder="选择日期时间">
				    </el-date-picker>
                </div>
                <div class="form-group">
                    <label for="edate">至</label>
                    <el-date-picker
                    	value-format="yyyy-MM-dd HH:mm:ss"
						:editable="false"
				      	v-model="search.endTime"
				      	type="datetime"
				      	placeholder="选择日期时间">
				    </el-date-picker>
                </div>

                <button @click="searchList" type="button" class="btn btn-primary" id="search_btn">查询</button>
                <button @click="clearSearch" type="button" class="btn btn-default">清空</button>
            </form>
		</div>
		
		<div class="list">
			<table class="table">
                <thead>
                    <tr>
                        <td width="100">订单号</td>
                        <td width="80">订单类型</td>
                        <td width="100">车牌号</td>
                        <td width="80">车位号</td>
                        <td width="120">进场时间</td>
                        <td width="120">出场时间</td>
                        <td width="60">金额</td>
                        <td width="100">停车场</td>
                    </tr>
                </thead>
                <tbody id="tbody">
                    <tr v-for="item in tableListData.rows">
                        <td>{{item.orderNum}}</td>
                        <td>{{item.orderType}}</td>
                        <!-- <td>{{item.plaId.indexOf('{')==-1?'':JSON.parse(item.plaId).carNumber}}</td> -->
                        <td>{{!item.plaId?'':JSON.parse(item.plaId).carNumber}}</td>
                        <td>{{!item.spaceId?'':JSON.parse(item.spaceId).spaceNum}}</td>
                        
                        <td>{{item.beginDate}}</td>
                        <td>{{item.endDate}}</td>
                        <td>{{item.realMoney}}</td>
                        <td>{{!item.parkingId?'':JSON.parse(item.parkingId).parkingName}}</td>
                    </tr>
                </tbody>
            </table>

		</div>
		
		<div class="pagbox">
			<Page :pageSize="search.pageSize"></Page>
		</div>
		
  	</div>
</template>

<script>
	import { mapState, mapMutations } from 'vuex';

	import {dictValue,getOrderList} from '../../api/url';

	import Page from '../commons/page.vue';

	export default{
		data(){
			return{
				allOrderType:[],
				search:{
					pageNumber:1,
					pageSize:15,
					status:'',
					type:'',
					startTime:"",
					endTime:""
				},
				tableListData:{}
			}
		},
		methods:{
			...mapMutations(['getPage']),
			getOrderType:function(){
				this.$get(dictValue()+'/order_type').then((data) => {
					this.allOrderType=data.data.rows;
				})
			},
			tableList:function(curPage,open){

				var _this=this;
				
				this.$get(getOrderList(),{
			    	orderStatus:this.search.status,
			    	orderType:this.search.type,
			    	limit:this.search.pageSize,
					page:curPage,
					beginTime:this.search.startTime,
					endTime:this.search.endTime
			    }).then((data) => {
    				if(data.status!=200) return;
		            //翻页
					var pageObj={
						curIndex:data.data.offset,
						rowsCount:data.data.total
					};
					_this.getPage(pageObj);

					_this.tableListData=data.data;
  				});
			},
			searchList:function(){
				var flTime=this.timeCompare(this.search.startTime,this.search.endTime);
				// console.log(this.search.endTime)
				if(flTime){
					return this.$layer.msg('开始时间请勿大于结束时间', { time: 1});
				}else if(!Boolean(this.search.startTime)&&Boolean(this.search.endTime)){
					return this.$layer.msg('请选择开始时间', { time: 1});
				}else if(Boolean(this.search.startTime)&&!Boolean(this.search.endTime)){
					return this.$layer.msg('请选择结束时间', { time: 1});
				}
				this.search.pageNumber="1";
				this.tableList(this.search.pageNumber);
			},
			timeCompare:function(bDateVal,eDateVal){
				// console.log(bDateVal,eDateVal);

				if(!Boolean(bDateVal)||!Boolean(eDateVal)){
					return false;
				}

				var bdate = new Date(Date.parse(bDateVal.replace(/-/g, "/")));
				bdate = bdate.getTime();
				var edate = new Date(Date.parse(eDateVal.replace(/-/g, "/")));
				edate = edate.getTime();
				if(bdate-edate>0){
					return true;
				}else{
					return false;
				}
			},
			clearSearch:function(){
				this.search.pageNumber="1";
				this.search.type="";
				this.search.startTime="";
				this.search.endTime="";
			}
		},
		computed:mapState({
			curIndex: state => state.page.curIndex,
			rowsCount: state => state.page.rowsCount
		}),
		components:{
			Page
		},
		created:function(){
			var curPath=this.$router.currentRoute.path;
			if(curPath=='/main/order/running'){
				this.search.status='running'
			}else if(curPath=='/main/order/complete'){
				this.search.status='complete'
			}else if(curPath=='/main/order/unpay'){
				this.search.status='unpay'
			}
			this.getOrderType();
		},
		mounted:function(){

			this.tableList(this.search.pageNumber);
		},
		watch:{
			$route(to, from) {
				var curPath=to.path;
				if(curPath=='/main/order/running'){
					this.search.status='running'
				}else if(curPath=='/main/order/complete'){
					this.search.status='complete'
				}else if(curPath=='/main/order/unpay'){
					this.search.status='unpay'
				}
				this.tableList(this.search.pageNumber);
			}
		}
	}

</script>

<style scoped>
	.modal-body .tab-img li{
		width:100px;
		height:100px;
		margin:10px 10px;
	}
</style>