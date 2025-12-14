import { _decorator, Component, director, Label, Node, sp, Sprite, SpriteFrame, tween, UITransform, v3, Vec3 } from 'cc';
import { DDL_GameManager } from './DDL_GameManager';
const { ccclass, property } = _decorator;

@ccclass('DDL_ItemCtel')
export class DDL_ItemCtel extends Component {

    @property(Node) role: Node = null;
    @property(Node) lightEffect: Node = null;
    @property(Node) sss: Node = null;
    @property(Node) ssr: Node = null;
    @property(Node) icon: Node = null;
    @property(Node) sssIcon: Node = null;
    @property(Node) ssrIcon: Node = null;
    @property(Node) continueBtn: Node = null;
    @property(Node) new: Node = null;
    @property(Node) addSum: Node = null;
    @property(Node) title: Node = null;
    @property(Node) noTanks: Node = null;

    init(sf: SpriteFrame, pos: Vec3, bol: boolean, num: number) {
        this.node.setPosition(pos)
        this.icon.getComponent(Sprite).spriteFrame = sf;
        this.role.getComponent(UITransform).contentSize = this.icon.getComponent(UITransform).contentSize;
        const nameParts = sf.name.split('_');
        const level = parseInt(nameParts[0], 10);
        this.role.active = true;
        this.lightEffect.active = true;
        this.sssTween()
        this.lightEffectTween()

        tween(this.node)
            .to(0.5, { position: v3(0, 0, 0) })
            .start()
        tween(this.node)
            .to(0.5, { scale: v3(1, 1, 1) })
            .call(() => {
                this.new.active = !bol;
                if (num == 0) {
                    this.continueBtn.active = false;
                    this.title.active = true;
                    this.addSum.active = true;
                    this.noTanks.active = true;
                } else {
                    this.continueBtn.active = true;
                    this.title.active = false;
                    this.addSum.active = false;
                    this.noTanks.active = false;
                }
                if (level == 1) {
                    this.sssIcon.active = true;
                }
                if (level == 2) {
                    this.ssrIcon.active = true;
                }

                if (DDL_GameManager.instance.list.length >= 28) {
                    DDL_GameManager.instance.gamePanel.Win();
                }
            })
            .start()
    }

    lightEffectTween() {
        tween(this.lightEffect)
            .by(3, { angle: -360 })
            .repeatForever()
            .start()
    }

    sssTween() {
        const ui = this.role.getComponent(UITransform).contentSize
        const x = ui.width
        const y = ui.height
        this.sss.active = true;
        this.sss.setPosition(-x / 2, y / 2)
        tween(this.sss)
            .to(1, { position: v3(x / 2, y / 2) })
            .start()
        tween(this.sss)
            .to(1, { position: v3(x / 2, -y / 2) })
            .call(() => {
                this.sss.active = false;
                this.scheduleOnce(() => {
                    this.sssTween()
                }, 1)
            })
            .start()
    }

    continueBtnClick() {
        this.new.active = false;
        this.continueBtn.active = false;
        this.sssIcon.active = false;
        this.ssrIcon.active = false;

        const pos = DDL_GameManager.instance.map.position;
        const blackMask = DDL_GameManager.instance.blackMask;
        const map = DDL_GameManager.instance.map;
        const spin = map.getComponent(sp.Skeleton)

        tween(this.node)
            .to(0.5, { position: v3(pos.x, pos.y, pos.z) })
            .start()
        tween(this.node)
            .to(0.5, { scale: v3(0.5, 0.5, 0.5) })
            .call(() => {
                blackMask.active = false;
                spin.setAnimation(0, "animation", false);
                this.node.destroy();
            })
            .start()
    }

    addsum() {
        DDL_GameManager.instance.num = 10;
        DDL_GameManager.instance.refreshTitle();
        const pos = DDL_GameManager.instance.map.position;
        const blackMask = DDL_GameManager.instance.blackMask;
        const map = DDL_GameManager.instance.map;
        const spin = map.getComponent(sp.Skeleton)

        tween(this.node)
            .to(0.5, { position: v3(pos.x, pos.y, pos.z) })
            .start()
        tween(this.node)
            .to(0.5, { scale: v3(0.5, 0.5, 0.5) })
            .call(() => {
                blackMask.active = false;
                spin.setAnimation(0, "animation", false);
                this.node.destroy();
            })
            .start()
    }

    noTanksBtn() {
        DDL_GameManager.instance.gamePanel.Win();
    }
}


