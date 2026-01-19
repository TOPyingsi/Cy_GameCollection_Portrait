import { _decorator, Animation, Component, EventTouch, Input, instantiate, Node, Prefab, Sprite, Touch, tween, UIOpacity, UITransform, v2, v3, Vec2, Vec3 } from 'cc';
import { YSMNQ_ItemBase } from '../Common/YSMNQ_ItemBase';
import { YSMNQ_DS_Manager } from './YSMNQ_DS_Manager';
import { YSMNQ_DS_PeopleState } from './YSMNQ_DS_PeopleState';
import { YSMNQ_ItemSelectedPanel } from '../Common/YSMNQ_ItemSelectedPanel';
import { EventManager } from 'db://assets/Scripts/Framework/Managers/EventManager';
import { YSMNQ_GameEvent } from '../Common/YSMNQ_GameEvent';
const { ccclass, property } = _decorator;

@ccclass('YSMNQ_DS_LongPressItem')
export class YSMNQ_DS_LongPressItem extends YSMNQ_ItemBase {

    private _itemId:number = 0;

    private _startPos: Vec3 = null;
    private _targets: Node = null; //  目标节点
    private _pressAreas: Node[] = []; // 所有操作区域节点
    private _secondPanel: Node = null; // 第二面板节点

    private reduceSpeed:number = 180;

    private _selectedNode: Node = null; // 选中节点
    private _normalNode: Node = null; // 正常节点
    private _collisionNode: Node = null; // 碰撞点节点
    private _tutorialsNode: Node = null; // 提示节点
    private _itemAnimNode:Node = null;
    private _completedNode: Node = null; // 完成节点

    private _isCanMove: boolean = false;
    private _isPressing: Map<number, boolean> = new Map(); // 每个操作区域的长按状态

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
        const pressArea = operationNode.getChildByName("pressArea");
        this._pressAreas = pressArea.children;
        this._itemId = itemId;

        this._secondPanel = secondPanel;

        // 初始化每个操作区域的长按状态
        this._pressAreas.forEach((node)=>{
            this._isPressing.set(Number(node.name.split("_")[1]),false)
        })

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
            case 2:
                // this._targets.getChildByName("target_"+targetId).getChildByName("sp").active = false;
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
            case 2:
                YSMNQ_DS_Manager.Instance.showPeopleReact(YSMNQ_DS_PeopleState.迷糊);
                break;
            default:
                break;
        }
    }

    showOperationSpTip(): void {
        YSMNQ_DS_Manager.Instance.showOperationSpTip(this._itemId);
    }

    hideOperationSpTip(): void {
        YSMNQ_DS_Manager.Instance.hideOperationSpTip();
    }

    showNormalTip(): void {
        YSMNQ_DS_Manager.Instance.showTip("治疗病人");
    }

    showOperationTip(): void {
        switch(this._itemId){
            case 0:
                YSMNQ_DS_Manager.Instance.showPeopleReact(YSMNQ_DS_PeopleState.迷糊);
                break;
            case 1:
                YSMNQ_DS_Manager.Instance.showPeopleReact(YSMNQ_DS_PeopleState.迷糊);
                break;
            case 2:
                YSMNQ_DS_Manager.Instance.showPeopleReact(YSMNQ_DS_PeopleState.迷糊);
                break;
            case 3:
                YSMNQ_DS_Manager.Instance.showPeopleReact(YSMNQ_DS_PeopleState.迷糊);
                break;
            case 4:
                 YSMNQ_DS_Manager.Instance.showPeopleReact(YSMNQ_DS_PeopleState.迷糊);
                break;
            case 5:
                YSMNQ_DS_Manager.Instance.showPeopleReact(YSMNQ_DS_PeopleState.迷糊);
                break;
            case 6:
                YSMNQ_DS_Manager.Instance.showPeopleReact(YSMNQ_DS_PeopleState.迷糊);
                break;
            case 7:
                YSMNQ_DS_Manager.Instance.showPeopleReact(YSMNQ_DS_PeopleState.迷糊);
                break;
            case 8:
                YSMNQ_DS_Manager.Instance.showPeopleReact(YSMNQ_DS_PeopleState.迷糊);
                break;
            case 9:
                YSMNQ_DS_Manager.Instance.showPeopleReact(YSMNQ_DS_PeopleState.迷糊);
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
        // 重置所有长按状态为false
        this._pressAreas.forEach((_, idx) => {
            this._isPressing.set(idx, false);
        });
    
        // 检查每个操作区域是否被触摸
        for (let i = 0; i < this._pressAreas.length; i++) {
            const pressArea = this._pressAreas[i];
            const uiTrans = pressArea.getComponent(UITransform);
            if (uiTrans) {
                const isInside = uiTrans.getBoundingBoxToWorld().contains(v2(this._collisionNode.getWorldPosition().x, this._collisionNode.getWorldPosition().y));
                if (isInside) {
                    this._isPressing.set(Number(pressArea.name.split("_")[1]),true);
                }
            }
        }
    }


    update(dt){
        for (let i = 0; i < this._pressAreas.length; i++) {
             const pressArea = this._pressAreas[i];
             let id = Number(pressArea.name.split("_")[1]);
            if (this._isPressing.get(id)) {
                const uiOpacity = pressArea.getComponent(UIOpacity);
                if (uiOpacity && uiOpacity.opacity > 0) {
                    let reduce = this.reduceSpeed * dt;
                    uiOpacity.opacity -= reduce;
                    if (uiOpacity.opacity <= 0) {
                        uiOpacity.opacity = 0;
                        this.checkAllClear(id);
                    }
                }
            }
        }
    }

    checkAllClear(idx){
        let isAllClear = true;
        for (let i = 0; i < this._pressAreas.length; i++) {
            const pressArea = this._pressAreas[i];
            const uiOpacity = pressArea.getComponent(UIOpacity);
            if(uiOpacity.opacity > 0){
                isAllClear = false;
                break;
            }
        }

        if(isAllClear){
            this.node.active = true;
            this._selectedNode.active = false;
            this._normalNode.active = true;
            this._isCanMove = false;
            this.hideTargets();
            this.cancelTouch();
            this.hideItemAnim();
            tween(this.node)
                .to(0.5, { worldPosition: this._startPos })
                .call(() => {
                    this.passTarget(idx);
                })
                .start();
        }
        else{
            this.passTarget(idx);
        }

    }


     // 完成目标点
       passTarget(targetId: number): void {
           this._targets.getChildByName("target_"+targetId).active = false;
           let isHave = false;
           this._targets.children.forEach((target)=>{
               if(target.active){
                   isHave = true;
               }
           })
           if(!isHave){
               this._completedNode.active = true;
               YSMNQ_DS_Manager.Instance.passItem(this._itemId);
               this.showNormalTip();
               this.hideOperationSpTip();
           }
           else{
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


