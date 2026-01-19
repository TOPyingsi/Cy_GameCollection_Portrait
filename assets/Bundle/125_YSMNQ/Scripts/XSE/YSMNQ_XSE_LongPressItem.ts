import { _decorator, Animation, Component, EventTouch, Input, instantiate, Node, Prefab, Sprite, Touch, tween, UIOpacity, UITransform, v2, v3, Vec2, Vec3 } from 'cc';
import { YSMNQ_ItemBase } from '../Common/YSMNQ_ItemBase';
import { YSMNQ_XSE_Manager } from './YSMNQ_XSE_Manager';
import { YSMNQ_XSE_PeopleState } from './YSMNQ_XSE_PeopleState';
import { YSMNQ_ItemSelectedPanel } from '../Common/YSMNQ_ItemSelectedPanel';
import { EventManager } from 'db://assets/Scripts/Framework/Managers/EventManager';
import { YSMNQ_GameEvent } from '../Common/YSMNQ_GameEvent';
const { ccclass, property } = _decorator;

@ccclass('YSMNQ_XSE_LongPressItem')
export class YSMNQ_XSE_LongPressItem extends YSMNQ_ItemBase {

    private _itemId:number = 0;

    private _startPos: Vec3 = null;
    private _targets: Node = null; //  目标节点
    private _pressArea: Node = null; // 操作节点
    private _secondPanel: Node = null; // 第二面板节点

    private reduceSpeed:number = 50;

    private _selectedNode: Node = null; // 选中节点
    private _normalNode: Node = null; // 正常节点
    private _collisionNode: Node = null; // 碰撞点节点
    private _tutorialsNode: Node = null; // 提示节点
    private _itemAnimNode:Node = null;
    private _completedNode: Node = null; // 完成节点

    private _isCanMove: boolean = false;
    private _isPressing:boolean = false;

    protected onLoad(): void {
        this.onListener();
        this._selectedNode = this.node.getChildByName('selected');
        this._normalNode = this.node.getChildByName('normal');
        this._collisionNode = this.node.getChildByName('collision');
        this._completedNode = this.node.getChildByName('completed');
        this._tutorialsNode = this.node.getChildByName("tutorials");
        this._itemAnimNode = this.node.getChildByName("itemAnim");
        this._completedNode.active = false;
        this._normalNode.active = true;
        this._collisionNode.active = true;
        this._selectedNode.active = false;
        this._itemAnimNode.active = false;
        if(this._tutorialsNode){
            this._tutorialsNode.children.forEach((tutorial) => {
                tutorial.active = false;
            })
        }
    }

    init(itemId:number,operationNode: Node,secondPanel: Node): void {
        this._startPos = this.node.getWorldPosition();
        this._targets = operationNode.getChildByName("targets");
        this._pressArea = operationNode.getChildByName("pressArea");
        this._itemId = itemId;

        this._secondPanel = secondPanel;

        this.showTutorial();

        // 注册触摸事件
        this.enableTouch();
    }


    showTutorial(): void {
        // if(!this._tutorialsNode)return;
            switch(this._itemId){
                case 3:
                    break;
                default:
                    break;
            }
 
    }



    hideTutorial(): void {
        if(this._tutorialsNode){
            this._tutorialsNode.children.forEach((tutorial) => {
                tutorial.active = false;
            })
            this._tutorialsNode.active = false;
        }
    }

    showItemAnim(){
        this._itemAnimNode.active = true;
        this._selectedNode.active = false;
        this._normalNode.active = false;
        this._itemAnimNode.getComponent(Animation).play();
    }

    hideItemAnim(){
        this._itemAnimNode.getComponent(Animation).stop();
        this._itemAnimNode.active = false;
        this._selectedNode.active = false;
        this._normalNode.active = true;
    }

    showTargets(): void {
        this._targets.active = true;
        this._targets.children.forEach((target) => {
            if(target.active){
                let circleNode = target.getChildByName("circle");
                circleNode.active = true;
                circleNode.getComponent(Animation).play();
            }
        })
    }

    hideTargets(): void {
        this._targets.children.forEach((target) => {
            let circleNode = target.getChildByName("circle");
            circleNode.active = false;
        })
        this._targets.active = false;
    }

    handleTargetSp(targetId:number): void {
        switch(this._itemId){
            case 3:
                break;
            default:
                break;
        }
    }

    handleSecondPanel(targetId:number,callback:()=>void): void {
        switch(this._itemId){
            case 3:
                callback&&callback();
                break;
            default:
                break;
        }
    }


    showOperationAnim(targetId: number): void {
        let duration = 0;
        let animParentNode:Node = null;
        switch(this._itemId){
            case 3:
                break;
            default:
                break;
        }
    }

  

