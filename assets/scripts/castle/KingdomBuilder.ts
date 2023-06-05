

const {ccclass, property} = cc._decorator;

@ccclass('HouseItemConfig')
export class HouseItemConfig {

    kingdomName: string = "";

    @property(cc.String)
    houseName: string = "";

    @property([cc.SpriteFrame])
    houseFrames: cc.SpriteFrame[] = [];
}

@ccclass
export default class KingdomBuilder extends cc.Component {

    @property(cc.String)
    kingdomName: string = "";

    @property([HouseItemConfig])
    arrayConfig: HouseItemConfig[] = [];
}
