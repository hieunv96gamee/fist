import easeBackOut = cc.easeBackOut;

const {ccclass, property} = cc._decorator;

export enum ReplaceItemType {

    NORMAL = 0,
    SLIDING_RIGHT = 1,
    SLIDING_TOP = 2,
}

@ccclass
export default class ReplaceItem extends cc.Component {

    @property({
        type: cc.Enum(ReplaceItemType)
    })
    private replaceType: ReplaceItemType = ReplaceItemType.NORMAL;

    @property(cc.Node)
    public replaceBy: cc.Node = null;

    replace(callback) {
        if (this.replaceType === ReplaceItemType.NORMAL) {

            this.node.active = false;
            this.replaceBy.active = true;
            this.replaceBy.scale = 1.0;
            cc.tween(this.replaceBy).to(0.2, {
                scale: 0.8
            }).to(0.25, {
                scale: 1.0
            }, easeBackOut())
                .delay(2)
                .call(callback).start();
        }
    }
}
