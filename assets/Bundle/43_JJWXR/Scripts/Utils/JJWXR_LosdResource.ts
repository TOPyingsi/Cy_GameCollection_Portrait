import { _decorator, Component, Node, assetManager, Sprite, SpriteFrame } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('JJWXR_LosdResource')
export class JJWXR_LosdResource extends Component {
    start() {
        // 加载分包
        assetManager.loadBundle('0_JJWXR_Bundle', (err, bundle) => {
            if (err) {
                console.error(err);
                return;
            }
            // 从分包中加载 resources 资源
            bundle.load('resources/textures/myTexture', SpriteFrame, (err, spriteFrame) => {
                if (err) {
                    console.error(err);
                    return;
                }
                // 将加载的 SpriteFrame 设置到 Sprite 组件上
                const sprite = this.node.getComponent(Sprite);
                if (sprite) {
                    sprite.spriteFrame = spriteFrame;
                }
            });
        });
    }
}