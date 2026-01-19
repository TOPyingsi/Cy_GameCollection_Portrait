import { _decorator, Animation, Component, EventTouch, Input, instantiate, Node, Prefab, Sprite, Touch, tween, UITransform, v2, v3, Vec2, Vec3 } from 'cc';
import { YSMNQ_ItemBase } from '../Common/YSMNQ_ItemBase';
import { YSMNQ_CWManager } from './YSMNQ_CWManager';
import { YSMNQ_CW_PeopleState } from './YSMNQ_CW_PeopleState';
import { YSMNQ_ItemSelectedPanel } from '../Common/YSMNQ_ItemSelectedPanel';
import { EventManager } from 'db://assets/Scripts/Framework/Managers/EventManager';
import { YSMNQ_GameEvent } from '../Common/YSMNQ_GameEvent';
import { YSMNQ_AnimBase } from '../Common/YSMNQ_AnimBase';
import { YSMNQ_CW_ItemSyringe } from './YSMNQ_CW_ItemSyringe';
const { ccclass, property } = _decorator;

@ccclass('YSMNQ_CW_CollisionItem')
export class YSMNQ_CW_CollisionItem extends YSMNQ_ItemBase {

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
                    this._tutorialsNode.children[0].active = true;
                    this._tutorialsNode.children[0].getComponent(Animation).play();
                    this._tutorialsNode.active = true;
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
            case 0:
                this._targets.children.forEach((target) => {
                    let circleNode = target.getChildByName("sp");
                    circleNode.active = false;
                })
                break;
            case 1:
                this._targets.getChildByName("target_"+targetId).getChildByName("sp").active = false;
                break;
            case 2:
                this._targets.getChildByName("target_"+targetId).getChildByName("sp").active = false;
                break;
            case 3:
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
            case 5:
                this._targets.children.forEach((target) => {
                    let circleNode = target.getChildByName("sp");
                    circleNode.active = false;
                })
                break;
            case 6:
                this._targets.children.forEach((target) => {
                    let circleNode = target.getChildByName("sp");
                    circleNode.active = false;
                })
                break;
            case 7:
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
            case 0:
                callback&&callback();
                break;
            case 1:
                this._secondPanel.getComponent(YSMNQ_ItemSelectedPanel).show((idx,spriteFrame)=>{
                    this._operationAnimsNode.children[targetId].getChildByName("pai").getComponent(Sprite).spriteFrame = spriteFrame;
                    callback&&callback();
                })
                break;
            case 2:
                callback&&callback();
                break;
            case 3:
                this._secondPanel.getComponent(YSMNQ_ItemSelectedPanel).show((idx,spriteFrame)=>{
                    let thermometerName = "thermometer_"+idx
                    this._operationAnimsNode.children.forEach((animNode) => {
                        if(animNode.name == thermometerName){
                            animNode.active = true;
                        }
                        else{
                            animNode.active = false;
                        }
                    })
                    callback&&callback();
                })
                break;
            case 4:
                callback&&callback();
                break;
            case 5:
                callback&&callback();
                break;
            case 6:
                callback&&callback();
                break;
            case 7:
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
            case 0:
                animParentNode = this._operationAnimsNode;
                animParentNode.children.forEach((animNode) => {
                     animNode.active = true;
                    let animCom = animNode.getComponent(Animation);
                    if(animCom){
                        animCom.play();
                    }
                })
                duration = animParentNode.children[0].getComponent(Animation).clips[0].duration*animParentNode.children[0].getComponent(Animation).clips[0].speed;
                this.scheduleOnce(()=>{
                        animParentNode.children.forEach((animNode) => {
                            let animCom = animNode.getComponent(Animation);
                            if(animCom){
                                animCom.stop();
                            }
                            animNode.active = false;
                        })

                        this.node.active = true;
                        tween(this.node)
                            .to(0.5, { worldPosition: this._startPos })
                            .call(()=>{
                               this.passTarget(targetId);
                            })
                            .start();
                    },duration)
                break;
            case 1:
                animParentNode = this._operationAnimsNode.getChildByName("operationAnims_"+targetId);
        
