

import {QuestType} from "../config/QuestType";

const {ccclass, property} = cc._decorator;

@ccclass('IconQuest')
export class IconQuest {
    @property({
        type: cc.Enum(QuestType)
    })
    questType: QuestType = QuestType.COLLECT_GEMS;

    @property(cc.SpriteFrame)
    icon: cc.SpriteFrame = null;
}