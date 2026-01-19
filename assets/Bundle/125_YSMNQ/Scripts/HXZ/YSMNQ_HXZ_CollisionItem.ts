import { _decorator, Animation, Component, EventTouch, Input, instantiate, Node, Prefab, Sprite, Touch, tween, UITransform, v2, v3, Vec2, Vec3 } from 'cc';
import { YSMNQ_ItemBase } from '../Common/YSMNQ_ItemBase';
import { EventManager } from 'db://assets/Scripts/Framework/Managers/EventManager';
import { YSMNQ_GameEvent } from '../Common/YSMNQ_GameEvent';
import { YSMNQ_HXZ_SecondPanel_0 } from './YSMNQ_HXZ_SecondPanel_0';

const { ccclass, property } = _decorator;

@ccclass('YSMNQ_HXZ_CollisionItem')
export class YSMNQ_HXZ_CollisionItem extends YSMNQ_ItemBase {

    private _itemId:number = 0;

    private _startPos: Vec3 = null;
    private _targets: Node = null; //  目标节点
    private _operationAnimsNode: Node = null; // 操作节点
    private _secondPanel: Node = null; // 第二面板节点

    private _selectedNode: Node = null; // 选中节点
    private _normalNode: Node = null; // 正常节点
    private _collisionNode: Node = null; // 碰撞点节点
    private _tutorialsNode: Node = null; // 提示节点
    private _completedNode: Node = null; // 完成节点

    private _isCanMove: boolean = false;

    protected onLoad(): void {
        this.onListener();
        this._selectedNode = this.node.getChildByName('selected');
        this._normalNode = this.node.getChildByName('normal');
        this._collisionNode = this.node.getChildByName('collision');
        this._completedNode = this.node.getChildByName('completed');
        this._tutorialsNode = this.node.getChildByName("tutorials");
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
        this._operationAnimsNode = operationNode.getChildByName("operationAnims");
        this._itemId = itemId;

        this._secondPanel = secondPanel;

        this.showTutorial();

        // 注册触摸事件
        this.enableTouch();
    }


    showTutorial(): void {
        // if(!this._tutorialsNode)return;
            switch(this._itemId){
                case 0:
                    // this._tutorialsNode.children[0].active = true;
                    // this._tutorialsNode.children[0].getComponent(Animation).play();
                    // this._tutorialsNode.active = true;
                    break;
                case 1:
                    break;
                case 2:
                    break;
                case 3:
                    break;
                case 4:
                    break;
                case 5:
                    break;
                case 6:
                    break;
                case 7:
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
            case 1:
                this._targets.children.forEach((target) => {
                    let circleNode = target.getChildByName("sp");
                    circleNode.active = false;
                })
                break;
            case 2:
                    this._targets.children.forEach((target) => {
                        let circleNode = target.getChildByName("sp");
                        circleNode.active = false;
                    })
                    break;
            case 4:
                this._targets.children.forEach((target) => {
                    let circleNode = target.getChildByName("sp");
                    circleNode.active = false;
                })
                break;
            default:
                break;
        }
    }

    handleSecondPanel(targetId:number,callback:()=>void): void {
        switch(this._itemId){
            case 1:
                callback&&callback();
                break;
            case 2:
                callback&&callback();
                break;
            case 4:
                callback&&callback();
                break;
            default:
                break;
        }
    }


    showOperationAnim(targetId: number): void {
        let duration = 0;
        let animParentNode:Node = null;
        let animNode:Node = null;
        let animName:string = "";
        let animCom: Animation = null;
        switch(this._itemId){
            case 1:
                animParentNode = this._operationAnimsNode;
                animName = "anim_"+targetId;
                animNode= this._operationAnimsNode.children[0];
                animNode.active = true;
                animCom = animNode.getComponent(Animation);
                if(animCom){
                    animCom.play(animName)
                }
                duration = animCom.getState(animName).duration*animCom.getState(animName).speed;
                this.scheduleOnce(()=>{
                        let animCom = animNode.getComponent(Animation);
                        if(animCom){
                            animCom.stop()
                        }
                        let childNames = ["骨1","骨2","骨3","骨4"]
                        let isAllHide = true;
                        animNode.children.forEach((child)=>{
                            if(isAllHide){
                                if(childNames.includes(child.name) &&child.active){
                                    isAllHide = false;
                                }
                            }
                        })
                        if(isAllHide){
                            animParentNode.getChildByName("骨架").active = false;
                            animParentNode.getChildByName("手术衣层").active = false;
                        }
                        this.node.active = true;
                        tween(this.node)
                            .to(0.5, { worldPosition: this._startPos })
                            .call(()=>{
                               this.passTarget(targetId);
                            })
                            .start();
                    },duration)
                break;

                case 2:
                    animParentNode = this._operationAnimsNode;
                    animNode = this._operationAnimsNode.children[0];
                    animNode.active = true;
                   animCom = animNode.getComponent(Animation);
                    if(animCom){
                        animCom.play()
                    }
                    duration = animCom.clips[0].duration*animCom.clips[0].speed;
                    this.scheduleOnce(()=>{
                            let animCom = animNode.getComponent(Animation);
                            if(animCom){
                                animCom.stop()
                            }
                            let lastHeart = animNode.getChildByName("坏心");
                            let parent = animParentNode.parent.parent.getChildByName("operation_3").getChildByName("targets").getChildByName("target_0");
                            let worldPos = lastHeart.worldPosition.clone();
                            lastHeart.setParent(parent);
                            lastHeart.setWorldPosition(worldPos);
                            lastHeart.name = "sp";

                            this.node.active = true;
                            tween(this.node)
                                .to(0.5, { worldPosition: this._startPos })
                                .call(()=>{
                                   this.passTarget(targetId);
                                })
                                .start();
                        },duration)
                    break;
                case 4:
                    animParentNode = this._operationAnimsNode;
                    animNode = this._operationAnimsNode.children[0];
                    animNode.active = true;

                    this.node.active = true;
                    this._normalNode.children.forEach((child)=>{
                        child.active = false;
                    })
                    tween(this.node)
                        .to(0.5, { worldPosition: this._startPos })
                        .call(()=>{
                            this.passTarget(targetId);
                        })
                        .start();
                    break;
            default:
                break;
        }
    }

  

