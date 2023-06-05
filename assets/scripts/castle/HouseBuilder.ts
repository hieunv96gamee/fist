const {ccclass, property} = cc._decorator;

@ccclass
export default class HouseBuilder extends cc.Component {

    @property(cc.String)
    houseName: string = "";

    @property([cc.Node])
    arrayLevels: cc.Node[] = [];

    level: number = 0;

    showLevel(level) {
        this.level = level;
        this.arrayLevels.forEach((house, i) => {
            house.active = i === level - 1;
        });
    }
}
