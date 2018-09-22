<template>
	
	<div>
		<div class="aside">
			<div class="panel panel-default">
				<div class="heading clearfix">
					<h3 class="fl">
						<span id="title-header">{{headTitle}}</span>
					</h3>
					<div class="btn-group fr">

						<el-dropdown trigger="click" @command="handleCommand">
						  	<el-button type="primary" size="small">
							    菜单<i class="el-icon-arrow-down el-icon--right"></i>
							</el-button>
						  	<el-dropdown-menu slot="dropdown">
						    	<el-dropdown-item command="1">场区</el-dropdown-item>
						    	<el-dropdown-item command="2">车位</el-dropdown-item>
						    	<el-dropdown-item command="3">出入口</el-dropdown-item>
						    	<el-dropdown-item command="4">其他部件</el-dropdown-item>
						  	</el-dropdown-menu>
						</el-dropdown>
					</div>
				</div>

				<div class="panel-body" id="tab-con">
				<!-- 场区 -->
					<div class="item-area" :class="{dn:command!='1'}">
						<div class="public_list" id="i_area">
							<el-tree :data="dataArea" :props="defaultProps" @node-click="getMapInfo" node-key="onlyId" :highlight-current="true" :default-expand-all="false" :show-checkbox="false" :default-expanded-keys="['1_0']">
								<span class="" slot-scope="{ node, data }">
									<span class="tree-label">{{ node.label}}</span>
								    <span>
								        <el-button v-if="data.level==2&&parkset_btn_editArea"
								            type="text"
								            size="mini"
								            @click="() => editArea(node, data)">
								            <i class="el-icon-edit-outline"></i>
								        </el-button>
								        <el-button v-else-if="parkset_btn_edit"
								            type="text"
								            size="mini"
								            @click="() => editPark(node, data)">
								            <i class="el-icon-edit-outline"></i>
								        </el-button>
								    </span>
						      	</span>
							</el-tree>
						</div>
						<div style="height:15px;"></div>
						<div class="public_btn">
							<button v-if="parkset_btn_addArea" type="button" class="btn btn-primary btn-sm btn-block" id="area" name="" @click="addArea()">添加场区&nbsp;<i class="fa fa-plus-square"></i></button>
							<div v-else class="show-height"></div>
						</div>
					</div>
				<!-- 车位 -->
					<div class="item-space" :class="{dn:command!='2'}">
						<div class="public_list" id="i_space">
							<el-tree @node-click="handleNodeClick" :data="dataSpace" :props="defaultProps" node-key="onlyId" :highlight-current="true" :default-expand-all="false" :show-checkbox="false" :default-expanded-keys="['1_0']">
								<span class="" slot-scope="{ node, data }">
									<span class="tree-label">{{ node.label}}</span>
								    <span>
								        <el-button
								        	v-if="data.level!=1&&parkset_btn_editSpace"
								            type="text"
								            size="mini"
								            @click="() => editSpace(node, data)">
								            <i class="el-icon-edit-outline"></i>
								        </el-button>
								        <el-button
								        	v-if="data.level!=1&&parkset_btn_bindSpace"
								            type="text"
								            size="mini"
								            @click="() => getsPaceBindEquip(node, data)">
								            <i class="el-icon-share"></i>
								        </el-button>
								    </span>
						      	</span>
							</el-tree>
						</div>
						<div style="height:15px;"></div>
						<div class="public_btn">
							<button v-if="parkset_btn_addSpace" type="button" class="btn btn-primary btn-sm btn-block" data-toggle="" data-target="" id="parking_space" name="" @click="addSpace()">添加车位&nbsp;<i class="fa fa-plus-square"></i></button>
							<div v-else class="show-height"></div>
						</div>
					</div>
				<!-- 出入口 -->
					<div class="item-outin" :class="{dn:command!='3'}">
						<div class="public_list" id="i_io">
							<el-tree @node-click="handleNodeClick" :data="dataIo" :props="defaultProps" node-key="onlyId" :highlight-current="true" :default-expand-all="false" :show-checkbox="false" :default-expanded-keys="['1_0']">
								<span class="" slot-scope="{ node, data }">
									<span class="tree-label">{{ node.label}}</span>
								    <span>
								        <el-button
								        	v-if="data.level!=1&&parkset_btn_editIo"
								            type="text"
								            size="mini"
								            @click="() => editIo(node, data)">
								            <i class="el-icon-edit-outline"></i>
								        </el-button>
								        <el-button
								        	v-if="data.level!=1&&parkset_btn_bindIo"
								            type="text"
								            size="mini"
								            @click="() => getsPaceBindEquip(node, data)">
								            <i class="el-icon-share"></i>
								        </el-button>
								    </span>
						      	</span>
							</el-tree>
						</div>
						<div style="height:15px;"></div>
						<div class="public_btn">
							<button v-if="parkset_btn_addIo" type="button" class="btn btn-primary btn-sm btn-block" data-toggle="" data-target="" id="outin" name="" @click="addIo()">添加出入口&nbsp;<i class="fa fa-plus-square"></i></button>
							<div v-else class="show-height"></div>
						</div>
					</div>
				<!-- 其他 -->
					<div class="item-custom" :class="{dn:command!='4'}">
						<div class="public_list" id="i_comp">
							<el-tree @node-click="handleNodeClick" :data="dataComp" :props="defaultProps" node-key="onlyId" :highlight-current="true" :default-expand-all="false" :show-checkbox="false" :default-expanded-keys="['1_0']">
								<span class="" slot-scope="{ node, data }">
									<span class="tree-label">{{ node.label}}</span>
								    <span>
								        <el-button
								        	v-if="data.level!=1&&parkset_btn_editComp"
								            type="text"
								            size="mini"
								            @click="() => editComp(node, data)">
								            <i class="el-icon-edit-outline"></i>
								        </el-button>
								        <el-button
								        	v-if="data.level!=1&&parkset_btn_delComp"
								            type="text"
								            size="mini"
								            @click="() => delComp(node, data)">
								            <i class="el-icon-delete"></i>
								        </el-button>
								    </span>
						      	</span>
							</el-tree>
						</div>
						<div style="height:15px;"></div>
						<div class="public_btn">
							<button v-if="parkset_btn_addComp" type="button" class="btn btn-primary btn-sm btn-block" data-toggle="" data-target="" id="custom" name="" @click="addComp()">添加其他部件&nbsp;<i class="fa fa-plus-square"></i></button>
							<div v-else class="show-height"></div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="map">
			<div class="panel panel-default" id="map1" :class="{dn:!mapOrBind}">
				<div class="heading clearfix">
					<h3 class="fl">
						<span>欢迎使用</span>
					</h3>

					<div class="btns fr">
						<!-- <button class="btn btn-primary btn-sm btn_right" id="sync">车位实时信息</button> -->
						<span class="btn btn-primary btn-sm" style="height: 30px;">
						当前场区：
							<input type="text" style="color:#000;" id="currentarea" readonly="readonly" v-model="parkInfo.parkingName+'-'+areaInfo.name">
						</span>
						<button type="button" class="btn btn-primary btn-sm btn_right" data-toggle="" data-target="">
							当前部件：&nbsp;<font id="current_component">{{currentComp.label}}</font>
						</button>
						<span class="btn btn-primary btn-sm btn_right" style="height: 30px;">
							缩放：
							<select v-model='areaInfo.scale' id="map_zoom" style="color:#000;">
								<option value="2">200%</option>
								<option value="1.5">150%</option>
								<option value="1.4">140%</option>
								<option value="1.3">130%</option>
								<option value="1.2">120%</option>
								<option value="1.1">110%</option>
								<option value="1">100%</option>
								<option value="0.9">90%</option>
								<option value="0.8">80%</option>
								<option value="0.7">70%</option>
								<option value="0.6">60%</option>
								<option value="0.5">50%</option>
							</select>
						</span>

					</div>

					<div class="btn-group fr" style="margin-right:5px;">
						<el-dropdown trigger="click">
						  	<el-button type="primary" size="small">
							    异常示例<i class="el-icon-arrow-down el-icon--right"></i>
							</el-button>
						  	<el-dropdown-menu slot="dropdown">
						    	<el-dropdown-item><img src="../../assets/images/red.png" alt=""><span style="padding:2px 8px;">地磁上报异常</span></el-dropdown-item>
						    	<el-dropdown-item><img src="../../assets/images/green.png" alt=""><span style="padding:2px 8px;">手持机上报故障</span></el-dropdown-item>
						    	<el-dropdown-item><img src="../../assets/images/yellow.png" alt=""><span style="padding:2px 8px;">通讯异常</span></el-dropdown-item>
						  	</el-dropdown-menu>
						</el-dropdown>
					</div>

				</div>
				<div class="panel-body">
					<div class="map-div" id="map_div">
						<table ref='workTable' :style="{ width: areaInfo.width + 'px', height: areaInfo.height + 'px', background: 'url('+areaInfo.background+') no-repeat left top',backgroundSize:'contain', transform: 'scale('+this.areaInfo.scale+')', transformOrigin: 'top left'}" id="map_workspace" class="map_workspace" @click="addCompToMap($event)" @mousedown="handleMousedown($event)" @mouseup="handleMouseup($event)" @contextmenu="handleContextmenu($event)">
							<tbody v-html="areaInfo.table">
								<!-- <tr v-for="(x,n) in areaInfo.y" v-html="$options.filters.detailEquipData(result)">
									<td v-for="(y,m) in areaInfo.x">1</td>
								</tr> -->
								<!-- <tr v-for="(y,n) in areaInfo.y">
									<td v-for="(x,m) in areaInfo.x">
										
									</td>
									
								</tr> -->
							</tbody>
						</table>
					</div>
				</div>
			</div>

			<div class="content panel panel-default" id="bindcontent" :class="{dn:mapOrBind}">

    			<div class="title-bind">
    				<span @click="handleBack" class="backmap" id="backmap"><i class="el-icon-back"></i></span>

    				<span id="bind_space_num">绑定设备<em style="color:#1bc3b4;">{{currentComp.label}}</em></span>

    			</div>
    			<div class="plist" id="bindlist">

					<div v-for="(item,index) in spaceEquipList">
						<div class="kind clearfix">
							<span>{{item.typeName}}</span>
							<button type="button" class="fr btn btn-primary" @click="spaceBindEquip(item.typeCode)">绑定</button>
						</div>
						<div class="">
							<ul class="klist">
								<li class="clearfix" :key="itemSub.devId" v-for="(itemSub) in spaceBindedList" v-if="itemSub.onerankdevType==item.typeCode">
									<span>设备ID：{{itemSub.devId}}，设备SN：{{itemSub.onerankdevDevSn}}</span>
									<button type="button" class="fr btn btn-default del" @click="spaceUnbindEquip(itemSub.onerankdevDevSn,itemSub.devId)">解绑</button>
								</li>
							</ul>
						</div>
					</div>

    			</div>
    		</div>
			
		</div>
		

		<!-- 编辑车场 -->
		<el-dialog title="编辑停车场" :visible.sync="dialogFormVisible" width="900px"  @open="openDialog" @close="closeDialog">
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
			      			<el-input v-model="form.name" auto-complete="off" onkeyup="this.value=this.value.replace(/^ +| +$/g,'')"></el-input>
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
							      v-for="(item,index) in allChargeRule"
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

				<div class="fr" id="areaMap" style="width: 52%;height: 340px;">
					
				</div>

		  	</div>

		  	<div slot="footer" class="dialog-footer">
		    	<el-button type="primary" @click="editParkTrue">确 定</el-button>
		    	<el-button @click="dialogFormVisible = false">取 消</el-button>
		  	</div>
		</el-dialog>


		<!-- 添加/编辑区层 -->
		<el-dialog title="添加/编辑区层" :visible.sync="dialogFormVisibleArea" width="430px"  @open="openDialogArea" @close="closeDialogArea">
			<el-form ref="formArea" label-position="right" :model="formArea" :rules="rulesArea" :label-width="formLabelWidth">
				
				<el-form-item label="车场名称">
		    		<el-col :span="18">
		      			<el-input readonly v-model="parkInfo.parkingName" auto-complete="off"></el-input>
		      		</el-col>
		      	</el-form-item>
				
				<el-form-item label="区层名称" prop="name">
		    		<el-col :span="18">
		      			<el-input v-model.trim="formArea.name" auto-complete="off" onkeyup="this.value=this.value.replace(/^ +| +$/g,'')"></el-input>
		      		</el-col>
		      	</el-form-item>
		      	
				
				<el-form-item label="区层类型" prop="type">
		    		<el-col :span="18">
		      			<el-select v-model="formArea.type" placeholder="请选择">
						    <el-option
						      v-for="(item,index) in areaAllType"
						      :key="item.index"
						      :label="item.label"
						      :value="item.value">
						    </el-option>
						  </el-select>
		      		</el-col>
		      	</el-form-item>
				
				<el-form-item label="布局长度" prop="width">
		    		<el-col :span="18">
		      			<el-input v-model.trim="formArea.width" auto-complete="off" onkeyup="this.value=this.value.replace(/^ +| +$/g,'')">
		      				<template slot="append">最佳长度16</template>
		      			</el-input>
		      		</el-col>
		    	</el-form-item>
		      	<el-form-item label="布局宽度" prop="height">
		    		<el-col :span="18">
		      			<el-input v-model.trim="formArea.height" auto-complete="off" onkeyup="this.value=this.value.replace(/^ +| +$/g,'')">
		      				<template slot="append">最佳宽度10</template>
		      			</el-input>
		      		</el-col>
		    	</el-form-item>

		      	<el-form-item label="布局底图" prop="bgImgUrl">
		    		<el-col :span="18">
		      			<el-input readonly v-model="formArea.bgImgUrl" auto-complete="off"></el-input>
		      		</el-col>
		      		<el-col :span="5" style="margin-left:6px;">
		      			<el-upload
						  class="upload-demo"
						  action="http://47.106.149.52:9992/oss/upload"
						  :on-error="handleError"
						  :on-success="handleSuccess"
						  :limit="3"
						  :show-file-list="false"
						  :auto-upload="true"
						  :data='{pathName:"itparking/web"}'
						  name="file">
						  <el-button size="small" type="primary">上传</el-button>
						</el-upload>
		      		</el-col>
		    	</el-form-item>
				
				<el-form-item label="显示底图">
		    		<el-col :span="18">
		      			<el-select v-model="formArea.bgImgType" placeholder="请选择">
						    <el-option
						      v-for="(item,index) in bgImgAllType"
						      :key="item.index"
						      :label="item.label"
						      :value="item.value">
						    </el-option>
						  </el-select>
		      		</el-col>
		      	</el-form-item>
				
			</el-form>
		  	
		  	<div slot="footer" class="dialog-footer">
		    	<el-button type="primary" @click="addEditAreaTrue">确 定</el-button>
		    	<el-button @click="dialogFormVisibleArea = false">取 消</el-button>
		  	</div>
		</el-dialog>


		<!-- 添加/编辑车位 -->
		<el-dialog title="添加/编辑车位" :visible.sync="dialogFormVisibleSpace" width="430px"  @open="openDialogSpace" @close="closeDialogSpace">
			<el-form ref="formSpace" label-position="right" :model="formSpace" :rules="rulesSpace" :label-width="formLabelWidth">
				
				<el-form-item label="所属区层">
		    		<el-col :span="18">
		      			<el-input readonly v-model="parkInfo.parkingName+areaInfo.name" auto-complete="off"></el-input>
		      		</el-col>
		      	</el-form-item>
				
				<el-form-item label="车位号码" prop="number">
		    		<el-col :span="18">
		      			<el-input v-model.trim="formSpace.number" auto-complete="off" onkeyup="this.value=this.value.replace(/^ +| +$/g,'')"></el-input>
		      		</el-col>
		      	</el-form-item>
		      	
				
				<el-form-item label="车位类型">
		    		<el-col :span="18">
		      			<el-select @change="changeSpaceType" v-model="formSpace.type" placeholder="请选择">
						    <el-option
						      v-for="(item,index) in spaceAllType"
						      :key="item.index"
						      :label="item.labelZhCh"
						      :value="item.value">
						    </el-option>
						  </el-select>
		      		</el-col>
		      	</el-form-item>
				
				<el-form-item v-if="userShow" label="用户手机" prop="userId">
		    		<el-col :span="18">
		      			<el-select filterable v-model="formSpace.userId" placeholder="请选择">
						    <el-option
						      v-for="(item,index) in allUser"
						      :key="item.index"
						      :label="item.mobile"
						      :value="item.id">
						    </el-option>
						  </el-select>
		      		</el-col>
		      	</el-form-item>
				
				<el-form-item label="占格方向">
		    		<el-col :span="18">
		      			<el-select v-model="formSpace.toward" placeholder="请选择">
						    <el-option
						      v-for="(item,index) in spaceAllToward"
						      :key="item.index"
						      :label="item.label"
						      :value="item.value">
						    </el-option>
						  </el-select>
		      		</el-col>
		      	</el-form-item>
			</el-form>
		  	
		  	<div slot="footer" class="dialog-footer">
		    	<el-button type="primary" @click="addEditSpaceTrue">确 定</el-button>
		    	<el-button @click="dialogFormVisibleSpace = false">取 消</el-button>
		  	</div>
		</el-dialog>
		
		<!-- 添加/编辑出入口 -->
		<el-dialog title="添加/编辑出入口" :visible.sync="dialogFormVisibleIo" width="430px"  @open="openDialogIo" @close="closeDialogIo">
			<el-form ref="formIo" label-position="right" :model="formIo" :rules="rulesIo" :label-width="formLabelWidth">
				
				<el-form-item label="所属区层">
		    		<el-col :span="18">
		      			<el-input readonly v-model="parkInfo.parkingName+areaInfo.name" auto-complete="off"></el-input>
		      		</el-col>
		      	</el-form-item>
				
				<el-form-item label="类型">
		    		<el-col :span="18">
		      			<el-select v-model="formIo.type" placeholder="请选择">
						    <el-option
						      v-for="(item,index) in ioAllType"
						      :key="item.index"
						      :label="item.labelZhCh"
						      :value="item.value">
						    </el-option>
						  </el-select>
		      		</el-col>
		      	</el-form-item>

				<el-form-item label="名称" prop="name">
		    		<el-col :span="18">
		      			<el-input v-model.trim="formIo.name" auto-complete="off" onkeyup="this.value=this.value.replace(/^ +| +$/g,'')"></el-input>
		      		</el-col>
		      	</el-form-item>

		      	<el-form-item label="摄像机SN" prop="sn">
		    		<el-col :span="18">
		      			<el-input v-model="formIo.sn" auto-complete="off"></el-input>
		      		</el-col>
		      	</el-form-item>
		      	
				
				
				
				
			</el-form>
		  	
		  	<div slot="footer" class="dialog-footer">
		    	<el-button type="primary" @click="addEditIoTrue">确 定</el-button>
		    	<el-button @click="dialogFormVisibleIo = false">取 消</el-button>
		  	</div>
		</el-dialog>

		<!-- 添加/编辑其他部件 -->
		<el-dialog title="添加/编辑其他部件" :visible.sync="dialogFormVisibleComp" width="430px"  @open="openDialogComp" @close="closeDialogComp">
			<el-form ref="formComp" label-position="right" :model="formComp" :rules="rulesComp" :label-width="formLabelWidth">
				
				<el-form-item label="所属区层">
		    		<el-col :span="18">
		      			<el-input readonly v-model="parkInfo.parkingName+areaInfo.name" auto-complete="off"></el-input>
		      		</el-col>
		      	</el-form-item>
				
				<el-form-item label="名称" prop="name">
		    		<el-col :span="18">
		      			<el-input v-model.trim="formComp.name" auto-complete="off" onkeyup="this.value=this.value.replace(/^ +| +$/g,'')"></el-input>
		      		</el-col>
		      	</el-form-item>
				
				<el-form-item label="图片" prop="compImgUrl">
		    		<el-col :span="18">
		      			<el-input readonly v-model="formComp.compImgUrl" auto-complete="off"></el-input>
		      		</el-col>
		      		<el-col :span="5" style="margin-left:6px;">
		      			<el-upload
						  class="upload-demo"
						  action="http://47.106.149.52:9992/oss/upload"
						  :on-error="handleErrorComp"
						  :on-success="handleSuccessComp"
						  :limit="3"
						  :show-file-list="false"
						  :auto-upload="true"
						  :data='{pathName:"itparking/web"}'
						  name="file">
						  <el-button size="small" type="primary">上传</el-button>
						</el-upload>
		      		</el-col>
		    	</el-form-item>

				<el-form-item label="通行">
		    		<el-col :span="18">
		      			<el-select v-model="formComp.type" placeholder="请选择">
						    <el-option
						      v-for="(item,index) in compAllType"
						      :key="item.index"
						      :label="item.label"
						      :value="item.value">
						    </el-option>
						  </el-select>
		      		</el-col>
		      	</el-form-item>

			</el-form>
		  	
		  	<div slot="footer" class="dialog-footer">
		    	<el-button type="primary" @click="addEditCompTrue">确 定</el-button>
		    	<el-button @click="dialogFormVisibleComp = false">取 消</el-button>
		  	</div>
		</el-dialog>

		<!-- 绑定设备 -->
		<el-dialog title="设备" :visible.sync="dialogFormVisibleEquip" width="560px"  @open="openDialogEquip" @close="closeDialogEquip">
			<el-form ref="formEquip" label-position="right" :model="formEquip" :rules="rulesEquip" :label-width="formLabelWidth">

				<el-form-item label="SN" prop="sn">
		    		<el-col :span="18">
		      			<el-select v-model="formEquip.sn" placeholder="请选择" style="width:100%;">
						    <el-option
						      v-for="(item,index) in spaceUseEquip"
						      :key="item.index"
						      :label="item.onerankdevDevSn"
						      :value="item.onerankdevDevSn">
						    </el-option>
						  </el-select>
		      		</el-col>
		      	</el-form-item>

			</el-form>
		  	
		  	<div slot="footer" class="dialog-footer">
		    	<el-button type="primary" @click="spaceBindEquipTrue">确 定</el-button>
		    	<el-button @click="dialogFormVisibleEquip = false">取 消</el-button>
		  	</div>
		</el-dialog>
		
		<!-- 右击 -->
		<el-dialog title="部件修改" :visible.sync="dialogFormVisibleBase" width="430px"  @open="openDialogBase" @close="closeDialogBase">
			<el-form ref="formBase" label-position="right" :model="formBase" :rules="rulesBase" :label-width="formLabelWidth">
				
				
				<el-form-item label="当前部件">
		    		<el-col :span="18">
		      			<el-input readonly v-model="formBase.name" auto-complete="off"></el-input>
		      		</el-col>
		      	</el-form-item>
		      	
				
				<el-form-item v-if="towardAndAngle" label="占格方向">
		    		<el-col :span="18">
		      			<el-select v-model="formBase.toward" placeholder="请选择">
						    <el-option
						      v-for="(item,index) in baseAllToward"
						      :key="item.index"
						      :label="item.label"
						      :value="item.value">
						    </el-option>
						  </el-select>
		      		</el-col>
		      	</el-form-item>
				
				<el-form-item v-if="!towardAndAngle" label="旋转角度">
		    		<el-col :span="18">
		      			<el-select v-model="formBase.angle" placeholder="请选择">
						    <el-option
						      v-for="(item,index) in baseAllAngle"
						      :key="item.index"
						      :label="item.label"
						      :value="item.value">
						    </el-option>
						  </el-select>
		      		</el-col>
		      	</el-form-item>

			</el-form>
		  	
		  	<div slot="footer" class="dialog-footer">
		    	<el-button type="primary" @click="addEditBaseTrue">修改</el-button>
		    	<el-button v-if="qrCodeBtn" @click="createQr">二维码</el-button>
		    	<el-button @click="removeBase">移除</el-button>
		    	<el-button @click="dialogFormVisibleBase = false">取 消</el-button>
		  	</div>
		</el-dialog>

	</div>
	
