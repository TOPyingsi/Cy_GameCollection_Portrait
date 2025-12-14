import { _decorator, AnimationComponent, color, Color, Component, director, Node, Sprite, tween, v3 } from 'cc';
import { CSN_TouchCtrl } from './CSN_TouchCtrl';
import CSN_ClearMask from './CSN_ClearMask';
import { CSN_Juan } from './CSN_Juan';
import { GamePanel } from 'db://assets/Scripts/UI/Panel/GamePanel';
import { myEventType } from 'db://assets/Scripts/Framework/Managers/TouchCtrl';
const { ccclass, property } = _decorator;

@ccclass('CSN_GameMgr')
export class CSN_GameMgr extends Component {

    @property({ type: [Node] })
    public propNodes: Node[] = [];

    @property({ type: [Node] })
    public juanTargets: Node[] = [];

    @property(Node)
    Light: Node = null;

    public level: number = 0;

    public targets: Node[] = [];

    public stepNodes: Node[] = [];

    public propsTs: CSN_TouchCtrl[] = [];

    public gameOver: boolean = false;

    public isChangeColor: boolean = false;
    public finnalColor: Color = null;
    public juanNum: number = 0;
    public static instance: CSN_GameMgr = null;
    start() {
        CSN_GameMgr.instance = this;

        this.targets = this.node.getChildByName("Targets").children;


        for (let i = 0; i < this.propNodes.length; i++) {
            let prop = this.propNodes[i].getComponent(CSN_TouchCtrl);
            this.propsTs.push(prop);
        }

        this.stepNodes = this.node.getChildByName("Props").children;

        director.getScene().once("炒酸奶_更换颜色", (color: Color) => {

            if (!this.isChangeColor) {
                this.isChangeColor = true;

                this.finnalColor = color;

                this.changeColor();
            }

        }, this);
    }

    win() {
        this.gameOver = true;

        this.Light.active = true;

        this.lightMove();

        this.scheduleOnce(() => {
            GamePanel.Instance.Win();
        }, 1.5);
    }

    lightMove() {
        tween(this.Light)
            .by(1, { eulerAngles: v3(0, 0, 180) })
            .call(() => {
                this.lightMove();
            })
            .start();
    }

    changeColor() {
        let targets = this.node.getChildByName("Targets");
        let juanNodes = targets.children[5];

        let sprite1 = targets.children[3].children[0].getComponent(Sprite);
        sprite1.color = this.finnalColor;

        let sprite2 = targets.children[4].children[0].getComponent(Sprite);
        sprite2.color = this.finnalColor;

        for (let i = 0; i < juanNodes.children.length - 1; i++) {
            let juanSprite1 = juanNodes.children[i].children[0].getComponent(Sprite);
            juanSprite1.color = this.finnalColor;

            let juanSprite2 = targets.children[6].children[i].getComponent(Sprite);
            juanSprite2.color = this.finnalColor;
        }

    }

    showNum: number = 0;
    showMilk() {
        let step4 = this.stepNodes[4].children[this.showNum + 1];
        step4.active = true;

        let sprite = step4.getComponent(Sprite);
        sprite.color = this.finnalColor;

        this.showNum++;

        let step5 = this.stepNodes[5];
        if (this.showNum === 7) {
            tween(step5)
                .by(1, { position: v3(1080, 0, 0) })
                .call(() => {
                    step5.children[0].getComponent(CSN_TouchCtrl).isLock = false;
                    step5.children[0].getComponent(CSN_TouchCtrl).initData();

                    step5.children[1].getComponent(CSN_TouchCtrl).isLock = false;
                    step5.children[1].getComponent(CSN_TouchCtrl).initData();


                    step5.children[0].getComponent(CSN_TouchCtrl).couldMove = true;
                    step5.children[1].getComponent(CSN_TouchCtrl).couldMove = true;
                })
                .start();
        }
    }

    nextStep() {
        this.level++;

        //隐藏当前步骤,显示下一步骤
        this.targets[this.level - 1].active = false;
        this.targets[this.level].active = true;
        //下一步骤若也为遮罩类型，则解锁
        let clearTs = this.targets[this.level].getComponent(CSN_ClearMask);
        if (clearTs) {
            clearTs.isLock = false;
        }
        //锁定当前步骤道具,解锁下一步骤道具
        this.propsTs[this.level - 1].isLock = true;
        this.propsTs[this.level].isLock = false;

        switch (this.level) {
            case 1:
                this.propsTs[this.level].isLock = true;
                // this.changeLevel0();
                break;
            case 2:
                this.changeLevel1();
                break;
            case 3:
                this.changeLevel3();
                this.propsTs[this.level].isLock = false;
                this.propsTs[this.level].couldMove = true;
            case 4:
                break;

        }

    }

