import { _decorator, Component, director, Label, Node, Sprite, SpriteFrame, sys, Vec3 } from 'cc';
import { SXZW_RoleControl } from './SXZW_RoleControl';
import { SXZW_AudioManage } from './SXZW_AudioManage';
import { SXZW_GameManage } from './SXZW_GameManage';
import { ProjectEvent, ProjectEventManager } from 'db://assets/Scripts/Framework/Managers/ProjectEventManager';
import Banner from 'db://assets/Scripts/Banner';
const { ccclass, property } = _decorator;

@ccclass('SXZW_HomeManage')
export class SXZW_HomeManage extends Component {

    @property(Node)
    weaponsNode: Node = null; // 武器节点
    @property(Node)
    arenaNode: Node = null; // 竞技场节点
    @property(Node)
    heroesNode: Node = null; // 英雄节点

    @property(Node)
    weaponsFlootNode: Node = null; // 武器节点
    @property(Node)
    arenaFlootNode: Node = null; // 竞技场节点
    @property(Node)
    heroesFlootNode: Node = null; // 英雄节点

    @property(Node)
    watchVideo200: Node
    @property(Node)
    watchVideo200_2: Node

    @property(SXZW_RoleControl)
    role: SXZW_RoleControl

    @property(Sprite)
    soundSprite: Sprite

    @property(SpriteFrame)
    sound_on: SpriteFrame

    @property(SpriteFrame)
    sound_off: SpriteFrame

    @property(Node)
    return_Btn: Node

    protected onEnable(): void {
        this.role.homeRole = true;
        this.scheduleOnce(() => {
            this.role.hello();
        }, 0)
        this.soundSprite.spriteFrame = SXZW_AudioManage.Instance.isMute ? this.sound_off : this.sound_on;
        SXZW_AudioManage.Instance.playMenuMusic();
        this.soundSprite.node.parent.on(Node.EventType.TOUCH_END, this.chanageSound, this);
        this.watchVideo200.on(Node.EventType.TOUCH_END, this.watchVideo, this);
        this.watchVideo200_2.on(Node.EventType.TOUCH_END, this.watchVideo, this);

        this.return_Btn.active = SXZW_GameManage.showReturnButton;
        if (this.return_Btn.active) {
            this.return_Btn.on(Node.EventType.TOUCH_END, this.retuenStartPage, this)
        }
    }


    start() {
        this.weaponsNode.active = true;
        this.arenaNode.active = true;
        this.heroesNode.active = false;
        this.arenaFlootNode.scale = new Vec3(1.2, 1.2, 1.2);

        this.role.updateHero();
    }

    update(deltaTime: number) {

    }

    onWeaponsClick() {
        this.weaponsNode.active = true;
        this.arenaNode.active = false;
        this.heroesNode.active = false;
        this.weaponsFlootNode.scale = new Vec3(1.2, 1.2, 1.2);
        this.arenaFlootNode.scale = new Vec3(1, 1, 1);
        this.heroesFlootNode.scale = new Vec3(1, 1, 1);
        ProjectEventManager.emit(ProjectEvent.页面转换, "谁先阵亡")
    }

    onArenaClick() {
        this.weaponsNode.active = false;
        this.arenaNode.active = true;
        this.heroesNode.active = false;
        this.weaponsFlootNode.scale = new Vec3(1, 1, 1);
        this.arenaFlootNode.scale = new Vec3(1.2, 1.2, 1.2);
        this.heroesFlootNode.scale = new Vec3(1, 1, 1);

        this.role.updateHero();
        this.role.hello();

        ProjectEventManager.emit(ProjectEvent.页面转换, "谁先阵亡")
    }

    onHeroesClick() {
        this.weaponsNode.active = false;
        this.arenaNode.active = false;
        this.heroesNode.active = true;
        this.weaponsFlootNode.scale = new Vec3(1, 1, 1);
        this.arenaFlootNode.scale = new Vec3(1, 1, 1);
        this.heroesFlootNode.scale = new Vec3(1.2, 1.2, 1.2);
        ProjectEventManager.emit(ProjectEvent.页面转换, "谁先阵亡")
    }

    chanageSound() {
        SXZW_AudioManage.Instance.isMute = !SXZW_AudioManage.Instance.isMute;
        this.soundSprite.spriteFrame = SXZW_AudioManage.Instance.isMute ? this.sound_off : this.sound_on;
    }

    watchVideo() {
        Banner.Instance.ShowVideoAd(() => {
            SXZW_GameManage.AddCoin(200);
            this.weaponsNode.active = false;
            this.weaponsNode.active = true;
        })
    }

    protected onDisable(): void {
        this.soundSprite.node.parent.off(Node.EventType.TOUCH_END, this.chanageSound, this);
        this.watchVideo200.off(Node.EventType.TOUCH_END, this.watchVideo, this);
        this.watchVideo200_2.off(Node.EventType.TOUCH_END, this.watchVideo, this);
        this.return_Btn.off(Node.EventType.TOUCH_END, this.retuenStartPage, this)
    }

    retuenStartPage() {
        director.loadScene("Start")
    }


}


