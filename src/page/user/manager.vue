<template>
  	<div class="boxbgcolor">
		<div class="searchbox">
			<form action="#" method="get" class="form-inline">
                <div class="form-group">
                    <label for="">账号</label>
                    <input v-model="search.userName" class="form-control" id="" type="text" placeholder="" size="12">
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
                        <td width="80">姓名</td>
                        <td width="80">账号</td>
                        <td width="100">时间</td>
                        <td width="80">角色</td>
                        <td width="80">操作</td>
                    </tr>
                </thead>
                <tbody id="tbody">
                    <tr v-for="item in tableListData.rows">
                        <td>{{item.name}}</td>
                        <td>{{item.username}}</td>
                        <td>{{item.crtTime}}</td>
                        <td>{{JSON.parse(item.departId).name}}</td>
                        
                        <td>
                            <a v-if="manager_btn_edit" class="margin-right" title="编辑" href="javascript:;" @click="addrOrEdit(item.id)"><span>编辑</span></a>
                            <a v-if="manager_btn_delete" title="删除" href="javascript:;" @click="delRole(item.id)"><span>删除</span></a>
                        </td>
                    </tr>
                </tbody>
            </table>

		</div>
		
		<div class="pagbox">
			<Page :pageSize="search.pageSize"></Page>
		</div>
		
		<!-- 添加或编辑 -->
		<el-dialog title="添加/编辑账号" :visible.sync="dialogFormVisible" width="430px" @close="closeDialog">
		 	<el-form ref="form" label-position="right" :model="form" :rules="rules" :label-width="formLabelWidth" id="form">
		 		<el-form-item label="姓名" prop="name">
		    		<el-col :span="18">
		      			<el-input v-model.trim="form.name" auto-complete="off" onkeyup="this.value=this.value.replace(/^ +| +$/g,'')"></el-input>
		      		</el-col>
		    	</el-form-item>

		    	<el-form-item label="账号" prop="userName">
		    		<el-col :span="18">
		      			<el-input v-model.trim="form.userName" auto-complete="off" onkeyup="this.value=this.value.replace(/^ +| +$/g,'')"></el-input>
		      		</el-col>
		    	</el-form-item>

		    	<el-form-item label="密码" prop="password">
		    		<el-col :span="18">
		      			<el-input v-model.trim="form.password" auto-complete="off" onkeyup="this.value=this.value.replace(/^ +| +$/g,'')"></el-input>
		      		</el-col>
		    	</el-form-item>

		    	<el-form-item label="手机" prop="phone">
		    		<el-col :span="18">
		      			<el-input v-model="form.phone" auto-complete="off"></el-input>
		      		</el-col>
		    	</el-form-item>

		    	<el-form-item label="角色" prop="role">
					
					<el-select v-model="form.role" placeholder="请选择">
		        		<el-option
					      v-for="(item,index) in allRole"
					      :key="item.index"
					      :label="item.label"
					      :value="item.id">
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
	import { mapState, mapMutations, mapGetters } from 'vuex';

	import {getManagerList,getAllRole,addManager,getManagerSingle,delRole} from '../../api/url';

	import Page from '../commons/page.vue';

	export default{
		data(){
			return{
				manager_btn_edit:false,
				manager_btn_delete:false,

				search:{
					pageNumber:1,
					pageSize:15,
					userName:""
				},
				tableListData:{},

		        formLabelWidth: '100px',
				dialogFormVisible: false,
				allType:[{
					label:'普通用户',
					value:'0'
				},{
					label:'管理员用户',
					value:'1'
				}],
				allRole:[],
		        form: {
		        	id:'',
		        	name:'',
		          	userName: '',
		          	password:'',
		          	phone:'',
		          	role:''

		        },
		        rules:{
		        	name: [
			            { required: true, message: '请填写姓名', trigger: 'blur' }
			        ],
		        	userName:[
			            { 
			            	required: true, 
			            	trigger: 'blur',
			            	validator:(rule,value,callback)=>{
			            		// console.log(rule,value);
			            		if(value != ""){
						            if((/^\w{2,12}$/).test(value) == false){
						                callback(new Error("请填写2到12位数字字母或下划线"));
						            }else{
						                callback();
						            }
						        }else{
						            callback(new Error("请填写账号"));
						        }
			            	}
			            }
			        ],
			        password:[
			            { 
			            	required: true, 
			            	trigger: 'blur',
			            	validator:(rule,value,callback)=>{
			            		// console.log(rule,value);
			            		if(!rule.required) return callback();
			            		if(value != ""){
						            if((/^\w{2,12}$/).test(value) == false){
						                callback(new Error("请填写2到12位数字字母或下划线"));
						            }else{
						                callback();
						            }
						        }else{
						            callback(new Error("请填写密码"));
						        }
			            	}
			            }
			        ],
			        phone:[
			            { 
			            	required: true, 
			            	trigger: 'blur',
			            	validator:(rule,value,callback)=>{
			            		// console.log(rule,value);
			            		if(value != ""){
						            if((/^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/).test(value) == false){
						                callback(new Error("请填写正确手机号"));
						            }else{
						                callback();
						            }
						        }else{
						            callback(new Error("请填写手机号"));
						        }
			            	}
			            }
			        ],
			        role:[
			            { required: true, message: '请选择角色', trigger: ['blur', 'change'] }
			        ]
			        
		        }
			}
		},
		methods:{
			...mapMutations(['getPage','storageScenId']),

			tableList:function(curPage,open){

				var _this=this;
				
				this.$get(getManagerList(),{
			    	username:this.search.userName,
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
				this.search.userName="";
			},
			getRoleType:function(){
				this.$get(getAllRole()).then((data) => {
					this.allRole=data;
				})
			},
			closeDialog:function(){
				this.$refs['form'].resetFields();
			},
			addrOrEdit:function(id){
				this.dialogFormVisible=true;
				if(Boolean(id)){
					this.rules.password[0].required=false;
					this.form.id=id;
				}else{
					this.rules.password[0].required=true;
					return this.form.id='';
				}

				this.$postRequest(getManagerSingle(),{id:id}).then((data) => {
    				if(data.status!=200) return;
		            this.form.id=data.data.id;	
		            this.form.name=data.data.name;	
		            this.form.userName=data.data.username;	
		            this.form.phone=data.data.attr1;	
		            this.form.role=data.data.departId;	
  				});

			},
			addrOrEditTrue:function(){
				var _this=this;

				// console.log(_this.getEditorData)
				this.$refs['form'].validate(function(valid,noStri){
					
					if(valid){
						_this.dialogFormVisible = false;

	      				if(!Boolean(_this.form.id)){

							_this.$postRequest(addManager(),{
								name:_this.form.name,
								username:_this.form.userName,
								password:_this.form.password,
								attr1:_this.form.phone,
								departId:_this.form.role
								
							}).then((data) => {
		        				if(data.status!=200) return;
					            _this.tableList(_this.search.pageNumber);
		      				});
		      			}else{
		      				_this.$putRequest(addManager(),{
		      					id:_this.form.id,
								name:_this.form.name,
								username:_this.form.userName,
								password:_this.form.password,
								attr1:_this.form.phone,
								departId:_this.form.role

							}).then((data) => {
		        				if(data.status!=200) return;
					            _this.tableList(_this.search.pageNumber);
		      				});
		      			}
					}
				});
			},
			delRole:function(id){
				var _this=this;
				var index=_this.$layer.confirm('您确定删除该管理员？', 
				{
				  btn: ['确定','取消'],
				  shade: true
				}, function(){
					_this.$layer.close(index);

					_this.$deleteRequest(delRole()+'/'+id).then((data) => {
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
    			this.manager_btn_edit = this.elements['manager:btn_edit'];
    			this.manager_btn_delete = this.elements['manager:btn_delete'];

	    	}
		},
		components:{
			Page
		},
		created:function(){
			this.permiss;
			this.getRoleType();
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
	
</style>