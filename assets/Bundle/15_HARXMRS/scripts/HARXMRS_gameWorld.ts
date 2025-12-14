import { _decorator, AudioClip, Component, director, find, Label, Node, Prefab, Sprite, SpriteFrame } from 'cc';
import { stateMachine } from './HARXMRS_stateMachine';
import { baseState } from './HARXMRS_baseState';
import { level_1 } from './levelState/HARXMRS_level_1';
import { level_2 } from './levelState/HARXMRS_level_2';
import { level_3 } from './levelState/HARXMRS_level_3';
import { level_4 } from './levelState/HARXMRS_level_4';
import { level_5 } from './levelState/HARXMRS_level_5';
import { level_6 } from './levelState/HARXMRS_level_6';
import { level_7 } from './levelState/HARXMRS_level_7';
import { itemController } from './HARXMRS_itemController';
import { roleControler } from './HARXMRS_roleControler';
import { moveController } from './HARXMRS_moveController';
import { Final } from './levelState/HARXMRS_Final';
import { GamePanel } from 'db://assets/Scripts/UI/Panel/GamePanel';
import { MyEvent } from 'db://assets/Scripts/Framework/Managers/EventManager';
const { ccclass, property } = _decorator;
/*
关卡由状态机控制，
延迟执行时间播放关卡结算动画，
物品碰触角色，通过碰撞体传递事件。
触摸用input system，到一定关卡时启用衣物触摸
gameworld控制人物状态以及关卡切换

*/
@ccclass('gameWorld')
export class gameWorld extends Component {

    stateMachine : stateMachine = new stateMachine();

    state : baseState[];

    @property([Node])
    roles : Node[] = [];

    @property(Node)
    items : Node[] = [];

    @property(itemController)
    itemController : itemController;
    @property(roleControler)
    role : roleControler;
    
    @property(Prefab)
    chabei : Prefab;
    @property(Prefab)
    pentou : Prefab;
    @property(Prefab)
    maojin : Prefab;
    @property(Prefab)
    xigua : Prefab;
    @property(Prefab)
    lizhi : Prefab;
    @property(Prefab)
    shanzi : Prefab;
    @property(Prefab)
    houlu : Prefab;
    @property(Node)
    Cv : Node;
    @property(Prefab)
    answer : Prefab;

    @property(level_1)
    level_1 : level_1 = new level_1();
    @property(level_2)
    level_2 : level_2 = new level_2();
    
    @property(level_3)
    level_3 : level_3 = new level_3();
    
    @property(level_4)
    level_4 : level_4 = new level_4();
    @property(level_5)
    level_5 : level_5 = new level_5();
    
    @property(level_6)
    level_6 : level_6 = new level_6();
    
    @property(level_7)
    level_7 : level_7 = new level_7();
    
    @property(Final)
    Final : Final = new Final();

    @property(Sprite)
    womenBed : Sprite;
    @property(Sprite)
    menBed : Sprite;
    @property([SpriteFrame])
    womenBeds : SpriteFrame[] = [];
    @property([SpriteFrame])
    menBeds : SpriteFrame[] = [];
    @property(Sprite)
    bk : Sprite;
    @property(SpriteFrame)
    bkf : SpriteFrame;
    @property(Node)
    yifu : Node;
    @property(GamePanel)
    gamePanel : GamePanel;

    @property([AudioClip])
    level_1_menLog : AudioClip[] = [];
    @property([AudioClip])
    level_2_menLog : AudioClip[] = [];
    @property([AudioClip])
    level_3_menLog : AudioClip[] = [];
    @property([AudioClip])
    level_4_menLog : AudioClip[] = [];
    @property([AudioClip])
    level_5_menLog : AudioClip[] = [];
    @property([AudioClip])
    level_6_menLog : AudioClip[] = [];
    @property([AudioClip])
    level_7_menLog : AudioClip[] = [];
    @property([AudioClip])
    level_8_menLog : AudioClip[] = [];
    @property([AudioClip])
    level_1_womenLog : AudioClip[] = [];
    @property([AudioClip])
    level_2_womenLog : AudioClip[] = [];
    @property([AudioClip])
    level_3_womenLog : AudioClip[] = [];
    @property([AudioClip])
    level_4_womenLog : AudioClip[] = [];
    @property([AudioClip])
    level_5_womenLog : AudioClip[] = [];
    @property([AudioClip])
    level_6_womenLog : AudioClip[] = [];
    @property([AudioClip])
    level_7_womenLog : AudioClip[] = [];
    @property([AudioClip])
    level_8_womenLog : AudioClip[] = [];

    protected onLoad(): void {
        this.gamePanel.answerPrefab = this.answer;
    }

    protected start(): void {
        this.itemController.node.setPosition(0,1485.254,0);
        this.level_1.init(0, this.itemController, this.level_2, this.stateMachine, this.role, this.level_1_menLog, this.level_1_womenLog);
        
        this.level_2.init(1, this.itemController, this.level_3, this.stateMachine, this.role, this.level_2_menLog, this.level_2_womenLog);
        this.level_2.initS(this.xigua, this.lizhi, this.Cv);
        
        this.level_3.init(2, this.itemController, this.level_4, this.stateMachine, this.role, this.level_3_menLog, this.level_3_womenLog);
        this.level_3.initS(this.shanzi, this.houlu);
        
        this.level_4.init(3, this.itemController, this.level_5, this.stateMachine, this.role, this.level_4_menLog, this.level_4_womenLog);

        this.level_5.init(4, this.itemController, this.level_6, this.stateMachine, this.role, this.level_5_menLog, this.level_5_womenLog);
        this.level_5.initS(this.pentou, this.maojin);
        
        this.level_6.init(5, this.itemController, this.level_7, this.stateMachine, this.role, this.level_6_menLog, this.level_6_womenLog);
        this.level_6.initS(this.chabei);
        this.level_7.init(6, this.itemController, this.Final, this.stateMachine, this.role, this.level_7_menLog, this.level_7_womenLog);
        this.level_7.initS(this.menBed, this.womenBed, this.menBeds, this.womenBeds);

        this.Final.init(7, this.itemController, null, this.stateMachine, this.role, this.level_8_menLog, this.level_8_womenLog);
        this.Final.initS(this.bk, this.bkf, this.itemController.node, this.yifu, this.gamePanel);
    }

    gameStart(){
        this.stateMachine.initState(this.level_1);
    }    

    protected onEnable(): void {
        director.getScene().on("changeItemSp", this.changeSp, this);
        director.getScene().on("gameStart", this.gameStart, this);

        
    }
    protected onDisable(): void {
        director.getScene().off("changeItemSp", this.changeSp, this);
        director.getScene().off("gameStart", this.gameStart, this);
    }
    @property(Sprite)
    leftNodeSp : Sprite;
    @property(Sprite)
    rightNodeSp : Sprite;


    changeSp(name : string){
        if (name == "leftitem"){
            this.role.lastLevelType = 2;
            this.rightNodeSp.spriteFrame = this.itemController.finalSf;
            this.itemController.rightNode.getComponentInChildren(Label).string = this.itemController.finalSf.name;
            this.itemController.leftNode.getComponentInChildren(Label).string = "";
            this.itemController.rightNode.getComponentInChildren(moveController).canMove = false;
        }else{
            this.role.lastLevelType = 1;
            this.itemController.leftNode.getComponentInChildren(moveController).canMove = false;
            this.leftNodeSp.spriteFrame = this.itemController.finalSf;
            this.itemController.leftNode.getComponentInChildren(Label).string = this.itemController.finalSf.name;
            this.itemController.rightNode.getComponentInChildren(Label).string = "";
        }
    }

}




