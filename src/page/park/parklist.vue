<template>
  	<div class="boxbgcolor">
		<div class="searchbox">
			<form action="#" method="get" class="form-inline">
                <div class="form-group">
                    <label for="a_name">停车场</label>
                    <input v-model="search.parkName" class="form-control" id="a_name" type="text" placeholder="" size="12">
                </div>
                <button @click="searchList" type="button" class="btn btn-primary" id="search_btn">查询</button>
                <button @click="clearSearch" type="button" class="btn btn-default">清空</button>
                <button v-if="parklist_btn_add" type="button" class="btn btn-default" id="addarea" @click="addrOrEdit()">添加</button>
            </form>
		</div>
		
		<div class="list">
			<table class="table">
                <thead>
                    <tr>
                        <td width="100">停车场</td>
                        <td width="80">类型</td>
                        <td width="80">管理员</td>
                        <td width="100">创建时间</td>
                        <td width="120">地址</td>
                        
                        <td width="100">操作</td>
                    </tr>
                </thead>
                <tbody id="tbody">
                    <tr v-for="item in tableListData.rows">
                        <td>{{item.parkingName}}</td>
                        <td>{{item.parkingType}}</td>
                        <td>{{JSON.parse(item.userId).username}}</td>
                        <td>{{item.crtTime}}</td>
                        <td>{{item.parkingAddress}}</td>
                        
                        <td>
                        	<a v-if="parklist_btn_rule" class="margin-right" title="收费规则" href="javascript:;" @click="getChargeRule(item.parkingId,item.chargeRuleId)"><span>收费规则</span></a>
                        	<a v-if="parklist_btn_pkset" class="margin-right" title="车场设置" href="javascript:;" @click="toView(item.parkingId,item.parkingName)"><span>车场设置</span></a>
                        	<a v-if="parklist_btn_person" title="人员管理" href="javascript:;" @click="toStaff(item.parkingId,item.parkingName)"><span>人员管理</span></a>


                        	<span v-show="false">&nbsp;&nbsp;&nbsp;&nbsp;</span>
                        	<a v-show="false" title="删除" href="javascript:;" @click="delPark(item.parkingId)"><span>删除</span></a>
                        </td>
                    </tr>
                </tbody>
            </table>

		</div>
		
		<div class="pagbox">
			<Page :pageSize="search.pageSize"></Page>
		</div>
		

		<!-- 添加停车场 -->
		<el-dialog title="添加停车场" :visible.sync="dialogFormVisible" width="900px"  @open="openDialog" @close="closeDialog">
			<div class="clearfix">
				<el-form class="fl" style="width:45%;" ref="form" label-position="right" :model="form" :rules="rules" :label-width="formLabelWidth" id="form">
					
					<el-form-item label="城市" prop="city">
			    		<el-col :span="18">
			      			<el-select @change="changeCity" filterable v-model="form.city" placeholder="请选择">
							    <el-option
							      v-for="item in allCity"
							      :key="item.value"
							      :label="item.name"
							      :value="item.id">
							    </el-option>
							  </el-select>
			      		</el-col>
			      	</el-form-item>
					
					<el-form-item label="管理员" prop="manager">
			    		<el-col :span="18">
			      			<el-select v-model="form.manager" placeholder="请选择">
							    <el-option
							      v-for="(item,index) in allManager"
							      :key="item.index"
							      :label="item.username"
							      :value="item.id">
							    </el-option>
							  </el-select>
			      		</el-col>
			      	</el-form-item>

			    	<el-form-item label="车场名称" prop="name">
			    		<el-col :span="18">
			      			<el-input v-model.trim="form.name" auto-complete="off" onkeyup="this.value=this.value.replace(/^ +| +$/g,'')"></el-input>
			      		</el-col>
			      	</el-form-item>
					
					<el-form-item label="车场地址" prop="address">
						<el-col :span="18">
			      			<el-input readonly v-model="form.address" auto-complete="off"></el-input>
			      		</el-col>
			    	</el-form-item>

			      	<el-form-item label="车场类型">
			    		<el-col :span="18">
			      			<el-select v-model="form.type" placeholder="请选择">
							    <el-option
							      v-for="(item,index) in allType"
							      :key="item.index"
							      :label="item.labelZhCh"
							      :value="item.value">
							    </el-option>
							  </el-select>
			      		</el-col>
			      	</el-form-item>

			      	
					
					<el-form-item label="收费规则">
			    		<el-col :span="18">
			      			<el-select v-model="form.chargeRuleId" placeholder="请选择">
							    <el-option
							      v-for="(item,index) in allChargeRuleSel"
							      :key="item.index"
							      :label="item.name"
							      :value="item.id">
							    </el-option>
							  </el-select>
			      		</el-col>
			      	</el-form-item>

			      	<el-form-item label="业务流程">
			    		<el-col :span="18">
			      			<el-select v-model="form.parkingBusType" placeholder="请选择">
							    <el-option
							      v-for="(item,index) in allParkingBusType"
							      :key="item.index"
							      :label="item.businessName"
							      :value="item.id">
							    </el-option>
							  </el-select>
			      		</el-col>
			      	</el-form-item>
					
				</el-form>

				<div class="fr" id="areaMap" style="width: 52%;height: 380px;">
					
				</div>

		  	</div>

		  	<div slot="footer" class="dialog-footer">
		    	<el-button @click="dialogFormVisible = false">取 消</el-button>
		    	<el-button type="primary" @click="addrOrEditTrue">确 定</el-button>
		  	</div>
		</el-dialog>

		<!-- 收费规则 -->
		<el-dialog title="收费规则" :visible.sync="dialogFormVisibleRule" width="600px"  @open="openDialogRule" @close="closeDialogRule">
			<div>
				<el-form ref="formRule" label-position="right" :label-width="formLabelWidth">
					<!-- 室内 3-->
					<table v-if="matchRuleStype" class="table-rule">
						<tr>
							<td rowspan="3">小车</td>
							<td rowspan="2">工作日</td>
							<td>
								<el-time-picker
									:editable="false"
								    is-range
								    v-model="formRule.params[0].StartOrEndTime"
								    value-format="HH:mm" 
								    format="HH:mm"
								    range-separator="-"
								    start-placeholder=""
								    end-placeholder=""
								    placeholder="">
								</el-time-picker>

							</td>
							<td>首小时<input v-model="formRule.params[0].firstPrice" type="text" class="money-input" maxlength="5" @keyup="handleKeyup($event)" @afterpaste="handleAfterpaste($event)">元,首小时后<input v-model="formRule.params[0].firstHoursPrice" type="text" class="money-input" maxlength="5" @keyup="handleKeyup($event)" @afterpaste="handleAfterpaste($event)">元/半小时</td>
						</tr>
						<tr>
							<td>
								{{formRule.params[0].StartOrEndTime[1]}} - 次日 {{formRule.params[0].StartOrEndTime[0]}}
							</td>
							<td><input v-model="formRule.params[0].odLastPrice" type="text" class="money-input" maxlength="5" @keyup="handleKeyup($event)" @afterpaste="handleAfterpaste($event)">元/时</td>
						</tr>
						<tr>
							<td>非工作日</td>
							<td colspan="2">首小时<input v-model="formRule.params[0].tdPrice" type="text" class="money-input" maxlength="5" @keyup="handleKeyup($event)" @afterpaste="handleAfterpaste($event)">元,首小时后<input v-model="formRule.params[0].tdHoursPrice" type="text" class="money-input" maxlength="5" @keyup="handleKeyup($event)" @afterpaste="handleAfterpaste($event)">元/半小时</td>
						</tr>

						<tr>
							<td rowspan="3">大车</td>
							<td rowspan="2">工作日</td>
							<td>
								{{formRule.params[0].StartOrEndTime[0]}} - {{formRule.params[0].StartOrEndTime[1]}}
							</td>
							<td>首小时<input v-model="formRule.params[1].firstPrice" type="text" class="money-input" maxlength="5" @keyup="handleKeyup($event)" @afterpaste="handleAfterpaste($event)">元,首小时后<input v-model="formRule.params[1].firstHoursPrice" type="text" class="money-input" maxlength="5" @keyup="handleKeyup($event)" @afterpaste="handleAfterpaste($event)">元/半小时</td>
						</tr>
						<tr>
							<td>
								{{formRule.params[0].StartOrEndTime[1]}} - 次日 {{formRule.params[0].StartOrEndTime[0]}}
							</td>
							<td><input v-model="formRule.params[1].odLastPrice" type="text" class="money-input" maxlength="5" @keyup="handleKeyup($event)" @afterpaste="handleAfterpaste($event)">元/时</td>
						</tr>
						<tr>
							<td>非工作日</td>
							<td colspan="2">首小时<input v-model="formRule.params[1].tdPrice" type="text" class="money-input" maxlength="5" @keyup="handleKeyup($event)" @afterpaste="handleAfterpaste($event)">元,首小时后<input v-model="formRule.params[1].tdHoursPrice" type="text" class="money-input" maxlength="5" @keyup="handleKeyup($event)" @afterpaste="handleAfterpaste($event)">元/半小时</td>
						</tr>

						<tr>
							<td>共享</td>
							<td></td>
							<td>
								<el-time-picker
									:editable="false"
								    is-range
								    v-model="formRule.params[2].StartOrEndTime"
								    value-format="HH:mm" 
								    format="HH:mm"
								    range-separator="-"
								    start-placeholder=""
								    end-placeholder=""
								    placeholder="">
								</el-time-picker>
							</td>
							<td>首小时<input v-model="formRule.params[2].firstPrice" type="text" class="money-input" maxlength="5" @keyup="handleKeyup($event)" @afterpaste="handleAfterpaste($event)">元,首小时后<input v-model="formRule.params[2].firstHoursPrice" type="text" class="money-input" maxlength="5" @keyup="handleKeyup($event)" @afterpaste="handleAfterpaste($event)">元/半小时（超出共享时段<input v-model="formRule.params[2].odLastPrice" type="text" class="money-input" maxlength="5" @keyup="handleKeyup($event)" @afterpaste="handleAfterpaste($event)">元/时）</td>
						</tr>
						<tr>
							<td colspan="4" style="text-align: left;">说明：进场<input v-model="formRule.freeTime" type="text" class="time-input" maxlength="3" @keyup="handleKeyupTime($event)" @afterpaste="handleAfterpasteTime($event)">分钟内免费;
								<div>
									月卡：小车<input v-model="formRule.params[0].monthsCardPrice" type="text" class="money-input" maxlength="5" @keyup="handleKeyup($event)" @afterpaste="handleAfterpaste($event)">元/月&nbsp;&nbsp;大车<input v-model="formRule.params[1].monthsCardPrice" type="text" class="money-input" maxlength="5" @keyup="handleKeyup($event)" @afterpaste="handleAfterpaste($event)">元/月&nbsp;&nbsp;开关：<el-switch v-model="formRule.openFlag" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
								</div>
							</td>
						</tr>
					</table>
					
					<!-- 路侧 1-->
					<table v-else class="table-rule">
						<tr>
							<td rowspan="2">小车</td>
							<td>工作日</td>
							<td>
								<el-time-picker
									:editable="false"
								    is-range
								    v-model="formRuleOne.params[0].wdStartOrEndTime"
								    value-format="HH:mm" 
								    format="HH:mm"
								    range-separator="-"
								    start-placeholder=""
								    end-placeholder=""
								    placeholder="">
								</el-time-picker>
							</td>
							<td>首<input v-model="formRuleOne.params[0].wdAfterHourF" type="text" class="time-input" maxlength="3" @keyup="handleKeyupTime($event)" @afterpaste="handleAfterpasteTime($event)">小时<input v-model="formRuleOne.params[0].wdFirstPrice" type="text" class="money-input" maxlength="5" @keyup="handleKeyup($event)" @afterpaste="handleAfterpaste($event)">元，{{formRuleOne.params[0].wdAfterHourF}} - {{formRuleOne.params[0].wdLastHour}} 小时<input v-model="formRuleOne.params[0].wdAfterPrice" type="text" class="money-input" maxlength="5" @keyup="handleKeyup($event)" @afterpaste="handleAfterpaste($event)">元，<input v-model="formRuleOne.params[0].wdLastHour" type="text" class="time-input" maxlength="3" @keyup="handleKeyupTime($event)" @afterpaste="handleAfterpasteTime($event)">小时后<input v-model="formRuleOne.params[0].wdLastPrice" type="text" class="money-input" maxlength="5" @keyup="handleKeyup($event)" @afterpaste="handleAfterpaste($event)">元</td>
						</tr>
						<tr>
							<td>非工作日</td>
							<td>
								<el-time-picker
									:editable="false"
								    is-range
								    v-model="formRuleOne.params[0].odStartOrEndTime"
								    value-format="HH:mm" 
								    format="HH:mm"
								    range-separator="-"
								    start-placeholder=""
								    end-placeholder=""
								    placeholder="">
								</el-time-picker>
							</td>
							<td>首<input v-model="formRuleOne.params[0].odAfterHourF" type="text" class="time-input" maxlength="3" @keyup="handleKeyupTime($event)" @afterpaste="handleAfterpasteTime($event)">小时<input v-model="formRuleOne.params[0].odFirstPrice" type="text" class="money-input" maxlength="5" @keyup="handleKeyup($event)" @afterpaste="handleAfterpaste($event)">元，{{formRuleOne.params[0].odAfterHourF}} - {{formRuleOne.params[0].odLastHour}} 小时<input v-model="formRuleOne.params[0].odAfterPrice" type="text" class="money-input" maxlength="5" @keyup="handleKeyup($event)" @afterpaste="handleAfterpaste($event)">元，<input v-model="formRuleOne.params[0].odLastHour" type="text" class="time-input" maxlength="3" @keyup="handleKeyupTime($event)" @afterpaste="handleAfterpasteTime($event)">小时后<input v-model="formRuleOne.params[0].odLastPrice" type="text" class="money-input" maxlength="5" @keyup="handleKeyup($event)" @afterpaste="handleAfterpaste($event)">元</td>
						</tr>
						<tr>
							<td colspan="4" style="text-align: left;">说明：进场<input v-model="formRuleOne.freeTime" type="text" class="time-input" maxlength="3" @keyup="handleKeyupTime($event)" @afterpaste="handleAfterpasteTime($event)">分钟内免费收费规则（元/半小时）</td>
						</tr>
					</table>

				</el-form>
		  	</div>

		  	<div slot="footer" class="dialog-footer">
		    	<el-button @click="dialogFormVisibleRule = false">取 消</el-button>
		    	<el-button type="primary" @click="addrOrEditRuleTrue">确 定</el-button>
		  	</div>
		</el-dialog>

  	</div>
