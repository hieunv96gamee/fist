import GUIUtil from "../base/utils/GUIUtil";
import {GameData} from "../GameData";
import MainScene from "../MainScene";
import HomeScreen from "../HomeScreen";
import {RoomConfig} from "../config/RoomConfig";
import {LevelConfig} from "../config/LevelConfig";


const {ccclass, property} = cc._decorator;

@ccclass
export default class SelectRoomItem extends cc.Component {

    @property(cc.String)
    prefabName: string = "Room1";

    @property(cc.Integer)
    levelUnlock: number = 40;

    @property(cc.Node)
    lock: cc.Node = null;

    @property(cc.Label)
    label_unlock: cc.Label = null;

    button: cc.Button = null;

    protected onLoad(): void {
        this.button = this.node.getComponent(cc.Button);

        if (!this.button) {
            this.button = this.node.addComponent(cc.Button);
            return;
        }

        GUIUtil.addClickListener(this.button, this.node, 'SelectRoomItem', 'onClick');
    }

    protected onEnable(): void {
        if (GameData.currentLevelId >= this.levelUnlock
            && LevelConfig.realLevelSize >= this.levelUnlock) {

            this.lock.active = false;
            this.button.interactable = true;

        } else {
            this.lock.active = true;
            this.button.interactable = false;

            if (LevelConfig.realLevelSize < this.levelUnlock) {
                this.label_unlock.string = "COMING SOON";
                this.label_unlock.fontSize = 14;

            } else {
                this.label_unlock.string = "LEVEL " + this.levelUnlock;
            }
        }
    }

    private onClick() {
        let roomId = RoomConfig.getRoomIdByName(this.prefabName);
        if (roomId != HomeScreen.instance.visibleRoomId) {
            HomeScreen.instance.loadRoom(roomId, () => {
                MainScene.instance.showHomeScreen((screen) => {
                    MainScene.instance.selectRoomPopup.active = false;
                });
            })
        } else {
            MainScene.instance.showHomeScreen((screen) => {
                MainScene.instance.selectRoomPopup.active = false;
            });
        }
    }
}