    showPeopleReact(targetId:number): void {
        switch(this._itemId){
            case 1:
                YSMNQ_XSE_Manager.Instance.showPeopleReact(YSMNQ_XSE_PeopleState.正常);
                break;
            case 2:
                YSMNQ_XSE_Manager.Instance.showPeopleReact(YSMNQ_XSE_PeopleState.正常);
                break;
            case 4:
                 YSMNQ_XSE_Manager.Instance.showPeopleReact(YSMNQ_XSE_PeopleState.张嘴);
                break;
            case 5:
                YSMNQ_XSE_Manager.Instance.showPeopleReact(YSMNQ_XSE_PeopleState.张嘴);
                break;
            case 6:
                YSMNQ_XSE_Manager.Instance.showPeopleReact(YSMNQ_XSE_PeopleState.正常);
                break;
            case 7:
                YSMNQ_XSE_Manager.Instance.showPeopleReact(YSMNQ_XSE_PeopleState.正常);
                break;
            case 8:
                YSMNQ_XSE_Manager.Instance.showPeopleReact(YSMNQ_XSE_PeopleState.正常);
                break;
            case 9:
                YSMNQ_XSE_Manager.Instance.showPeopleReact(YSMNQ_XSE_PeopleState.喝奶);
                break;
            default:
                break;
        }
    }

    showOperationSpTip(): void {
        YSMNQ_XSE_Manager.Instance.showOperationSpTip(this._itemId);
    }

    hideOperationSpTip(): void {
        YSMNQ_XSE_Manager.Instance.hideOperationSpTip();
    }

    showNormalTip(): void {
        YSMNQ_XSE_Manager.Instance.showTip("治疗病人");
    }

    showOperationTip(): void {
        switch(this._itemId){
            
            case 3:
                YSMNQ_XSE_Manager.Instance.showTip("给宝宝擦痱子粉");
                break;
            default:
                break;
        }
    }


    /** 触摸开始：初始化角度 */
    private onTouchStart(event: Touch): void {
    
        this._isCanMove = true;

        const touchPos = event.getUILocation(); // 触摸点世界坐标
        this.node.setWorldPosition(v3(touchPos.x, touchPos.y, 0));
        this._selectedNode.active = false;
        this._normalNode.active = false;
        this.showTargets();
        this.showItemAnim();
        this.hideTutorial();
        this.showOperationTip();
        this.showOperationSpTip();
        EventManager.Scene.emit(YSMNQ_GameEvent.CancelTutorial);
    }

    /** 触摸移动：实时更新角度和旋转 */
    private onTouchMove(event: Touch): void {
        if (!this._isCanMove) return;
        const touchPos = event.getUILocation();

        this.node.setWorldPosition(v3(touchPos.x, touchPos.y, 0));

        this.handlePress(event);
    }


    /** 触摸结束：重置状态 */
    private onTouchEnd(event: Touch): void {
        if (!this._isCanMove) return;
        this.node.setWorldPosition(this._startPos);
        this._selectedNode.active = false;
        this._normalNode.active = true;
        this.hideItemAnim();
        this.hideTargets();
        this.showNormalTip();
        this.hideOperationSpTip();
    }

    handlePress(event:Touch){
        const uiTrans = this._pressArea.getComponent(UITransform);
        let isInside = uiTrans.getBoundingBoxToWorld().contains(v2(this._collisionNode.getWorldPosition().x, this._collisionNode.getWorldPosition().y));
        if(isInside){
            this._isPressing = true;
        }
    }


    update(dt){
        if(this._isPressing && this._pressArea.getComponent(UIOpacity).opacity>0){
            let reduce = this.reduceSpeed*dt;
            this._pressArea.getComponent(UIOpacity).opacity-=reduce;
            if(this._pressArea.getComponent(UIOpacity).opacity<=0){
                this._pressArea.getComponent(UIOpacity).opacity = 0;

                this.node.active = true;
                this._selectedNode.active = false;
                this._normalNode.active = true;
                this._isCanMove = false;
                this.hideTargets();
                this.cancelTouch();
                this.hideItemAnim();
                tween(this.node)
                    .to(0.5, { worldPosition: this._startPos })
                    .call(()=>{
                        this.passTarget(0);
                    })
                    .start();
            }
        }
    }


    passTarget(targetId:number): void {
        this._targets.getChildByName("target_"+targetId).active = false;
        let isHave = false;
        this._targets.children.forEach((target)=>{
            if(target.active){
                isHave = true;
            }
        })
        if(!isHave){
            this._completedNode.active = true;
            YSMNQ_XSE_Manager.Instance.passItem(this._itemId);
            this.showNormalTip();
            this.hideOperationSpTip();
        }
        else{
            this.showNormalTip();
            this.hideOperationSpTip();
            this.enableTouch();
        }
        
    }

    enableTouch(){
        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }

    cancelTouch(){
        this.node.off(Node.EventType.TOUCH_START);
        this.node.off(Node.EventType.TOUCH_MOVE);
        this.node.off(Node.EventType.TOUCH_END);
        this.node.off(Node.EventType.TOUCH_CANCEL);
    }

    onListener(){
        EventManager.on(YSMNQ_GameEvent.CancelTutorial, this.hideTutorial, this);
    }
    removeListener(){
        EventManager.off(YSMNQ_GameEvent.CancelTutorial);
    }

    protected onDestroy(): void {
        this.removeListener();
    }

}


