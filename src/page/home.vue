<template>
  	<div class="mainMap">
  		<!-- <div class="search">
  			<input type="text" v-model="search.parkName"><button @click="searchEquip">搜索</button>
  		</div> -->
        <div class="homemap" id="homemap">
            
        </div>
    </div>
</template>

<script>
	import BMap from 'BMap';
	import {parkList,customOverlay,addMapOverlay,addMapOverlayl,setMapEvent,addMapControl} from '../api/url';

	export default {
		data(){
			return{
				search:{
					pageNumber:1,
					pageSize:12,
					parkName:""
				},
				map:null
			}
		},

		methods:{
			searchEquip:function(){
				var _this=this;
				this.$get(parkList(),{
					parkingName:this.search.parkName
			    }).then((data) => {
    				if(data.status!=200) return;
		            var markers = data.data.rows;
			        this.map.clearOverlays();
			        this.definedOverlay(this.map,markers);
  				});

			},
			getAllLocal:function() {

				this.map = new BMap.Map("homemap"); 
				this.map.centerAndZoom(new BMap.Point(113.937122, 22.542874), 14);   
				setMapEvent(this.map);
				addMapControl(this.map);

				this.$get(parkList(),{
					parkingName:this.search.parkName
			    }).then((data) => {
    				if(data.status!=200) return;
		            var markers = data.data.rows;
			        
			        this.definedOverlay(this.map,markers);
			        // addMapOverlay(this.map,markers);
  				});

			},
			definedOverlay:function(map,markers){
				
				var _this=this;
				customOverlay.prototype = new BMap.Overlay();
				customOverlay.prototype.initialize = function(map){
    	
					this._map = map;
					var div = this._div = document.createElement("div");
					div.style.position = "absolute";
					div.style.zIndex = BMap.Overlay.getZIndex(this._point.lat);
					div.style.background = "url("+this._bgImg+") no-repeat center center";
					div.style.backgroundSize = "contain";
					// div.style.border = "1px solid #BC3B3A";
					div.style.color = this._color;
					div.style.padding = "2px";	
					div.style.width = "40px";
					div.style.height = "48px";
					div.style.lineHeight = "32px";
					div.style.MozUserSelect = "none";
					div.style.fontSize = "12px";
					div.style.top = "36px";
					div.style.left = "18px";
					div.style.textAlign = "center";
					var span = this._span = document.createElement("span");

					div.appendChild(span);	
					console.log(this)
					span.appendChild(document.createTextNode(this._text)); 

					     
					var that = this;

					var arrow = this._arrow = document.createElement("div");
				      arrow.style.position = "absolute";
				      arrow.style.width = "11px";
				      arrow.style.height = "10px";
				      arrow.style.top = "36px";
				      arrow.style.left = "18px";
				      arrow.style.overflow = "hidden";
				      div.appendChild(arrow);


					div.onmouseover = function(){}

					div.onmouseout = function(){}

					_this.map.getPanes().labelPane.appendChild(div);

					return div;
				}
				customOverlay.prototype.draw = function(){
					var map = this._map;
					var pixel = map.pointToOverlayPixel(this._point);
					this._div.style.left = pixel.x - parseInt(this._arrow.style.left) + "px";
					this._div.style.top  = pixel.y - parseInt(this._arrow.style.top) + "px";
				}

				for (var index = 0; index < markers.length; index++) {
					if(Boolean(markers[index].firstHourPrice)){
						var myCompOverlay = new customOverlay(new BMap.Point(markers[index].pointLng,markers[index].pointLat), "￥"+markers[index].firstHourPrice,'../../static/images/marker1.png','#02c1af');
					}else{
						var myCompOverlay = new customOverlay(new BMap.Point(markers[index].pointLng,markers[index].pointLat), "￥",'../../static/images/marker1.png','#02c1af');
					}

					

					map.addOverlay(myCompOverlay);
				}
			}
		},
		mounted:function(){
			this.getAllLocal();
			
		}
	}


</script>

<style scoped>
	.search{
		height: 38px;
		border:1px solid #ddd;
		position: absolute;
		z-index: 1;
		top:10px;
		left:40px;
	}
	.search input{
		width:220px;
		height: 100%;
		padding: 2px 10px;

	}
	.search button{
		width:80px;
		height:100%;
		background: #2a9cec;
		color: #fff;
	}
	.mainMap{
		position: relative;
		height:95%;
	} 
	.homemap{
		height:100%;
		background: pink;
	}
</style>
<style>
	.info-marker p{
		padding:10px 0 0;
	}
	.history-btn{
		padding:8px 0 0;
		text-align: right;
	}
	.history-btn button{
		border:1px solid #ccc;
		padding:4px;
		background: #fff;
	}
</style>