    showPeopleReact(targetId:number): void {
        switch(this._itemId){
            case 0:
                YSMNQ_HXZ_SecondPanel_0.Instance.showPeopleReact(targetId);
                break;
            case 1:
                YSMNQ_HXZ_SecondPanel_0.Instance.showPeopleReact(targetId);
                break;
            case 2:
                YSMNQ_HXZ_SecondPanel_0.Instance.showPeopleReact(targetId);
                break;
            case 4:
                YSMNQ_HXZ_SecondPanel_0.Instance.showPeopleReact(targetId);
                break;
            default:
                break;
        }
    }

    showOperationSpTip(): void {
        YSMNQ_HXZ_SecondPanel_0.Instance.showOperationSpTip(this._itemId);
    }

    hideOperationSpTip(): void {
        YSMNQ_HXZ_SecondPanel_0.Instance.hideOperationSpTip();
    }

    showNormalTip(): void {
        YSMNQ_HXZ_SecondPanel_0.Instance.showTip("治疗病人");
    }

    showOperationTip(): void {
        switch(this._itemId){
            case 0:
                YSMNQ_HXZ_SecondPanel_0.Instance.showTip("用手术刀切开胸腔皮肤");
                break;
            case 1:
                YSMNQ_HXZ_SecondPanel_0.Instance.showTip("用锯子锯开肋骨");
                break;
            case 2:
                YSMNQ_HXZ_SecondPanel_0.Instance.showTip("切断连接心脏的血管");
                break;
            case 3:
                YSMNQ_HXZ_SecondPanel_0.Instance.showTip("摘除衰竭心脏");
                break;
            case 4:
                YSMNQ_HXZ_SecondPanel_0.Instance.showTip("换上健康心脏");
                break;
            case 5:
                YSMNQ_HXZ_SecondPanel_0.Instance.showTip("安装肋骨");
                break
            case 6:
                YSMNQ_HXZ_SecondPanel_0.Instance.showTip("安装肋骨");
                break
            case 7:
                YSMNQ_HXZ_SecondPanel_0.Instance.showTip("安装肋骨");
                break
            case 8:
                YSMNQ_HXZ_SecondPanel_0.Instance.showTip("安装肋骨");
                break
            case 9:
                YSMNQ_HXZ_SecondPanel_0.Instance.showTip("缝合胸腔皮肤");
                break
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
        EventManager.Scene.emit(YSMNQ_GameEvent.CancelTutorial);
    }

    /** 触摸移动：实时更新角度和旋转 */
    private onTouchMove(event: Touch): void {
        if (!this._isCanMove) return;
        const touchPos = event.getUILocation();

        this.node.setWorldPosition(v3(touchPos.x, touchPos.y, 0));
    }


    /** 触摸结束：重置状态 */
    private onTouchEnd(event: Touch): void {
        if (!this._isCanMove) return;
        let isInside = false;
        let targetId = -1;
        this._targets.children.forEach((target) => {
            if(!isInside && target.active){
                 const uiTrans = target.getComponent(UITransform);
                isInside = uiTrans.getBoundingBoxToWorld().contains(v2(this._collisionNode.getWorldPosition().x, this._collisionNode.getWorldPosition().y));
                if(isInside){
                    targetId = Number(target.name.split("_")[1]);
                }
            }
        })

        if (isInside) {
            this.cancelTouch();
            this.hideTargets();
            this._selectedNode.active = false;
            this._normalNode.active = true;
            this.node.active = false;
            this.handleSecondPanel(targetId,()=>{
                this.handleTargetSp(targetId);
                this.showOperationAnim(targetId);
                this.showPeopleReact(targetId);
            });
            
        } else {
            this.node.setWorldPosition(this._startPos);
            this._selectedNode.active = false;
            this._normalNode.active = true;
            this.hideTargets();
            this.showNormalTip();
            this.hideOperationSpTip();
        }
    }


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
            YSMNQ_HXZ_SecondPanel_0.Instance.passItem(this._itemId);
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


