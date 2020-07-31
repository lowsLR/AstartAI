// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html 
let nav_map = require("navMap");
let State = {
	Idle: 0, //停止状态
	Walk: 1, //移动状态
};
cc.Class({
	extends: cc.Component,

	properties: {
		speed: 100, //移速
		game_map: { //地图
			type: nav_map,
			default: null,
		}
	},
	// LIFE-CYCLE CALLBACKS:
	onLoad() {
		this.state = State.Idle;
		this.walk_total = 0.0; //每次移动一个格子的时间
		this.walk_time = 0; //移动的时间 
	},
	nav_to_map(dst_wpos) {
		// 将节点坐标系下的一个点转换到世界空间坐标系。convertToWorldSpaceAR，要拿到player放在的起点处
		let src_wpos = this.node.convertToWorldSpaceAR(cc.v2(0, 0));
		// cc.log(src_wpos,"===>player放在的起点处-世界坐标");
		this.road_set = this.game_map.astar_search(src_wpos, dst_wpos);//移动的世界坐标数组
	},
	start() {

	},

	// update (dt) {},
});
