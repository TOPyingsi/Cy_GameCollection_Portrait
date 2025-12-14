import { _decorator, Canvas, Component, error, EventTouch, find, Node, tween, UITransform, v3, Vec3 } from 'cc';
import { TTAJ_GameManager } from './TTAJ_GameManager';
const { ccclass, property } = _decorator;

@ccclass('TTAJ_MaskRun')
export class TTAJ_MaskRun extends Component {
    @property(Node) //底层固定
    Diceng: Node = null;
    public BKpos: Vec3 = new Vec3();
    public BKpos1: Vec3 = new Vec3();
    public BKpos2: Vec3 = new Vec3();
    public BKpos3: Vec3 = new Vec3();
    private StartPosition: Vec3 = new Vec3();
    onLoad() {
        this.BKpos = find("Canvas/放大镜/放大镜/底层敖丙").worldPosition;
        this.BKpos1 = find("Canvas/放大镜/放大镜/底层悟空").worldPosition;
        this.BKpos2 = find("Canvas/放大镜/放大镜/哪吒").worldPosition;
        this.BKpos3 = find("Canvas/放大镜/放大镜/无量仙翁").worldPosition;
        this.StartPosition = this.Diceng.worldPosition.clone();
        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }
    onTouchStart(event: EventTouch) {
        this.OnChilck(event);

    }
    onTouchMove(event: EventTouch) {
        const pos = event.getUILocation();
        this.node.worldPosition = v3(pos.x, pos.y);
        if (find("Canvas/放大镜/放大镜/底层敖丙") != null) {
            find("Canvas/放大镜/放大镜/底层敖丙").worldPosition = this.BKpos;
        }
        if (find("Canvas/放大镜/放大镜/底层悟空") != null) {
            find("Canvas/放大镜/放大镜/底层悟空").worldPosition = this.BKpos1;
        }
        if (find("Canvas/放大镜/放大镜/哪吒") != null) {
            find("Canvas/放大镜/放大镜/哪吒").worldPosition = this.BKpos2;
        }
        if (find("Canvas/放大镜/放大镜/无量仙翁") != null) {
            find("Canvas/放大镜/放大镜/无量仙翁").worldPosition = this.BKpos3;
        }

        this.Diceng.worldPosition = this.StartPosition;
    }
    onTouchEnd() {

    }
    OnChilck(event: EventTouch) {
        const pos = event.getUILocation();
        let Children1 = find("Canvas/放大镜/放大镜").children[1];
        for (let i = 0; i < Children1.children.length; i++) {
            const uiTransform = Children1.children[i].getComponent(UITransform);
            const spawnAreaWidth = uiTransform.width;
            const spawnAreaHeight = uiTransform.height;
            const spawnAreaPos = Children1.children[i].worldPosition;
            let MaxX = spawnAreaPos.x + spawnAreaWidth / 2;
            let MinX = spawnAreaPos.x - spawnAreaWidth / 2;
            let MaxY = spawnAreaPos.y + spawnAreaHeight / 2;
            let MinY = spawnAreaPos.y - spawnAreaHeight / 2;
            if (pos.x > MinX && pos.x < MaxX && pos.y > MinY && pos.y < MaxY) {

                if (Children1.name == "底层敖丙" && Children1.children[i].name != "武器") {


                    const Qxiang = find("Canvas/背景/盒子遮罩").worldPosition;
                    const Laichu = Children1.children[i].worldPosition;
                    tween(Children1.children[i])
                        .to(0, { worldPosition: v3(Laichu) })
                        .to(0.5, { worldPosition: v3(Qxiang) })
                        .start();
                    find("Canvas/背景/桌子").addChild(Children1.children[i]);
                    TTAJ_GameManager.Instance.Level1 += 1;
                    TTAJ_GameManager.Instance.jingdu.string = TTAJ_GameManager.Instance.renwu[1].name + "  线索：" + TTAJ_GameManager.Instance.Level1 + "/3" + "当前人物：" + TTAJ_GameManager.Instance.Level3 + "/4";
                    break;

                } else if (Children1.name == "底层悟空" && Children1.children[i].name != "表层悟空") {

                    const Qxiang = find("Canvas/背景/盒子遮罩").worldPosition;
                    const Laichu = Children1.children[i].worldPosition;
                    tween(Children1.children[i])
                        .to(0, { worldPosition: v3(Laichu) })
                        .to(0.5, { worldPosition: v3(Qxiang) })
                        .start();
                    find("Canvas/背景/桌子").addChild(Children1.children[i]);
                    TTAJ_GameManager.Instance.Level1 += 1;
                    TTAJ_GameManager.Instance.jingdu.string = TTAJ_GameManager.Instance.renwu[2].name + "  线索：" + TTAJ_GameManager.Instance.Level1 + "/4" + "当前人物：" + TTAJ_GameManager.Instance.Level3 + "/4";
                    break;
                } else if (Children1.name == "哪吒") {

                    const Qxiang = find("Canvas/背景/盒子遮罩").worldPosition;
                    const Laichu = Children1.children[i].worldPosition;
                    tween(Children1.children[i])
                        .to(0, { worldPosition: v3(Laichu) })
                        .to(0.5, { worldPosition: v3(Qxiang) })
                        .start();
                    find("Canvas/背景/桌子").addChild(Children1.children[i]);
                    TTAJ_GameManager.Instance.Level1 += 1;
                    TTAJ_GameManager.Instance.jingdu.string = TTAJ_GameManager.Instance.renwu[3].name + "  线索：" + TTAJ_GameManager.Instance.Level1 + "/4" + "当前人物：" + TTAJ_GameManager.Instance.Level3 + "/4";
                    break;
                }
                else if (Children1.name == "无量仙翁" && Children1.children[i].name != "变身") {

                    const Qxiang = find("Canvas/背景/盒子遮罩").worldPosition;
                    const Laichu = Children1.children[i].worldPosition;
                    tween(Children1.children[i])
                        .to(0, { worldPosition: v3(Laichu) })
                        .to(0.5, { worldPosition: v3(Qxiang) })
                        .start();
                    find("Canvas/背景/桌子").addChild(Children1.children[i]);
                    TTAJ_GameManager.Instance.Level1 += 1;
                    TTAJ_GameManager.Instance.jingdu.string = TTAJ_GameManager.Instance.renwu[4].name + "  线索：" + TTAJ_GameManager.Instance.Level1 + "/4" + "当前人物：" + TTAJ_GameManager.Instance.Level3 + "/4";
                    break;
                }



            }
        }
    }
}


