import { _decorator, Component, find, math, Node, Label, SpriteFrame, tween, v3, Vec2, Vec3, Prefab, instantiate, Sprite } from 'cc';
import { GamePanel } from '../../../Scripts/UI/Panel/GamePanel';
import { ZJAB_SoundController, ZJAB_Sounds } from './ZJAB_SoundController';
import { ZJAB_GRADE, ZJAB_ITEM, ZJAB_ITEM_CARD } from './ZJAB_Constant';
import { ZJAB_Effect } from './ZJAB_Effect';
import { ProjectEvent, ProjectEventManager } from '../../../Scripts/Framework/Managers/ProjectEventManager';
const { ccclass, property } = _decorator;

@ccclass('ZJAB_NZ')
export class ZJAB_NZ extends Component {

    public static Instance: ZJAB_NZ = null;

    @property(Node)
    Talks: Node[] = [];

    @property(Node)
    Icons: Node[] = [];

    @property(Prefab)
    EffectPrefabs: Prefab[] = [];

    IconNode: Node = null;
    FHLNode: Node = null;
    Flame: Node = null;
    FinishNode: Node = null;
    FinishLabel: Label = null;

    TalkNode: Node = null;
    RemoveNode: Node = null;
    RemovePos: Vec3 = new Vec3();
    Effect: Node = null;
    GradeEffect: Sprite = null;


    OffsetX: number = 0;
    NGNumber: number = 0;

    Progress: number = 0;
    CurGrade: ZJAB_GRADE = ZJAB_GRADE.GRADE1;

    private _index: number = 0;
    private _startPos: Vec3 = new Vec3();

    protected onLoad(): void {
        ZJAB_NZ.Instance = this;

        this.IconNode = find("Icon", this.node);
        this.FHLNode = find("FHL", this.node);
        this.Flame = find("Icon/火焰特效", this.node);
        this.FinishNode = find("完成度", this.node);
        this.FinishLabel = find("完成度/完成度", this.node).getComponent(Label);
        this.Effect = find("Effect", this.node);
        this.GradeEffect = find("GradeEffect", this.node).getComponent(Sprite);

        this.TalkNode = find("Talk", this.node);
        this.RemoveNode = find("销毁节点", this.node);

        this._startPos = this.node.getPosition().clone();

        // this.initPos();
        this.showFinishLabel();
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
    }

    moveByOffsetX(offsetX: number = 0) {
        const x = math.clamp(offsetX, -400, 400);
        this.OffsetX = x;
        this.node.setPosition(v3(x, this._startPos.y, this._startPos.z));
    }

    initPos() {
        this.node.setPosition(v3(0, this._startPos.y, this._startPos.z));
        this.RemovePos = this.RemoveNode.getWorldPosition().clone();
    }

    showTalk(index: number, cb: Function = null, time: number = 3) {
        this.TalkNode.active = true;
        this.Talks[index].active = true;
        this.playSoundByIndex(index);
        this.scheduleOnce(() => {
            this.TalkNode.active = false;
            this.Talks[index].active = false;
            cb && cb();
        }, time);
    }

    playSoundByIndex(index: number) {
        switch (index) {
            case 0:
                ZJAB_SoundController.Instance.PlaySound(ZJAB_Sounds.NZ_1);
                break;
            case 1:
                ZJAB_SoundController.Instance.PlaySound(ZJAB_Sounds.NZ_3);
                break;
        }
    }

    showIconByIndex(index: number) {
        this.Icons.forEach(e => e.active = false)
        this.Icons[index].active = true;
    }

