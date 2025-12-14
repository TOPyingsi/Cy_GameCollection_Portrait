import { _decorator, Collider2D, Component, Contact2DType, IPhysics2DContact, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('leftClipController')
export class leftClipController extends Component {
       cds : Collider2D[];
       firstT : boolean = false;
       secondT : boolean = false;
       protected onLoad(): void {
           this.cds = this.getComponentsInChildren(Collider2D);
           this.firstT = false;
           this.secondT = false;
       }
       protected onEnable(): void {
           this.cds[0].on(Contact2DType.BEGIN_CONTACT, this.BEGIN_CONTACTF, this);
           this.cds[1].on(Contact2DType.BEGIN_CONTACT, this.BEGIN_CONTACTS, this);
       }
       BEGIN_CONTACTF(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null){
           if (otherCollider.node.name == "needle"){
               this.firstT = true;
           }
       }
       BEGIN_CONTACTS(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null){
           if (otherCollider.node.name == "needle"){
               this.secondT = true;
           }
       }
       protected onDisable(): void {
           this.cds[0].off(Contact2DType.BEGIN_CONTACT, this.BEGIN_CONTACTF, this);
           this.cds[1].off(Contact2DType.BEGIN_CONTACT, this.BEGIN_CONTACTS, this);
       }
}


