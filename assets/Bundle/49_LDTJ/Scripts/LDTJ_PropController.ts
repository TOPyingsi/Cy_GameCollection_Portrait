import { _decorator, BoxCollider2D, Collider2D, Component, Contact2DType, instantiate, Label, macro, Node, Prefab, RigidBody2D, Sprite, SpriteFrame, Tween, tween, UITransform, Vec3 } from 'cc';
import NodeUtil from 'db://assets/Scripts/Framework/Utils/NodeUtil';
import { Tools } from 'db://assets/Scripts/Framework/Utils/Tools';
import { LDTJ_GameManager } from './LDTJ_GameManager';
import { LDTJ_RoleController } from './LDTJ_RoleController';
const { ccclass, property } = _decorator;

@ccclass('LDTJ_PropController')
export class LDTJ_PropController extends Component {

    public static Instance: LDTJ_PropController;

    @property(SpriteFrame)
    corn: SpriteFrame = null;//玉米

    @property(SpriteFrame)
    tomato: SpriteFrame = null;//西红柿

    @property(SpriteFrame)
    broccoli: SpriteFrame = null;//西兰花

    @property(SpriteFrame)
    iceCream: SpriteFrame = null;//冰激凌

    @property(SpriteFrame)
    chocolate: SpriteFrame = null;//巧克力

    @property(SpriteFrame)
    milkTea: SpriteFrame = null;//奶茶

    @property(Prefab)
    propPrefab: Prefab = null;

    @property(Node)
    propParent: Node = null;

    props: SpriteFrame[] = [];

    nb: SpriteFrame[] = [];

    round: number = 0;

    @property(Prefab)
    left: Prefab = null;

    @property(Prefab)
    right: Prefab = null;

    @property(Prefab)
    left1: Prefab = null;

    @property(Prefab)
    right1: Prefab = null;

    private isLoadPrefab: boolean = false;
    isDestroy: number = 0;

    l: Node;
    r: Node;

    index: number = 0;

    @property([SpriteFrame])
    propSpriteFrame: SpriteFrame[] = [];



    protected onLoad(): void {
        LDTJ_PropController.Instance = this;

        this.props = [this.corn, this.corn, this.tomato, this.tomato, this.broccoli, this.broccoli, this.iceCream, this.iceCream, this.chocolate, this.chocolate, this.milkTea, this.milkTea];

    }

    start() {
        this.nb = Tools.Shuffle(this.props);
        this.loadNextProp(this.nb, this.index);

    }

    loadNextProp(list: SpriteFrame[], index: number) {
        if (index >= list.length) {
            this.loadPrefabBasedOnRound();
            return;
        }

        const propNode = instantiate(this.propPrefab);
        const sp = propNode.getChildByName("Sprite");
        sp.getComponent(Sprite).spriteFrame = list[index];
        const w = this.propParent.getComponent(UITransform).width;
        this.propParent.addChild(propNode);
        propNode.setPosition(Tools.GetRandomInt(-w / 2, w / 2), 900);
        this.move(propNode);
    }

    move(node: Node) {
        tween(node)
            .to(5, { position: new Vec3(node.position.x, -2000, 0) })
            .call(() => {
                this.scheduleOnce(() => {
                    node.destroy();
                    this.index++;
                    this.loadNextProp(this.nb, this.index); // 加载下一个道具
                }, 0);
            })
            .start();
    }


    loadPrefabBasedOnRound() {
        switch (this.round) {
            case 0:
                this.loadPrefab("-50", "-100");
                break;
            case 1:
                this.loadPrefab("+50", "-50");
                break;
            case 2:
                this.loadPrefab("/0.2", "-20");
                break;
            case 3:
                this.loadPrefab("*0.3", "/2");
                break;
            case 4:
                this.loadPrefab("/2", "-100");
                break;
            case 5:
                this.loadPrefab("+50", "+100");
                break;
            case 6:
                this.loadPrefab(this.propSpriteFrame[0], this.propSpriteFrame[1]);
                break;
        }
    }

    loadPrefab(x?: string | SpriteFrame, y?: string | SpriteFrame) {
        this.round++;

        if (typeof x === "string" && typeof y === "string") {
            const l = instantiate(this.left);
            const r = instantiate(this.right);

            const labelL = NodeUtil.GetNode("Label", l)?.getComponent(Label);
            const labelR = NodeUtil.GetNode("Label", r)?.getComponent(Label);

            if (labelL) labelL.string = x as string;
            if (labelR) labelR.string = y as string;

            this.jb(l, r);

        } else if (x instanceof SpriteFrame && y instanceof SpriteFrame) {

            const l = instantiate(this.left1);
            const r = instantiate(this.right1);

            const spriteL = NodeUtil.GetNode("Sprite", l)?.getComponent(Sprite);
            const spriteR = NodeUtil.GetNode("Sprite", r)?.getComponent(Sprite);

            if (spriteL) spriteL.spriteFrame = x as SpriteFrame;
            if (spriteR) spriteR.spriteFrame = y as SpriteFrame;

            this.jb(l, r);
        }
    }

    jb(l: Node, r: Node) {
        this.propParent.addChild(l);
        this.propParent.addChild(r);

        l.setPosition(-300, 900);
        r.setPosition(300, 900);

        tween(l).to(5, { position: new Vec3(-300, -2000, 0) })
            .call(() => {
                this.scheduleOnce(() => {
                    l.destroy();
                }, 0);
            })
            .start();

        tween(r).to(5, { position: new Vec3(300, -2000, 0) })
            .call(() => {
                this.scheduleOnce(() => {
                    r.destroy();
                }, 0);
            })
            .start();

        this.scheduleOnce(() => {
            this.www()
        }, 5);
    }
    www() {
        if (this.round > 6) {
            const weight = parseInt(LDTJ_RoleController.Instance.weight.getComponent(Label).string)
            if (weight <= 96) {
                LDTJ_GameManager.Instance.gameOver(true);
            } else {
                LDTJ_GameManager.Instance.gameOver(false);
            }
        } else {
            this.index = 0;
            this.loadNextProp(this.nb, this.index);
        }
    }
}