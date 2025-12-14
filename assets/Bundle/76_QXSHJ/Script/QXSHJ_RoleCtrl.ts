import { _decorator, CCFloat, Component, Node, sp, Tween, tween, v3, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('QXSHJ_RoleCtrl')
export class QXSHJ_RoleCtrl extends Component {

    public static instance: QXSHJ_RoleCtrl = null;

    mgrs: Node[] = [];
    rzs: Node[] = [];

    @property(Node) mgr1: Node = null;
    @property(Node) mgr2: Node = null;
    @property(Node) mgr3: Node = null;
    @property(Node) mgr4: Node = null;
    @property(Node) mgr5: Node = null;
    @property(Node) mgr6: Node = null;

    @property(Node) rz1: Node = null;
    @property(Node) rz2: Node = null;
    @property(Node) rz3: Node = null;
    @property(Node) rz4: Node = null;
    @property(Node) rz5: Node = null;
    @property(Node) rz6: Node = null;
    @property(Node) rz7: Node = null;

    mgr4Ske: sp.Skeleton = null;

    protected onLoad(): void {
        QXSHJ_RoleCtrl.instance = this;

        this.mgr4Ske = this.mgr4.getComponent(sp.Skeleton);


        this.bottomTween(this.mgr1)
        this.bottomTween(this.mgr2)
        this.bottomTween(this.mgr3)
        this.bottomTween(this.mgr4)
        this.bottomTween(this.mgr5)
        this.bottomTween(this.mgr6)

        this.bottomTween(this.rz1)
        this.bottomTween(this.rz2)
        this.bottomTween(this.rz3)
        this.bottomTween(this.rz4)
        this.bottomTween(this.rz5)
        this.bottomTween(this.rz6)
        this.bottomTween(this.rz7)
    }

    protected start(): void {
        this.mgrTween()
    }

    activeMgr(mgr: Node) {
        this.mgr1.active = mgr == this.mgr1;
        this.mgr2.active = mgr == this.mgr2;
        this.mgr3.active = mgr == this.mgr3;
        this.mgr4.active = mgr == this.mgr4;
        this.mgr5.active = mgr == this.mgr5;
        this.mgr6.active = mgr == this.mgr6;
    }

    activeRz(rz: Node) {
        this.rz1.active = rz == this.rz1;
        this.rz2.active = rz == this.rz2;
        this.rz3.active = rz == this.rz3;
        this.rz4.active = rz == this.rz4;
        this.rz5.active = rz == this.rz5;
        this.rz6.active = rz == this.rz6;
        this.rz7.active = rz == this.rz7;
    }

    x() {
        this.updateSlot(this.mgr4Ske, "钳子", 0)
    }

    updateSlot(ske: sp.Skeleton, name: string, a: number) {
        console.log("updateSlot", name, a)
        const slot = ske.findSlot(name)
        if (slot) {
            slot.color.a = a;
        } else {
            console.error(`ske 没有找到对应的插槽 ${name}`);
        }
    }

    mgrTween() {
        this.mgr1.setPosition(-1000, 0)
        tween(this.mgr1)
            .to(0.25, { position: v3(0, 0) })
            .start()
    }

    loadRZ() {
        this.rz1.parent.active = true;
        this.rz1.setPosition(-1000, 0)
        tween(this.rz1)
            .to(0.25, { position: v3(0, 0) })
            .start()
    }

    @property(CCFloat) speed: number = 3;
    @property(CCFloat) scaleGap: number = 0.03;
    private oriScale: Vec3 = v3();

    bottomTween(node: Node) {
        Tween.stopAllByTarget(node);
        this.oriScale.set(node.getScale());

        tween(node)
            .to(1 / this.speed, { scale: v3(this.oriScale.x, this.oriScale.y + this.scaleGap) })
            .to(1 / this.speed, { scale: this.oriScale })
            .to(1 / this.speed, { scale: v3(this.oriScale.x, this.oriScale.y - this.scaleGap) })
            .to(1 / this.speed, { scale: this.oriScale })
            .union().repeatForever().start();
    }

}


