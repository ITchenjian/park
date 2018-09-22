<template>
  	<div class="boxbgcolor">
		<div class="searchbox">
			<form action="#" method="get" class="form-inline">
				
                <div class="form-group">
                    <label for="">内容</label>
                    <input v-model="search.fbMsg" class="form-control" id="" type="text" placeholder="" size="12">
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
                        <td width="60">账号</td>
                        <td width="160">内容</td>
                        <!-- <td width="80">操作</td> -->
                    </tr>
                </thead>
                <tbody id="tbody">
                    <tr v-for="item in tableListData.rows">
                        <td>{{item.fbDate}}</td>
                        <td>{{item.userId}}</td>
                        <td>{{item.fbMsg}}</td>
                        
                        <!-- <td>
                            <a title="查看" href="javascript:;" @click="photo(item.id)"><span>查看</span></a>&nbsp;&nbsp;
                            <a v-if="item.proceStatus=='running'" title="" href="javascript:;" @click="deal(item.id)"><span>处理</span></a>
                            <a v-else title="" href="javascript:;"><span class="fontgay">处理</span></a>
                        </td> -->
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

  	</div>
</template>

<script>
	import { mapState, mapMutations } from 'vuex';

	import {dictValue,getAppList,getHandsetSingle, dealHandset} from '../../api/url';

	import Page from '../commons/page.vue';

	export default{
		data(){
			return{
				allFbType:[],
				search:{
					pageNumber:1,
					pageSize:15,
					fbMsg:""
				},
				tableListData:{},

		        formLabelWidth: '100px',

		        dialogFormVisiblePhoto:false,
		        allImgUrl:[],
		        imgUrl:''
			}
		},
		methods:{
			...mapMutations(['getPage']),

			tableList:function(curPage,open){

				var _this=this;
				
				this.$get(getAppList(),{
			    	fbMsg:this.search.fbMsg,
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
				this.search.fbMsg="";
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

			}
		},
		computed:mapState({
			curIndex: state => state.page.curIndex,
			rowsCount: state => state.page.rowsCount
		}),
		components:{
			Page
		},
		mounted:function(){
			this.tableList(this.search.pageNumber);
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