import { _decorator, Component, director, EventTouch, Input, input, Label, Node, UITransform, Vec2, Vec3 } from 'cc';
import { roleControler } from './HARXMRS_roleControler';
const { ccclass, property } = _decorator;

@ccclass('moveController')
export class moveController extends Component {
    
    initPos : Vec3;
    
    originParent : Node = null;
    @property(Node)
    moveParent : Node;

    canMove : boolean = true;

    static womenCanWear : boolean = false;

    @property(UITransform)
    purposTrans : UITransform;

    protected onLoad(): void {
        this.initPos = this.node.getPosition();
        this.originParent = this.node.parent;
    }

    protected onEnable(): void {
        this.node.on(Input.EventType.TOUCH_START, this.TOUCH_START, this);
        this.node.on(Input.EventType.TOUCH_MOVE, this.TOUCH_MOVE, this);
        this.node.on(Input.EventType.TOUCH_END, this.TOUCH_END, this);
   
    }
    
    checkInpos(pos : Vec2){
        if (this.purposTrans.getBoundingBoxToWorld().contains(pos)){
            return true;
        }
        return false;
    }

    TOUCH_START(event : EventTouch){
        if (!this.canMove) return;
        let startPos = this.node.getWorldPosition();
        this.node.setParent(this.moveParent);
        this.node.setWorldPosition(startPos);
    }
    
    TOUCH_MOVE(event : EventTouch){
        if (!this.canMove) return;
        this.node.setWorldPosition(new Vec3(event.getUILocation().x, event.getUILocation().y, 0));
        
    }
    
    TOUCH_END(event : EventTouch){
        if (!this.canMove) return;
        console.log(this.node.name);
        if (this.checkInpos(new Vec2(this.node.worldPosition.x, this.node.worldPosition.y))){
            if (this.node.name == "衣服" && moveController.womenCanWear){
                console.log("CNM");
                if (this.purposTrans.node.parent.getComponent(roleControler).leftName == 'women'){
                    director.getScene().emit("changeSkinLeft", "长袖长裤", 1);
                }else{
                    director.getScene().emit("changeSkinRight", "长袖长裤", 1);
                }
            
                this.node.setScale(0, 0, 0);
                director.getScene().emit("addWin");
            }else if (this.node.name == "rightitem" || this.node.name == "leftitem"){
                director.getScene().emit("changeItemSp", this.node.name);
                this.node.setScale(0, 0, 0);
                // this.node.parent.getComponentInChildren(Label).string = "";
            }else{
                this.init();
            }
        }else{
            this.init();
        }
    }


    init() {
        this.node.setParent(this.originParent);
        this.node.setPosition(this.initPos);
    }
}


