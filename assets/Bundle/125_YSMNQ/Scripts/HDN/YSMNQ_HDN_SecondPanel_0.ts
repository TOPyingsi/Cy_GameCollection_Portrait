import { _decorator, Component, Label, Node, tween, UITransform, v3, Widget } from 'cc';
import { YSMNQ_ItemBase } from '../Common/YSMNQ_ItemBase';
import { YSMNQ_HDN_PeopleState } from './YSMNQ_HDN_PeopleState';
import { YSMNQ_AudioManager } from '../YSMNQ_AudioManager';
const { ccclass, property } = _decorator;

@ccclass('YSMNQ_HDN_SecondPanel_0')
export class YSMNQ_HDN_SecondPanel_0 extends Component {
    static Instance: YSMNQ_HDN_SecondPanel_0 = null;

    @property(Node)
    itemLayer: Node = null;

    @property(Node)
    operationLayer: Node = null;

    @property(Node)
    secondPanels: Node = null;

    @property(Node)
    tipNode: Node = null;

    @property(Node)
    spTipNode: Node = null;


    itemGroupIds: {itemId:number,status:boolean}[][] = [
        [{itemId:0,status:false}],
        [{itemId:1,status:false}],
        [{itemId:2,status:false}],
        [{itemId:3,status:false}],
        [{itemId:4,status:false}],
        [{itemId:5,status:false}],
        [{itemId:6,status:false},{itemId:7,status:false},{itemId:8,status:false}],
        [{itemId:9,status:false},{itemId:10,status:false},{itemId:11,status:false}],

    ];


    public currentItemGroupId: number = -1;
    public currentItemId: number = 0;

    private _cb:()=>void = null;

    onLoad(){
        YSMNQ_HDN_SecondPanel_0.Instance = this;
        this.node.getComponent(Widget).updateAlignment();

        this.itemLayer.getComponent(Widget).updateAlignment();
        this.itemLayer.children.forEach((item, index) => {
            let count = item.children.length;
            item.getComponent(UITransform).width =  this.itemLayer.getComponent(UITransform).width/3*count;
            item.setWorldPosition(v3(this.itemLayer.getComponent(UITransform).width+item.getComponent(UITransform).width/2, item.worldPosition.y, 0));
        });

        this.itemLayer.active = false;

        this.secondPanels.getComponent(Widget).updateAlignment();
        this.secondPanels.children.forEach((item, index) => {
            item.getComponent(UITransform).width =  this.secondPanels.getComponent(UITransform).width;
            item.getComponent(UITransform).height =  this.secondPanels.getComponent(UITransform).height;
            item.active = true;
        });

        this.node.setScale(v3(0,0,0));
    }

    init(cb:()=>void): void {
        YSMNQ_HDN_SecondPanel_0.Instance = this;
        this._cb = cb;

      
        
        this.tipNode.active = true;
        this.tipNode.getChildByName("Label").getComponent(Label).string = "治疗病人";
        this.spTipNode.active = false;

        tween(this.node)
            .to(0.5, { scale: v3(1,1,1) })
            .call(()=>{
                this.itemLayer.active = true;
                this.changeItemGroup();
            })
            .start();
    }

    passGame(): void {
       tween(this.node)
        .to(0.5, { scale: v3(0,0,0) })
        .call(()=>{
            this._cb();
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
            tween(lastItemGroup)
            .stop();
            this.passGame();
            return;
        }

        let currentItemGroup = this.itemLayer.getChildByName("itemGroup_" + this.currentItemGroupId);
        if(currentItemGroup){
            currentItemGroup.active = true;
            tween(currentItemGroup)
                .delay(time)
                .to(1, { worldPosition: v3(this.itemLayer.getComponent(UITransform).width/2, currentItemGroup.worldPosition.y, 0) })
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


        
    showPeopleReact(state: YSMNQ_HDN_PeopleState): void {
        switch(state){
            case YSMNQ_HDN_PeopleState.迷糊:
                break;
            case YSMNQ_HDN_PeopleState.咬紧牙关:
                break;
            case YSMNQ_HDN_PeopleState.正常:
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
    

 
}


