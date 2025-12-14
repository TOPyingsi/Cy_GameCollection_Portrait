import { _decorator, Component, Node } from 'cc';
import { BZLGYJJF_TouchMonitor } from './BZLGYJJF_TouchMonitor';
import { BZLGYJJF_GameManager } from './BZLGYJJF_GameManager';
import { BZLGYJJF_GameNode } from './BZLGYJJF_GameNode';
const { ccclass, property } = _decorator;

@ccclass('BZLGYJJF_ClickNode')
export class BZLGYJJF_ClickNode extends BZLGYJJF_TouchMonitor {

    start() {
        super.start();
    }
    //触摸按下
    OnTouchDown(even) {
        if (BZLGYJJF_GameManager.Instance.GamePause) return;
        this.node.active = false;
        switch (this.ID) {//0大门，1柜子2.窗户3电视
            case 0:
                BZLGYJJF_GameManager.Instance.GameNode.getChildByName("哪吒").active = true;
                BZLGYJJF_GameManager.Instance.GameNode.getChildByName("哪吒").getComponent(BZLGYJJF_GameNode).IsLook = true;
                BZLGYJJF_GameManager.Instance.GameNode.getChildByName("太乙").active = true;
                BZLGYJJF_GameManager.Instance.GameNode.getChildByName("太乙").getComponent(BZLGYJJF_GameNode).IsLook = true;
                break;
            case 1:
                BZLGYJJF_GameManager.Instance.GameNode.getChildByName("土拨鼠").active = true;
                BZLGYJJF_GameManager.Instance.GameNode.getChildByName("土拨鼠").getComponent(BZLGYJJF_GameNode).IsLook = true;
                break;
            case 2:
                BZLGYJJF_GameManager.Instance.GameNode.getChildByName("鲨鱼").active = true;
                BZLGYJJF_GameManager.Instance.GameNode.getChildByName("鲨鱼").getComponent(BZLGYJJF_GameNode).IsLook = true;
                break;
            case 3:
                BZLGYJJF_GameManager.Instance.GameNode.getChildByName("偶像龙").active = true;
                BZLGYJJF_GameManager.Instance.GameNode.getChildByName("偶像龙").getComponent(BZLGYJJF_GameNode).IsLook = true;
                break;
        }
    }
}


