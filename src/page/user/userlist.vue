<template>
  	<div class="boxbgcolor">
		<div class="searchbox">
			<form action="#" method="get" class="form-inline">
                <div class="form-group">
                    <label for="">手机号</label>
                    <input v-model="search.mobile" class="form-control" id="" type="text" placeholder="" size="12">
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
                        <td width="100">手机号</td>
                        <td width="100">时间</td>
                        <!-- <td width="100">车牌号</td> -->
                        <td width="80">级别</td>
                        <!-- <td width="80">行驶证</td> -->
                        <td width="80">操作</td>
                    </tr>
                </thead>
                <tbody id="tbody">
                    <tr v-for="item in tableListData.rows">
                        <td>{{item.mobile}}</td>
                        <td>{{item.updTime}}</td>
                        <!-- <td>{{'车牌'}}</td> -->
                        <td>{{item.userType==1?'管理员用户':'普通用户'}}</td>
                        <!-- <td>{{'行驶证'}}</td> -->
                        
                        <td>
                            <a title="查看" href="javascript:;" @click="photo(item.id)"><span>查看</span></a>&nbsp;&nbsp;
                            <a v-if="userlist_btn_delete" title="删除" href="javascript:;" @click="delUser(item.id)"><span>删除</span></a>
                        </td>
                    </tr>
                </tbody>
            </table>

		</div>
		
		<div class="pagbox">
			<Page :pageSize="search.pageSize"></Page>
		</div>
		
		<!-- 照片 -->
		<el-dialog :title="'行驶证（车牌：'+plateNum+'）'" :visible.sync="dialogFormVisiblePhoto" width="500px" @close="closeDialogPhoto">
		 	<el-form ref="" label-position="right" :label-width="formLabelWidth" id="">
		    	
		    	<div class="modal-body">
                    <!-- <div class="chkimg" style="text-align:center;overflow:hidden;">
                        <img :src="imgUrl" alt="" style="max-height:500px;max-width:540px;">
                    </div> -->

					<div class="chkimg" style="text-align:center;overflow:hidden;">
                        <img :src="imgUrl" alt="" style="max-height:300px;max-width:540px;">
                    </div>
                    <ul class="tab-img clearfix">
                    	<li class="fl" @click="handleClickTag(item)" v-for="(item,index) in allImgUrl">
                    		<a href="javascript:;"><img :src="item.carNumberPhoto" alt="" width="100%" height="100%"></a>
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

	import {getUserList,getLicense, delUser} from '../../api/url';

	import Page from '../commons/page.vue';

	export default{
		data(){
			return{
				userlist_btn_delete:false,

				search:{
					pageNumber:1,
					pageSize:15,
					userName:"",
					mobile:"",

					startTime:"",
					endTime:""
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
		        form: {
		        	id:'',
		          	userName: '',
		          	type:'0'
		        },
		        rules:{
		        	userName: [
			            { required: true, message: '请填写场景名称', trigger: 'blur' },
			            { min: 3, max: 12, message: '长度在 3 到 12 个字符', trigger: 'blur' }
			        ],
			        type: [
			            { required: false, message: '请填写场景名称', trigger: 'blur' }
			        ]
			        
		        },

		        dialogFormVisiblePhoto:false,

		        allImgUrl:[],
		        plateNum:'',
		        imgUrl:''
			}
		},
		methods:{
			...mapMutations(['getPage','storageScenId']),

			tableList:function(curPage,open){

				var _this=this;
				
				this.$get(getUserList(),{
			    	name:this.search.userName,
			    	mobile:this.search.mobile,
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
				this.search.userName="";
				this.search.mobile="";
				this.search.startTime="";
				this.search.endTime="";
			},
			closeDialogPhoto:function(){
				this.allImgUrl=[];
				this.imgUrl='';
		        this.plateNum='';
			},
			photo:function(id){
				this.dialogFormVisiblePhoto=true;
				this.$postRequest(getLicense(),{
					userId:id

				}).then((data) => {
    				if(data.status!=200) return;
    				var result=data.data.rows;
    				for(var i=0;i<result.length;i++){
    					this.allImgUrl.push(result[i])
    				}
    				if(Boolean(result.length)){
    					this.imgUrl=this.allImgUrl[0].carNumberPhoto;
		            	this.plateNum=this.allImgUrl[0].carNumber;
    				}
		            
  				});
				
			},
			handleClickTag:function(obj){
				this.imgUrl=obj.carNumberPhoto;
				this.plateNum=obj.carNumber;
			},
			delUser:function(id){
				var _this=this;
				var index=_this.$layer.confirm('您确定删除该车主？', 
				{
				  btn: ['确定','取消'],
				  shade: true
				}, function(){
					_this.$layer.close(index);

					_this.$deleteRequest(delUser()+'/'+id).then((data) => {
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
    			this.userlist_btn_delete = this.elements['userlist:btn_delete'];
	    	}
		},
		components:{
			Page
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
	.modal-body .tab-img li{
		width:100px;
		height:100px;
		margin:10px 10px;
	}
</style>