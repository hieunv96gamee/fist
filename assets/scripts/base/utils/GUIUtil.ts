export default class GUIUtil {

    public static addClickListener(button, node, component: string,
                                   callback: string, params: any = "") {
        let clickEventHandler = new cc.Component.EventHandler();
        clickEventHandler.target = node;
        clickEventHandler.component = component;
        clickEventHandler.handler = callback;
        clickEventHandler.customEventData = params;
        button.getComponent(cc.Button).clickEvents.push(clickEventHandler);
    }

    public static addToggleListener(button, node, component: string,
                                    callback: string, params: any = "") {
        let clickEventHandler = new cc.Component.EventHandler();
        clickEventHandler.target = node;
        clickEventHandler.component = component;
        clickEventHandler.handler = callback;
        clickEventHandler.customEventData = params;
        button.getComponent(cc.Toggle).clickEvents.push(clickEventHandler);
    }

    public static getDistancePoints(p1, p2) {
        return Math.sqrt(Math.pow((p1.x - p2.x), 2) + Math.pow((p1.y - p2.y), 2));
    }

    public static getImgBase64() {
        let node = new cc.Node();
        node.x = cc.visibleRect.width / 2;
        node.y = cc.visibleRect.height / 2;
        node.parent = cc.director.getScene();
        let camera = node.addComponent(cc.Camera);

        camera.backgroundColor = cc.Color.TRANSPARENT;
        camera.clearFlags = cc.Camera.ClearFlags.DEPTH | cc.Camera.ClearFlags.STENCIL | cc.Camera.ClearFlags.COLOR;

        // Set the CullingMask of the screenshot you want
        camera.cullingMask = 0xffffffff;

        // Create a new RenderTexture and set this new RenderTexture to the camera's targetTexture so that the camera content will be rendered to this new RenderTexture
        let texture = new cc.RenderTexture();
        let gl = cc.game['_renderContext'];
        // If the Mask component is not included in the screenshot, you don't need to pass the third parameter.
        texture.initWithSize(cc.visibleRect.width, cc.visibleRect.height, gl.STENCIL_INDEX8);
        camera.targetTexture = texture;

        // Render the camera once, updating the content once into RenderTexture
        camera.render();

        // This allows the data to be obtained from the rendertexture.
        let data = texture.readPixels();

        // Then you can manipulate the data.
        let canvas = document.createElement('canvas');
        let ctx = canvas.getContext('2d');
        let width = canvas.width = texture.width;
        let height = canvas.height = texture.height;

        canvas.width = texture.width;
        canvas.height = texture.height;

        let rowBytes = width * 4;
        for (let row = 0; row < height; row++) {
            let startRow = height - 1 - row;
            let imageData = ctx.createImageData(width, 1);
            let start = startRow * width * 4;
            for (let i = 0; i < rowBytes; i++) {
                imageData.data[i] = data[start + i];
            }

            ctx.putImageData(imageData, 0, row);
        }

        return canvas.toDataURL("image/jpeg");
    }
};