                // animParentNode.children.forEach((animNode) => {
                     animParentNode.active = true;
                    if(animParentNode.getComponent(Animation)){
                        animParentNode.getComponent(Animation).play();
                    }
                // })
                duration = animParentNode.getComponent(Animation).clips[0].duration*animParentNode.getComponent(Animation).clips[0].speed;
                this.scheduleOnce(()=>{
                        if(animParentNode.getComponent(Animation)){
                            animParentNode.getComponent(Animation).stop();
                        }
                         animParentNode.active = false;

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
                animParentNode = this._operationAnimsNode.getChildByName("operationAnims_"+targetId);
        
                    animParentNode.active = true;
                    if(animParentNode.getComponent(Animation)){
                        animParentNode.getComponent(Animation).play();
                    }
                duration = animParentNode.getComponent(Animation).clips[0].duration*animParentNode.getComponent(Animation).clips[0].speed;
                this.scheduleOnce(()=>{
                        if(animParentNode.getComponent(Animation)){
                            animParentNode.getComponent(Animation).stop();
                        }
                         animParentNode.active = false;


                        this.node.active = true;
                        tween(this.node)
                            .to(0.5, { worldPosition: this._startPos })
                            .call(()=>{
                                this.passTarget(targetId);
                            })
                            .start();
                    },duration)

                break;
            case 3:
                this._operationAnimsNode.children.forEach((node)=>{
                    if(node.active){
                         animParentNode = node;
                    }
                })
        
                animParentNode.children.forEach((animNode) => {
                     animNode.active = true;
                    let animCom = animNode.getComponent(Animation);
                    if(animCom){
                        animCom.play();
                    }
                    let animBase = animNode.getComponent(YSMNQ_AnimBase);
                    if(animBase){
                        animBase.play();
                    }
                })
                duration = animParentNode.children[0].getComponent(Animation).clips[0].duration*animParentNode.children[0].getComponent(Animation).clips[0].speed;
                this.scheduleOnce(()=>{
                        animParentNode.children.forEach((animNode) => {
                            let animCom = animNode.getComponent(Animation);
                            if(animCom){
                                animCom.stop();
                            }
                            let animBase = animNode.getComponent(YSMNQ_AnimBase);
                            if(animBase){
                                animBase.stop();
                            }
                            animNode.active = false;
                        })

                        this.node.active = true;
                        tween(this.node)
                            .to(0.5, { worldPosition: this._startPos })
                            .call(()=>{
                                this.passTarget(targetId);
                            })
                            .start();
                    },duration)

                break;
             case 4://特殊
                animParentNode = this._operationAnimsNode
        
                animParentNode.children.forEach((animNode) => {
                     animNode.active = true;
                    let animCom = animNode.getComponent(Animation);
                    if(animCom){
                        animCom.play();
                    }
                    let animBase = animNode.getComponent(YSMNQ_AnimBase);
                    if(animBase){
                        animBase.play();
                    }
                })
                duration = animParentNode.children[0].getComponent(Animation).clips[0].duration*animParentNode.children[0].getComponent(Animation).clips[0].speed;
                this.scheduleOnce(()=>{
                    let itemSyringe= animParentNode.children[0].getComponent(YSMNQ_CW_ItemSyringe);
                    itemSyringe.init(()=>{
                         animParentNode.children.forEach((animNode) => {
                            let animCom = animNode.getComponent(Animation);
                            if(animCom){
                                animCom.stop();
                            }
                            let animBase = animNode.getComponent(YSMNQ_AnimBase);
                            if(animBase){
                                animBase.stop();
                            }
                            animNode.active = false;
                        })

                        this.node.active = true;
                        tween(this.node)
                            .to(0.5, { worldPosition: this._startPos })
                            .call(()=>{
                                this.passTarget(targetId);
                            })
                            .start();
                    })
                },duration)

                break;
            case 5:
                animParentNode = this._operationAnimsNode;
                animParentNode.children.forEach((animNode) => {
                     animNode.active = true;
                    let animCom = animNode.getComponent(Animation);
                    if(animCom){
                        animCom.play();
                    }
                })
                duration = animParentNode.children[0].getComponent(Animation).clips[0].duration*animParentNode.children[0].getComponent(Animation).clips[0].speed;
                this.scheduleOnce(()=>{
                        animParentNode.children.forEach((animNode) => {
                            let animCom = animNode.getComponent(Animation);
                            if(animCom){
                                animCom.stop();
                            }
                            animNode.active = false;
                        })

                        this.node.active = true;
                        tween(this.node)
                            .to(0.5, { worldPosition: this._startPos })
                            .call(()=>{
                               this.passTarget(targetId);
                            })
                            .start();
                    },duration)
                break;
             case 6:
                animParentNode = this._operationAnimsNode;
                animParentNode.children.forEach((animNode) => {
                     animNode.active = true;
                    let animCom = animNode.getComponent(Animation);
                    if(animCom){
                        animCom.play();
                    }
                })
                duration = animParentNode.children[0].getComponent(Animation).clips[0].duration*animParentNode.children[0].getComponent(Animation).clips[0].speed;
                this.scheduleOnce(()=>{
                        animParentNode.children.forEach((animNode) => {
                            let animCom = animNode.getComponent(Animation);
                            if(animCom){
                                animCom.stop();
                            }
                            animNode.active = false;
                        })

                        this.node.active = true;
                        tween(this.node)
                            .to(0.5, { worldPosition: this._startPos })
                            .call(()=>{
                               this.passTarget(targetId);
                            })
                            .start();
                    },duration)
                break;
             case 7:
                animParentNode = this._operationAnimsNode;
                animParentNode.children.forEach((animNode) => {
                     animNode.active = true;
                    let animCom = animNode.getComponent(Animation);
                    if(animCom){
                        animCom.play();
                    }
                    let animBase = animNode.getComponent(YSMNQ_AnimBase);
                    if(animBase){
                        animBase.play();
                    }
                })
                duration = animParentNode.children[0].getComponent(Animation).clips[0].duration*animParentNode.children[0].getComponent(Animation).clips[0].speed;
                //动画播放完将目标移动到目标8
                this.scheduleOnce(()=>{
                        let item8TargetsLayer = animParentNode.parent.parent.getChildByName("operation_8").getChildByName("targets");
                        let item8targets = animParentNode.children[0].getChildByName("item8Targets");
                        while(item8targets.children.length>0){
                            let item8target = item8targets.children[0];
                            let worldPosition  = item8target.worldPosition.clone();
                            item8target.setParent(item8TargetsLayer);
                            item8target.setWorldPosition(worldPosition);
                            item8target.active = true;
                        }
                    },duration)
                break;
            default:
                break;
        }
    }

  

