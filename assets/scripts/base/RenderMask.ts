const {ccclass, property} = cc._decorator;

@ccclass
export default class RenderMask extends cc.Component {

    @property(cc.Camera)
    camera: cc.Camera = null;

    @property(cc.Sprite)
    sprite: cc.Sprite = null;

    private renderTexture: cc.RenderTexture;

    onLoad() {
        this.renderTexture = new cc.RenderTexture();
        this.renderTexture.initWithSize(cc.winSize.width, cc.winSize.height);
        this.camera.targetTexture = this.renderTexture;
        // this.renderTexture['_premultiplyAlpha'] = true;
    }

    start() {
        this.sprite.node.active = true;
        this.sprite.spriteFrame = new cc.SpriteFrame(this.renderTexture);
        // this.follower.setState(0);

        //fix multi screen
        let sizeScreen = cc.winSize;
        this.sprite.node.height = sizeScreen.height;
        this.sprite.node.width = sizeScreen.width;
    }
}
