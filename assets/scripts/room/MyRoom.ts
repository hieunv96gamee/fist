import OpenItem from "./OpenItem";
import {ItemConfig} from "../objects/more/ItemLoot";
import ReplaceItem from "./ReplaceItem";
import {GameData} from "../GameData";
import {RoomConfig} from "../config/RoomConfig";


const {ccclass, property} = cc._decorator;

@ccclass
export default class MyRoom extends cc.Component {

    @property(sp.Skeleton)
    boss: sp.Skeleton = null;

    @property(cc.Prefab)
    openItemPrefab: cc.Prefab = null;

    @property([ReplaceItem])
    items: ReplaceItem[] = [];

    roomId: number = 0;

    protected onLoad(): void {
        this.roomId = RoomConfig.getRoomIdByName(this.node.name);
        if (this.roomId < GameData.currentRoomId) { //Nếu Room này đã vượt qua thì mở khóa hết
            cc.log("unlock all items roomId = " + GameData.currentRoomId);

            this.items.forEach((item) => {
                item.replaceBy.active = true;
                item.node.active = false;
            });
        } else {
            cc.log("init GameData.arrayItem = " + GameData.arrayItem);
            GameData.arrayItem.forEach((id) => {
                this.items[id - 1].replaceBy.active = true;
                this.items[id - 1].node.active = false;
            });

            if (GameData.arrayItem.length === RoomConfig.rooms[GameData.currentRoomId].size) {
                GameData.currentRoomId++;
                GameData.arrayItem = [];
                cc.log("unlock roomId = " + GameData.currentRoomId);
            }
        }
    }

    openItem(itemConfig: ItemConfig, callback: Function) {
        cc.log("openItem");

        GameData.addRoomItem(itemConfig.itemId, this.roomId);
        this.boss.setAnimation(0, "Idle", true);

        let obj = cc.instantiate(this.openItemPrefab);
        this.node.addChild(obj);

        let openItem = obj.getComponent(OpenItem);
        openItem.show(itemConfig);

        openItem.setOpenCallback((itemSkeleton, effectPrefab) => {
            cc.log("setOpenCallback");
            let dst = this.items[itemConfig.itemId - 1];

            cc.tween(itemSkeleton).to(0.5, {
                position: dst.node.position,
                scale: 0.6
            }).call(() => {
                this.boss.setAnimation(0, "IdleNice", true);
                this.showEffectAppear(effectPrefab, dst.node.position);
                itemSkeleton.removeFromParent();
                dst.replace(callback);
            }).start();
        });
    }

    showEffectAppear(effectPrefab: cc.Prefab, pos: cc.Vec3) {
        if (!effectPrefab) {
            cc.warn("effectPrefab is null");
            return;
        }

        let bum = cc.instantiate(effectPrefab);
        bum.setPosition(pos);
        bum.scale = 1;
        this.node.addChild(bum);

        cc.tween(bum).delay(0.8).call(() => {
            bum.removeFromParent();
        }).start();
    }


    protected onDisable(): void {
        this.boss.setAnimation(0, "Dance", true);
    }

}
