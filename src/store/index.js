/*
* @Author: Administrator
* @Date:   2018-07-09 11:48:39
* @Last Modified by:   Administrator
* @Last Modified time: 2018-08-28 17:49:23
*/
import Vue from 'vue';
import Vuex from 'vuex';

import axios from 'axios';

import {getInfo} from '../api/url.js';

Vue.use(Vuex);


const state = {
	adminInfo: {
		avatar: 'default.jpg'
	},
	page:{
		curIndex:1,
		rowsCount:null
	},
	storage:{
		scenId:null
	},
	menu:{
		isCollapse:false
	},
	elements:{}
}
const getters={
    elements: state => state.elements
}

const mutations = {
	saveAdminInfo(state, adminInfo){
		state.adminInfo = adminInfo;
	},
	getPage(state,pageObj){
		state.page.curIndex=pageObj.curIndex;
		state.page.rowsCount=pageObj.rowsCount;
	},
	storageScenId(state,scenId){
		state.storage.scenId=scenId;
	},
	handleMenuStore(state,openState){
		state.menu.isCollapse=openState;
	},
	setElements: (state, elements) => {
      state.elements = elements;
    }
}

const actions = {
	getAdminData({commit}){
		return new Promise((resolve, reject) =>{
			axios.get(getInfo(),{}).then((data) => {
	            var data=data.data;
	            const elements = {}
		        for (let i = 0; i < data.elements.length; i++) {
		            elements[data.elements[i].code] = true
		        }
		        // console.log(elements);
	            commit('setElements', elements);
			});
		})
	}
}

export default new Vuex.Store({
	state,
	actions,
	mutations,
	getters
})