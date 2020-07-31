// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
let initData = require("initData");
cc.Class({
	extends: cc.Component,

	properties: {

	},

	// LIFE-CYCLE CALLBACKS:

	// onLoad () {},

	start() {
		this.map = require("game_map_" + this.node.name); //生成的地图规则json格式
		cc.log(this.map,"==>this.map")
	},
	astar_search(src_w, dst_w) {
		// cc.log("调用了", src_w, dst_w);
		// 将一个点转换到节点 (局部) 空间坐标系。convertToNodeSpaceAR
		let src = this.node.convertToNodeSpaceAR(src_w);
		let dst = this.node.convertToNodeSpaceAR(dst_w);
		//起点
		let src_mx = Math.floor((Math.round(src.x)) / this.map.item_size);
		let src_my = Math.floor((Math.round(src.y)) / this.map.item_size);
		//始点
		let dst_mx = Math.floor((Math.round(dst.x)) / this.map.item_size);
		let dst_my = Math.floor((Math.round(dst.y)) / this.map.item_size);
		// cc.log(src_mx, "===>src_mx")
		let path = initData.search(this.map, src_mx, src_my, dst_mx, dst_my);//存放起始点
		// cc.log(path,"===>path计算路径")
	},
	// update (dt) {},
});
