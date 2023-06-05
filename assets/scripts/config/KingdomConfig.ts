export class KingdomConfig {

    public static kingdoms = [
        {
            name: "spring",
            builder: "SpringBuilder",
            kingdom: "SpringKingdom",
            prices: [500, 1000, 2000, 3000, 4000]
        }
    ];

    public static getKingdomCfg(name: string) {
        for (let i = 0; i < KingdomConfig.kingdoms.length; i++) {
            if (KingdomConfig.kingdoms[i].name === name) {
                return KingdomConfig.kingdoms[i];
            }
        }
        return null;
    }

}