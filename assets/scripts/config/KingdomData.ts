import {FBInstantData} from "../plugins/fb/FBInstantData";


export class KingdomData {

    //"hp_kingdom_spring = {spring_1: 1, spring_2: 0, spring_3: 5,...}";

    public static KEY_KINGDOM = "hp_kingdom";
    public static SPRING = "spring";
    public static SUMMER = "summer";
    public static AUTUMN = "autumn";
    public static FUTURE = "future";
    public static TOY = "toy";
    public static WINTER = "winter";

    private static arrConfig = [
        KingdomData.SPRING,
        KingdomData.SUMMER,
        KingdomData.AUTUMN,
        KingdomData.FUTURE,
        KingdomData.TOY,
        KingdomData.WINTER
    ];

    public static getKingdomData(data: any): any {
        let kingdom = {};
        KingdomData.arrConfig.forEach((key) => {
            let key_data = KingdomData.KEY_KINGDOM + "_" + key;
            if (data[key_data]) {
                kingdom[key] = data[key_data];

            } else {
                kingdom[key] = {};
            }
        });
        return kingdom;
    }

    public static saveKingdomData(key, value, callback = null) {
        if (KingdomData.arrConfig.indexOf(key) === -1) {
            console.warn('saveKingdomData: ' + key + " is not Kingdom");
            return;
        }
        let data = {};
        let key_data = KingdomData.KEY_KINGDOM + "_" + key;
        data[key_data] = value;
        FBInstantData.setData(data, callback);
    }
}