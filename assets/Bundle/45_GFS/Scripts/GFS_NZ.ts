import { _decorator, Component, director, find, math, Node, Sprite, SpriteFrame, tween, v3, Vec2, Vec3 } from 'cc';
import { GFS_DS } from './GFS_DS';
import { GFS_LVController } from './GFS_LVController';
import { GFS_GHEFFECTS, GFS_ITEM } from './GFS_Constant';
import { GFS_TouchController } from './GFS_TouchController';
import { GFS_GH } from './GFS_GH';
import { GamePanel } from '../../../Scripts/UI/Panel/GamePanel';
import { GFS_SoundController, GFS_Sounds } from './GFS_SoundController';
import { ProjectEventManager } from '../../../Scripts/Framework/Managers/ProjectEventManager';
import { MyEvent } from '../../../Scripts/Framework/Managers/EventManager';
const { ccclass, property } = _decorator;

@ccclass('GFS_NZ')
export class GFS_NZ extends Component {

    public static Instance: GFS_NZ = null;

    @property(SpriteFrame)
    SF: SpriteFrame[] = [];

    @property(Node)
    Talks: Node[] = [];

    IconNode: Node = null;
    IconSprite: Sprite = null;

    TalkNode: Node = null;
    RemoveNode: Node = null;
    RemovePos: Vec3 = new Vec3();

    Sun: Node = null;
    Moon: Node = null;
    BGZ: Node = null;

    GHs: GFS_GH[] = [];

    OffsetX: number = 0;
    NGNumber: number = 0;

    FailNode: Node = null;

    private _index: number = 0;
    private _startPos: Vec3 = new Vec3();

    protected onLoad(): void {
        GFS_NZ.Instance = this;

        this.IconNode = find("Icon", this.node);
        this.IconSprite = find("Icon", this.node).getComponent(Sprite);

        this.TalkNode = find("Talk", this.node);
        this.RemoveNode = find("销毁节点", this.node);
        this.Sun = find("太阳", this.node);
        this.Moon = find("月亮", this.node);
        this.BGZ = find("八卦阵", this.node);
        this.FailNode = find("失败", this.node);

        this._startPos = this.node.getPosition().clone();
    }

    protected start(): void {
        if (this.IconNode) {
            tween(this.IconNode)
                .to(1, { scale: v3(1, 1.05, 1) }, { easing: 'sineOut' })
                .to(1, { scale: v3(1, 1, 1) }, { easing: 'sineOut' })
                .union()
                .repeatForever()
                .start();
        }

        if (ProjectEventManager.GameStartIsShowTreasureBox) director.getScene().once(MyEvent.TreasureBoxDestroy, this.startGame, this);
        else this.startGame();
    }

    startGame() {
        tween(this.node)
            .by(3, { position: v3(1000, 0, 0) }, { easing: `sineOut` })
            .call(() => {
                GFS_SoundController.Instance.PlaySound(GFS_Sounds.NZ_1)
                this.nextTalk(() => {
                    GFS_DS.Instance.next(() => {
                        GFS_SoundController.Instance.PlaySound(GFS_Sounds.NZ_2)
                        this.nextTalk(() => {
                            GFS_LVController.Instance.switchBG();
                        })
                    });
                }, 4);
            })
            .start();
    }

    nextTalk(cb: Function = null, time: number = 3) {
        this.TalkNode.active = true;
        this.Talks[this._index].active = true;
        this.scheduleOnce(() => {
            this.TalkNode.active = false;
            this.Talks[this._index].active = false;
            this._index++;
            cb && cb();
        }, time);
    }

    initPos() {
        this.node.setPosition(v3(0, this._startPos.y, this._startPos.z));
        this.RemovePos = this.RemoveNode.getWorldPosition().clone();
    }

    moveByOffsetX(offsetX: number = 0) {
        const x = math.clamp(offsetX, -600, 600);
        this.OffsetX = x;
        this.node.setPosition(v3(x, this._startPos.y, this._startPos.z));
    }

