<template>
	<div class="info">
		<div class="panel panel-default">
			<div class="panel-heading clearfix" style="padding:3px 8px;">
				<h3 class="fl" style="line-height:30px;">人员绑定</h3>
                <div class="fr">
                    <button v-if="staff_btn_bindMan" type="button" class="btn btn-primary btn-sm" data-toggle="modal" data-target="#bindmanagerModal" @click="userBind()" id="bindmanabtn">绑定管理员</button>
                </div>
			</div>
			<ul class="list-group">
				<li class="list-group-item">
					停车场：<span class="titleColor" id="p_title">{{parkName}}</span>
				</li>
                
			</ul>
			<table class="table">
				<tr>
					<th>帐号</th>
					<th>姓名</th>
					<th>电话</th>
					<th>操作</th>
				</tr>
			</table>
            <table class="table" v-for="(item,index) in tableListData.depart">
            	<thead>
	                <tr>
	                    <th class="title">{{item.label}}</th>
	                </tr>
            	</thead>
            	<tbody>
	                <tr v-if="JSON.parse(subItem.userId).departId==item.id" v-for="(subItem,subIndex) in tableListData.userParking">
	                    <td>{{JSON.parse(subItem.userId).username}}</td>
	                    <td>{{JSON.parse(subItem.userId).name}}</td>
	                    <td>{{JSON.parse(subItem.userId).attr1}}</td>
	                    <td>
	                    	<button @click="unBindUser(subItem.fpId)" type="button" class="btn btn-default del">解绑</button>
	                    </td>
	                </tr>
	            </tbody>
            </table>
		</div>
		
		<!-- 绑定管管理员 -->
		<el-dialog title="管理员" :visible.sync="dialogFormVisible" width="430px"  @open="openDialog" @close="closeDialog">
			<el-form ref="form" label-position="right" :model="form" :rules="rules" :label-width="formLabelWidth">

				<el-form-item label="角色" prop="role">
		    		<el-col :span="18">
		      			<el-select @change="changeRole" v-model="form.role" placeholder="请选择">
						    <el-option
						      v-for="(item,index) in allRole"
						      :key="item.index"
						      :label="item.label"
						      :value="item.id">
						    </el-option>
						  </el-select>
		      		</el-col>
		      	</el-form-item>
		      	<el-form-item label="账号" prop="userId">
		    		<el-col :span="18">
		      			<el-select v-model="form.userId" placeholder="请选择">
						    <el-option
						      v-for="(item,index) in allUser"
						      :key="item.index"
						      :label="item.username"
						      :value="item.id">
						    </el-option>
						  </el-select>
		      		</el-col>
		      	</el-form-item>

			</el-form>
		  	
		  	<div slot="footer" class="dialog-footer">
		    	<el-button type="primary" @click="userBindTrue">确 定</el-button>
		    	<el-button @click="dialogFormVisible = false">取 消</el-button>
		  	</div>
		</el-dialog>


	</div>
</template>
<script>
	import { mapGetters } from 'vuex';
	import {getAllRole,getRoleStaff,bindUser,getParkStaff,unBindUser} from '../../api/url';
	export default {
		data(){
			return {
				staff_btn_bindMan: false,

				parkId:'',
				parkName:'',
				tableListData:{
					depart:[],
					userParking:[]
				},
				formLabelWidth: '100px',

			    dialogFormVisible: false,
				allRole:[],
				allUser:[],
		        form: {
		        	role:'',
		        	userId:''
		        },
		        rules:{
		        	role:[
			            { required: true, message: '请选择角色', trigger: ['blur', 'change'] }
			        ],
			        userId:[
			            { required: true, message: '请选择账号', trigger: ['blur', 'change'] }
			        ]
		        }
			}
		},
		methods:{
			getAllRole:function(){
				this.$get(getAllRole()).then((data) => {
					this.allRole=data;
				})
			},
			getRoleStaff:function(id){
				this.$get(getRoleStaff(),{
					departId:id
				}).then((data) => {
					this.allUser=data.data.rows;
				})
			},
			tableList:function(){
				var _this=this;
				this.$get(getParkStaff(),{
					parkingId:this.parkId
			    }).then((data) => {
    				if(data.status!=200) return;
					_this.tableListData.depart=data.data.depart;
					_this.tableListData.userParking=data.data.userParking;
  				});

			},
			changeRole:function(val){
				this.getRoleStaff(val);
			},
			userBind:function(){
				this.dialogFormVisible=true;
			},
			userBindTrue:function(){
				var _this=this;
				this.$refs['form'].validate(function(valid,noStri){
					if(valid){
						_this.dialogFormVisible=false;
						_this.$postRequest(bindUser(),{
							parkingId:_this.parkId,
							userId:_this.form.userId
						}).then((data) => {
							// if(data.status!=200) return _this.$layer(message)
							_this.tableList();
						})
					}
				});
			},
			unBindUser:function(fpId){
				var _this=this;
				var index=_this.$layer.confirm('您确定解绑该设备？', {
				  btn: ['确定','取消'],
				  shade: true
				}, function(){
					_this.$layer.close(index);

					_this.$deleteRequest(unBindUser()+'/'+fpId).then((data) => {
						if(data.status!=200) return;
	    				_this.tableList();
	  				});
		  			
  				});
			},
			openDialog:function(){},
			closeDialog:function(){
				this.$refs['form'].resetFields();
			}
		},
		filters:{},

		computed:{
			...mapGetters([
	      		'elements'
	    	]),
	    	permiss(){
    			this.staff_btn_bindMan = this.elements['staff:btn_bindMan'];
	    	}
		},
		created:function(){
			this.permiss;

			this.getAllRole();
		},
		mounted:function(){
			this.parkId=this.$route.query.id;
			this.parkName=this.$route.query.name;
			this.tableList();
		},
		watch: {
		    elements: {
		     	handler: function (val, oldVal) {
		     		this.permiss;
		     	},
		      	deep: true 	//深度
		    }
		}
	}
</script>
<style scoped>
	.info{
		margin:6px 16px;
	}
	.panel {
	    border-radius: 0px;
	}
	.panel-default>.panel-heading {
	    background: none;
	}
	.list-group-item {
	    border: 0;
	    padding: 5px 8px;
	    color: #000;
	}
	
	.table tr th{
		font-weight: 100;
		color: #222;
		border-bottom: 0;
	}
	.table tr td,.table tr th{
		text-align: center;
		width: 25%;
		padding: 8px;

	}
	.table .title{
		text-align:left;
	}


	.titleColor{
		color: #1bc3b4;
	}
</style>