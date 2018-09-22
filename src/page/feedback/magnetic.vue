<template>
  	<div class="boxbgcolor">
		<div class="searchbox">
			<form action="#" method="get" class="form-inline">
				<div class="form-group">
                    <label for="">类型</label>
	      			<el-select style="width:150px;" v-model="search.errorType" placeholder="请选择">
					    <el-option
					      v-for="(item,index) in allErrorType"
					      :key="item.index"
					      :label="item.labelZhCh"
					      :value="item.value">
					    </el-option>
					</el-select>
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
                        <td width="80">信息类型</td>
                        <td width="100">SN</td>
                        <!-- <td width="80">车位号</td> -->
                        <td width="80">状态</td>
                        <td width="80">操作</td>
                    </tr>
                </thead>
                <tbody id="tbody">
                    <tr v-for="item in tableListData.rows">
                        <td>{{item.crtTime}}</td>
                        <td>{{item.errorType}}</td>
                        <td>{{item.onerankdeSn}}</td>
                        
                        <!-- <td>{{JSON.parse(item.spaceId).spaceNum}}</td> -->
                        <td>{{item.proceStatus|filterStatus}}</td>
                        <td>
                            <a class="margin-right" title="查看" href="javascript:;" @click="detail(item.id,JSON.parse(item.spaceId).spaceNum)"><span>详情</span></a>
                            <a v-if="item.proceStatus=='running'&&magnetic_btn_deal" title="" href="javascript:;" @click="deal(item.id)"><span>处理</span></a>
                            <a v-else-if="magnetic_btn_deal" title="" href="javascript:;"><span class="fontgay">处理</span></a>
                        </td>
                    </tr>
                </tbody>
            </table>

		</div>
		
		<div class="pagbox">
			<Page :pageSize="search.pageSize"></Page>
		</div>
		
		<!-- 详情 -->
		<el-dialog title="详情" :visible.sync="dialogFormVisibleDetail" width="430px">
		 	<el-form ref="" label-position="right" :label-width="formLabelWidth" id="">
		    	<el-form-item label="开始时间" prop="name">
		    		<el-col :span="18">
		      			<el-input readOnly v-model="formDetail.beginTime" auto-complete="off"></el-input>
		      		</el-col>
		      	</el-form-item>
		    	
				<el-form-item label="更新时间">
		    		<el-col :span="18">
		      			<el-input readOnly v-model="formDetail.updTime" auto-complete="off"></el-input>
		      		</el-col>
		      	</el-form-item>

		      	<el-form-item label="SN">
		    		<el-col :span="18">
		      			<el-input readOnly v-model="formDetail.onerankdeSn" auto-complete="off"></el-input>
		      		</el-col>
		      	</el-form-item>
				
				<el-form-item label="车位号">
		    		<el-col :span="18">
		      			<el-input readOnly v-model="formDetail.spaceNum" auto-complete="off"></el-input>
		      		</el-col>
		      	</el-form-item>

			</el-form>
		  	<div slot="footer" class="dialog-footer">
		    	<el-button type="primary" @click="dialogFormVisibleDetail = false">确 定</el-button>
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

	import {dictValue,getMagneticList,getMagneticSingle, dealMagnetic} from '../../api/url';

	import Page from '../commons/page.vue';

	export default{
		data(){
			return{
				magnetic_btn_deal:false,

				allErrorType:[],
				search:{
					pageNumber:1,
					pageSize:15,
					errorType:""
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

		        dialogFormVisibleDetail:false,
		        formDetail:{}
			}
		},
		methods:{
			...mapMutations(['getPage']),

			getErrorType:function(){
				this.$get(dictValue()+'/error_type').then((data) => {
					this.allErrorType=data.data.rows;
				})
			},
			tableList:function(curPage,open){

				var _this=this;
				
				this.$get(getMagneticList(),{
			    	errorType:this.search.errorType,
			    	limit:this.search.pageSize,
			    	page:curPage
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
				this.search.pageNumber="1";
				this.tableList(this.search.pageNumber);
			},
			clearSearch:function(){
				this.search.pageNumber="1";
				this.search.errorType="";
			},
			detail:function(id,spaceNum){
				this.dialogFormVisibleDetail=true;
				this.$postRequest(getMagneticSingle(),{
					id:id

				}).then((data) => {
    				if(data.status!=200) return;
    				this.formDetail=data.data;
    				this.formDetail.spaceNum=spaceNum;
  				});

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

						_this.$putRequest(dealMagnetic()+'/'+_this.form.id,{
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
    			this.magnetic_btn_deal = this.elements['magnetic:btn_deal'];

	    	}
		},
		filters:{
			filterStatus:function(status){
				switch(status){
					case 'complete':
					return '已完成';
					break;
					case 'cancel':
					return '已取消';
					break;
					case 'running':
					return '进行中';
					break;
				}
			}
		},
		components:{
			Page
		},
		created:function(){
			this.permiss;
			this.getErrorType();
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