import { _decorator, AnimationComponent, Collider2D, Component, Contact2DType, director, EventTouch, Node, ParticleSystem2D, Sprite, SpriteFrame, tween, v3 } from 'cc';
import { DTSP_Choose } from './DTSP_Choose';
import { DTSP_GameMgr } from './DTSP_GameMgr';
const { ccclass, property } = _decorator;

@ccclass('DTSP_Player')
export class DTSP_Player extends Component {
    @property(DTSP_Choose)
    ChooseTs: DTSP_Choose = null;

    @property()
    playerID: number = 1;

    @property(SpriteFrame)
    rigthSp: SpriteFrame = null;
    @property(SpriteFrame)
    wrongSp: SpriteFrame = null;

    @property(SpriteFrame)
    lostSp: SpriteFrame = null;
    @property(SpriteFrame)
    winSp: SpriteFrame = null;

    @property(SpriteFrame)
    rigthTalkSp: SpriteFrame = null;
    @property(SpriteFrame)
    wrongTalkSp: SpriteFrame = null;

    //主角已选择后的效果
    public rightEffect: Node = null;
    public wrongEffect: Node = null;

    public choose: boolean = false;

    private aniComp: AnimationComponent = null;

    public talk: Sprite = null;

    private rightNum: number = 0;
    public get RightNum() {
        return this.rightNum;
    }

    public iswin: boolean = false;
    private colider: Collider2D = null;
    start() {
        this.initData();
        director.getScene().on("答题赛跑_开始", () => {
            switch (this.playerID) {
                case 1:
                    this.aniComp.play("狮子普通");
                    break;
                case 2:
                    this.aniComp.play("猴子普通");
                    break;
            }
        }, this);
    }

    onBtnClick(event: EventTouch) {
        switch (event.target.name) {
            case "RightBtn":
                this.rightClick();
                break;
            case "WrongBtn":
                this.wrongClick();
                break;
        }
    }

    win() {
        this.iswin = true;

        let head = this.node.getChildByName("普通").getChildByName("头");
        let sprite = head.getComponent(Sprite);

        sprite.spriteFrame = this.winSp;

    }

    lost() {
        let head = this.node.getChildByName("普通").getChildByName("头");
        let sprite = head.getComponent(Sprite);

        sprite.spriteFrame = this.lostSp;
    }

    public restart() {
        this.choose = false;
        this.talk.node.active = false;
        this.hideEffect();
    }

    rightClick() {
        this.choose = true;
        this.ChooseTs.rightEffect.active = true;
        this.ChooseTs.rightSp.spriteFrame = this.rigthSp;
        this.talk.spriteFrame = this.rigthTalkSp;
        this.talk.node.active = true;
        DTSP_GameMgr.Instance.playSFX("按钮");
        this.LockBtn();
    }

    wrongClick() {
        this.choose = false;
        this.ChooseTs.wrongEffect.active = true;
        this.ChooseTs.wrongSp.spriteFrame = this.wrongSp;
        this.talk.spriteFrame = this.wrongTalkSp;
        this.talk.node.active = true;
        DTSP_GameMgr.Instance.playSFX("按钮");
        this.LockBtn();
    }

    public Right() {
        this.rightEffect.active = false;
        this.wrongEffect.active = false;

        DTSP_GameMgr.Instance.playSFX("正确");

        switch (this.playerID) {
            case 1:
                this.aniComp.play("狮子正确");
                break;
            case 2:
                this.aniComp.play("猴子正确");
                break;
        }

        this.scheduleOnce(() => {
            switch (this.playerID) {
                case 1:
                    this.aniComp.play("狮子普通");
                    break;
                case 2:
                    this.aniComp.play("猴子普通");
                    break;
            }
        }, 3.3);

        this.hideEffect();
        this.rightNum++;
    }

    public Wrong() {
        this.rightEffect.active = false;
        this.wrongEffect.active = false;

        DTSP_GameMgr.Instance.playSFX("错误");

        switch (this.playerID) {
            case 1:
                this.aniComp.play("狮子错误");
                break;
            case 2:
                this.aniComp.play("猴子错误");
                break;
        }

        let particleNode = this.node.getChildByName("错误").getChildByName("冰霜特效2");
        let particle = particleNode.getComponent(ParticleSystem2D);
        this.scheduleOnce(() => {
            particle.resetSystem();
            DTSP_GameMgr.Instance.playSFX("魔法");
        }, 1.4);

        this.scheduleOnce(() => {

            tween(this.node)
                .by(1, { position: v3(0, 800, 0) })
                .start();

            this.hideEffect();

            this.scheduleOnce(() => {
                tween(this.node)
                    .by(1, { position: v3(0, -700, 0) })
                    .start();
            }, 2.2);

            this.scheduleOnce(() => {
                switch (this.playerID) {
                    case 1:
                        this.aniComp.play("狮子普通");
                        break;
                    case 2:
                        this.aniComp.play("猴子普通");
                        break;
                }
            }, 3.3);

        }, 2);
    }

    autoChoose() {
        if (!this.ChooseTs.rightBtn.enabled && !this.ChooseTs.wrongBtn.enabled) {
            return;
        }

        this.rightClick();

        this.LockBtn();
    }

    hideEffect() {
        this.rightEffect.active = false;
        this.wrongEffect.active = false;
    }

    unLockBtn() {
        this.ChooseTs.rightBtn.enabled = true;
        this.ChooseTs.wrongBtn.enabled = true;
    }

    LockBtn() {
        this.ChooseTs.rightBtn.enabled = false;
        this.ChooseTs.wrongBtn.enabled = false;
    }

    initData() {
        this.rightEffect = this.node.getChildByName("RightEffect");
        this.wrongEffect = this.node.getChildByName("WrongEffect");

        this.talk = this.node.getChildByName("已选框").getComponent(Sprite);
        this.aniComp = this.getComponent(AnimationComponent);

        this.colider = this.getComponent(Collider2D);
        this.colider.on(Contact2DType.BEGIN_CONTACT, (selfCollider, otherCollider, contact) => {

            let group = otherCollider.node.name;

            DTSP_GameMgr.Instance.playSFX("冲线");

            if (DTSP_GameMgr.Instance.winnerState === 3) {
                otherCollider.node.active = false;
                DTSP_GameMgr.Instance.Player1.aniComp.play("狮子胜利");
                DTSP_GameMgr.Instance.Player2.aniComp.play("猴子胜利");
            }
            else if (this.iswin && group == "终点线") {
                otherCollider.node.active = false;

                switch (this.playerID) {
                    case 1:
                        this.aniComp.play("狮子胜利");
                        break;
                    case 2:
                        this.aniComp.play("猴子胜利");
                        break;
                }

            }

            this.scheduleOnce(() => {
                DTSP_GameMgr.Instance.showFinnal();
            }, 1.5);
        }, this);

        director.getScene().on("答题赛跑_自动选择", this.autoChoose, this);
    }
}


