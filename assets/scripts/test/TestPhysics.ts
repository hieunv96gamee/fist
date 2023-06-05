

const {ccclass, property} = cc._decorator;

@ccclass
export default class TestPhysics extends cc.Component {

    onClick(){
        cc.tween(this.node).by(0.1, {
            position: new cc.Vec3(700, 0, 0)
        }).start();
    }
}
