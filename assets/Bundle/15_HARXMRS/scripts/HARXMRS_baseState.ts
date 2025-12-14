import { _decorator, AudioClip, Component, Label, Node, Prefab, Sprite, tween, Vec2, Vec3 } from 'cc';
import { itemController } from './HARXMRS_itemController';
import { stateMachine } from './HARXMRS_stateMachine';
import { moveController } from './HARXMRS_moveController';
import { roleControler } from './HARXMRS_roleControler';
const { ccclass, property } = _decorator;

@ccclass('baseState')
export class baseState extends Component {

    stateName: string;

    machine : stateMachine;

    level: number;

    durationTime: number = 5;

    EnterPos: Vec3 = new Vec3(0, 1452.339, 0);
    EndPos: Vec3 = new Vec3(0, 75.418, 0);
    itemController : itemController;
    nextLevel : baseState;
    roleController : roleControler;
    leftMove : moveController;
    rightMove : moveController;

    menLogClip : AudioClip[] = [];
    womenLogClip : AudioClip[] = [];

    init(_level: number, _itemController : itemController, _nextlevel : baseState, _machine : stateMachine, _role : roleControler, menclip : AudioClip[], womenClip : AudioClip[]) {
        this.level = _level;
        this.itemController = _itemController;
        this.nextLevel = _nextlevel;
        this.machine = _machine;
        this.roleController = _role;
        this.leftMove = this.itemController.leftNode.getComponentInChildren(moveController);
        this.rightMove = this.itemController.rightNode.getComponentInChildren(moveController);
        this.leftMove.canMove = false;
        this.rightMove.canMove = false;
        this.menLogClip = menclip;
        this.womenLogClip = womenClip;
        // console.log(this.node.name)
        // console.log(this.leftMove);
    }

    enter() {
        if (this.itemController.node == null) return;
        this.itemController.node.setPosition(this.EnterPos);
        this.itemController.node.setScale(1,1,1);
        this.itemController.leftNode.getComponentInChildren(Sprite).spriteFrame = this.itemController.leftSfs[this.level];
        this.itemController.leftNode.getComponentInChildren(Label).string = this.itemController.leftSfs[this.level].name;
        this.itemController.leftNode.getComponentInChildren(moveController).init();
        this.itemController.rightNode.getComponentInChildren(Sprite).spriteFrame = this.itemController.rightSfs[this.level];
        this.itemController.rightNode.getComponentInChildren(Label).string = this.itemController.rightSfs[this.level].name;
        this.itemController.rightNode.getComponentInChildren(moveController).init();
        tween(this.itemController.node).to(this.durationTime,{position : this.EndPos}).call(()=>{
            this.leftMove.init();
            this.rightMove.init();
            this.itemController.node.setScale(0, 0, 0);
            this.work();
            this.scheduleOnce(()=>{
                if (this.nextLevel != null){
                    this.machine.changeState(this.nextLevel);
                } 
                
            }, 3);
        }).start();
    }
    work(){

    }

    exit() {

    }

    
}


