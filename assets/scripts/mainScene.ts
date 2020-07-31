// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class mainScene extends cc.Component {
	@property(cc.Node)
	player: cc.Node = null;

	// LIFE-CYCLE CALLBACKS:

	onLoad() {
		this.node.on(cc.Node.EventType.TOUCH_START, this.playerMove, this);
	}
	playerMove(e: cc.Event.EventTouch) {
		let pos = e.getLocation(); //获取当前触点位置。
		// console.log(pos, '==>possssss');
		this.player.getComponent('agent').nav_to_map(pos); //调用nav_agent.js的nav_to_map()方法
	}

	start() {}

	// update (dt) {}
}
