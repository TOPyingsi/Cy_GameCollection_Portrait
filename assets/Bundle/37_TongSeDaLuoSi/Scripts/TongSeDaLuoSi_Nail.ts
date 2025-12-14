import { _decorator, Collider2D, Color, Component, Contact2DType, Event, IPhysics2DContact, Node, Sprite, SpriteFrame } from 'cc';
import { TongSeDaLuoSi_GameManager } from './TongSeDaLuoSi_GameManager';
const { ccclass, property } = _decorator;

@ccclass('TongSeDaLuoSi_Nail')
export class TongSeDaLuoSi_Nail extends Component {

    type = 0;
    contacts: Collider2D[] = [];

    start() {
        this.getComponent(Collider2D).on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        this.getComponent(Collider2D).on(Contact2DType.END_CONTACT, this.onEndContact, this);
    }

    update(deltaTime: number) {

    }

    Init(num: number, sf: SpriteFrame) {
        this.type = num;
        this.getComponent(Sprite).spriteFrame = sf;
    }

    Click(event: Event) {
        if (this.contacts.length == 0) TongSeDaLuoSi_GameManager.Instance.RemoveNail(event.target);
    }

    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        let node = otherCollider.node;
        // 只在两个碰撞体开始接触时被调用一次
        // console.log('onBeginContact' + node.name);
        if (this.node.parent == node) return;
        if (node.getComponent(TongSeDaLuoSi_Nail)) return;
        if (this.node.parent.getSiblingIndex() < node.getSiblingIndex()) {
            if (this.contacts.indexOf(otherCollider) == -1) this.contacts.push(otherCollider);
        }
        let sprite = this.getComponent(Sprite);
        if (this.contacts.length > 0) sprite.grayscale = true;
        else sprite.grayscale = false;
    }

    onEndContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        // 只在两个碰撞体开始接触时被调用一次
        // console.log('onEndContact' + otherCollider.node.name);
        if (this.contacts.indexOf(otherCollider) != -1) this.contacts.splice(this.contacts.indexOf(otherCollider), 1);
        let sprite = this.getComponent(Sprite);
        if (this.contacts.length > 0) sprite.grayscale = true;
        else sprite.grayscale = false;
    }
}


