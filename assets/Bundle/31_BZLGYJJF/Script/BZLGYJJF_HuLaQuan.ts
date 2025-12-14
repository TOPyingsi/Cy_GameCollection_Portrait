import { _decorator, Component, EventTouch, Node, v2, v3, Vec2, Vec3 } from 'cc';
import { BZLGYJJF_Touch_ObjectType, BZLGYJJF_TouchMonitor } from './BZLGYJJF_TouchMonitor';
import { BZLGYJJF_GameNode } from './BZLGYJJF_GameNode';
import { BZLGYJJF_GameManager } from './BZLGYJJF_GameManager';
const { ccclass, property } = _decorator;

@ccclass('BZLGYJJF_HuLaQuan')
export class BZLGYJJF_HuLaQuan extends BZLGYJJF_TouchMonitor {

    chidInitPos: Vec3 = null;
    //触摸按下
    OnTouchDown(even) {
        if (BZLGYJJF_GameManager.Instance.GamePause) return;
        super.OnTouchDown(even);
        this.chidInitPos = this.node.children[this.node.children.length - 1].position.clone();

    }
    //触摸拖拽
    OnTouchMove(even) {
        if (BZLGYJJF_GameManager.Instance.GamePause) return;
        let x = even.getUILocation().x;
        let y = even.getUILocation().y;
        this.node.children[this.node.children.length - 1].setWorldPosition(v3(x, y, 0));


    }
    //触摸抬起
    OnTouchUp(even: EventTouch) {
        if (BZLGYJJF_GameManager.Instance.GamePause) return;
        if (this.point.x == even.getUILocation().x && this.point.y == even.getUILocation().y) {
            this.TouchOnClick();
        }

        if (this.ObjectType == BZLGYJJF_Touch_ObjectType.拖拽式) {
            let Distances: number[] = [];
            for (let i = 0; i < this.TargetNode.length; i++) {
                let Distance = (even.getUILocation().add(this.Offset)).subtract(v2(this.TargetNode[i].getWorldPosition().x, this.TargetNode[i].getWorldPosition().y)).length();
                Distances.push(Distance);
            }
            let minIndex = 0;
            for (let i = 1; i < Distances.length; i++) {
                if (Distances[i] < Distances[minIndex]) {
                    minIndex = i;
                }
            }
            if (Distances[minIndex] < this.upliftDistance) {
                this.TouchMoveInCident(this.TargetNode[minIndex]);
                return;
            }
            this.node.children[this.node.children.length - 1].position = this.chidInitPos.clone();
        }


    }
    TouchMoveInCident(target: Node) {
        if (target.getComponent(BZLGYJJF_GameNode).IsLook) {
            target.getComponent(BZLGYJJF_GameNode).JianFei();
            BZLGYJJF_GameManager.Instance.Say(target.getComponent(BZLGYJJF_GameNode).Id);
            this.node.children[this.node.children.length - 1].destroy();
            if (this.node.children.length == 0) {
                this.node.active = false;
            }
        } else {
            this.node.children[this.node.children.length - 1].position = this.chidInitPos.clone();
        }
    }

}


