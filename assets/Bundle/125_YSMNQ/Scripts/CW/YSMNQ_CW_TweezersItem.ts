import { _decorator, Animation, Component, EventTouch, Input, instantiate, Node, Prefab, Sprite, Touch, tween, UIOpacity, UITransform, v2, v3, Vec2, Vec3 } from 'cc';
import { YSMNQ_ItemBase } from '../Common/YSMNQ_ItemBase';
import { YSMNQ_CWManager } from './YSMNQ_CWManager';
import { YSMNQ_CW_PeopleState } from './YSMNQ_CW_PeopleState';
import { YSMNQ_ItemSelectedPanel } from '../Common/YSMNQ_ItemSelectedPanel';
import { EventManager } from 'db://assets/Scripts/Framework/Managers/EventManager';
import { YSMNQ_GameEvent } from '../Common/YSMNQ_GameEvent';
import { YSMNQ_AnimBase } from '../Common/YSMNQ_AnimBase';
import { YSMNQ_CW_ItemSyringe } from './YSMNQ_CW_ItemSyringe';
const { ccclass, property } = _decorator;

@ccclass('YSMNQ_CW_TweezersItem')
export class YSMNQ_CW_TweezersItem extends YSMNQ_ItemBase {

    private _itemId:number = 0;

    private _startPos: Vec3 = null;
    private _targets: Node = null; //  目标节点
    private _placeNode: Node = null; // 操作节点
    private _tutorialsNode: Node = null; // 提示节点
    private _secondPanel: Node = null; // 第二面板节点

    private _placeAreaNode: Node = null; // 操作区域节点

    private _selectedNode: Node = null; // 选中节点
    private _normalNode: Node = null; // 正常节点
    private _collisionNode: Node = null; // 碰撞点节点
    private _completedNode: Node = null; // 完成节点
    private _holdingItemsSpNodes: Node[] = []; // 物品节点
    private _placeItemsSpNodes: Node[] = []; // 物品节点

    private _isCanMove: boolean = false;

    private _isHolding: boolean = false; // 是否正在拿取物品
    private _currentHoldingTargetId: number = -1; // 当前正在拿取的物品id

    

    protected onLoad(): void {
        this.onListener();
        this._selectedNode = this.node.getChildByName('selected');
        this._normalNode = this.node.getChildByName('normal');
        this._collisionNode = this.node.getChildByName('collision');
        this._completedNode = this.node.getChildByName('completed');
        this._tutorialsNode = this.node.getChildByName("tutorials");
        this._holdingItemsSpNodes = this.node.getChildByName("holdingItemsSpNodes").children;
        this.hideAllHoldingItemsSp();


        this._completedNode.active = false;
        this._normalNode.active = true;
        this._collisionNode.active = true;
        this._selectedNode.active = false;
        if(this._tutorialsNode){
            this._tutorialsNode.children.forEach((tutorial) => {
                tutorial.active = false;
            })
        }
    }

    init(itemId:number,operationNode: Node,secondPanel: Node): void {
        this._startPos = this.node.getWorldPosition();
        this._targets = operationNode.getChildByName("targets");
        this._placeNode = operationNode.getChildByName("placeNode");
        this._placeAreaNode = this._placeNode.getChildByName("placeArea");
        this._placeItemsSpNodes = this._placeNode.getChildByName("placeItemsSpNodes").children;
        this._itemId = itemId;
        this.hidePlaceNode();
        this._placeItemsSpNodes.forEach((itemSpNode) => {
            itemSpNode.active = false;
        })

        this._secondPanel = secondPanel;

        this.showTutorial();

        // 注册触摸事件
        this.enableTouch();
    }


    showTutorial(): void {

    }

    showPlaceNode(): void {
        this._placeNode.active = true;
    }

    hidePlaceNode(): void {
        this._placeNode.active = false;
    }

    hideTutorial(): void {
        if(this._tutorialsNode){
            this._tutorialsNode.children.forEach((tutorial) => {
                tutorial.active = false;
            })
            this._tutorialsNode.active = false;
        }
    }

    showTargets(): void {
        this._targets.children.forEach((target) => {
            if(target.active){
                let circleNode = target.getChildByName("circle");
                circleNode.active = true;
                circleNode.getComponent(UIOpacity).opacity = 255;
                circleNode.getComponent(Animation).play();
            }
        })
    }

    hideTargets(): void {
        this._targets.children.forEach((target) => {
            let circleNode = target.getChildByName("circle");
            circleNode.getComponent(UIOpacity).opacity = 0;
            circleNode.active = false;
        })
    }

    hideTargetSp(targetId:number): void {
        this._targets.getChildByName("target_"+targetId).getChildByName("sp").active = false;
    }


    showTargetSp(targetId:number): void {
        this._targets.getChildByName("target_"+targetId).getChildByName("sp").active = true;
    }