    showIconByProgress() {
        if (this.Progress < 8) {
            //第一阶段
            if (this.CurGrade == ZJAB_GRADE.GRADE1) return;
            this.CurGrade = ZJAB_GRADE.GRADE1;
            this.showIconByIndex(0);
            this.FHLNode.active = false;
            this.Flame.active = false;
        } else if (this.Progress < 20) {
            //第二阶段
            if (this.CurGrade == ZJAB_GRADE.GRADE2) return;
            this.CurGrade = ZJAB_GRADE.GRADE2;
            this.gradeEfeect();
            this.showIconByIndex(1);
            this.FHLNode.active = false;
            this.Flame.active = false;
        } else if (this.Progress < 50) {
            //第三阶段
            if (this.CurGrade == ZJAB_GRADE.GRADE3) return;
            this.CurGrade = ZJAB_GRADE.GRADE3;
            this.gradeEfeect();
            this.showIconByIndex(1);
            this.FHLNode.active = true;
            this.Flame.active = false;
        } else if (this.Progress < 68) {
            //第四阶段
            if (this.CurGrade == ZJAB_GRADE.GRADE4) return;
            this.CurGrade = ZJAB_GRADE.GRADE4;
            this.gradeEfeect();
            this.showIconByIndex(2);
            this.FHLNode.active = true;
            this.Flame.active = false;
        } else if (this.Progress < 84) {
            //第五阶段
            if (this.CurGrade == ZJAB_GRADE.GRADE5) return;
            this.CurGrade = ZJAB_GRADE.GRADE5;
            this.gradeEfeect();
            this.showIconByIndex(2);
            this.FHLNode.active = true;
            this.Flame.active = true;
        } else if (this.Progress == 100) {
            //第六阶段
            if (this.CurGrade == ZJAB_GRADE.GRADE6) return;
            this.CurGrade = ZJAB_GRADE.GRADE6;
            this.gradeEfeect();
            this.moveByOffsetX(0);
            this.showIconByIndex(3);
            this.Flame.active = false;
        }
    }

    showFinish() {
        this.FinishNode.active = true;
        this.Progress = 0;
        this.CurGrade = ZJAB_GRADE.Null;
        this.showFinishLabel();
    }

    showFinishLabel(addNum: number = 0) {
        this.Progress += addNum;
        this.Progress = math.clamp(this.Progress, 0, 100);
        this.FinishLabel.string = `完成度: ${this.Progress} %`;
        this.showIconByProgress();
    }

    showEffectByIndex(index: number) {
        const prefab = this.EffectPrefabs[index];
        for (let i = 0; i < 6; i++) {
            const angle = i * Math.PI / 3;
            const effect = instantiate(prefab);
            effect.parent = this.node;
            effect.setPosition(this.Effect.getPosition());
            effect.getComponent(ZJAB_Effect).init(angle);
        }
    }

    getItem(type: ZJAB_ITEM) {
        switch (type) {
            case ZJAB_ITEM.火焰:
                ZJAB_SoundController.Instance.PlaySound(ZJAB_Sounds.火焰);
                this.showFinishLabel(1);
                break;
            case ZJAB_ITEM.冰块:
                ZJAB_SoundController.Instance.PlaySound(ZJAB_Sounds.冰块);
                this.showFinishLabel(-1);
                break;
        }
        this.showEffectByIndex(type);
    }

    check(type: ZJAB_ITEM_CARD) {
        ZJAB_SoundController.Instance.PlaySound(ZJAB_Sounds.卡牌);
        switch (type) {
            case ZJAB_ITEM_CARD.加3:
                this.showFinishLabel(3);
                break;
            case ZJAB_ITEM_CARD.加5:
                this.showFinishLabel(5);
                break;
            case ZJAB_ITEM_CARD.加6:
                this.showFinishLabel(6);
                break;
            case ZJAB_ITEM_CARD.加7:
                this.showFinishLabel(7);
                break;
            case ZJAB_ITEM_CARD.加8:
                this.showFinishLabel(8);
                break;
            case ZJAB_ITEM_CARD.加10:
                this.showFinishLabel(10);
                break;
            case ZJAB_ITEM_CARD.减5:
                this.showFinishLabel(-5);
                break;
            case ZJAB_ITEM_CARD.乘2:
                this.showFinishLabel(this.Progress);
                break;
            case ZJAB_ITEM_CARD.除2:
                const num = Math.floor(this.Progress / 2);
                this.showFinishLabel(-num);
                break;
        }
    }

    gradeEfeect() {
        ZJAB_SoundController.Instance.PlaySound(ZJAB_Sounds.卡牌);
        tween(this.GradeEffect)
            .to(0.1, { fillRange: 1 }, { easing: `sineOut` })
            .delay(0.2)
            .call(() => {
                this.GradeEffect.fillRange = 0;
            })
            .start();
    }

    backStartPos() {
        this.node.setPosition(this._startPos);
    }
}


