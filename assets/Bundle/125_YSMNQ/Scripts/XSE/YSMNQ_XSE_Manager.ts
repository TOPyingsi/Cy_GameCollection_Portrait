import { _decorator, Animation, Component, Event, Label, Node, tween, UITransform, v3, Widget } from 'cc';
import { YSMNQ_ItemBase } from '../Common/YSMNQ_ItemBase';
import { YSMNQ_XSE_PeopleState } from './YSMNQ_XSE_PeopleState';
import { YSMNQ_ManagerBase } from '../Common/YSMNQ_ManagerBase';
import { YSMNQ_UIManager } from '../YSMNQ_UIManager';
import { YSMNQ_PanelName } from '../Common/YSMNQ_PanelName';
import Banner from 'db://assets/Scripts/Banner';
import { YSMNQ_AudioManager } from '../YSMNQ_AudioManager';
import { ProjectEvent, ProjectEventManager } from 'db://assets/Scripts/Framework/Managers/ProjectEventManager';
const { ccclass, property } = _decorator;

@ccclass('YSMNQ_XSE_Manager')
export class YSMNQ_XSE_Manager extends YSMNQ_ManagerBase {
    static Instance: YSMNQ_XSE_Manager = null;

    @property(Node)
    itemLayer: Node = null;

    @property(Node)
    dialogue: Node = null;

    @property(Node)
    operationLayer: Node = null;

    @property(Node)
    secondPanels: Node = null;

    @property(Node)
    tipNode: Node = null;

    @property(Node)
    spTipNode: Node = null;

    @property(Node)
    completedAnim: Node = null;

    @property(Node)
    completedPanelNode: Node = null;

            
    @property(Node)
    peopleStatusNode: Node = null;

    @property(Node)
    peopleAnim: Node = null;


    
    @property(Node)
    getTipPanel: Node = null;

    @property(Node)
    pausePanel: Node = null;

    @property(Node)
    tipPanel: Node = null;
    


    itemGroupIds: {itemId:number,status:boolean}[][] = [
        [{itemId:0,status:false},{itemId:1,status:false},{itemId:2,status:false}],
        [{itemId:3,status:false},{itemId:4,status:false},{itemId:5,status:false}],
        [{itemId:6,status:false},{itemId:7,status:false},{itemId:8,status:false}],
        [{itemId:9,status:false}],
    ];


    public currentItemGroupId: number = -1;
    public currentItemId: number = 0;

    onLoad(){
        YSMNQ_XSE_Manager.Instance = this;
    }

    startGame(): void {
        YSMNQ_XSE_Manager.Instance = this;

        this.dialogue.setScale(v3(0,0,0));
        this.tipNode.active = true;
        this.tipNode.getChildByName("Label").getComponent(Label).string = "治疗病人";
        this.spTipNode.active = false;
        this.completedPanelNode.getComponent(Widget).updateAlignment();
        this.completedPanelNode.getComponent(Widget).enabled = false;
        this.completedPanelNode.active = false;
        this.completedPanelNode.setScale(v3(0,0,0));
        this.completedAnim.active = false;
        this.peopleStatusNode.getChildByName("status_0").active = true;
        this.peopleStatusNode.getChildByName("status_1").active = false;
        this.showPeopleReact(YSMNQ_XSE_PeopleState.迷糊);


        this.getTipPanel.getComponent(Widget).updateAlignment();
        this.getTipPanel.getComponent(Widget).enabled = false;
        this.getTipPanel.active = false;
        this.getTipPanel.setScale(v3(0,0,0));

        this.pausePanel.getComponent(Widget).updateAlignment();
        this.pausePanel.getComponent(Widget).enabled = false;
        this.pausePanel.active = false;
        this.pausePanel.setScale(v3(0,0,0));

        this.tipPanel.getComponent(Widget).updateAlignment();
        this.tipPanel.getComponent(Widget).enabled = false;
        this.tipPanel.active = false;
        this.tipPanel.setScale(v3(0,0,0));

        
        this.itemLayer.getComponent(Widget).updateAlignment();
        this.itemLayer.children.forEach((item, index) => {
            item.getComponent(UITransform).width =  this.itemLayer.getComponent(UITransform).width;
            item.setWorldPosition(v3(item.getComponent(UITransform).width+item.getComponent(UITransform).width/2, item.worldPosition.y, 0));
        });

        this.secondPanels.getComponent(Widget).updateAlignment();
        this.secondPanels.children.forEach((item, index) => {
            item.getComponent(UITransform).width =  this.secondPanels.getComponent(UITransform).width;
            item.getComponent(UITransform).height =  this.secondPanels.getComponent(UITransform).height;
            item.active = true;
        });



        this.node.active = true;
        this.showDialogue();
    }