</template>
<script>
	import { mapGetters } from 'vuex';

	import {parkingBusType,dictValue,getUserList,getCity,parkAdd,getParkSingle,addMapOverlay,addMapOverlayl,setMapEvent,addMapControl,getManagerList, getArea,getAreaAllData,getAreaSingle,addEditArea, addEditSpace,getSpaceSingle,addEditIo,getIoSingle,addEditComp,getCompSingle,addDataComp,getDataSingle,getSpaceBindEquip,getSpaceEquip,spaceBindEquip,spaceUnbindEquip, getIoBindEquip,getIoEquip,ioBindEquip,ioUnbindEquip, qrCode} from '../../api/url.js';

	import Paho from '../../utils/mqttws31.js';

	
	export default {
		data(){
			return{
				parkset_btn_edit:false,
				parkset_btn_editArea:false,
				parkset_btn_addArea:false,

				parkset_btn_addSpace:false,
				parkset_btn_editSpace:false,
				parkset_btn_bindSpace:false,

				parkset_btn_addIo:false,
				parkset_btn_editIo:false,
				parkset_btn_bindIo:false,

				parkset_btn_addComp:false,
				parkset_btn_editComp:false,
				parkset_btn_delComp:false,

				vueMqtt:{
					hostname : '47.106.143.1',
					port : 3001,
					timeout : 5,  
                	keepAlive : 50,  
                	cleanSession : false,  
                	useTLS : false,

                	userName : 'adminSlwl', 
                	password : 'admin123456',
                	topic : 'iot-topic/web/d0b691961df24bdfbedc180501dad2f9',

                	reconnectTimeout : 2000,
                	client:null
				},
				parkId:'',
				parkName:'',
				parkInfo:{},
				areaInfo:{
					id:159,
					name:'',
					width:52,
					height:52,
					background:'',
					size:50,
					x:10,
					y:10,

					table:'',
					scale:'1'
				},
				PD:{},
				command:1,
				headTitle:'场区管理',
				defaultProps: {
		          	children: 'children',
		          	label: 'label'
		        },
				dataArea: [],
				dataSpace:[],
				dataIo:[],
			    dataComp:[{
					label: '一级 1',
					id:'1',
					children:[{
						label: '二级 1-1',
						id:'1-1'
					}]
				}],

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
				allChargeRule:[{
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
		          	scenImgUrl:'',
		          	address:'',
		          	longitude:'',
		          	latitude:'',
		          	chargeRuleId:'1',
		          	manager:'',
		          	parkingBusType:''
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


		        dialogFormVisibleArea: false,
				areaAllType:[{
					label:'地上',
					value:'1'
				},{
					label:'地下',
					value:'0'
				}],
				bgImgAllType:[{
					label:'是',
					value:'1'
				},{
					label:'否',
					value:'0'
				}],
		        formArea: {
		        	id:'',
		          	name:'',
		          	type:'1',
		          	width:'',
		          	height:'',
		          	bgImgUrl:'',
		          	bgImgType:'1'
		        },
		        rulesArea:{
		        	name: [
			            { required: true, message: '请填写区层名称', trigger: 'blur' },
			            { min: 2, max: 5, message: '长度在 2 到 5 个字符', trigger: 'blur' }
			        ],
			        width:[
			            { 
			            	required: true, 
			            	trigger: 'blur',
			            	type:'number',
			            	validator:(rule,value,callback)=>{
			            		// console.log(rule,value);
			            		if(value != ""){
						            if((/^\d{1,3}$/).test(value) == false){
						                callback(new Error("请填写1到3位数字"));
						            }else{
						                callback();
						            }
						        }else{
						            callback(new Error("请填写长度"));
						        }
			            	}
			            }
			        ],
			        height:[
			            { 
			            	required: true, 
			            	trigger: 'blur',
			            	type:'number',
			            	validator:(rule,value,callback)=>{
			            		// console.log(rule,value);
			            		if(value != ""){
						            if((/^\d{1,3}$/).test(value) == false){
						                callback(new Error("请填写1到3位数字"));
						            }else{
						                callback();
						            }
						        }else{
						            callback(new Error("请填写宽度"));
						        }
			            	}
			            }
			        ],
			        bgImgUrl: [
			            { required: false}
			        ]
			        
		        },
		        
		        dialogFormVisibleSpace: false,
				spaceAllToward:[{
					label:'上',
					value:'1'
				},{
					label:'右',
					value:'2'
				},{
					label:'下',
					value:'3'
				},{
					label:'左',
					value:'4'
				}],
				spaceAllType:[{
					labelZhCh:'普通车位',
					value:'common'
				},{
					labelZhCh:'vip车位',
					value:'vip'
				},{
					labelZhCh:'临时车位',
					value:'temporary'
				},{
					labelZhCh:'私人车位',
					value:'private'
				}],
				allUser:[],
				/*spaceAllStatus:[{
					label:'通讯异常',
					value:'communication'
				},{
					label:'地磁上报异常',
					value:'geomagnetic'
				},{
					label:'手持机上报异常',
					value:'handheld_machine'
				},{
					label:'有效',
					value:'y'
				},{
					label:'无效',
					value:'n'
				}],*/
				userShow:false,
		        formSpace: {
		        	id:'',
		        	userId:'',
		          	number:'',
		          	type:'common',
		          	toward:'1',

		          	angle:0,
		          	zoom:100,
		          	x:0,
		          	y:0,

		          	status:'normal',	//异常类型
		          	lotType:'n'		//有无车
		        },
		        rulesSpace:{
		        	number:[
			            {
			            	required: true, 
			            	trigger: 'blur',
			            	type:'number',
			            	validator:(rule,value,callback)=>{
			            		// console.log(rule,value);
			            		if(value != ""){
						            if((/^\d{6,6}$/).test(value) == false){
						                callback(new Error("请填写6位数字"));
						            }else{
						                callback();
						            }
						        }else{
						            callback(new Error("请填写车位号"));
						        }
			            	}
			            }
			        ],
			        userId:[
			            { required: true, message: '请选择用户', trigger: ['blur', 'change'] }
			        ]
		        },

		        dialogFormVisibleIo: false,
				ioAllToward:[{
					label:'上',
					value:'1'
				},{
					label:'右',
					value:'2'
				},{
					label:'下',
					value:'3'
				},{
					label:'左',
					value:'4'
				}],
				ioAllType:[{
					labelZhCh:'入口',
					value:'entrance'
				},{
					labelZhCh:'出口',
					value:'exit'
				}],
				
		        formIo: {
		        	id:'',
		          	name:'',
		          	type:'entrance',
		          	sn:'',

		          	toward:'1',
		          	angle:0,
		          	zoom:100,
		          	x:0,
		          	y:0
		        },
		        rulesIo:{
		        	name: [
			            { required: true, message: '请填写名称', trigger: 'blur' },
			            { min: 2, max: 5, message: '长度在 2 到 5 个字符', trigger: 'blur' }
			        ],
			        sn: [
						{ required: false},
						{ pattern: /^[A-Za-z0-9]+$/, message: '请输入数字或者字母' }
			        ]
		        },

		        dialogFormVisibleComp: false,
		        compAllType:[{
					label:'不允许',
					value:'0'
				},{
					label:'允许',
					value:'1'
				}],
		        formComp: {
		        	id:'',
		          	name:'',
		          	type:'0',
		          	compImgUrl:'',

		          	toward:'1',
		          	angle:0,
		          	zoom:100,
		          	x:0,
		          	y:0
		        },
		        rulesComp:{
		        	name: [
			            { required: true, message: '请填写名称', trigger: 'blur' },
			            { min: 2, max: 5, message: '长度在 2 到 5 个字符', trigger: 'blur' }
			        ],
			        compImgUrl: [
			            { required: false}
			        ]
		        },

		        currentComp:{
		        	label:'请选择',
		        	type:'N'
		        },

		        mapOrBind:true,
				spaceEquipList:[],
				spaceBindedList:[],
				

				dialogFormVisibleEquip: false,
		        spaceUseEquip:[],
		        formEquip: {
		          	sn:[]
		        },
		        rulesEquip:{
		        	sn:[
			            { required: true, message: '请选择sn', trigger: ['blur', 'change'] }
			        ]
		        },

		        dialogFormVisibleBase: false,
				baseAllToward:[{
					label:'上',
					value:'1'
				},{
					label:'右',
					value:'2'
				},{
					label:'下',
					value:'3'
				},{
					label:'左',
					value:'4'
				}],
				baseAllAngle:[{
					label:'0',
					value:0
				},{
					label:'30',
					value:30
				},{
					label:'60',
					value:60
				},{
					label:'90',
					value:90
				},{
					label:'120',
					value:120
				},{
					label:'150',
					value:150
				},{
					label:'180',
					value:180
				},{
					label:'210',
					value:210
				},{
					label:'240',
					value:240
				},{
					label:'270',
					value:270
				},{
					label:'300',
					value:300
				},{
					label:'330',
					value:330
				}],
				towardAndAngle:true,
				qrCodeBtn:true,
		        formBase: {
		        	typeCode:'',
		        	id:'',
		          	name:'',
		          	toward:'1',

		          	angle:0,
		          	zoom:100,
		          	x:0,
		          	y:0,
		          	compType:''
		        },
		        rulesBase:{},

		        controlMouse:{

		        	targetDiv:'',
		        	parentDiv:'',
		        	tdClass:'',
		        	tdStyle:''
		        }
				
			}
		},
		methods:{

			MQTTconnect:function(){

				this.vueMqtt.client = new Paho.MQTT.Client(this.vueMqtt.hostname, this.vueMqtt.port, "web_" + parseInt(Math.random() * 100,10));


				var options = {  
                    invocationContext: {  
                        host : this.vueMqtt.hostname,  
                        port: this.vueMqtt.port,  
                        path: this.vueMqtt.client.path,
                        clientId: "web_" + parseInt(Math.random() * 100,10) 
                    },  
                    timeout: this.vueMqtt.timeout,  
                    keepAliveInterval: this.vueMqtt.keepAlive,  
                    cleanSession: this.vueMqtt.cleanSession,  
                    useSSL: this.vueMqtt.useTLS,  
                    userName: this.vueMqtt.userName,  
                    password: this.vueMqtt.password,  
                    onSuccess: this.onConnect,  
                    onFailure: this.onFailure
                }; 
                // this.vueMqtt.client.onConnectionLost = this.onConnectionLost;  
                
                // this.vueMqtt.client.onMessageArrived = this.onMessageArrived;

                this.vueMqtt.client.connect(options);

			},

			onConnect:function(){
				console.log("connected");
                this.vueMqtt.client.subscribe(this.vueMqtt.topic);
			},

			onFailure:function(){
				console.log('error');
				setTimeout(this.MQTTconnect, this.vueMqtt.reconnectTimeout);
			},
			onConnectionLost:function(responseObject){
				setTimeout(this.MQTTconnect, this.vueMqtt.reconnectTimeout);
			},
			onMessageArrived:function(message){
				// console.log(message);
                // console.log("收到消息:"+message.payloadString);
                var mqttPd=JSON.parse(message.payloadString) ;
                if(this.areaInfo.id==mqttPd.data.parkingArea.areaId){
                	var parkArea=mqttPd.data.parkingArea;
                	this.initTable(parkArea.width,parkArea.height,mqttPd.data,this.areaInfo.size);
                }
			},

			openDialogEquip:function(){
				
			},
			closeDialogEquip:function(){
				this.$refs['formEquip'].resetFields();
				
			},
			getsPaceBindEquip:function(node,data){
				this.mapOrBind=false;

				// console.log(data);
				if(data.type=='space'){
					this.$get(getSpaceBindEquip()+'/'+data.id).then((data) => {
						this.spaceEquipList=data.data.sceneDevList;
						this.spaceBindedList=data.data.onerankdevList;
					})
				}else{
					this.$get(getIoBindEquip()+'/'+data.id).then((data) => {
						this.spaceEquipList=data.data.sceneDevList;
						this.spaceBindedList=data.data.onerankdevList;
					})
				}
			},
			spaceBindEquip:function(typeCode){
				this.dialogFormVisibleEquip=true;
				console.log(this.currentComp);
				if(this.currentComp.type=='space'){
					this.$get(getSpaceEquip(),{
						devType:typeCode
					}).then((data) => {
						this.spaceUseEquip=data.data.rows;
					})
				}else{
					this.$get(getIoEquip(),{
						devType:typeCode
					}).then((data) => {
						this.spaceUseEquip=data.data.rows;
					})
				}
			},
			spaceBindEquipTrue:function(){
				var _this=this;
				this.$refs['formEquip'].validate(function(valid,noStri){
					// console.log(valid)
					if(valid){
						_this.dialogFormVisibleEquip=false;
						if(_this.currentComp.type=='space'){
							_this.$postRequest(spaceBindEquip(),{
								onerankdevSn:_this.formEquip.sn,
								spaceId:_this.currentComp.id
							}).then((data) => {
								_this.getsPaceBindEquip({},_this.currentComp);
							})
						}else{
							_this.$postRequest(ioBindEquip(),{
								onerankdevSn:_this.formEquip.sn,
								parkingioId:_this.currentComp.id
							}).then((data) => {
								_this.getsPaceBindEquip({},_this.currentComp);
							})
						}
					}
				});
			},
			spaceUnbindEquip:function(sn,id){
				var _this=this;
				var index=_this.$layer.confirm('您确定解绑该设备？', {
				  btn: ['确定','取消'],
				  shade: true
				}, function(){
					_this.$layer.close(index);
					if(_this.currentComp.type=='space'){
						_this.$deleteRequest(spaceUnbindEquip()+'?devSn='+sn).then((data) => {
		    				// if(data.status!=200) return;
				            _this.getsPaceBindEquip({},_this.currentComp);
		  				});
		  			}else{
		  				_this.$deleteRequest(ioUnbindEquip(),{
		  					onerankdevSn:sn,
							parkingioId:_this.currentComp.id
		  				}).then((data) => {
		    				// if(data.status!=200) return;
				            _this.getsPaceBindEquip({},_this.currentComp);
		  				});
		  			}
  				});
			},
			handleBack:function(){
				this.mapOrBind=true;
			},

			getSpaceType:function(){
				this.$get(dictValue()+'/space_type').then((data) => {
					this.spaceAllType=data.data.rows;
				})
			},
			getAllUser:function(){
				this.$get(getUserList(),{
			    	mobile:'',
			    	limit:"0"
			    }).then((data) => {
    				if(data.status!=200) return;
		            this.allUser=data.data.rows;
  				});
			},
			getIoType:function(){
				this.$get(dictValue()+'/parking_io_type').then((data) => {
					this.ioAllType=data.data.rows;
				})
			},

			handleNodeClick:function(data){
				// console.log(data)
				this.currentComp=data;
			},
			addCompToMap:function(e){
				// console.log(e);
				var target= e.srcElement ? e.srcElement : e.target;
				if(target.tagName!="TD") return;

				var x = target.cellIndex + 1;;
				var y = target.parentNode.rowIndex + 1;

				if(this.currentComp.type=='N') return;

				if(this.currentComp.type=='space'){
					// console.log(x,y);

					this.$putRequest(addEditSpace()+'/'+this.currentComp.id,{
						parkingId:this.parkId,
						areaId:this.areaInfo.id,

						spaceId:this.currentComp.id,
						userId:this.currentComp.userId,
						abscissa:x,
						ordinate:y

					}).then((data) => {
        				if(data.status!=200) return;
			            this.getMapInfo(this.areaInfo,false);
      				});

				}else if(this.currentComp.type=='io'){
					this.$putRequest(addEditIo()+'/'+this.currentComp.id,{
						parkingId:this.parkId,
						parkingAreaId:this.areaInfo.id,

						parkingIoId:this.currentComp.id,
						x: x,
						y: y

					}).then((data) => {
        				if(data.status!=200) return;
			            this.getMapInfo(this.areaInfo,false);
      				});
				}else if(this.currentComp.type=='comp'){
					this.$postRequest(addDataComp(),{
						parkingId:this.parkId,
						parkingAreaId:this.areaInfo.id,

						parkingComponentId:this.currentComp.id,
						x: x,
						y: y

					}).then((data) => {
        				if(data.status!=200) return;
			            this.getMapInfo(this.areaInfo,false);
      				});
				}

			},

			getParkingBusType:function(){
				this.$get(parkingBusType()).then((data) => {
					this.allParkingBusType=data;
				})
			},
			getParkType:function(){
				this.$get(dictValue()+'/parking_type').then((data) => {
					this.allType=data.data.rows;
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
			changeCity:function(val){
				let obj = {};  
			    obj = this.allCity.find((item)=>{ 
			    return item.id === val;
			    });  
			    // console.log(obj.name);
				this.map.centerAndZoom(obj.name,12);
			},
			openDialog:function(){},
			closeDialog:function(){
				this.$refs['form'].resetFields();
			},
			editPark:function(node,data){
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

				this.$postRequest(getParkSingle(),{parkingId:data.id}).then((data) => {
    				if(data.status!=200) return;
		            this.form.id=data.data.parkingId;
		            this.form.name=data.data.parkingName;
		            this.form.type=data.data.parkingType;
		            this.form.city=data.data.cityId;
		            this.form.address=data.data.parkingAddress;

		            this.form.latitude=data.data.pointLat;
		            this.form.longitude=data.data.pointLng;
		            this.form.manager=data.data.userId;
		            this.form.chargeRuleId=data.data.chargeRuleId;
		            this.form.parkingBusType=data.data.parkingBusType;

		            addMapOverlayl(data.data.pointLat, data.data.pointLng, this.map,);
							
					this.map.panTo(new BMap.Point(data.data.pointLng,data.data.pointLat),{noAnimation:true});

  				});

			},
			editParkTrue:function(){

				var _this=this;

				this.$refs['form'].validate(function(valid,noStri){
					// console.log(valid)
					if(valid){
						_this.dialogFormVisible = false;

						_this.$putRequest(parkAdd()+'/'+_this.form.id,{

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
				            _this.getArea(_this.parkId);
	      				});

					}
				});
				
			},

			openDialogArea:function(){
				
			},
			closeDialogArea:function(){
				// this.$refs['form'].resetFields();
				this.$refs['formArea'].resetFields();
				
			},
			addArea:function(id){
				this.dialogFormVisibleArea=true;
				this.formArea.id='';
			},
			editArea:function(node,data){
				if(data.level==1){

				}else if(data.level==2){
					this.dialogFormVisibleArea=true;
					this.$postRequest(getAreaSingle(),{areaId:data.id}).then((data) => {
	    				if(data.status!=200) return;
			            this.formArea.id=data.data.areaId;
			            this.formArea.name=data.data.areaName;
			            this.formArea.type=data.data.areaType;
			            this.formArea.width=data.data.width;
			            this.formArea.height=data.data.height;
			            this.formArea.bgImgUrl=data.data.bgImg;
			            this.formArea.bgImgType=data.data.bgimgFlag;
	  				});
				}
				
			},
			handleError(rr, file, fileList) {
		        console.log(file, fileList);
		    },
		    handleSuccess(response, file, fileList) {
		        this.formArea.bgImgUrl=response.data;
		    },

			addEditAreaTrue:function(){
				var _this=this;
				this.$refs['formArea'].validate(function(valid,noStri){
					if(valid){
						_this.dialogFormVisibleArea = false;

						if(!Boolean(_this.formArea.id)){


							_this.$postRequest(addEditArea(),{
								parkingId:_this.parkId,

								// areaId:_this.formArea.id,
								areaName:_this.formArea.name,
								areaType:_this.formArea.type,
								bgImg:_this.formArea.bgImgUrl,
								bgimgFlag:_this.formArea.bgImgType,
								height:_this.formArea.height,
								width:_this.formArea.width

							}).then((data) => {
		        				if(data.status!=200) return;
					            _this.getArea(_this.parkId);
					            
		      				});
		      			}else{
		      				_this.$putRequest(addEditArea()+'/'+_this.formArea.id,{
								parkingId:_this.parkId,

								areaId:_this.formArea.id,
								areaName:_this.formArea.name,
								areaType:_this.formArea.type,
								bgImg:_this.formArea.bgImgUrl,
								bgimgFlag:_this.formArea.bgImgType,
								height:_this.formArea.height,
								width:_this.formArea.width

							}).then((data) => {
		        				if(data.status!=200) return;
					            _this.getArea(_this.parkId);

					            _this.areaInfo.table='';
		      				});
		      			}
					}
				});
				
			},

			openDialogSpace:function(){
				
			},
			closeDialogSpace:function(){
				this.$refs['formSpace'].resetFields();
				this.formSpace.type='common';
				
			},
			changeSpaceType:function(val){
				if(val=="private"){
	            	this.userShow=true;
	            }else{
	            	this.userShow=false;
	            }
			},
			addSpace:function(){
				this.dialogFormVisibleSpace=true;
				this.formSpace.id='';

				this.userShow=false;
			},
			editSpace:function(node,data){
				if(data.level==1){

				}else if(data.level==2){
					this.dialogFormVisibleSpace=true;
					this.$postRequest(getSpaceSingle(),{spaceId:data.id}).then((data) => {
	    				if(data.status!=200) return;
			            this.formSpace.id=data.data.spaceId;
			            this.formSpace.number=data.data.spaceNum;
			            this.formSpace.type=data.data.spaceType;
			            // this.formSpace.status=data.data.spaceStatus;
			            
			            this.formSpace.toward=data.data.toward;
			            this.formSpace.angle=data.data.angle;
			            this.formSpace.x=data.data.abscissa;
						this.formSpace.y=data.data.ordinate;
						
						this.formSpace.userId=data.data.userId;


			            if(data.data.spaceType=="private"){
			            	this.userShow=true;
			            }else{
			            	this.userShow=false;
			            }

			           
	  				});
				}
				
			},
			addEditSpaceTrue:function(){
				var _this=this;
				this.$refs['formSpace'].validate(function(valid,noStri){
					if(valid){
						_this.dialogFormVisibleSpace = false;

						if(!Boolean(_this.formSpace.id)){

							_this.$postRequest(addEditSpace(),{
								parkingId:_this.parkId,
								areaId:_this.areaInfo.id,

								// spaceId:_this.formSpace.id,
								spaceNum:_this.formSpace.number,
								spaceType:_this.formSpace.type,
								userId:_this.formSpace.type=='private' ? _this.formSpace.userId : '',

								abscissa:_this.formSpace.x,
								ordinate:_this.formSpace.y,
								toward:_this.formSpace.toward,
								angle:_this.formSpace.angle,
								zoom:_this.formSpace.zoom,

								spaceStatus:_this.formSpace.status,
								lotType:_this.formSpace.lotType,
								

							}).then((data) => {
		        				if(data.status!=200) return _this.$layer.msg(data.message);
					            _this.getMapInfo(_this.areaInfo,true);
		      				});
		      			}else{
		      				_this.$putRequest(addEditSpace()+'/'+_this.formSpace.id,{
								parkingId:_this.parkId,
								areaId:_this.areaInfo.id,

								spaceId:_this.formSpace.id,
								spaceNum:_this.formSpace.number,
								spaceType:_this.formSpace.type,
								userId:_this.formSpace.type=='private' ? _this.formSpace.userId : '',

								abscissa:_this.formSpace.x,
								ordinate:_this.formSpace.y,
								toward:_this.formSpace.toward,
								angle:_this.formSpace.angle,
								zoom:_this.formSpace.zoom,

								spaceStatus:_this.formSpace.status,
								lotType:_this.formSpace.lotType,

							}).then((data) => {
		        				if(data.status!=200) return;
					            _this.getMapInfo(_this.areaInfo,true);
		      				});
		      			}
					}
				});
			},

			openDialogIo:function(){
				
			},
			closeDialogIo:function(){
				this.$refs['formIo'].resetFields();
				
			},
			addIo:function(){
				this.dialogFormVisibleIo=true;
				this.formIo.id='';
			},
			editIo:function(node,data){
				if(data.level==1){

				}else if(data.level==2){
					this.dialogFormVisibleIo=true;
					this.$postRequest(getIoSingle(),{parkingIoId:data.id}).then((data) => {
	    				if(data.status!=200) return;
			            this.formIo.id=data.data.parkingIoId;
			            this.formIo.name=data.data.parkingIoName;
			            this.formIo.type=data.data.parkingIoType;
			            this.formIo.sn=data.data.cameraSn;
			            this.formIo.x=data.data.x;
			            this.formIo.y=data.data.y;
			            // this.formIo.toward=data.data.toward;
			            // this.formIo.angle=data.data.angle;
			            // this.formIo.zoom=data.data.zoom;
			            

			           
	  				});
				}
				
			},
			addEditIoTrue:function(){
				var _this=this;
				this.$refs['formIo'].validate(function(valid,noStri){
					if(valid){
						_this.dialogFormVisibleIo = false;

						if(!Boolean(_this.formIo.id)){

							_this.$postRequest(addEditIo(),{
								parkingId:_this.parkId,
								parkingAreaId:_this.areaInfo.id,

								
								parkingIoName:_this.formIo.name,
								parkingIoType:_this.formIo.type,
								cameraSn:_this.formIo.sn,

								x:_this.formIo.x,
								y:_this.formIo.y,
								toward:_this.formIo.toward,
								angle:_this.formIo.angle,
								zoom:_this.formIo.zoom
								

							}).then((data) => {
		        				if(data.status!=200) return;
					            _this.getMapInfo(_this.areaInfo,true);
		      				});
		      			}else{
		      				_this.$putRequest(addEditIo()+'/'+_this.formIo.id,{
								parkingId:_this.parkId,
								parkingAreaId:_this.areaInfo.id,

								parkingIoId:_this.formIo.id,
								parkingIoName:_this.formIo.name,
								parkingIoType:_this.formIo.type,
								cameraSn:_this.formIo.sn,

								x:_this.formIo.x,
								y:_this.formIo.y,
								toward:_this.formIo.toward,
								angle:_this.formIo.angle,
								zoom:_this.formIo.zoom

							}).then((data) => {
		        				if(data.status!=200) return;
					            _this.getMapInfo(_this.areaInfo,true);
		      				});
		      			}
					}
				});
			},

			openDialogComp:function(){
				
			},
			closeDialogComp:function(){
				this.$refs['formComp'].resetFields();
				
			},

			handleErrorComp(rr, file, fileList) {
		        console.log(file, fileList);
		    },
		    handleSuccessComp(response, file, fileList) {
		        this.formComp.compImgUrl=response.data;
		    },
			addComp:function(){
				this.dialogFormVisibleComp=true;
				this.formComp.id='';
			},
			editComp:function(node,data){
				if(data.level==1){

				}else if(data.level==2){
					this.dialogFormVisibleComp=true;
					this.$postRequest(getCompSingle(),{componentId:data.id}).then((data) => {
	    				if(data.status!=200) return;
			            this.formComp.id=data.data.componentId;
			            this.formComp.name=data.data.parkingComponentName;
			            this.formComp.type=data.data.isPassageway;
			            this.formComp.compImgUrl=data.data.parkingComponentImage;
			            
	  				});
				}
				
			},
			addEditCompTrue:function(){
				var _this=this;
				this.$refs['formComp'].validate(function(valid,noStri){
					if(valid){
						_this.dialogFormVisibleComp = false;

						if(!Boolean(_this.formComp.id)){

							_this.$postRequest(addEditComp(),{
								parkingId:_this.parkId,
								parkingAreaId:_this.areaInfo.id,
								
								parkingComponentName:_this.formComp.name,
								isPassageway:_this.formComp.type,
								parkingComponentImage:_this.formComp.compImgUrl
								
							}).then((data) => {
		        				if(data.status!=200) return;
					            _this.getMapInfo(_this.areaInfo,true);
		      				});
		      			}else{
		      				_this.$putRequest(addEditComp()+'/'+_this.formComp.id,{
								parkingId:_this.parkId,
								parkingAreaId:_this.areaInfo.id,

								componentId:_this.formComp.id,
								parkingComponentName:_this.formComp.name,
								isPassageway:_this.formComp.type,
								parkingComponentImage:_this.formComp.compImgUrl

							}).then((data) => {
		        				if(data.status!=200) return;
					            _this.getMapInfo(_this.areaInfo,true);
		      				});
		      			}
					}
				});
			},

			delComp:function(node,data){
				var _this=this;
				var index=_this.$layer.confirm('您确定删除该部件？', {
				  btn: ['确定','取消'],
				  shade: true
				}, function(){
					_this.$layer.close(index);
					_this.$deleteRequest(addEditComp()+'/'+data.id).then((data) => {
	    				if(data.status!=200) return;
	    				_this.getMapInfo(_this.areaInfo,true);
			            
	  				});
  				});
			},

			compTree:function(arrData){
				var result=arrData;
				var jsTreeData=[];
				var itemOne={
					onlyId:'',
					id:"",
					label:"",
					level:"1",
					children:[]
				};
				var itemTwo={
					onlyId:'',
					id:"",
					label:"",
					level:"2",
					type:"comp",
					children:[]
				};

				
				itemOne.onlyId='1_0';
				itemOne.id=this.parkInfo.parkingId;
				// itemOne.label=this.parkInfo.parkingName+this.areaInfo.name;
				itemOne.label=this.areaInfo.name;
				
				
				for(var j=0;j<result.length;j++){
					
					itemTwo={
						onlyId:'',
						id:"",
						label:"",
						level:"2",
						type:"comp",
						children:[]
					};
					itemTwo.onlyId='2_'+j;
					itemTwo.id=result[j].componentId;
					itemTwo.label=result[j].parkingComponentName;
					itemOne.children.push(itemTwo);
					
				}
					
				jsTreeData.push(itemOne);
				
				this.dataComp=jsTreeData;
			},
			ioTree:function(arrData){
				var result=arrData;
				var jsTreeData=[];
				var itemOne={
					onlyId:'',
					id:"",
					label:"",
					level:"1",
					children:[]
				};
				var itemTwo={
					onlyId:'',
					id:"",
					label:"",
					level:"2",
					type:"io",
					children:[]
				};

				
				itemOne.onlyId='1_0';
				itemOne.id=this.parkInfo.parkingId;
				// itemOne.label=this.parkInfo.parkingName+this.areaInfo.name;
				itemOne.label=this.areaInfo.name;
				
				
				for(var j=0;j<result.length;j++){
					
					itemTwo={
						onlyId:'',
						id:"",
						label:"",
						level:"2",
						type:"io",
						children:[]
					};
					itemTwo.onlyId='2_'+j;
					itemTwo.id=result[j].parkingIoId;
					itemTwo.label=result[j].parkingIoName;
					itemOne.children.push(itemTwo);
					
				}
					
				jsTreeData.push(itemOne);
				
				this.dataIo=jsTreeData;
			},
			spaceTree:function(arrData){
				var result=arrData;
				var jsTreeData=[];
				var itemOne={
					onlyId:'',
					id:"",
					label:"",
					level:"1",
					children:[]
				};
				var itemTwo={
					onlyId:'',
					id:"",
					label:"",
					level:"2",
					type:"space",
					userId:"",
					children:[]
				};

				
				itemOne.onlyId='1_0';
				itemOne.id=this.parkInfo.parkingId;
				// itemOne.label=this.parkInfo.parkingName+this.areaInfo.name;
				itemOne.label=this.areaInfo.name;
				
				
				for(var j=0;j<result.length;j++){
					// console.log(result)
					itemTwo={
						onlyId:'',
						id:"",
						label:"",
						level:"2",
						type:"space",
						userId:"",
						children:[]
					};
					itemTwo.onlyId='2_'+j;
					itemTwo.id=result[j].spaceId;
					itemTwo.label=result[j].spaceNum;
					itemTwo.userId=result[j].userId;
					itemOne.children.push(itemTwo);
					
				}
					
				jsTreeData.push(itemOne);
				
				this.dataSpace=jsTreeData;
			},
			getArea:function(id){
				this.$get(getArea(),{
					parkingId:id
			    }).then((data) => {	
    				if(data.status!=200) return;
		            var result=data.data.rows;
					var jsTreeData=[];
					var itemOne={
						onlyId:'',
						id:"",
						label:"",
						level:"1",
						children:[]
					};
					var itemTwo={
						onlyId:'',
						id:"",
						label:"",
						level:"",
						children:[]
					};

					if(result.length==0) {
						itemOne.onlyId='1_0';
						itemOne.id=this.parkId;
						// itemOne.label=this.parkName;

						this.$postRequest(getParkSingle(),{parkingId:id}).then((data) => {
		    				if(data.status!=200) return;
				            itemOne.label=data.data.parkingName;
		  				});

					}else{
						this.parkInfo=JSON.parse(result[0].parkingId);
						
						itemOne.onlyId='1_0';
						itemOne.id=this.parkInfo.parkingId;
						itemOne.label=this.parkInfo.parkingName;
					}
					
					for(var j=0;j<result.length;j++){
						
						itemTwo={
							onlyId:'',
							id:"",
							label:"",
							level:"2",
							children:[]
						};
						itemTwo.onlyId='2_'+j;
						itemTwo.id=result[j].areaId;
						itemTwo.label=result[j].areaName;
						itemOne.children.push(itemTwo);
						
					}
						
					jsTreeData.push(itemOne);
					
					this.dataArea=jsTreeData;
  				});
			},


			handleCommand:function(command){
				this.command=command;
				this.mapOrBind=true;

				if(command==1){
					this.headTitle='场区管理';
				}else if(command==2){
					this.headTitle='车位管理';
				}else if(command==3){
					this.headTitle='出入口管理';
				}else if(command==4){
					this.headTitle='其他部件';
				}
			},

			getMapInfo:function(nodeData,upDateTree){
				// console.log(nodeData);
				if (nodeData.level==1) return;
				this.$get(getAreaAllData(),{
					areaId:nodeData.id
			    }).then((data) => {
    				if(data.status!=200) return;
		            var result=data.data;
					
		            this.PD=result;

					var parkArea=result.parkingArea;
					var space=result.parking_space_list;
					var io=result.parking_io_list;
					var stair=result.parking_staircase_list;
					var comp=result.parking_component_list;

					this.areaInfo.id=parkArea.areaId;
					this.areaInfo.name=parkArea.areaName;

					this.areaInfo.x=parkArea.width;
					this.areaInfo.y=parkArea.height;

					this.areaInfo.width=parkArea.width*this.areaInfo.size;
					this.areaInfo.height=parkArea.height*this.areaInfo.size;

					this.initTable(parkArea.width,parkArea.height,this.PD,this.areaInfo.size);

					/*给table添加背景图*/
					if(parkArea.bgimgFlag==1){
						this.areaInfo.background=parkArea.bgImg;

					}else{
						this.areaInfo.background='';
					};

					if(upDateTree){
						this.spaceTree(space);
						this.ioTree(io);
						this.compTree(comp);
					}
					
  				});

			},
			
			
			initTable:function(map_x,map_y,PD,map_size){
				if(map_x*map_y>10000) return this.$layer.msg("为了您的操作流畅，建议设置合理的宽度与高度参数",{time:1});
				var arr=[];
				for(var i=1;i<=map_y;i++){
					arr.push("<tr>")
					for(var j=1;j<=map_x;j++){
						arr.push(this.traverse(j,i,PD));
					}
					arr.push("</tr>")
				}
				this.areaInfo.table=arr.join("");
			},
			traverse:function(x,y,PD){

				var htmlTd="";
				var arrTd=[];

				var hasComp=false;
				var xx,yy,ele_name,ele_type,ele_attr,ele_component_id,angle,zoom;
				//遍历车位
				for(var i in PD.parking_space_list){
					xx = PD.parking_space_list[i].abscissa;
					yy = PD.parking_space_list[i].ordinate;
					
					ele_type = 1;
					if(PD.parking_space_list[i].spaceStatus=='normal'){
						ele_attr = PD.parking_space_list[i].spaceType+PD.parking_space_list[i].lotType;
					}else{
						ele_attr = PD.parking_space_list[i].spaceType+PD.parking_space_list[i].spaceStatus;
					}
					
					ele_name = PD.parking_space_list[i].spaceNum;
					ele_component_id = PD.parking_space_list[i].spaceId;
					angle = PD.parking_space_list[i].angle;
					zoom = PD.parking_space_list[i].zoom;

					var angle2 = (angle > 0 && angle < 360) ? angle : 0;
					var zoom2 = (zoom>=50 && zoom <= 150) ? zoom/100 : 1;

					if(x==xx&&y==yy){

						hasComp=true;
						switch(PD.parking_space_list[i].toward*1){
							case 1://上
								arrTd.push('<td style="position: relative;z-index:1;-webkit-transform: rotate(0deg) scaley(2);transform: rotate(0deg) scaley(2);top: -25px;" title="X：'+x+'\nY：'+y+'" class="z_component_'+ele_type+'_'+ele_attr+' cid_'+ele_component_id+' car car1">');
								break;
							case 2://右
								arrTd.push('<td style="position: relative;z-index:1;-webkit-transform: rotate(90deg) scaley(2);transform: rotate(90deg) scaley(2);left: 25px;" title="X：'+x+'\nY：'+y+'" class="z_component_'+ele_type+'_'+ele_attr+' cid_'+ele_component_id+' car car2">');
								break;
							case 3://下
								arrTd.push('<td style="position: relative;z-index:1;-webkit-transform: rotate(180deg) scaley(2);transform: rotate(180deg) scaley(2);top: 25px;" title="X：'+x+'\nY：'+y+'" class="z_component_'+ele_type+'_'+ele_attr+' cid_'+ele_component_id+' car car3">');
								break;
							case 4://左
								arrTd.push('<td style="position: relative;z-index:1;-webkit-transform: rotate(270deg) scaley(2);transform: rotate(270deg) scaley(2);left: -25px;" title="X：'+x+'\nY：'+y+'" class="z_component_'+ele_type+'_'+ele_attr+' cid_'+ele_component_id+' car car4">');
								break;
						}

						if(angle2 || zoom2!=1){
							arrTd.push('<div draggable="true" style="position:absolute;margin-top:-25px;-webkit-transform:rotate(' + angle2 + 'deg) scale(' + zoom2 + ');transform:rotate(' + angle2 + 'deg) scale(' + zoom2 + ')">'+ele_name+'</div>')
						}else{
							arrTd.push('<div style="position:absolute;margin-top:-25px">'+ele_name+'</div>')
						}
						
						arrTd.push('</td>');

						return htmlTd=arrTd.join("");
					}
					
				}

				//遍历出入口
				for(var i in PD.parking_io_list){
						
					xx = PD.parking_io_list[i].x;
					yy = PD.parking_io_list[i].y;
					
					ele_type = 2;
					ele_attr = PD.parking_io_list[i].parkingIoType;
					ele_name = PD.parking_io_list[i].parkingIoName;
					ele_component_id = PD.parking_io_list[i].parkingIoId;
					angle = PD.parking_io_list[i].angle;
					zoom = PD.parking_io_list[i].zoom;
					// ispassway=PD.parking_io_list[i].parkingIoStatus;
					ispassway=true;

					var angle2 = (angle > 0 && angle < 360) ? angle : 0;
					var zoom2 = (zoom>=50 && zoom <= 150) ? zoom/100 : 1;
					if(x==xx&&y==yy){
						hasComp=true;
						if(Boolean(ispassway)){
							arrTd.push('<td title="X：'+x+'\nY：'+y+'" class="z_component_'+ele_type+'_'+ele_attr+' cid_'+ele_component_id+' road">');
						}else{
							arrTd.push('<td title="X：'+x+'\nY：'+y+'" class="z_component_'+ele_type+'_'+ele_attr+' cid_'+ele_component_id+'">');
						}

						if(angle2 || zoom2!=1){
							arrTd.push('<div style="position:absolute;margin-top:-25px;-webkit-transform:rotate(' + angle2 + 'deg) scale(' + zoom2 + ');transform:rotate(' + angle2 + 'deg) scale(' + zoom2 + ')">'+ele_name+'</div>')
						}else{
							arrTd.push('<div style="position:absolute;margin-top:-25px">'+ele_name+'</div>')
						}
						
						arrTd.push('</td>');

						return htmlTd=arrTd.join("");
					}
				}

				//遍历自定义部件
				var tmp_component_css="";
				for(var i in PD.parking_component_list){
					for(var j in PD.parking_component_data){
						if(PD.parking_component_list[i].componentId!=PD.parking_component_data[j].parkingComponentId) continue;
						
						xx = PD.parking_component_data[j].x;
						yy = PD.parking_component_data[j].y;
						
						ele_type = 99;
						ele_attr = PD.parking_component_data[j].parkingComponentId;
						ele_name=PD.parking_component_list[i].parkingComponentName;

						ele_component_id = PD.parking_component_data[j].componentDataId;
						angle = PD.parking_component_data[j].angle;
						zoom = PD.parking_component_data[j].zoom;
						var ispassway=PD.parking_component_list[i].isPassageway; //是否通行额外增加

						var angle2 = (angle > 0 && angle < 360) ? angle : 0;
						var zoom2 = (zoom>=50 && zoom <= 150) ? zoom/100 : 1;
						if(x==xx&&y==yy){
							hasComp=true;
							if(Boolean(ispassway)){
								arrTd.push('<td title="X：'+x+'\nY：'+y+'" class="z_component_'+ele_type+'_'+ele_attr+' cid_'+ele_component_id+' road">');
							}else{
								arrTd.push('<td title="X：'+x+'\nY：'+y+'" class="z_component_'+ele_type+'_'+ele_attr+' cid_'+ele_component_id+'">');
							}
							
							if(angle2 || zoom2!=1){
								arrTd.push('<div style="background-image:url('+ PD.parking_component_list[i].parkingComponentImage + ');position:absolute;margin-top:-25px;-webkit-transform:rotate(' + angle2 + 'deg) scale(' + zoom2 + ');transform:rotate(' + angle2 + 'deg) scale(' + zoom2 + ')">'+ele_name+'</div>')
							}else{
								arrTd.push('<div style="background-image:url('+ PD.parking_component_list[i].parkingComponentImage + ');position:absolute;margin-top:-25px">'+ele_name+'</div>')
							}
							
							arrTd.push('</td>');

							return htmlTd=arrTd.join("");
						}
					}
				}


				if(!hasComp){
					return htmlTd='<td title="X：'+x+'\nY：'+y+'" class="type_0"></td>';
				}
			},
			changeArea:function(){
				this.areaInfo.id=160;
				this.getMapInfo();
			},
			handleMousedown:function(e){
				// console.log(e);
				// console.log(this.$refs['workTable']);

				var table=this.$refs['workTable'];

				var target=e.target||e.srcElement;
				var _name=target.nodeName;
				
				if(_name=="DIV"){
					
					this.controlMouse.targetDiv=target;
					this.controlMouse.parentDiv=target.parentNode;
					this.controlMouse.tdStyle=target.parentNode.getAttribute("style");
					this.controlMouse.tdClass=target.parentNode.getAttribute("class");
					
				};

				if(this.controlMouse.targetDiv){

					this.controlMouse.targetDiv.onselectstart = function () {
					    return false;
					};
				}

			},
			handleMouseup:function(e){
				
				// console.log(e.target)
				var target=e.target||e.srcElement;
				var _name=target.nodeName;
				
				if(_name=="TD"&&this.controlMouse.tdClass){			

					var x = target.cellIndex + 1;
					var y = target.parentNode.rowIndex + 1;
					var component_data = this.controlMouse.tdClass.split("_");
					var component_type = component_data[2];
					var component_id = (component_data[4] + ' ').split(' ')[0];

					// console.log(component_type,component_id,x,y);

					if(component_type=='1'){

						this.$putRequest(addEditSpace()+'/'+component_id,{
							// parkingId:this.parkId,
							// areaId:this.areaInfo.id,

							spaceId:component_id,
							abscissa:x,
							ordinate:y

						}).then((data) => {
	        				if(data.status!=200) return;
				            this.getMapInfo(this.areaInfo,true);
	      				});

					}else if(component_type=='2'){
						this.$putRequest(addEditIo()+'/'+component_id,{
							parkingId:this.parkId,
							parkingAreaId:this.areaInfo.id,

							parkingIoId:component_id,
							x:x,
							y:y

						}).then((data) => {
	        				if(data.status!=200) return;
				            this.getMapInfo(this.areaInfo,true);
	      				});
					}else if(component_type=='99'){
						this.$putRequest(addDataComp()+'/'+component_id,{
							parkingId:this.parkId,
							parkingAreaId:this.areaInfo.id,

							componentDataId:component_id,
							x: x,
							y: y

						}).then((data) => {
	        				if(data.status!=200) return;
				            this.getMapInfo(this.areaInfo,false);
	      				});
					}


					this.controlMouse={};	//重置
				}
					
			},

			openDialogBase:function(){
				
			},
			closeDialogBase:function(){
				this.$refs['formBase'].resetFields();
				
			},
			handleContextmenu:function(e){
				e.preventDefault ? e.preventDefault() : e.returnValue=false;

				var target=e.target||e.srcElement;
				var _name=target.nodeName;
				// console.log(e);
				if(_name=="DIV"){
					this.dialogFormVisibleBase=true;

					var tdClass=target.parentNode.getAttribute("class");
					var component_data = tdClass.split("_");

					var componentType = component_data[2];
					var componentId = (component_data[4] + ' ').split(' ')[0];
					this.formBase.typeCode=componentType;
					// console.log(componentType,componentId);
					if(componentType=='1'){
						this.towardAndAngle=true;
						this.qrCodeBtn=true;

						this.$postRequest(getSpaceSingle(),{spaceId:componentId}).then((data) => {
		    				if(data.status!=200) return;
				            this.formBase.id=data.data.spaceId;
				            this.formBase.name=data.data.spaceNum;
				            
				            this.formBase.toward=data.data.toward;
				            // this.formBase.angle=data.data.angle;
		  				});
					}else if(componentType=='2'){
						this.towardAndAngle=false;
						this.qrCodeBtn=true;

						this.$postRequest(getIoSingle(),{parkingIoId:componentId}).then((data) => {
		    				if(data.status!=200) return;
				            this.formBase.id=data.data.parkingIoId;
				            this.formBase.name=data.data.parkingIoName;
				            this.formBase.angle=data.data.angle;
				            
		  				});
					}else if(componentType=='99'){
						console.log(this)
						this.towardAndAngle=false;
						this.qrCodeBtn=false;

						this.$postRequest(getDataSingle(),{componentDataId:componentId}).then((data) => {
		    				if(data.status!=200) return;
				            this.formBase.id=data.data.componentDataId;
				            this.formBase.name=target.innerText;
				            this.formBase.angle=data.data.angle;
				            
		  				});

					}
					
				};

			},
			
			addEditBaseTrue:function(){
				var componentType=this.formBase.typeCode;
				if(componentType=='1'){
					this.$putRequest(addEditSpace()+'/'+this.formBase.id,{
						parkingId:this.parkId,
						areaId:this.areaInfo.id,

						spaceId:this.formBase.id,

						// abscissa:this.formBase.x,
						// ordinate:this.formBase.y,
						toward:this.formBase.toward

					}).then((data) => {
        				if(data.status!=200) return;
			            this.getMapInfo(this.areaInfo,true);
      				});
				}else if(componentType=='2'){
					this.$putRequest(addEditIo()+'/'+this.formBase.id,{
						parkingId:this.parkId,
						parkingAreaId:this.areaInfo.id,

						parkingIoId:this.formBase.id,

						// x:this.formBase.x,
						// y:this.formBase.y,
						angle:this.formBase.angle

					}).then((data) => {
        				if(data.status!=200) return;
			            this.getMapInfo(this.areaInfo,true);
      				});
				}else if(componentType=='99'){
					this.$putRequest(addDataComp()+'/'+this.formBase.id,{
						parkingId:this.parkId,
						parkingAreaId:this.areaInfo.id,

						componentDataId:this.formBase.id,

						// x:this.formBase.x,
						// y:this.formBase.y,
						angle:this.formBase.angle

					}).then((data) => {
        				if(data.status!=200) return;
			            this.getMapInfo(this.areaInfo,true);
      				});

				}
				this.dialogFormVisibleBase=false;
			},
			removeBase:function(){
				var componentType=this.formBase.typeCode;
				if(componentType=='1'){
					this.$putRequest(addEditSpace()+'/'+this.formBase.id,{
						parkingId:this.parkId,
						areaId:this.areaInfo.id,

						spaceId:this.formBase.id,

						abscissa:0,
						ordinate:0

					}).then((data) => {
        				if(data.status!=200) return;
			            this.getMapInfo(this.areaInfo,true);
      				});
				}else if(componentType=='2'){
					this.$putRequest(addEditIo()+'/'+this.formBase.id,{
						parkingId:this.parkId,
						parkingAreaId:this.areaInfo.id,

						parkingIoId:this.formBase.id,

						x:0,
						y:0

					}).then((data) => {
        				if(data.status!=200) return;
			            this.getMapInfo(this.areaInfo,true);
      				});
				}else if(componentType=='99'){
					this.$deleteRequest(addDataComp()+'/'+this.formBase.id).then((data) => {
        				if(data.status!=200) return;
			            this.getMapInfo(this.areaInfo,true);
      				});

				}
				this.dialogFormVisibleBase=false;
			},
			createQr:function(){
				var compType='';
				if(this.formBase.typeCode=='1'){
					compType='parkingSpace';
				}else if(this.formBase.typeCode=='2'){
					compType='parkingIo';
				}
				/*this.$get(qrCode(),{
					component_id:this.formBase.id,
					component_type:compType
				}).then((data) => {
					
				})*/
				
				window.location.href=qrCode()+'?component_id='+this.formBase.id+'&component_type='+compType;
				
				this.dialogFormVisibleBase=false;

			}

		},
		computed:{
			...mapGetters([
	      		'elements'
	    	]),
	    	permiss(){
    			this.parkset_btn_edit = this.elements['parkset:btn_edit'];

    			this.parkset_btn_editArea = this.elements['parkset:btn_editArea'];
    			this.parkset_btn_addArea = this.elements['parkset:btn_addArea'];

    			this.parkset_btn_editSpace = this.elements['parkset:btn_editSpace'];
    			this.parkset_btn_addSpace = this.elements['parkset:btn_addSpace'];
    			this.parkset_btn_bindSpace = this.elements['parkset:btn_bindSpace'];

    			this.parkset_btn_editIo = this.elements['parkset:btn_editIo'];
    			this.parkset_btn_addIo = this.elements['parkset:btn_addIo'];
    			this.parkset_btn_bindIo = this.elements['parkset:btn_bindIo'];

    			this.parkset_btn_editComp = this.elements['parkset:btn_editComp'];
    			this.parkset_btn_addComp = this.elements['parkset:btn_addComp'];
    			this.parkset_btn_delComp = this.elements['parkset:btn_delComp'];
	    	}
		},
		created:function(){
			this.permiss;

			this.getParkingBusType();
			this.getParkType();
			this.getAllManager();
			this.getCity();

			this.getAllUser();
			this.getSpaceType();
			this.getIoType();

			this.MQTTconnect();

			this.vueMqtt.client.onConnectionLost = this.onConnectionLost;
            this.vueMqtt.client.onMessageArrived = this.onMessageArrived;
		},
		mounted:function(){
			this.parkId=this.$route.query.id;
			this.parkName=this.$route.query.name;
			this.parkInfo.parkingName=this.$route.query.name;
			this.getArea(this.parkId);
		},

		destroyed:function(){
			this.vueMqtt.client.disconnect();
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
	.aside{
		position: absolute;
		left:16px;
		color: #2e2e2e;
	}
	.aside .panel{
		width:200px;
		font-size:14px;
	}
	.panel .heading{
		padding:2px;
		border-bottom: 1px solid #ddd;
	}
	.panel .heading h3{
		padding: 0 10px;
		line-height: 30px;
	}
	.aside .public_list{
		overflow: auto;
		height:680px;
	}
	
	.map {
		margin-left: 228px;
		height: 797px;
		color:#2e2e2e;
	}
	.map .panel-body {
		height: 756px;
	}
	.map .panel-body .map-div {
		height: 100%;
		border: 1px solid #ccc;
		overflow: auto;
	}
	.map .panel-body .map-div table {
		border: solid 2px greenyellow;
		overflow: hidden;
		margin: 0;
		padding: 0;
		background-repeat: no-repeat;
		background-size: 100%;
	}
	
	.content .title-bind{
		padding:8px 8px;
		border-bottom: 1px solid #ddd;
	}
	.content .title-bind .backmap{
		padding:2px 6px;
	}
	.content .title-bind .backmap:hover{
		cursor:pointer;
		color:#409EFF;
	}
	.content .plist .kind{
		line-height: 34px;
		/* border-top: 1px solid #ddd; */
		border-bottom: 1px solid #ddd;
		padding:2px 10px;
	}
	.content .plist	.klist li{
		padding:2px 10px 2px 28px;
		line-height: 38px;
		border-bottom: 1px solid #ddd;
	}
	.el-button--text{
		font-size: 16px;
	}

	.el-button+.el-button{
		margin-left: 0px;
	}
	.el-button--text{
		color:#1bc3b4;
	}

</style>
<style>
	.panel-body .map-div table td {
		text-align: center;
		width: 50px;
		height: 50px;
		border: solid 1px #EEEEEE;
		overflow: hidden;
		background-repeat: no-repeat;
		background-position: center;
		margin: 0;
		padding: 0;
		position: relative;
	}

	.map-div .map_workspace td div {
		position: absolute;
		overflow: visible;
		color: white;
		text-shadow: 0 0 3px black;
		text-align: center;
		font-size: 12px;
		background-size: 100% 100%;
		background-position: center;
		background-repeat: no-repeat;
		width: 50px;
		height: 50px;
	}

	/* 异常类型 */
	.z_component_1_3 div {
		background-image: url(../../assets/images/parking_up_ban2.png);
	}
	.z_component_1_4 div {
		background-image: url(../../assets/images/parking_up_ban3.png);
	}
	.z_component_1_5 div {
		background-image: url(../../assets/images/parking_up_ban4.png);
	}


	/* 普通车位 */
	/* 无车 */
	.z_component_1_commonn div {
		background-image: url(../../assets/images/parking_up.png);
	}
	/* 有车 */
	.z_component_1_commony div {
		background-image: url(../../assets/images/parking_up_park.png);
	}
	/* 地磁上报异常 */
	.z_component_1_commongeomagnetic div {
		background-image: url(../../assets/images/parking_up_ban2.png);
	}
	/* 手持机上报异常 */
	.z_component_1_commonhandheld_machine div {
		background-image: url(../../assets/images/parking_up_ban3.png);
	}
	/* 通讯异常 */
	.z_component_1_commoncommunication div {
		background-image: url(../../assets/images/parking_up_ban4.png);
	}
	/* 禁用 */
	.z_component_1_commonban div {
		background-image: url(../../assets/images/parking_up_ban.png);
	}
	

	/* VIP车位 */
	.z_component_1_vipn div {
		background-image: url(../../assets/images/parking_up_vip.png);
	}
	.z_component_1_vipy div {
		background-image: url(../../assets/images/parking_up_vip_park.png);
	}
	.z_component_1_vipgeomagnetic div {
		background-image: url(../../assets/images/parking_up_ban2.png);
	}
	.z_component_1_viphandheld_machine div{
		background-image: url(../../assets/images/parking_up_ban3.png);
	}
	.z_component_1_vipcommunication div{
		background-image: url(../../assets/images/parking_up_ban4.png);
	}
	.z_component_1_vipban div{
		background-image: url(../../assets/images/parking_up_ban.png);
	}

	/*临时车位 */
	.z_component_1_temporaryn div {
		background-image: url(../../assets/images/parking_up_temp.png);
	}
	.z_component_1_temporaryy div {
		background-image: url(../../assets/images/parking_up_temp_park.png);
	}
	.z_component_1_temporarygeomagnetic div {
		background-image: url(../../assets/images/parking_up_ban2.png);
	}
	.z_component_1_temporaryhandheld_machine div {
		background-image: url(../../assets/images/parking_up_ban3.png);
	}
	.z_component_1_temporarycommunication div {
		background-image: url(../../assets/images/parking_up_ban4.png);
	}
	.z_component_1_temporaryban div {
		background-image: url(../../assets/images/parking_up_temp_ban.png);
	}
	

	/* 私人车位 */
	.z_component_1_privaten div {
		background-image: url(../../assets/images/parking_up_owner.png);
	}
	.z_component_1_privatey div {
		background-image: url(../../assets/images/parking_up_owner_park.png);
	}
	.z_component_1_privategeomagnetic div {
		background-image: url(../../assets/images/parking_up_ban2.png);
	}
	.z_component_1_privatehandheld_machine div {
		background-image: url(../../assets/images/parking_up_ban3.png);
	}
	.z_component_1_privatecommunication div {
		background-image: url(../../assets/images/parking_up_ban4.png);
	}
	.z_component_1_privateban div {
		background-image: url(../../assets/images/parking_up_owner_ban.png);	
	}
	
	/* 入口 */
	.z_component_2_entrance div {
		background-image: url(../../assets/images/component_2_1.gif);
	}

	/* 出口 */
	.z_component_2_exit div {
		background-image: url(../../assets/images/component_3_1.gif);
	}
</style>