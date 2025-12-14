import { _decorator, Component, EventTouch, Input, input, Node, SpriteFrame, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('itemController')
export class itemController extends Component {
    @property(Node)
    leftNode : Node;
    @property(Node)
    rightNode : Node;

    @property([SpriteFrame]) 
    leftSfs : SpriteFrame[] = [];
    @property([SpriteFrame]) 
    rightSfs : SpriteFrame[] = [];

    leftType : string[] = [];
    rightType : string[] = [];
    
    @property(SpriteFrame)
    finalSf : SpriteFrame;

    protected onEnable(): void {
        this.node.on(Input.EventType.TOUCH_MOVE, this.TOUCH_MOVE, this);
    }
    
    TOUCH_MOVE(event : EventTouch){
        this.node.setPosition(new Vec3(event.getUILocation().x, event.getUILocation().y, 0));
    }
    
    
    protected onDisable(): void {
        this.node.off(Input.EventType.TOUCH_MOVE, this.TOUCH_MOVE, this);
    }

}


