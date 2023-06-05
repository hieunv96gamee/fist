
const {ccclass, property} = cc._decorator;

@ccclass
export default class CaptureTexture extends cc.Component {

    @property(cc.Camera)
    camera: cc.Camera = null;

    getImgBase64 () {
        // Getting view rect size.
        let visibleSize = cc.view.getVisibleSize();
        let width = visibleSize.width;
        let height = visibleSize.height;
        // Creating a new renderTexture.
        // this.camera.node.active = true;
        let renderTexture = new cc.RenderTexture();
        let gl = cc.game._renderContext;
        renderTexture.initWithSize(cc.visibleRect.width, cc.visibleRect.height, gl.STENCIL_INDEX8);
        this.camera.targetTexture = renderTexture;
        // Creating a new canvas.
        let canvas = document.createElement('canvas');
        let ctx = canvas.getContext('2d');
        canvas.width = width;
        canvas.height = height;
        this.camera.render();
        // Getting pixels.
        let data = new Uint8Array(width * height * 4);
        renderTexture.readPixels(data);
        // Input the data into the new canvas.
        let rowBytes = width * 4;
        for (let row = 0; row < height; row++) {
            let srow = height - 1 - row;
            let data2 = new Uint8ClampedArray(data.buffer, srow * width * 4, rowBytes);
            let imageData = new ImageData(data2, width, 1);
            ctx.putImageData(imageData, 0, row);
        }

        // this.camera.node.active = false;
        return canvas.toDataURL('image/png');
    }

}