    passGame(): void {
                 YSMNQ_AudioManager.getInstance().playSound("胜利");
       this.showPeopleReact(YSMNQ_XSE_PeopleState.治好);
       this.completedAnim.active = true;
       this.scheduleOnce(()=>{
        this.completedPanelNode.active = true;
        tween(this.completedPanelNode)
            .to(0.5, { scale: v3(1,1,1) })
            .call(()=>{
                this.completedPanelNode.getChildByName("btnMain").on("click", this.backToMain, this);
                this.completedPanelNode.getChildByName("btnStart").on("click", this.backToStart, this);
            })
            .start();
       },2);
    }




    showDialogue(){
        this.dialogue.active = true;
        this.dialogue.setScale(v3(0,0,0));
        tween(this.dialogue)
            .to(0.5, { scale: v3(1,1,1) })
            .delay(2)
            .to(0.5, { scale: v3(0,0,0) })
            .call(()=>{
                this.changeItemGroup();
            })
            .start();
    }

    

    changeItemGroup(): void {
        let lastItemGroupId = this.currentItemGroupId;
        let lastItemGroup = this.itemLayer.getChildByName("itemGroup_" + lastItemGroupId);
        let time = 0;
        if(lastItemGroup){
            tween(lastItemGroup)
                .to(1, { worldPosition: v3(- lastItemGroup.getComponent(UITransform).width/2,lastItemGroup.worldPosition.y, 0) })
                .call(() => {
                    lastItemGroup.active = false;
                })
                .start();
            time = 1;
        }
        this.currentItemGroupId ++;
        if(this.currentItemGroupId >= this.itemGroupIds.length){
            this.currentItemGroupId = 0;
            this.passGame();
            return;
        }

        let currentItemGroup = this.itemLayer.getChildByName("itemGroup_" + this.currentItemGroupId);
        if(currentItemGroup){
            currentItemGroup.active = true;
            tween(currentItemGroup)
                .delay(time)
                .to(1, { worldPosition: v3(currentItemGroup.getComponent(UITransform).width/2, currentItemGroup.worldPosition.y, 0) })
                .call(() => {
                    this.itemGroupIds[this.currentItemGroupId].forEach((item, index) => {
                        this.initItem(item.itemId);
                        item.status = false;
                    })
                })
                .start();
        }
    }

    
    initItem(itemId: number): void {
        let operationNode = this.operationLayer.getChildByName("operation_" + itemId);
        let secondPanel = this.secondPanels.getChildByName("secondPanel_" + itemId);
        let itemBase = this.itemLayer.getChildByName("itemGroup_" + this.currentItemGroupId).getChildByName("item_" + itemId);
        if(itemBase){
            itemBase.getComponent(YSMNQ_ItemBase).init(itemId,operationNode,secondPanel);
        }
    }


    
    passItem(itemId: number): void {
                YSMNQ_AudioManager.getInstance().playSound("完成");
        this.itemGroupIds[this.currentItemGroupId][this.itemGroupIds[this.currentItemGroupId].findIndex((item) => item.itemId == itemId)].status = true;
        if(this.itemGroupIds[this.currentItemGroupId].every((item) => item.status)){
            this.changeItemGroup();
        }
    }


    
    showPeopleReact(state: YSMNQ_XSE_PeopleState): void {
        let animCom = this.peopleAnim.getComponent(Animation);
        switch(state){
            case YSMNQ_XSE_PeopleState.张嘴:
                if(!animCom.getState("zhangzhui").isPlaying){
                    animCom.play("zhangzhui");
                }
                this.peopleStatusNode.getChildByName("status_0").active = true;
                this.peopleStatusNode.getChildByName("status_1").active = false;
            case YSMNQ_XSE_PeopleState.正常:
            case YSMNQ_XSE_PeopleState.迷糊:
                if(!animCom.getState("zhengchang").isPlaying){
                    animCom.play("zhengchang");
                }
                this.peopleStatusNode.getChildByName("status_0").active = true;
                this.peopleStatusNode.getChildByName("status_1").active = false;
                break;
            case YSMNQ_XSE_PeopleState.喝奶:
                if(!animCom.getState("he").isPlaying){
                    animCom.play("he");
                }
                this.peopleStatusNode.getChildByName("status_0").active = true;
                this.peopleStatusNode.getChildByName("status_1").active = false;
                break;
            case YSMNQ_XSE_PeopleState.治好:
                this.peopleStatusNode.getChildByName("status_0").active = false;
                this.peopleStatusNode.getChildByName("status_1").active = true;
                break;
        }
    }