    showPeopleReact(targetId:number): void {
        switch(this._itemId){
            case 0:
                YSMNQ_CWManager.Instance.showPeopleReact(YSMNQ_CW_PeopleState.迷糊);
                break;
            case 1:
                YSMNQ_CWManager.Instance.showPeopleReact(YSMNQ_CW_PeopleState.迷糊);
                break;
            case 2:
                YSMNQ_CWManager.Instance.showPeopleReact(YSMNQ_CW_PeopleState.咬紧牙关);
                break;
            case 3:
                YSMNQ_CWManager.Instance.showPeopleReact(YSMNQ_CW_PeopleState.张嘴);
                break;
            case 4:
                 YSMNQ_CWManager.Instance.showPeopleReact(YSMNQ_CW_PeopleState.咬紧牙关);
                break;
            case 5:
                YSMNQ_CWManager.Instance.showPeopleReact(YSMNQ_CW_PeopleState.张嘴);
                break;
            case 6:
                YSMNQ_CWManager.Instance.showPeopleReact(YSMNQ_CW_PeopleState.迷糊);
                break;
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
            case 0:
                YSMNQ_CWManager.Instance.showTip("用手掌给病人按摩");
                break;
            case 1:
                YSMNQ_CWManager.Instance.showTip("用苍蝇拍拍打苍蝇");
                break;
            case 2:
                YSMNQ_CWManager.Instance.showTip("用镊子拔出碎玻璃");
                break;
            case 3:
                YSMNQ_CWManager.Instance.showTip("用体温计量体温");
                break;
            case 4:
                YSMNQ_CWManager.Instance.showTip("给病人进行抽血检查");
                break;
            case 5:
                YSMNQ_CWManager.Instance.showTip("给病人吃药");
                break;
            case 6:
                YSMNQ_CWManager.Instance.showTip("给病人输液");
                break;
            case 7:
                YSMNQ_CWManager.Instance.showTip("用胃镜仪检查肠胃");
                break;
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
            YSMNQ_CWManager.Instance.passItem(this._itemId);
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

    onItem_8_Completed(){
        if(this._itemId == 7){
            let animParentNode = this._operationAnimsNode;
            let animCom = animParentNode.children[0].getComponent(Animation)
            animCom.play("end");
            let duration = animCom.getState("end").duration;
            this.scheduleOnce(()=>{
                animParentNode.children.forEach((animNode) => {
                    let animCom = animNode.getComponent(Animation);
                    if(animCom){
                        animCom.stop();
                    }
                    animNode.active = false;
                })

                this.node.active = true;
                tween(this.node)
                    .to(0.5, { worldPosition: this._startPos })
                    .call(()=>{
                        this.passTarget(0);
                    })
                    .start();
            },duration)
        }
    }
    

    onListener(){
        EventManager.on(YSMNQ_GameEvent.CancelTutorial, this.hideTutorial, this);
        EventManager.on(YSMNQ_GameEvent.CW_Item_8_Completed, this.onItem_8_Completed, this);
    }

    removeListener(){
        EventManager.off(YSMNQ_GameEvent.CancelTutorial);
        EventManager.off(YSMNQ_GameEvent.CW_Item_8_Completed);
    }

    protected onDestroy(): void {
        this.removeListener();
    }

}


