import { _decorator, AnimationComponent, AudioClip, Component, EventTouch, Label, Node, NodeEventType, tween, UITransform, v3, v4 } from 'cc';
import { SHJJY_GameMgr } from './SHJJY_GameMgr';
const { ccclass, property } = _decorator;

@ccclass('SHJJY_Target')
export class SHJJY_Target extends Component {

    @property()
    targetIndex: number = 0;

    @property()
    target: Node = null;

    private talkNode: Node = null;
    private talkLabel: Label = null;

    private isFirst: boolean = true;
    private chooseStrArr: string[] = [];
    private player: Node = null;

    start() {
        this.initData();

        this.player = SHJJY_GameMgr.instance.playerNode;

        //对话框节点
        this.talkNode = this.node.getChildByName("对话框");
        //对话框文本组件
        this.talkLabel = this.talkNode.getComponentInChildren(Label);

        this.moveSelf();
    }

    closeTalk() {
        tween(this.talkNode)
            .to(0.5, { scale: v3(0, 0, 0) })
            .start();

    }

    Talk(word?: string, clip?: AudioClip) {
        this.talkNode.scale = v3(0, 0, 0);

        if (word) {
            if (!clip) {
                console.error("音效资源为空");
                return;
            }

            SHJJY_GameMgr.instance.playSFX(-1, clip);

            this.talkLabel.string = word;

            tween(this.talkNode)
                .to(0.3, { scale: v3(1, 1, 1) }, { easing: "backOut" })
                .start();
            return;
        }

        if (this.isFirst) {

            this.isFirst = false;

            this.talkLabel.string = this.chooseStrArr[0];

            SHJJY_GameMgr.instance.setCheckAudioEnd(true);

            let sfxIndex = this.targetIndex * 4;
            SHJJY_GameMgr.instance.playSFX(sfxIndex);

            tween(this.talkNode)
                .to(0.3, { scale: v3(1, 1, 1) }, { easing: "backOut" })
                .start();
        }

    }

    sign: number = 1;
    moveSelf() {

        let name = SHJJY_GameMgr.instance.jsonName[this.targetIndex];
        let targetNode = this.node.getChildByName(name);
        tween(targetNode)
            .by(1, { scale: v3(0, 0.05 * this.sign, 0) })
            .call(() => {
                this.sign = -this.sign;
                this.moveSelf();
            })
            .start();
    }

    winMove() {
        this.closeTalk();

        let name = SHJJY_GameMgr.instance.jsonName[this.targetIndex];

        let targetNode = this.node.getChildByName(name);

        tween(this.talkNode)
            .by(0.5, { position: v3(500, 0, 0) })
            .start();

        tween(targetNode)
            .by(0.5, { position: v3(500, 0, 0) })
            .call(() => {
                // SHJJY_GameMgr.instance.setCheckAudioEnd(true);
                SHJJY_GameMgr.instance.nextLevel();
            })
            .start();

    }

    isover: boolean = false;
    Finnal() {

        let woodNode = this.node.getChildByName("木棍");

        woodNode.once(NodeEventType.TOUCH_START, () => {
            if (this.isover) {
                return;
            }

            this.isover = true;

            this.closeTalk();

            woodNode.active = true;

            let ani = woodNode.parent.getComponent(AnimationComponent);

            this.scheduleOnce(() => {
                SHJJY_GameMgr.instance.playWin();
            }, 0.5);

            ani.play();

        });

    }

    initData() {
        this.player = SHJJY_GameMgr.instance.playerNode;

        //对话框节点
        this.talkNode = this.node.getChildByName("对话框");
        //对话框文本组件
        this.talkLabel = this.talkNode.getComponentInChildren(Label);

        let jsonName = SHJJY_GameMgr.instance.jsonName[this.targetIndex];

        if (!jsonName) {
            return;
        }

        let jsonData = SHJJY_GameMgr.instance.jsonMap.get(jsonName);
        this.chooseStrArr = jsonData.strArr;


    }
}


