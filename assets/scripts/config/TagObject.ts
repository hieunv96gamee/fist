const {ccclass, property} = cc._decorator;

export enum TagConfig {
    NONE = 0,
    BOSS = 1,
    BOSS_STICK = 2,
    GIRL = 3,
    GIRL_WONDER = 4,
    BOSS_SUPER = 5,

    GEMS = 99,
    LAVA = 100,
    WATER = 101,
    SNOW = 102,
    ROCK = 103,
    BIG_ROCK = 104,
    ICE = 105,
    GAS = 106,
    BOMB = 107,
    SAW = 108,
    POW = 109,
    TRAP = 110,
    BULLET = 111,
    FIRE_BALL = 112,
    HOLY_WATER = 113,
    LAZE = 114,

    STEALER = 200,
    DEMON = 201,
    BIGFOOT = 202,
    DRAGON = 203,
    DOG = 204,
    SHOOTER = 205,

    CHEST = 299,
    ITEM = 300,
    STICK = 301,
    MEAT = 302,
    REDIRECT_LEFT = 303,
    REDIRECT_RIGHT = 304,
    REDIRECT_STOP = 305,

    HIT = 1000
}

@ccclass
export default class TagObject extends cc.Component {

    @property({
        type: cc.Enum(TagConfig)
    })
    tag: TagConfig = TagConfig.NONE;

    @property({
        type: cc.Enum(TagConfig)
    })
    tag2: TagConfig = TagConfig.NONE;

    protected onLoad(): void {
        this.node.name = "" + this.tag;
    }

    setTag(_tag){
        this.tag = _tag;
        this.node.name = "" + this.tag;
    }

    setTag2(_tag){
        this.tag2 = _tag;
    }

}