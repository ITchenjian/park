<template>
  	<div class="boxbgcolor">
		<div class="searchbox">
			<form action="#" method="get" class="form-inline">
                <div class="form-group">
                    <label for="">车位号</label>
                    <input v-model="search.spaceNum" class="form-control" id="" type="text" placeholder="" size="12">
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
                    	<td width="100">时间</td>
                        <td width="60">姓名</td>
                        
                        <td width="100">手机号</td>
                        <td width="80">车位号</td>
                        <td width="80">停车场</td>
                        <td width="100">地址</td>
                        <td width="80">操作</td>
                    </tr>
                </thead>
                <tbody id="tbody">
                    <tr v-for="item in tableListData.rows">
                    	<td>{{item.crtTime}}</td>
                        <td>{{item.corporateName}}</td>
                        <td>{{item.telephone}}</td>
                        <td>{{item.spaceNums}}</td>
                        <td>{{item.parkingName}}</td>
                        <td>{{item.parkingAddress}}</td>
                        
                        
                        <td>
                            <a class="margin-right" title="详情" href="javascript:;" @click="detail(item.pvRecordId)"><span>详情</span></a>
                            <a v-if="privatespace_btn_del" title="删除" href="javascript:;" @click="delPrivate(item.pvRecordId)"><span>删除</span></a>
                        </td>
                    </tr>
                </tbody>
            </table>

		</div>
		
		<div class="pagbox">
			<Page :pageSize="search.pageSize"></Page>
		</div>
		
		<!-- 详情 -->
		<el-dialog title="详情" :visible.sync="dialogFormVisiblePhoto" width="500px">
		 	<el-form ref="" label-position="right" :label-width="formLabelWidth" id="">
		    	
		    	<div class="modal-body">
		    		<ul class="detail-word">
		    			<li class="clearfix"><span class="fl">车场类型</span><span class="fr">{{detailData.parkingType|parkTypeFilter}}</span></li>
		    			<li class="clearfix"><span class="fl">区层类型</span><span class="fr">{{detailData.areaType|areaTypeFilter}}</span></li>
		    			<li class="clearfix"><span class="fl">面积</span><span class="fr">{{detailData.floorSpace}}</span></li>
		    			<!-- <li>{{detailData.areaType}}</li>
		    			<li>{{detailData.floorSpace}}</li> -->
		    		</ul>
		    		<h3>车位产权证明</h3>
                    <div class="chkimg" style="text-align:center;overflow:hidden;">
                        <img :src="imgUrl" alt="" style="max-height:300px;max-width:540px;">
                    </div>
                    <ul class="tab-img clearfix">
                    	<li class="fl" @click="handleClickTag(item)" v-for="(item,index) in allImgUrl">
                    		<a href="javascript:;"><img :src="item" alt="" width="100%" height="100%"></a>
                    	</li>
                    </ul>
                </div>

				
			</el-form>
		  	<div slot="footer" class="dialog-footer">
		    	<el-button type="primary" @click="dialogFormVisiblePhoto = false">确 定</el-button>
		 	</div>
			
		</el-dialog>

  	</div>
</template>

<script>
	import { mapState, mapMutations, mapGetters } from 'vuex';

	import {getPrivateList,getPrivateSingle,delPrivate} from '../../api/url';

	import Page from '../commons/page.vue';

	export default{
		data(){
			return{
				privatespace_btn_del: false,

				search:{
					pageNumber:1,
					pageSize:15,
					telephone:"",
					spaceNum:"",
					startTime:"",
					endTime:""
				},
				tableListData:{},

		        formLabelWidth: '100px',
		        dialogFormVisiblePhoto:false,
		        allImgUrl:[],
		        imgUrl:'',
		        detailData:{}
			}
		},
		methods:{
			...mapMutations(['getPage']),

			tableList:function(curPage,open){

				var _this=this;
				
				this.$get(getPrivateList(),{
			    	telephone:this.search.telephone,
			    	spaceNums:this.search.spaceNum,
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
				this.search.spaceNum="";
				this.search.startTime="";
				this.search.endTime="";
			},
			detail:function(id){
				this.dialogFormVisiblePhoto=true;

				this.$postRequest(getPrivateSingle(),{
					pvRecordId:id

				}).then((data) => {
    				if(data.status!=200) return;
		            this.detailData=data.data;
		            // this.allImgUrl=data.data.photo.split(';');
		            this.allImgUrl=['http://slwl-parking.oss-cn-shenzhen.aliyuncs.com/intelligePark/plaNumPhoto/d3192b6-3.jpg','http://slwl-parking.oss-cn-shenzhen.aliyuncs.com/intelligePark/plaNumPhoto/7d255a9-0.jpg'];
		            this.imgUrl=this.allImgUrl[0];
  				});
			},
			handleClickTag:function(url){
				this.imgUrl=url;
			},
			delPrivate:function(id){
				var _this=this;
				var index=_this.$layer.confirm('您确定删除该车位？', 
				{
				  btn: ['确定','取消'],
				  shade: true
				}, function(){
					_this.$layer.close(index);

					_this.$deleteRequest(delPrivate()+'/'+id).then((data) => {
        				if(data.status!=200) return _this.$layer.msg('删除失败', { time: 1});
						_this.tableList(_this.search.pageNumber)
      				});

				});
			}
		},
		computed:{
			...mapState({
				curIndex: state => state.page.curIndex,
				rowsCount: state => state.page.rowsCount
			}),
			...mapGetters([
	      		'elements'
	    	]),
	    	permiss(){
    			this.privatespace_btn_del = this.elements['privatespace:btn_delete'];

	    	}
		},
		components:{
			Page
		},
		filters:{
			parkTypeFilter:function(type){
				if(type=='onsize'){
					return '室内'
				}else if(type=='roadside'){
					return '路侧'
				}
			},
			areaTypeFilter:function(type){
				if(type=='underground'){
					return '地下'
				}else if(type=='ground'){
					return '地上'
				}
			}
		},
		created:function(){
			this.permiss;
		},
		mounted:function(){
			this.tableList(this.search.pageNumber);
		},
		watch: {
		    elements: {
		     	handler: function (val, oldVal) {
		     		this.permiss;
		     	},
		      	deep: true
		    }
		}
	}

</script>

<style scoped>
	.modal-body{
		padding-top:0;
	}
	.modal-body .detail-word li{
		padding:10px 0;
		border-bottom:1px solid #ddd;
	}
	.modal-body h3{
		padding:8px 0;
		font-size: 16px;
	}
	.modal-body .tab-img li{
		width:100px;
		height:100px;
		margin:10px 10px;
		background: pink;
	}
</style>