    check(item: GFS_ITEM) {
        this.moveByOffsetX();
        GFS_TouchController.Instance.IsTouch = false;
        switch (item) {
            case GFS_ITEM.人民币:
                GFS_SoundController.Instance.PlaySound(GFS_Sounds.人民币);
                GFS_LVController.Instance.showTips(`有钱我也没命花啊！`);
                this.showSF(8);
                break;
            case GFS_ITEM.纸币:
                GFS_SoundController.Instance.PlaySound(GFS_Sounds.纸币);
                GFS_LVController.Instance.showTips(`这些钱全部孝敬你，饶我一条狗命吧！`);
                this.showSF(1);
                this.removeGH(GFS_GHEFFECTS.爱心);
                break;
            case GFS_ITEM.月亮:
                GFS_SoundController.Instance.PlaySound(GFS_Sounds.月亮);
                GFS_LVController.Instance.showTips(`我现在哪里睡得着啊！`);
                this.showSF(16);
                this.showTarget(this.Moon);
                break;
            case GFS_ITEM.太阳:
                GFS_SoundController.Instance.PlaySound(GFS_Sounds.太阳);
                GFS_LVController.Instance.showTips(`鬼最怕阳光了！`);
                this.showSF(2);
                this.removeGH(GFS_GHEFFECTS.大惊);
                this.showTarget(this.Sun);
                break;
            case GFS_ITEM.贴纸:
                GFS_SoundController.Instance.PlaySound(GFS_Sounds.宝剑);
                GFS_LVController.Instance.showTips(`这玩意对鬼没用啊！`);
                this.showSF(15);
                break;
            case GFS_ITEM.符咒:
                GFS_SoundController.Instance.PlaySound(GFS_Sounds.符纸);
                GFS_LVController.Instance.showTips(`这可是专门驱鬼的符咒，再不走就别走了！`);
                this.showSF(2);
                this.removeGH(GFS_GHEFFECTS.符纸);
                break;
            case GFS_ITEM.大宝剑:
                GFS_SoundController.Instance.PlaySound(GFS_Sounds.宝剑);
                GFS_LVController.Instance.showTips(`这玩意对鬼没用啊！`);
                this.showSF(12);
                break;
            case GFS_ITEM.桃木剑:
                GFS_SoundController.Instance.PlaySound(GFS_Sounds.桃木剑);
                GFS_LVController.Instance.showTips(`桃木剑可是驱鬼神器，还不快滚?`);
                this.showSF(3);
                this.removeGH(GFS_GHEFFECTS.大惊);
                break;
            case GFS_ITEM.蜡质口红:
                GFS_SoundController.Instance.PlaySound(GFS_Sounds.蜡质口红);
                GFS_LVController.Instance.showTips(`现在哪有心思涂口红啊！`);
                this.showSF(13);
                break;
            case GFS_ITEM.朱砂口红:
                GFS_SoundController.Instance.PlaySound(GFS_Sounds.朱砂口红);
                GFS_LVController.Instance.showTips(`朱砂做成的口红，女鬼姐姐要不要试试?`);
                this.showSF(4);
                this.removeGH(GFS_GHEFFECTS.爱心);
                break;
            case GFS_ITEM.化妆镜:
                GFS_SoundController.Instance.PlaySound(GFS_Sounds.化妆镜);
                GFS_LVController.Instance.showTips(`命都快没了，哪有心思化妆啊！`);
                this.showSF(14);
                break;
            case GFS_ITEM.铜镜:
                GFS_SoundController.Instance.PlaySound(GFS_Sounds.铜镜);
                GFS_LVController.Instance.showTips(`这可是大师开过光的铜镜，小女鬼还不退下?`);
                this.showSF(5);
                this.removeGH(GFS_GHEFFECTS.大惊);
                break;
            case GFS_ITEM.玉液琼浆:
                GFS_SoundController.Instance.PlaySound(GFS_Sounds.酒);
                GFS_LVController.Instance.showTips(`现在哪有心思喝这些!`);
                this.showSF(11);
                break;
            case GFS_ITEM.昆仑山甘露:
                GFS_SoundController.Instance.PlaySound(GFS_Sounds.昆仑甘露);
                GFS_LVController.Instance.showTips(`这昆仑甘露中有哪吒的童子尿，最克制女鬼了!`);
                this.showSF(6);
                this.removeGH(GFS_GHEFFECTS.大惊);
                break;
            case GFS_ITEM.男神海报:
                GFS_SoundController.Instance.PlaySound(GFS_Sounds.男神海报);
                GFS_LVController.Instance.showTips(`命都没了还追什么星啊!`);
                this.showSF(10);
                break;
            case GFS_ITEM.八卦阵:
                GFS_SoundController.Instance.PlaySound(GFS_Sounds.八卦阵);
                GFS_LVController.Instance.showTips(`我这八卦阵展开你可就无处可逃了!`);
                this.showSF(2);
                this.removeGH(GFS_GHEFFECTS.大惊);
                this.showTarget(this.BGZ);
                break;
            case GFS_ITEM.母鸡:
                GFS_SoundController.Instance.PlaySound(GFS_Sounds.母鸡);
                GFS_LVController.Instance.showTips(`母鸡对鬼没作用啊!`);
                this.showSF(7);
                break;
            case GFS_ITEM.黑狗:
                GFS_SoundController.Instance.PlaySound(GFS_Sounds.黑狗);
                GFS_LVController.Instance.showTips(`都什么时候了，还养宠物啊!`);
                this.showSF(9);
                break;
            case GFS_ITEM.黑狗血:
                GFS_SoundController.Instance.PlaySound(GFS_Sounds.黑狗血);
                GFS_LVController.Instance.showTips(`黑狗血最克制女鬼了!`);
                this.removeGH(GFS_GHEFFECTS.大惊);
                this.showSF(17);
                break;

        }
    }

    showSF(index: number = 0) {
        this.IconSprite.spriteFrame = this.SF[index];
    }

    removeGH(type: GFS_GHEFFECTS, time: number = 2) {
        this.NGNumber--;
        const gh = this.GHs.pop();
        gh.show(type, time);
    }

    showTarget(target: Node) {
        target.active = true;
        this.scheduleOnce(() => {
            target.active = false;
        }, 4);
    }

    gameFail() {
        GFS_SoundController.Instance.PlaySound(GFS_Sounds.失败);
        this.FailNode.active = true;
        this.scheduleOnce(() => {
            this.showSF(18);
        }, 2);
        this.scheduleOnce(() => {
            GamePanel.Instance.lostStr = `游戏失败，再试一次吧！`
            GamePanel.Instance.Lost();
        }, 4);
    }

    gameWin() {
        GFS_SoundController.Instance.PlaySound(GFS_Sounds.胜利);
        this.showSF(2);
        GFS_LVController.Instance.showWinTips();
    }
}


