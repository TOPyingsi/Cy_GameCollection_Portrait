import { _decorator, BoxCollider2D, Component, EventTouch, instantiate, Label, Node, Prefab, Sprite, SpriteFrame, tween, UITransform, v2, v3, Vec3 } from 'cc';
import { NZABSJ_GameMain } from './NZABSJ_GameMain';
import { NZABSJ_RoleController } from './NZABSJ_RoleController';
const { ccclass, property } = _decorator;

@ccclass('NZABSJ_PropController')
export class NZABSJ_PropController extends Component {
    private static instance: NZABSJ_PropController = null;

    public static get Instance(): NZABSJ_PropController {
        return this.instance;
    }

    @property(Prefab)
    leftPropPrefab: Prefab = null;

    @property(Prefab)
    rightPropPrefab: Prefab = null;

    @property([SpriteFrame])
    round1: SpriteFrame[] = [];

    @property([SpriteFrame])
    round2: SpriteFrame[] = [];

    @property([SpriteFrame])
    round3: SpriteFrame[] = [];

    @property([SpriteFrame])
    round4: SpriteFrame[] = [];

    @property([SpriteFrame])
    round5: SpriteFrame[] = [];

    @property([SpriteFrame])
    round6: SpriteFrame[] = [];

    @property([SpriteFrame])
    round7: SpriteFrame[] = [];

    @property(Node)
    leftNode: Node = null;

    @property(Node)
    rightNode: Node = null;

    count: number = 0;

    private g: Number = 0;

    protected onLoad(): void {
        NZABSJ_PropController.instance = this;
    }

    del() {
        this.node.children.forEach((node) => {
            node.destroy();
            console.log("销毁" + node.name);
        });
    }

    onLoadSprite(round: Number) {
        this.g = round;
        console.log("onLoadSprite被调用 : " + round)
        switch (round) {
            case 0:
                this.setSprite("left", this.round1[0], this.leftPropPrefab, 2);
                this.setSprite("right", this.round1[1], this.rightPropPrefab, 1);
                break;
            case 1:
                this.setSprite("left", this.round2[0], this.leftPropPrefab, 1);
                this.setSprite("right", this.round2[1], this.rightPropPrefab, 2);
                break;
            case 2:
                this.setSprite("left", this.round3[0], this.leftPropPrefab, 1);
                this.setSprite("right", this.round3[1], this.rightPropPrefab, 2);
                break;
            case 3:
                this.setSprite("left", this.round4[0], this.leftPropPrefab, 2);
                this.setSprite("right", this.round4[1], this.rightPropPrefab, 1);
                break;
            case 4:
                this.setSprite("left", this.round5[0], this.leftPropPrefab, 2);
                this.setSprite("right", this.round5[1], this.rightPropPrefab, 1);
                break;
            case 5:
                this.setSprite("left", this.round6[0], this.leftPropPrefab, 1);
                this.setSprite("right", this.round6[2], this.rightPropPrefab, 2);
                break;
            case 6:
                this.setSprite("left", this.round7[0], this.leftPropPrefab, 1);
                this.setSprite("right", this.round7[1], this.rightPropPrefab, 2);
                break;
        }
    }

    private setSprite(str: string, sf: SpriteFrame, prefab: Prefab, tag: number) {
        switch (str) {
            case "left":
                const leftNode = instantiate(prefab);
                leftNode.getChildByName("Prop").getComponent(Sprite).spriteFrame = sf;
                leftNode.getChildByName("Label").getComponent(Label).string = sf.name;
                leftNode.getComponent(BoxCollider2D).tag = tag;
                leftNode.setParent(this.node);
                break;
            case "right":
                const rightNode = instantiate(prefab);
                rightNode.getChildByName("Prop").getComponent(Sprite).spriteFrame = sf;
                rightNode.getChildByName("Label").getComponent(Label).string = sf.name;
                rightNode.getComponent(BoxCollider2D).tag = tag;
                rightNode.setParent(this.node);
                break;
        }
    }
}



