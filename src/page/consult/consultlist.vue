<template>
  	<div class="boxbgcolor">
		<div class="searchbox">
			<form action="#" method="get" class="form-inline">
                <div class="form-group">
                    <label for="">主题</label>
                    <input v-model="search.title" class="form-control" id="" type="text" placeholder="" size="12">
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
                <button @click="addrOrEdit('')" type="button" class="btn btn-default" id="addarea">添加</button>
            </form>
		</div>
		
		<div class="list">
			<table class="table">
                <thead>
                    <tr>
                        <td width="80">创建时间</td>
                        <td width="80">名称</td>
                        <td width="100">状态</td>
                        <td width="80">操作</td>
                    </tr>
                </thead>
                <tbody id="tbody">
                    <tr v-for="item in tableListData.rows">
                        <td>{{item.crtTime}}</td>
                        <td>{{item.title}}</td>
                        <td>{{item.enabledFlag=='y'?'发布':'保存'}}</td>
                        
                        <td>
                            <a title="编辑" href="javascript:;" @click="addrOrEdit(item.adId)"><span>编辑</span></a>&nbsp;&nbsp;
                            <router-link :to="{path:'/main/consult/edit',query:{id:item.adId}}"><span>内容</span></router-link>&nbsp;&nbsp;
                            <a title="删除" href="javascript:;" @click="delConsult(item.adId)"><span>删除</span></a>
                        </td>
                    </tr>
                </tbody>
            </table>

		</div>
		
		<div class="pagbox">
			<Page :pageSize="search.pageSize"></Page>
		</div>
		
		<!-- 添加或编辑 -->
		<el-dialog title="添加/编辑咨询" :visible.sync="dialogFormVisible" width="430px" @close="closeDialog">
		 	<el-form ref="form" label-position="right" :model="form" :rules="rules" :label-width="formLabelWidth" id="form">
		 		<el-form-item label="主题" prop="title">
		    		<el-col :span="18">
		      			<el-input v-model.trim="form.title" auto-complete="off" onkeyup="this.value=this.value.replace(/^ +| +$/g,'')"></el-input>
		      		</el-col>
		    	</el-form-item>

		    	<el-form-item label="状态">
					
					<el-select v-model="form.status" placeholder="请选择">
		        		<el-option
					      v-for="(item,index) in allStatus"
					      :key="item.index"
					      :label="item.label"
					      :value="item.value">
					    </el-option>
		      		</el-select>

		    	</el-form-item>
				
				
			</el-form>
		  	<div slot="footer" class="dialog-footer">
		    	<el-button @click="dialogFormVisible = false">取 消</el-button>
		    	<el-button type="primary" @click="addrOrEditTrue()">确 定</el-button>
		 	</div>
			
		</el-dialog>

  	</div>
</template>

<script>
	import { mapState, mapMutations } from 'vuex';

	import {getConsultList,addConsultList,getConsultSingle,delRole} from '../../api/url';

	import Page from '../commons/page.vue';

	export default{
		data(){
			return{
				search:{
					pageNumber:1,
					pageSize:15,
					title:"",
					startTime:"",
					endTime:""
				},
				tableListData:{},

		        formLabelWidth: '100px',
				dialogFormVisible: false,
				allStatus:[{
					label:'发布',
					value:'y'
				},{
					label:'保存',
					value:'n'
				}],
		        form: {
		        	id:'',
		        	title:'',
		          	status:'n'

		        },
		        rules:{
		        	title: [
			            { required: true, message: '请填写主题', trigger: 'blur' }
			        ],
			        status:[
			            { required: false, message: '请选择状态', trigger: ['blur', 'change'] }
			        ]
			        
		        }
			}
		},
		methods:{
			...mapMutations(['getPage','storageScenId']),

			tableList:function(curPage,open){

				var _this=this;
				
				this.$get(getConsultList(),{
			    	title:this.search.title,
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
				this.search.title="";
				this.search.startTime="";
				this.search.endTime="";
			},
			closeDialog:function(){
				this.$refs['form'].resetFields();
			},
			addrOrEdit:function(id){
				this.dialogFormVisible=true;
				if(Boolean(id)){
					this.form.id=id;
				}else{
					return this.form.id='';
				}

				this.$postRequest(getConsultSingle(),{adId:id}).then((data) => {
    				if(data.status!=200) return;
		            this.form.id=data.data.adId;	
		            this.form.title=data.data.title;	
		            this.form.status=data.data.enabledFlag;	
  				});

			},
			addrOrEditTrue:function(){
				var _this=this;

				// console.log(_this.getEditorData)
				this.$refs['form'].validate(function(valid,noStri){
					
					if(valid){
						_this.dialogFormVisible = false;
						console.log(_this.form.id)
	      				if(!Boolean(_this.form.id)){

							_this.$postRequest(addConsultList(),{
								title:_this.form.title,
								enabledFlag:_this.form.status,
								content:_this.form.content
								
							}).then((data) => {
		        				if(data.status!=200) return;
					            _this.tableList(_this.search.pageNumber);
		      				});
		      			}else{
		      				_this.$putRequest(addConsultList()+'/'+_this.form.id,{
		      					adId:_this.form.id,
								title:_this.form.title,
								enabledFlag:_this.form.status,
								content:_this.form.content

							}).then((data) => {
		        				if(data.status!=200) return;
					            _this.tableList(_this.search.pageNumber);
		      				});
		      			}
					}
				});
			},
			delConsult:function(id){
				var _this=this;
				var index=_this.$layer.confirm('您确定删除该条咨询？', 
				{
				  btn: ['确定','取消'],
				  shade: true
				}, function(){
					_this.$layer.close(index);

					_this.$deleteRequest(addConsultList()+'/'+id).then((data) => {
        				if(data.status!=200) return _this.$layer.msg('删除失败', { time: 1});
						_this.tableList(_this.search.pageNumber)
      				});

				});
			}
		},
		computed:mapState({
			curIndex: state => state.page.curIndex,
			rowsCount: state => state.page.rowsCount
		}),
		components:{
			Page
		},
		created:function(){},
		mounted:function(){
			this.tableList(this.search.pageNumber);
		}
	}

</script>

<style scoped>
	
</style>