    changeLevel0() {
        let preNode = this.stepNodes[0];
        let nextNode = this.stepNodes[1];

        tween(preNode)
            .by(1, { position: v3(1080, 0, 0) })
            .start();

        tween(nextNode)
            .by(1, { position: v3(1080, 0, 0) })
            .call(() => {
                nextNode.children[0].getComponent(CSN_TouchCtrl).initData();
                nextNode.children[0].getComponent(CSN_TouchCtrl).isLock = false;
                nextNode.children[0].getComponent(CSN_TouchCtrl).couldMove = true;
            })
            .start();


    }

    finnalInit() {

        let preNode = this.stepNodes[3];
        let nextNode = this.stepNodes[4];
        nextNode.active = true;

        //移除上一步骤结点
        preNode.active = false;
        nextNode.active = true;

        tween(preNode)
            .by(1, { position: v3(1080, 0, 0) })
            .call(() => {
                preNode.active = false;
            })
            .start();

        //显示下一步骤结点
        tween(nextNode)
            .by(1, { position: v3(1080, 0, 0) })
            .call(() => {
                for (let i = 0; i < this.juanTargets.length; i++) {
                    let index = this.juanTargets.length - 1 - i;
                    let worldPosition = this.juanTargets[index].worldPosition.clone();

                    this.juanTargets[index].parent = this.stepNodes[4];
                    this.juanTargets[index].setSiblingIndex(8);
                    this.juanTargets[index].worldPosition = worldPosition;
                    this.juanTargets[index].eulerAngles = v3(0, 0, 90);


                    let juanTs = this.juanTargets[index].addComponent(CSN_TouchCtrl);
                    juanTs.TouchID = 5;
                    juanTs.isLock = false;
                    juanTs.couldMove = true;
                    juanTs.myEventType = myEventType.拖拽触发;
                    juanTs.initData();
                    juanTs.start();

                }

                this.juanNum = 0;
            })
            .start();
    }

    changeLevel4() {
        this.targets[2].active = false;
        this.targets[3].active = false;
        this.targets[4].active = false;

        this.targets[5].active = true;

        this.level++;

        let step3 = this.stepNodes[3];
        step3.active = false;
        step3.position.add(v3(-1080, 0, 0));

        let ani = this.getComponent(AnimationComponent);

        ani.once(AnimationComponent.EventType.FINISHED, () => {
            step3.active = true;

            tween(step3)
                .by(0.8, { position: v3(1080, 0, 0) })
                .call(() => {

                    let propTs = this.propNodes[5].getComponent(CSN_TouchCtrl);
                    propTs.initData();
                    propTs.ReOn();
                    propTs.TouchID = 4;
                    propTs.isLock = false;
                    propTs.couldMove = true;

                })
                .start();


        }, this);

        ani.play("cut");

    }

    changeLevel3() {
        let preNode = this.stepNodes[2];
        let nextNode = this.stepNodes[3];
        nextNode.active = true;

        this.targets[this.level - 1].active = true;
        this.targets[this.level + 1].active = true;

        let clearTs = this.targets[this.level + 1].getComponent(CSN_ClearMask);
        if (clearTs) {
            clearTs.isLock = false;
        }

        //移除上一步骤结点
        tween(preNode)
            .by(1, { position: v3(1080, 0, 0) })
            .call(() => {
                preNode.active = false;
            })
            .start();

        //显示下一步骤结点
        tween(nextNode)
            .by(1, { position: v3(1080, 0, 0) })
            .call(() => {
                this.propsTs[5].initData();
                this.propsTs[5].isLock = false;
                this.propsTs[5].couldMove = true;
            })
            .start();
    }

    changeLevel1() {
        let preNode = this.stepNodes[1];
        let nextNode = this.stepNodes[2];
        nextNode.active = true;

        let clearTs = this.targets[this.level].getComponent(CSN_ClearMask);
        if (clearTs) {
            clearTs.isLock = false;
        }

        //移除上一步骤结点
        tween(preNode)
            .by(1, { position: v3(1080, 0, 0) })
            .call(() => {
                preNode.active = false;
            })
            .start();

        //显示下一步骤结点
        tween(nextNode)
            .by(1, { position: v3(1080, 0, 0) })
            .call(() => {
                this.propsTs[2].initData();
                this.propsTs[3].initData();
                this.propsTs[4].initData();

                this.propsTs[2].isLock = false;
                this.propsTs[3].isLock = false;
                this.propsTs[4].isLock = false;

                this.propsTs[2].couldMove = true;
                this.propsTs[3].couldMove = true;
                this.propsTs[4].couldMove = true;
            })
            .start();
    }
}