    showHoldingItemsSp(targetId:number): void {
        this._holdingItemsSpNodes.forEach((itemSpNode,index) => {
            itemSpNode.active = index === targetId;
        })
    }

    showPlaceItemsSp(targetId:number): void {
        this._placeItemsSpNodes[targetId].active = true;
    }

    hideAllHoldingItemsSp(): void {
        this._holdingItemsSpNodes.forEach((itemSpNode) => {
            itemSpNode.active = false;
        })
    }

    handleSecondPanel(targetId:number,callback:()=>void): void {
        
    }


    showOperationAnim(targetId: number): void {
       
    }

  

    showPeopleReact(targetId:number): void {
        switch(this._itemId){
            case 8:
                YSMNQ_CWManager.Instance.showPeopleReact(YSMNQ_CW_PeopleState.迷糊);
                break;
            default:
                break;
        }
    }

    showOperationSpTip(): void {
        YSMNQ_CWManager.Instance.showOperationSpTip(this._itemId);
    }

    hideOperationSpTip(): void {
        YSMNQ_CWManager.Instance.hideOperationSpTip();
    }

    showNormalTip(): void {
        YSMNQ_CWManager.Instance.showTip("治疗病人");
    }

    showOperationTip(): void {
        switch(this._itemId){
            case 8:
                YSMNQ_CWManager.Instance.showTip("用镊子夹出食物残渣");
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
        this._selectedNode.active = true;
        this._normalNode.active = false;
        this.showTargets();
        this.hideTutorial();
        this.showOperationTip();
        this.showOperationSpTip();
        this.showPlaceNode();
        EventManager.Scene.emit(YSMNQ_GameEvent.CancelTutorial);
    }

    /** 触摸移动：实时更新角度和旋转 */
    private onTouchMove(event: Touch): void {
        if (!this._isCanMove) return;
        const touchPos = event.getUILocation();

        this.node.setWorldPosition(v3(touchPos.x, touchPos.y, 0));

        if(!this._isHolding){
            this._currentHoldingTargetId = -1;
            this._targets.children.forEach((target) => {
                if(!this._isHolding && target.active){
                    const uiTrans = target.getComponent(UITransform);
                    this._isHolding = uiTrans.getBoundingBoxToWorld().contains(v2(this._collisionNode.getWorldPosition().x, this._collisionNode.getWorldPosition().y));
                    if(this._isHolding){
                        this._currentHoldingTargetId = Number(target.name.split("_")[1]);
                        //隐藏目标点
                        this.hideTargets();
                        this.hideTargetSp(this._currentHoldingTargetId);
                        //显示拿取图片
                        this.showHoldingItemsSp(this._currentHoldingTargetId);
                    }
                }
            })
        }
        else{
            let isInside = false;
            const uiTrans = this._placeAreaNode.getComponent(UITransform);
            isInside = uiTrans.getBoundingBoxToWorld().contains(v2(this._collisionNode.getWorldPosition().x, this._collisionNode.getWorldPosition().y));
            if(isInside){
                this._isHolding = false;
                //放置图片
                this.showPlaceItemsSp(this._currentHoldingTargetId);
                this.hideAllHoldingItemsSp();
                this.hideTargets();
                //取消触摸
                this._isCanMove = false;
                this.cancelTouch();
                //恢复提示
                this.showNormalTip();
                this.hideOperationSpTip();
                //移回原位置
                this._selectedNode.active = false;
                this._normalNode.active = true;
                this.node.active = true;
                tween(this.node)
                    .to(0.5, { worldPosition: this._startPos })
                    .call(()=>{
                        this.passTarget(this._currentHoldingTargetId);
                    })
                    .start();
            }
        }
    }


    /** 触摸结束：重置状态 */
    private onTouchEnd(event: Touch): void {
        if (!this._isCanMove) return;
        if (this._isHolding) {
            this._isHolding = false;
            //恢复目标
            this.showTargetSp(this._currentHoldingTargetId);
            this._currentHoldingTargetId = -1;
        }
        this.hideAllHoldingItemsSp();
        this.hideTargets();
        this.node.setWorldPosition(this._startPos);
        this._selectedNode.active = false;
        this._normalNode.active = true;
        this.node.active = true;
        this.showNormalTip();
        this.hideOperationSpTip();
        this.hidePlaceNode();
    }





    passTarget(targetId: number): void {
        this.hidePlaceNode();
        this._targets.getChildByName("target_"+targetId).active = false;
        let isHave = false;
        this._targets.children.forEach((target)=>{
            if(target.active){
                isHave = true;
            }
        })
        if(!isHave){
            this._completedNode.active = true;
            YSMNQ_CWManager.Instance.passItem(this._itemId);
            this.showNormalTip();
            this.hideOperationSpTip();
            EventManager.Scene.emit(YSMNQ_GameEvent.CW_Item_8_Completed);
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


