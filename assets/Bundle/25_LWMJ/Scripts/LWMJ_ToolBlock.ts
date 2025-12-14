import { _decorator, Component, Label, Node, Sprite, SpriteFrame } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('LWMJ_ToolBlock')
export class LWMJ_ToolBlock extends Component {
    private block_id: number = -1;

    @property([SpriteFrame])
    public blockSpriteFrame:[]= [];

    public setID(id: number) {
        this.block_id = id;
    }

    public getID() {
        return this.block_id;
    }
    protected onLoad(): void {
       
    }
    start() {
        this.blockSet();

    }
    blockSet(){
        this.node.getChildByName('wp').getComponent(Sprite).spriteFrame = this.blockSpriteFrame[this.block_id];
        switch (this.block_id) {
            case 0:
                this.node.getChildByName("djText").getComponent(Label).string = "抹布";
                break;
            case 1:
                this.node.getChildByName("djText").getComponent(Label).string = "卸甲胶";
                break;
            case 2:
                this.node.getChildByName("djText").getComponent(Label).string = "钢推";
                break;
            case 3:
                this.node.getChildByName("djText").getComponent(Label).string = "死皮剪";
                break;
            case 4:
                this.node.getChildByName("djText").getComponent(Label).string = "火炬头";
                break;
            case 5:
                this.node.getChildByName("djText").getComponent(Label).string = "护甲油";
                break;
            case 6:
                this.node.getChildByName("djText").getComponent(Label).string = "照灯";
                break;
            case 7:
                this.node.getChildByName("djText").getComponent(Label).string = "胶水";
                break;
            case 8:
                this.node.getChildByName("djText").getComponent(Label).string = "甲片";
                break;
            case 9:
                this.node.getChildByName("djText").getComponent(Label).string = "一字灯";
                break;
            case 10:
                this.node.getChildByName("djText").getComponent(Label).string = "打磨条";
                break;
            case 11:
                this.node.getChildByName("djText").getComponent(Label).string = "底胶";
                break;
            case 12:
                this.node.getChildByName("djText").getComponent(Label).string = "亮片";
                break;
            case 13:
                this.node.getChildByName("djText").getComponent(Label).string = "提亮刷";
                break;
            case 14:
                this.node.getChildByName("djText").getComponent(Label).string = "封层";
                break;
        }

    }

    update(deltaTime: number) {
        
    }
}


