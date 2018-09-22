<template>
  	<div class="boxbgcolor">
		<div class="searchbox">
			<form action="#" method="get" class="form-inline">
				<div class="form-group">
                    <label for="">审核状态</label>
                    <el-select style="width:150px;" v-model="search.result" placeholder="请选择">
					    <el-option
					      v-for="(item,index) in allStatus"
					      :key="index"
					      :label="item.labelZhCh"
					      :value="item.value">
					    </el-option>
					</el-select>
                </div>
                <div class="form-group">
                    <label for="">车牌号</label>
                    <input v-model="search.plateNum" class="form-control" id="" type="text" placeholder="" size="12">
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
                    	<td width="100">申请时间</td>
                        <td width="100">车牌号</td>
                        <td width="80">账户</td>
                        
                        <td width="100">操作</td>
                    </tr>
                </thead>
                <tbody id="tbody">
                    <tr v-for="item in tableListData.rows">
                        <td>{{item.crtTime}}</td>
                        <td>{{item.carNumber}}</td>
                        <td>{{JSON.parse(item.userId).name}}</td>
                        
                        
                        <td>
                        	<a title="照片" href="javascript:;" @click="photo(item.carNumberPhoto)"><span>照片</span></a>&nbsp;&nbsp;
                        	<a v-if="item.result=='running'&&platecheck_btn_check" title="审核" href="javascript:;" @click="check(item.recordId)"><span>审核</span></a>
                        	<a v-else-if="platecheck_btn_check" title="审核" href="javascript:;"><span class="fontgay">审核</span></a>
                        </td>
                    </tr>
                </tbody>
            </table>

		</div>
		
		<div class="pagbox">
			<Page :pageSize="search.pageSize"></Page>
		</div>
		
		<!-- 审核 -->
		<el-dialog title="审核" :visible.sync="dialogFormVisible" width="430px" @close="closeDialog">
		 	<el-form ref="form" label-position="right" :model="form" :rules="rules" :label-width="formLabelWidth" id="form">
		    	
		    	<el-form-item label="车型">
					
					<el-select v-model="form.type" placeholder="请选择">
		        		<el-option
					      v-for="(item,index) in carType"
					      :key="item.index"
					      :label="item.labelZhCh"
					      :value="item.value">
					    </el-option>
		      		</el-select>

		    	</el-form-item>

				<el-form-item label="状态">
					
					<el-select v-model="form.status" placeholder="请选择">
		        		<el-option
					      v-for="(item,index) in chkStatus"
					      :key="item.index"
					      :label="item.labelZhCh"
					      :value="item.value">
					    </el-option>
		      		</el-select>

		    	</el-form-item>

				
			</el-form>
		  	<div slot="footer" class="dialog-footer">
		    	<el-button @click="dialogFormVisible = false">取 消</el-button>
		    	<el-button type="primary" @click="checkTrue()">确 定</el-button>
		 	</div>
			
		</el-dialog>

		<!-- 照片 -->
		<el-dialog title="照片" :visible.sync="dialogFormVisiblePhoto" width="430px">
		 	<el-form ref="" label-position="right" :label-width="formLabelWidth" id="">
		    	
		    	<div class="modal-body">
                    <div class="chkimg" style="text-align:center;overflow:hidden;">
                        <img :src="imgUrl" alt="" style="max-height:500px;max-width:540px;">
                    </div>
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

	import {getCheckList,checkPlate,dictValue} from '../../api/url';

	import Page from '../commons/page.vue';

	export default{
		data(){
			return{
				platecheck_btn_check:false,
				allStatus:[],
				search:{
					pageNumber:1,
					pageSize:15,
					plateNum:"",
					startTime:"",
					endTime:"",
					result:'',
				},
				tableListData:{},
				formLabelWidth: '100px',
				dialogFormVisible: false,
				carType:[{
					labelZhCh:'汽车',
					value:'auto'
				},{
					labelZhCh:'货车',
					value:'truck'
				}],
				chkStatus:[{
					labelZhCh:'成功',
					value:'success'
				},{
					labelZhCh:'失败',
					value:'fail'
				}],
		        form: {
		        	id:'',
		          	type:'auto',
		          	status:'success'
		        },
		        rules:{},

		        dialogFormVisiblePhoto:false,
		        imgUrl:''
		        
			}
		},
		methods:{
			...mapMutations(['getPage']),

			handleError(rr, file, fileList) {
		        console.log(file, fileList);
		    },
		    handleSuccess(response, file, fileList) {
		        this.form.scenImgUrl=response.data;
		    },
			getCheckStatus:function(){
				this.$get(dictValue()+'/audit_state').then((data) => {
					this.allStatus=data.data.rows;
				})
			},
			tableList:function(curPage,open){
				
				var _this=this;
				this.$get(getCheckList(),{
						carNumber:this.search.plateNum,
				    	limit:this.search.pageSize,
						page:curPage,
						beginTime:this.search.startTime,
						endTime:this.search.endTime,
						result:this.search.result,
				    }).then((data) => {
        				if(data.status!=200) return;
			            //翻页
						var pageObj={
							curIndex:data.data.offset,
							rowsCount:data.data.total
						};
						_this.getPage(pageObj);

						// console.log(data)
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
				this.search.plateNum="";
				this.search.startTime="";
				this.search.endTime="";
				this.search.result ="";
			},
			check:function(id){
				this.dialogFormVisible=true;
				this.form.id=id;
			},
			checkTrue:function(){
				var _this=this;

				// console.log(_this.getEditorData)
				this.$refs['form'].validate(function(valid,noStri){
					
					if(valid){
						_this.dialogFormVisible = false;

						_this.$putRequest(checkPlate(),{
							recordId:_this.form.id,
							carType:_this.form.type,
							result:_this.form.status
						}).then((data) => {
	        				if(data.status!=200) return;
							var result=data.data;

							_this.tableList(_this.curIndex);
	      				});
					}
				});
			},
			openDialog:function(){},
			closeDialog:function(){
				this.$refs['form'].resetFields();
			},
			photo:function(imgUrl){
				this.dialogFormVisiblePhoto=true;
				if(Boolean(imgUrl)){
					this.imgUrl=imgUrl;
				}else{
					this.imgUrl='';
				}
				
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
    			this.platecheck_btn_check = this.elements['platecheck:btn_check'];

	    	}
		},
		components:{
			Page
		},
		created:function(){
			this.permiss;
			this.getCheckStatus();
		},
		mounted:function(){
			this.tableList(this.search.pageNumber);
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
	
</style>