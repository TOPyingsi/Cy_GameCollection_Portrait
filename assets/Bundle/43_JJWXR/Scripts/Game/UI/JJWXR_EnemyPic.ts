import { _decorator, Component, Node, SpriteFrame, Sprite } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('JJWXR_EnemyPic')
export class JJWXR_EnemyPic extends Component {
    @property(SpriteFrame)
    highlightSprite: SpriteFrame = null; // 绑定到场景中的Sprite组件
    @property(SpriteFrame)
    darkSprite: SpriteFrame = null; // 绑定到场景中的Sprite组件

    start() {
        // 初始化,获取Sprite组件
        let sprite = this.getComponent(Sprite).spriteFrame;
        // 设置初始状态为高亮
        sprite = this.highlightSprite;
    }

    // 切换暗色状态
    changeDark() {
        const spriteComponent = this.getComponent(Sprite);

        if (spriteComponent && this.darkSprite) {
            spriteComponent.spriteFrame = this.darkSprite;
        } else {
            console.error("未找到 Sprite 组件或 darkSprite 未设置！");
        }
    }
}