    //显示当前操作图
    showOperationSpTip(itemId: number): void {
        this.spTipNode.active = true;
        switch(itemId){
            case 0:
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
            case 8:
                break;
        }
    }

    hideOperationSpTip(){
        this.spTipNode.active = false;
    }

    //显示当前操作图
    showTip(string:string){
        this.tipNode.getChildByName("Label").getComponent(Label).string = string;
        this.tipNode.active = true;
    }

    hideTip(){
        this.tipNode.active = false;
    }
    

      
      OnButtonClick(event: Event) {
                YSMNQ_AudioManager.getInstance().playSound("按钮点击");
          switch (event.target.name) {
              case "btnPause":
                            ProjectEventManager.emit(ProjectEvent.弹出窗口, "医生模拟器");
                  this.pausePanel.active = true;
                  tween(this.pausePanel)
                      .to(0.5, { scale: v3(1,1,1) })
                      .start();
                  break;
              case "btnShowGetTipPanel":
                            ProjectEventManager.emit(ProjectEvent.弹出窗口, "医生模拟器");
                  this.getTipPanel.active = true;
                  tween(this.getTipPanel)
                      .to(0.5, { scale: v3(1,1,1) })
                      .start();
                  break;
              case "btnCloseGetTipPanel":
                  tween(this.getTipPanel)
                      .to(0.5, { scale: v3(0,0,0) })
                      .call(() => {
                          this.getTipPanel.active = false;
                      })
                      .start();
                  break;
              case "btnClosePausePanel":
                  tween(this.pausePanel)
                      .to(0.5, { scale: v3(0,0,0) })
                      .call(() => {
                          this.pausePanel.active = false;
                      })
                      .start();
                  break;
              case "btnShowTipPanel":
                  Banner.Instance.ShowVideoAd(()=>{
                      this.pausePanel.setScale(v3(0,0,0));
                      this.getTipPanel.setScale(v3(0,0,0));
                      this.pausePanel.active = false;
                      this.getTipPanel.active = false;
                      this.tipPanel.active = true;
                      tween(this.tipPanel)
                          .to(0.3, { scale: v3(1,1,1) })
                          .start();
                  })
                  break;
              case "btnCloseTipPanel":
                  tween(this.tipPanel)
                      .to(0.5, { scale: v3(0,0,0) })
                      .call(() => {
                          this.tipPanel.active = false;
                      })
                      .start();
                  break;
              case "btnBackToMain":
                  this.backToMain();
                  break;
          }
      }
      
 
 
}


