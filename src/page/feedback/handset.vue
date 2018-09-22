<template>
  	<div class="boxbgcolor">
		<div class="searchbox">
			<form action="#" method="get" class="form-inline">
				<div class="form-group">
                    <label for="">类型</label>
	      			<el-select style="width:150px;" v-model="search.fbType" placeholder="请选择">
					    <el-option
					      v-for="(item,index) in allFbType"
					      :key="item.index"
					      :label="item.labelZhCh"
					      :value="item.value">
					    </el-option>
					</el-select>
                </div>

                <div class="form-group">
                    <label for="">内容</label>
                    <input v-model="search.fbMsg" class="form-control" id="" type="text" placeholder="" size="12">
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
                        <td width="100">反馈时间</td>
                        <!-- <td width="60">账号</td> -->
                        <td width="80">信息类型</td>
                        <td width="120">内容</td>
                        <td width="80">操作</td>
                    </tr>
                </thead>
                <tbody id="tbody">
                    <tr v-for="item in tableListData.rows">
                        <td>{{item.fbDate}}</td>
                        <!-- <td>{{item.userId}}</td> -->
                        <td>{{item.fbType=='exit_error'?'无车报有车':'有车报无车'}}</td>
                        <td>{{item.fbMsg}}</td>
                        
                        <td>
                            <a class="margin-right" title="查看" href="javascript:;" @click="photo(item.id)"><span>查看</span></a>
                            <a v-if="item.proceStatus=='running'&&handset_btn_deal" title="" href="javascript:;" @click="deal(item.id)"><span>处理</span></a>
                            <a v-else-if="handset_btn_deal" title="" href="javascript:;"><span class="fontgay">处理</span></a>
                        </td>
                    </tr>
                </tbody>
            </table>

		</div>
		
		<div class="pagbox">
			<Page :pageSize="search.pageSize"></Page>
		</div>
		
		<!-- 照片 -->
		<el-dialog title="照片" :visible.sync="dialogFormVisiblePhoto" width="500px">
		 	<el-form ref="" label-position="right" :label-width="formLabelWidth" id="">
		    	
		    	<div class="modal-body">
					
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

		<!-- 处理 -->
		<el-dialog title="处理" :visible.sync="dialogFormVisible" width="430px">
		 	<el-form ref="form" label-position="right" :model="form" :rules="rules" :label-width="formLabelWidth" id="form">

				<el-form-item label="状态">
					
					<el-select v-model="form.status" placeholder="请选择">
		        		<el-option
					      v-for="(item,index) in allDealStatus"
					      :key="item.index"
					      :label="item.labelZhCh"
					      :value="item.value">
					    </el-option>
		      		</el-select>

		    	</el-form-item>

				
			</el-form>
		  	<div slot="footer" class="dialog-footer">
		    	<el-button @click="dialogFormVisible = false">取 消</el-button>
		    	<el-button type="primary" @click="dealTrue()">确 定</el-button>
		 	</div>
			
		</el-dialog>

  	</div>
</template>

<script>
	import { mapState, mapMutations, mapGetters } from 'vuex';

	import {dictValue,getHandsetList,getHandsetSingle, dealHandset} from '../../api/url';

	import Page from '../commons/page.vue';

	export default{
		data(){
			return{
				handset_btn_deal: false,


				allFbType:[],
				search:{
					pageNumber:1,
					pageSize:15,
					fbMsg:"",
					fbType:"",
					startTime:"",
					endTime:""
				},
				tableListData:{},

		        formLabelWidth: '100px',
				dialogFormVisible: false,
				allDealStatus:[{
					value:'complete',
					labelZhCh:'完成'
				},{
					value:'cancel',
					labelZhCh:'取消'
				}],
		        form: {
		        	id:'',
		          	status: 'complete'
		        },
		        rules:{},

		        dialogFormVisiblePhoto:false,
		        allImgUrl:[],
		        imgUrl:''
			}
		},
		methods:{
			...mapMutations(['getPage']),

			getFbType:function(){
				this.$get(dictValue()+'/feedback_type').then((data) => {
					this.allFbType=data.data.rows;
				})
			},
			tableList:function(curPage,open){

				var _this=this;
				
				this.$get(getHandsetList(),{
			    	fbMsg:this.search.fbMsg,
			    	fbType:this.search.fbType,
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
				this.search.fbMsg="";
				this.search.fbType="";
				this.search.startTime="";
				this.search.endTime="";
			},
			photo:function(id){
				this.dialogFormVisiblePhoto=true;
				
				this.$postRequest(getHandsetSingle(),{
					id:id

				}).then((data) => {
    				if(data.status!=200) return;
		            this.allImgUrl=[data.data.imageHead,data.data.imageTail,data.data.imageSideways];
		            this.imgUrl=this.allImgUrl[0];
  				});

			},
			handleClickTag:function(url){
				this.imgUrl=url;
			},
			deal:function(id){
				this.dialogFormVisible=true;
				this.form.id=id;
			},
			dealTrue:function(){
				var _this=this;
				this.$refs['form'].validate(function(valid,noStri){
					
					if(valid){
						_this.dialogFormVisible = false;

						_this.$postRequest(dealHandset(),{
							id:_this.form.id,
							proceStatus:_this.form.status
						}).then((data) => {
	        				if(data.status!=200) return;
							var result=data.data;
							_this.tableList(_this.curIndex);

	      				});
					}
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
    			this.handset_btn_deal = this.elements['handset:btn_deal'];

	    	}
		},
		components:{
			Page
		},
		created:function(){
			this.permiss;
			
			this.getFbType();
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
	.modal-body .tab-img li{
		width:100px;
		height:100px;
		margin:10px 10px;
	}
</style>