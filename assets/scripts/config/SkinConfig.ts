export class SkinConfig {

    public static get_type = {
        free: "free",
        buy: "buy",
        claim_ad: "claim_ad",
        gift_code: "gift_code",
        share_fb: "share_fb",
        daily_reward: "daily_reward"
    };

    public static arraySkinBoss: {
        skinId: string,
        skins: string[],
        type: string,
        value: number

    }[] = [
            //row 1
            {
                skinId: "boss_0",
                skins: ["Boss0/Boss"],
                type: SkinConfig.get_type.free,
                value: 0
            },
            {
                skinId: "boss_1",
                skins: ["Boss1/Boss"],
                type: SkinConfig.get_type.claim_ad,
                value: 0
            },
            {
                skinId: "boss_46",
                skins: ["Boss46/Boss"],
                type: SkinConfig.get_type.claim_ad,
                value: 0
            },
            //row 2
            {
                skinId: "boss_3",
                skins: ["Boss3/Boss"],
                type: SkinConfig.get_type.buy,
                value: 10000
            },
            {
                skinId: "boss_4",
                skins: ["Boss4/Boss"],
                type: SkinConfig.get_type.buy,
                value: 10000
            },
            {
                skinId: "boss_5",
                skins: ["Boss5/Boss"],
                type: SkinConfig.get_type.buy,
                value: 10000
            },
            //row 3
            {
                skinId: "boss_6",
                skins: ["Boss6/Boss"],
                type: SkinConfig.get_type.buy,
                value: 15000
            },
            {
                skinId: "boss_7",
                skins: ["Boss7/Boss"],
                type: SkinConfig.get_type.buy,
                value: 15000
            },
            {
                skinId: "boss_8",
                skins: ["Boss8/Boss"],
                type: SkinConfig.get_type.buy,
                value: 15000
            },
            //row 4
            {
                skinId: "boss_9",
                skins: ["Boss9/Boss"],
                type: SkinConfig.get_type.buy,
                value: 30000
            },
            {
                skinId: "boss_10",
                skins: ["Boss10/Boss"],
                type: SkinConfig.get_type.buy,
                value: 30000
            },
            {
                skinId: "boss_11",
                skins: ["Boss11/Boss"],
                type: SkinConfig.get_type.buy,
                value: 30000
            },
            //row 5
            {
                skinId: "boss_12",
                skins: ["Boss12/Boss"],
                type: SkinConfig.get_type.buy,
                value: 30000
            },
            {
                skinId: "boss_13",
                skins: ["Boss13/Boss"],
                type: SkinConfig.get_type.buy,
                value: 30000
            },
            {
                skinId: "boss_14",
                skins: ["Boss14/Boss"],
                type: SkinConfig.get_type.buy,
                value: 30000
            },
            //row 6
            {
                skinId: "boss_15",
                skins: ["Boss15/Boss"],
                type: SkinConfig.get_type.buy,
                value: 40000
            },
            {
                skinId: "boss_16",
                skins: ["Boss16/Boss"],
                type: SkinConfig.get_type.buy,
                value: 40000
            },
            {
                skinId: "boss_17",
                skins: ["Boss17/Boss"],
                type: SkinConfig.get_type.buy,
                value: 40000
            },
            //row 7
            {
                skinId: "boss_19",
                skins: ["Boss19/Boss"],
                type: SkinConfig.get_type.buy,
                value: 50000
            },
            {
                skinId: "boss_40",
                skins: ["Boss40/Boss", "Boss41/Boss"],
                type: SkinConfig.get_type.buy,
                value: 100000
            },
            {
                skinId: "boss_20",
                skins: ["Boss20/Boss", "Boss21/Boss"],
                type: SkinConfig.get_type.buy,
                value: 200000
            },
            //row 8
            {
                skinId: "boss_29",
                skins: ["Boss29/Boss"],
                type: SkinConfig.get_type.buy,
                value: 50000
            },
            {
                skinId: "boss_30",
                skins: ["Boss30/Boss"],
                type: SkinConfig.get_type.buy,
                value: 50000
            },
            {
                skinId: "boss_26",
                skins: ["Boss26/Boss", "Boss27/Boss"],
                type: SkinConfig.get_type.buy,
                value: 200000
            },
            //row 9
            {
                skinId: "boss_34",
                skins: ["Boss34/Boss"],
                type: SkinConfig.get_type.buy,
                value: 40000
            },
            {
                skinId: "boss_35",
                skins: ["Boss35/Boss"],
                type: SkinConfig.get_type.gift_code,
                value: 0
            },
            {
                skinId: "boss_31",
                skins: ["Boss31/Boss", "Boss32/Boss"],
                type: SkinConfig.get_type.buy,
                value: 200000
            },
            //row 10
            {
                skinId: "boss_36",
                skins: ["Boss36/Boss"],
                type: SkinConfig.get_type.buy,
                value: 100000
            },
            {
                skinId: "boss_37",
                skins: ["Boss37/Boss"],
                type: SkinConfig.get_type.gift_code,
                value: 0
            },
            {
                skinId: "boss_38",
                skins: ["Boss38/Boss", "Boss39/Boss"],
                type: SkinConfig.get_type.buy,
                value: 100000
            },
            //row 11
            {
                skinId: "boss_44",
                skins: ["Boss44/Boss"],
                type: SkinConfig.get_type.gift_code,
                value: 0
            },
            {
                skinId: "boss_45",
                skins: ["Boss45/Boss"],
                type: SkinConfig.get_type.gift_code,
                value: 0
            },
            {
                skinId: "boss_47",
                skins: ["Boss47/Boss"],
                type: SkinConfig.get_type.gift_code,
                value: 0
            },
            //row 12
            {
                skinId: "boss_23",
                skins: ["Boss23/Boss"],
                type: SkinConfig.get_type.daily_reward,
                value: 0
            },
            {
                skinId: "boss_24",
                skins: ["Boss24/Boss"],
                type: SkinConfig.get_type.daily_reward,
                value: 0
            },
            {
                skinId: "boss_25",
                skins: ["Boss25/Boss"],
                type: SkinConfig.get_type.daily_reward,
                value: 0
            }
        ];

    public static getSkinNameById(skinId: string) {
        let arr = SkinConfig.arraySkinBoss;
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].skinId === skinId) {
                let cfg = arr[i];
                return cfg.skins[cfg.skins.length - 1];
            }
        }
        return "Boss0/Boss";
    }

}
