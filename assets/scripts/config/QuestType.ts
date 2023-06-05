


export enum QuestType{

    COLLECT_GEMS = 0,
    COLLECT_ITEM = 1,
    KILL_ENEMY = 2,
    SAVE_HOSTAGE = 3,
    OPEN_CHEST = 4,
    ALL = 5
}

export class QuestUtil {

    public static getQuestName(type: QuestType){

        switch (type) {
            case QuestType.COLLECT_GEMS:
                return "COLLECT THE GOLD";
            case QuestType.COLLECT_ITEM:
                return "COLLECT THE ITEM";
            case QuestType.KILL_ENEMY:
                return "TAKE DOWN ENEMIES";
            case QuestType.SAVE_HOSTAGE:
                return "SAVE YOUR WIFE";
            case QuestType.OPEN_CHEST:
                return "OPEN MONEY SAFE";
        }

        return "DO NOTHING";
    }
}