</template>

<script>
	import { mapState, mapMutations,mapGetters } from 'vuex';

	import {parkingBusType,dictValue,getCity,parkList,getRulesType,addOrUpdateChargeRule,getChargeRule,parkAdd,addMapOverlay,addMapOverlayl,setMapEvent,addMapControl,getManagerList} from '../../api/url';

	import Page from '../commons/page.vue';

	export default{
		data(){
			return{

      			parklist_btn_add: false,
      			parklist_btn_rule: false,
      			parklist_btn_pkset: false,
      			parklist_btn_person: false,


				search:{
					pageNumber:1,
					pageSize:15,
					parkName:""
				},
				tableListData:{
					
				},

				formLabelWidth: '100px',

				dialogFormVisible: false,
				allParkingBusType:[],
				allType:[{
					labelZhCh:'室内',
					value:'onsize'
				},{
					labelZhCh:'路侧',
					value:'roadside'
				}],
				allCity:[],
				allManager:[],
				allChargeRule:[],
				allChargeRuleSel:[{
					name:'室内',
					id:'3'
				},{
					name:'路侧',
					id:'1'
				}],
		        form: {
		        	id:'',
		          	name: '',
		          	type:'roadside',
		          	city:'',
		          	manager:'',
		          	scenImgUrl:'',
		          	address:'',
		          	longitude:'',
		          	latitude:'',
		          	chargeRuleId:'1',
		          	
		          	parkingBusType:'1'
		        },
		        rules:{
		        	city:[
			            { required: true, message: '请选择城市', trigger: ['blur', 'change'] }
			        ],
			        manager:[
			            { required: true, message: '请选择管理员', trigger: ['blur', 'change'] }
			        ],
		        	name: [
			            { required: true, message: '请填写车场名称', trigger: 'blur' },
			            { min: 2, max: 8, message: '长度在 2 到 8 个字符', trigger: 'blur' }
			        ],
			        address: [
			            { required: true, message: '请在地图上选取位置', trigger: 'blur' }
			        ]
			        
		        },
		        map:{},

		        dialogFormVisibleRule: false,
		        matchRuleStype:false,
		        // 室内3
		        formRule:{
		        	chargeRuleId:'',
		        	parkingId:'',
		        	openFlag:false,
		        	freeTime:'',
		        	params:[{
		        		lrId:'',
		        		carType:'auto',
		        		StartOrEndTime:['00:00','00:00'],
		        		firstHours:'1',
		        		firstPrice:'',
		        		firstHoursPrice:'',
		        		odLastPrice:'',

		        		tdHours:'1',
		        		tdPrice:'',
		        		tdHoursPrice:'',
		        		monthsCardPrice:''
		        	},{
		        		lrId:'',
		        		carType:'truck',
		        		firstHours:'1',
		        		firstPrice:'',
		        		firstHoursPrice:'',
		        		odLastPrice:'',

		        		tdHours:'1',
		        		tdPrice:'',
		        		tdHoursPrice:'',
		        		monthsCardPrice:''
		        	},{
		        		lrId:'private',
		        		carType:'',
		        		StartOrEndTime:['00:00','00:00'],

		        		firstHours:'1',
		        		firstPrice:'',
		        		firstHoursPrice:'',
		        		odLastPrice:'',
		        		monthsCardPrice:''
		        	}]
		        },

		        //室外1
		        formRuleOne:{
		        	chargeRuleId:'',
		        	parkingId:'',
		        	freeTime:'',
		        	params:[{
		        		lrId:'',
		        		carType:'auto',
		        		wdStartOrEndTime:['00:00','00:00'],
		        		wdAfterHourF:'',
		        		wdLastHour:'',

		        		wdFirstPrice:'',
		        		wdAfterPrice:'',
		        		wdLastPrice:'',
		        		wdFreeMin:'',

		        		odStartOrEndTime:['00:00','00:00'],
		        		odAfterHourF:'',
		        		odLastHour:'',

		        		odFirstPrice:'',
		        		odAfterPrice:'',
		        		odLastPrice:'',
		        		odFreeMin:''

		        	}]
		        }
		        
			}
		},
		methods:{
			...mapMutations(['getPage','storageScenId']),
			changeCity:function(val){
				let obj = {};  
			    obj = this.allCity.find((item)=>{ 
			    return item.id === val;
			    });  
			    // console.log(obj.name);
				this.map.centerAndZoom(obj.name,12);
			},
			handleKeyup:function(e){
				e.target.value=e.target.value.replace(/[ !`~\!@#\$%\^&\*()_+=\-\;\:\"\'\\/?,<>|\A-Za-z\u4e00-\u9fa5]+/g,'')
			},
			handleAfterpaste:function(e){
				e.target.value=e.target.value.replace(/[ !`~\!@#\$%\^&\*()_+=\-\;\:\"\'\\/?,<>|\A-Za-z\u4e00-\u9fa5]+/g,'')
			},
			handleKeyupTime:function(e){
				e.target.value=e.target.value.replace(/\D/g,'')
			},
			handleAfterpasteTime:function(e){
				e.target.value=e.target.value.replace(/\D/g,'')
			},
		    getParkType:function(){
				this.$get(dictValue()+'/parking_type').then((data) => {
					this.allType=data.data.rows;
				})
			},
			getParkingBusType:function(){
				this.$get(parkingBusType()).then((data) => {
					this.allParkingBusType=data;
				})
			},
			getAllManager:function(){
				this.$get(getManagerList()).then((data) => {
					if(data.status!=200) return;
					this.allManager=data.data.rows;
				})
			},
			getCity:function(){
				this.$get(getCity(),{
					arealevel:"2",
					name:"",
					limit:"0"
				}).then((data) => {
					if(data.status!=200) return;
					this.allCity=data.data.rows;
				})
			},
			getRulesType:function(){
				this.$get(getRulesType()).then((data) => {
					// if(data.status!=200) return;
					this.allChargeRule=data;
				})
			},
			tableList:function(curPage,open){
				
				var _this=this;
				this.$get(parkList(),{
					parkingName:this.search.parkName,
					cityId:'',
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

					// console.log(data)
					_this.tableListData=data.data;
  				});

			},
			searchList:function(){
				this.search.pageNumber="1";
				this.tableList(this.search.pageNumber);
			},
			clearSearch:function(){
				this.search.pageNumber="1";
				this.search.parkName="";
			},
			
			toView:function(parkId,parkName){
				this.storageScenId(parkId);
				this.$router.push({path:'/main/park/parkset',query:{id:parkId,name:parkName}});
			},
			toStaff:function(parkId,parkName){
				this.storageScenId(parkId);
				this.$router.push({path:'/main/park/staff',query:{id:parkId,name:parkName}});
			},
			addrOrEdit:function(id){
				this.dialogFormVisible=true;

				this.$nextTick(function(){
					this.map = new BMap.Map("areaMap"); 
					this.map.centerAndZoom(new BMap.Point(113.937122, 22.542874), 12);   
					setMapEvent(this.map);
					addMapControl(this.map);

					var _this=this;
					this.map.addEventListener("click", function(e) {
					    // 创建地理编码服务实例
					    var myGeo = new BMap.Geocoder();
					    // 根据坐标得到地址描述
					    myGeo.getLocation(new BMap.Point(e.point.lng, e.point.lat), function(result) {
					        if (result) {
					        	// console.log(result)
					        	_this.form.address=result.address;
								_this.form.longitude=result.point.lng;
								_this.form.latitude=result.point.lat;
					        }

					    });
					});
				});

				if(Boolean(id)){
					this.form.id=id;
				}else{
					return this.form.id='';
				}

			},
			addrOrEditTrue:function(){

				var _this=this;

				this.$refs['form'].validate(function(valid,noStri){
					// console.log(valid)
					if(valid){
						_this.dialogFormVisible = false;

						_this.$postRequest(parkAdd(),{

							parkingId:_this.form.id,
							parkingType:_this.form.type,
							cityId:_this.form.city,
							parkingAddress:_this.form.address,
							parkingName:_this.form.name,
							pointLat:_this.form.latitude,
							pointLng:_this.form.longitude,
							userId:_this.form.manager,
							chargeRuleId:_this.form.chargeRuleId,

							parkingBusType: _this.form.parkingBusType

							/*parkingBusModel:"1",
							parkingDescription:"selfSupport",
							parkingBusType: "1",
							approachNum:0,*/
							
							
						}).then((data) => {
	        				if(data.status!=200) return;
				            _this.tableList(_this.curIndex);
	      				});

					}
				});
				
			},
			delPark:function(id){
				var _this=this;
				var index=_this.$layer.confirm('您确定删除该车场？', 
				{
				  btn: ['确定','取消'],
				  shade: true
				}, function(){
					_this.$layer.close(index);

					_this.$deleteRequest(parkAdd()+'/'+id).then((data) => {
        				if(data.status!=200) return _this.$layer.msg('删除失败', { time: 1});
						_this.tableList(_this.search.pageNumber)
      				});


				});
			},
			openDialog:function(){},
			closeDialog:function(){
				this.$refs['form'].resetFields();
			},
			getChargeRule:function(parkId,objCharge){
				this.dialogFormVisibleRule=true;
				// console.log(parkId,objCharge);
				var chargeRuleId=JSON.parse(objCharge).id;

				

				if(chargeRuleId=='3'){
					this.matchRuleStype=true;
					this.formRule.chargeRuleId=chargeRuleId;
					this.formRule.parkingId=parkId;
				}else if(chargeRuleId=='1'){
					this.matchRuleStype=false;
					this.formRuleOne.chargeRuleId=chargeRuleId;
					this.formRuleOne.parkingId=parkId;
				}

				


				this.$get(getChargeRule(),{
					parkingId:parkId,
					chargeRuleId:chargeRuleId
					
				}).then((data) => {
					if(data.status!=200) return;
					var result=data.data;
					if(chargeRuleId=='3'){
						for(var i=0;i<result.length;i++){
							if(result[i].carType=='auto'){
								this.formRule.freeTime=result[i].freeTime;
								this.formRule.openFlag=result[i].openFlag=='y'?true:false;

								for(var k in result[i]){
									this.formRule.params[0][k]=result[i][k];
								}

								this.formRule.params[0].StartOrEndTime=[result[i].firstStartTime,result[i].firstEndTime];
								

							}else if(result[i].carType=='truck'){
								this.formRule.params[1]=result[i];
							}else if(result[i].carType=='private'){

								for(var k in result[i]){
									this.formRule.params[2][k]=result[i][k];
								}
								
								this.formRule.params[2].StartOrEndTime=[result[i].firstStartTime,result[i].firstEndTime];
							}
						}
					}else if(chargeRuleId=='1'){

						for(var i=0;i<result.length;i++){
							if(result[i].carType=='auto'){
								this.formRuleOne.freeTime=result[i].wdFreeMin;

								for(var k in result[i]){
									this.formRuleOne.params[0][k]=result[i][k];
								}

								this.formRuleOne.params[0].wdStartOrEndTime=[result[i].wdStartTime,result[i].wdEndTime];
								
								this.formRuleOne.params[0].odStartOrEndTime=[result[i].odStartTime,result[i].odEndTime];
							}
						}
					}
				})


			},
			addrOrEditRuleTrue:function(){
				this.dialogFormVisibleRule=false;
				if(this.matchRuleStype){
					this.$postRequest(addOrUpdateChargeRule(),{
						chargeRuleId:this.formRule.chargeRuleId,
						params:[{
							parkingId:this.formRule.parkingId,
							freeTime:this.formRule.freeTime,
			        		carType:this.formRule.params[0].carType,

			        		lrId:this.formRule.params[0].lrId,
			        		openFlag:this.formRule.openFlag?'y':'n',
			        		monthsCardPrice:this.formRule.params[0].monthsCardPrice,
			        		firstStartTime:this.formRule.params[0].StartOrEndTime[0],
			        		firstEndTime:this.formRule.params[0].StartOrEndTime[1],
			        		odStartTime:this.formRule.params[0].StartOrEndTime[1],
			        		odEndTime:this.formRule.params[0].StartOrEndTime[0],

			        		firstHours:'1',
			        		firstPrice:this.formRule.params[0].firstPrice,
			        		firstHoursPrice:this.formRule.params[0].firstHoursPrice,
			        		odLastPrice:this.formRule.params[0].odLastPrice,

			        		tdHours:'1',
			        		tdPrice:this.formRule.params[0].tdPrice,
			        		tdHoursPrice:this.formRule.params[0].tdHoursPrice
			        	},{
							parkingId:this.formRule.parkingId,
							freeTime:this.formRule.freeTime,
			        		carType:this.formRule.params[1].carType,

			        		lrId:this.formRule.params[1].lrId,
			        		openFlag:this.formRule.openFlag?'y':'n',
			        		monthsCardPrice:this.formRule.params[1].monthsCardPrice,
			        		// StartOrEndTime:['00:00','00:00'],
			        		firstStartTime:this.formRule.params[0].StartOrEndTime[0],
			        		firstEndTime:this.formRule.params[0].StartOrEndTime[1],
			        		odStartTime:this.formRule.params[0].StartOrEndTime[1],
			        		odEndTime:this.formRule.params[0].StartOrEndTime[0],

			        		firstHours:'1',
			        		firstPrice:this.formRule.params[1].firstPrice,
			        		firstHoursPrice:this.formRule.params[1].firstHoursPrice,
			        		odLastPrice:this.formRule.params[1].odLastPrice,

			        		tdHours:'1',
			        		tdPrice:this.formRule.params[1].tdPrice,
			        		tdHoursPrice:this.formRule.params[1].tdHoursPrice
			        	},{
							parkingId:this.formRule.parkingId,
							freeTime:this.formRule.freeTime,
			        		carType:this.formRule.params[2].carType,

			        		lrId:this.formRule.params[2].lrId,
			        		// StartOrEndTime:['00:00','00:00'],
			        		firstStartTime:this.formRule.params[2].StartOrEndTime[0],
			        		firstEndTime:this.formRule.params[2].StartOrEndTime[1],
			        		odStartTime:this.formRule.params[2].StartOrEndTime[1],
			        		odEndTime:this.formRule.params[2].StartOrEndTime[0],

			        		firstHours:'1',
			        		firstPrice:this.formRule.params[2].firstPrice,
			        		firstHoursPrice:this.formRule.params[2].firstHoursPrice,
			        		odLastPrice:this.formRule.params[2].odLastPrice
			        	}]

					}).then((data) => {
	    				if(data.status!=200) return ;

	  				});
  				}else{
  					this.$postRequest(addOrUpdateChargeRule(),{
						chargeRuleId:this.formRuleOne.chargeRuleId,
						params:[{
							parkingId:this.formRuleOne.parkingId,
			        		carType:this.formRuleOne.params[0].carType,

			        		lrId:this.formRuleOne.params[0].lrId,

			        		wdStartTime:this.formRuleOne.params[0].wdStartOrEndTime[0],
			        		wdEndTime:this.formRuleOne.params[0].wdStartOrEndTime[1],

			        		wdAfterHourF:this.formRuleOne.params[0].wdAfterHourF,
			        		wdFirstHour:this.formRuleOne.params[0].wdAfterHourF,
			        		wdAfterHourL:this.formRuleOne.params[0].wdLastHour,
			        		wdLastHour:this.formRuleOne.params[0].wdLastHour,

			        		wdFirstPrice:this.formRuleOne.params[0].wdFirstPrice,
			        		wdAfterPrice:this.formRuleOne.params[0].wdAfterPrice,
			        		wdLastPrice:this.formRuleOne.params[0].wdLastPrice,
			        		wdFreeMin:this.formRuleOne.freeTime,

			        		odStartTime:this.formRuleOne.params[0].odStartOrEndTime[0],
			        		odEndTime:this.formRuleOne.params[0].odStartOrEndTime[1],

			        		odAfterHourF:this.formRuleOne.params[0].odAfterHourF,
			        		odFirstHour:this.formRuleOne.params[0].odAfterHourF,
			        		odAfterHourL:this.formRuleOne.params[0].odLastHour,
			        		odLastHour:this.formRuleOne.params[0].odLastHour,

			        		odFirstPrice:this.formRuleOne.params[0].odFirstPrice,
			        		odAfterPrice:this.formRuleOne.params[0].odAfterPrice,
			        		odLastPrice:this.formRuleOne.params[0].odLastPrice,
			        		odFreeMin:this.formRuleOne.freeTime

			        	}]

					}).then((data) => {
	    				if(data.status!=200) return ;

	  				});
  				}
			},
			
			openDialogRule:function(){},
			closeDialogRule:function(){
				this.$refs['formRule'].resetFields();

				// 室内3
		        this.formRule={
		        	chargeRuleId:'',
		        	parkingId:'',
		        	openFlag:false,
		        	freeTime:'',
		        	params:[{
		        		lrId:'',
		        		carType:'auto',
		        		StartOrEndTime:['00:00','00:00'],
		        		firstHours:'1',
		        		firstPrice:'',
		        		firstHoursPrice:'',
		        		odLastPrice:'',

		        		tdHours:'1',
		        		tdPrice:'',
		        		tdHoursPrice:'',
		        		monthsCardPrice:''
		        	},{
		        		lrId:'',
		        		carType:'truck',
		        		firstHours:'1',
		        		firstPrice:'',
		        		firstHoursPrice:'',
		        		odLastPrice:'',

		        		tdHours:'1',
		        		tdPrice:'',
		        		tdHoursPrice:'',
		        		monthsCardPrice:''
		        	},{
		        		lrId:'private',
		        		carType:'',
		        		StartOrEndTime:['00:00','00:00'],

		        		firstHours:'1',
		        		firstPrice:'',
		        		firstHoursPrice:'',
		        		odLastPrice:'',
		        		monthsCardPrice:''
		        	}]
		        };

		        //室外1
		        this.formRuleOne={
		        	chargeRuleId:'',
		        	parkingId:'',
		        	freeTime:'',
		        	params:[{
		        		lrId:'',
		        		carType:'auto',
		        		wdStartOrEndTime:['00:00','00:00'],
		        		wdAfterHourF:'',
		        		wdLastHour:'',

		        		wdFirstPrice:'',
		        		wdAfterPrice:'',
		        		wdLastPrice:'',
		        		wdFreeMin:'',

		        		odStartOrEndTime:['00:00','00:00'],
		        		odAfterHourF:'',
		        		odLastHour:'',

		        		odFirstPrice:'',
		        		odAfterPrice:'',
		        		odLastPrice:'',
		        		odFreeMin:''

		        	}]
		        };

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
    			this.parklist_btn_add = this.elements['parklist:btn_add'];
    			this.parklist_btn_rule = this.elements['parklist:btn_rule'];
    			this.parklist_btn_pkset = this.elements['parklist:btn_pkset'];
    			this.parklist_btn_person = this.elements['parklist:btn_person'];
	    	}
		},
		components:{
			Page
		},
		created:function(){
			this.permiss;

			this.getParkingBusType();
			this.getParkType();
			this.getAllManager();
			this.getCity();
			this.getRulesType();
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
	.table-rule {
		color: #222;
	    border-spacing: 0;
	    border-collapse: collapse;
	}
	.table-rule tr td {
		padding:10px 10px;
	    text-align: center;
	    border: 1px solid #ccc;
	    font-size: 14px;
	}

	.table-rule .money-input,.table-rule .time-input{
		width: 40px;
	    height: 26px;
	    border: 1px solid #ccc;
	    /* border: 1px solid #02c1af; */
	    border-radius: 2px;
	    text-align: center;
	    color: #222;
	    color: #02c1af;
	}
</style>