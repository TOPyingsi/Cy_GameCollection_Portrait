import { _decorator, Camera, Component, director, EventTouch, Node, tween, UITransform, v2, v3, Vec3 } from 'cc';
import { ZHSHJ_GameManager } from './ZHSHJ_GameManager';
import { ZHSHJ_Change } from './ZHSHJ_Change';

const { ccclass, property } = _decorator;

@ccclass('ZHSHJ_GameNode')
export class ZHSHJ_GameNode extends Component {

    private _startPos: Vec3 = new Vec3();

    private _propId: number = 0;
    public get PropId(): number {
        return this._propId;
    }
    public set PropId(id: number) {
        this._propId = id;
    }

    _parent: Node = null;

    start() {
        this._parent = this.node.parent;
        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);

        this._startPos = this.node.getPosition();


        //console.log(this.node.name + "的位置为:" + this._startPos);
    }

    update(deltaTime: number) {

    }



    onTouchStart(event) {
        //console.log("开始触碰");
        if (ZHSHJ_GameManager.Instance) {
            return;
        }

        ZHSHJ_GameManager.Instance.propsView.vertical = false;
        this.node.parent = ZHSHJ_GameManager.Instance.propsView.node;
        let pos = v3(event.getUILocation().x, event.getUILocation().y, 0);
        this.node.setWorldPosition(pos);
        this.node.setScale(v3(2, 2, 2));
    }

    onTouchMove(event) {
        let pos = v3(event.getUILocation().x, event.getUILocation().y, 0);
        this.node.setWorldPosition(pos);
        //console.log("触碰中");
    }

    onTouchEnd(event: EventTouch) {
        for (let target of ZHSHJ_GameManager.Instance.Targets) {
            //获取鼠标位置
            let mousePos = v2(event.getUILocation().x, event.getUILocation().y);

            //获取目标对象的包围盒
            let box = target.getBoundingBoxToWorld();
            //判断鼠标位置与包围盒是否重合
            let isContain = box.contains(v2(mousePos));
            if (isContain) {

                let targetTs = target.node.getComponent(ZHSHJ_Change);
                let boxID = targetTs.targetID;

                if (boxID === this._propId) {
                    //正确
                    targetTs.changeSk();
                    ZHSHJ_GameManager.Instance.JudgmentAnsewr(true);

                    let targets = ZHSHJ_GameManager.Instance.Targets;
                    let index = targets.indexOf(target);
                    targets.splice(index, 1);

                    let content = ZHSHJ_GameManager.Instance.propsView.content.getComponent(UITransform);
                    content.height -= 300;
                    this.node.parent.destroy();
                    //console.log("正确");
                }
                else {
                    //错误
                    ZHSHJ_GameManager.Instance.JudgmentAnsewr(false);
                    ZHSHJ_GameManager.Instance.lost();
                    //console.log("错误");
                }
            }
            this.node.setPosition(this._startPos);
            ZHSHJ_GameManager.Instance.propsView.vertical = true;
            this.node.parent = this._parent;
        }

        //console.log("触碰结束");
    }

}