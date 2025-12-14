import { _decorator, AudioClip, BoxCollider2D, Button, Component, director, Event, EventTouch, find, instantiate, Node, Prefab, RigidBody2D, tween, Vec3 } from 'cc';
import { AudioManager } from 'db://assets/Scripts/Framework/Managers/AudioManager';
import { Tools } from 'db://assets/Scripts/Framework/Utils/Tools';
import { GamePanel } from 'db://assets/Scripts/UI/Panel/GamePanel';
const { ccclass, property } = _decorator;

@ccclass('HCSHJ_GameManager')
export class HCSHJ_GameManager extends Component {

    public static Instance: HCSHJ_GameManager = null;

    @property(Node) explainPanel: Node = null;
    @property(Node) touchNode: Node = null;
    @property(GamePanel) gamePanel: GamePanel = null;

    @property([Prefab]) props: Prefab[] = [];
    @property(Prefab) line: Prefab = null;
    @property(AudioClip) audioClip: AudioClip = null;


    protected onLoad(): void {
        HCSHJ_GameManager.Instance = this;
        this.gamePanel.time = 1800;

    }

    protected start(): void {
        this.loadProp()
    }

    explainPanel_on(event: Event) {
        console.log("explainPanel_on");
        this.explainPanel.active = true;
        this.explainPanel.on(Node.EventType.TOUCH_START, this.explainPanel_off, this);
    }

    explainPanel_off(event: EventTouch) {
        console.log("explainPanel_off");
        this.explainPanel.active = false;
        this.explainPanel.off(Node.EventType.TOUCH_START, this.explainPanel_off, this);
    }

    playAudio() {
        AudioManager.Instance.PlaySFX(this.audioClip);
    }

    loadProp(pos?: Vec3) {
        this.touchNode.getComponent(RigidBody2D).enabled = false;
        this.touchNode.getComponent(BoxCollider2D).enabled = false;
        if (!pos) pos = new Vec3(0, 0, 0);

        const line = instantiate(this.line)
        line.setParent(this.touchNode)
        line.setPosition(pos.x, 0)

        const randomNumber = Tools.GetRandomIntWithMax(0, 3)
        const prop = instantiate(this.props[randomNumber])
        prop.setParent(this.touchNode)
        prop.setPosition(pos.x, 0)
        prop.getComponent(RigidBody2D).enabled = false;

        director.emit("loadProp", prop, line)
    }

    /**
     * @param selfColliderTag selfCollider.tag
     * @param otherColliderTag otherCollider.tag
     * @param otherColliderPosition otherCollider.position
     * @returns 
     */
    synthetic(selfColliderTag: number, otherColliderTag: number, otherColliderPosition: Vec3) {
        // 再次校验tag
        if (selfColliderTag !== otherColliderTag) {
            console.error("道具标签不匹配，无法合成");
            return;
        }

        //  获取下一个道具索引,校验是否有效
        const nextPropIndex = selfColliderTag + 1;
        if (nextPropIndex >= this.props.length) {
            console.error(`道具索引越界: ${nextPropIndex} (最大 ${this.props.length - 1})`);
            return;
        }

        // 创建并显示新道具
        this.createNextProp(nextPropIndex, otherColliderPosition);
        this.playAudio()

        // 如果是最终道具，触发胜利逻辑
        if (this.isFinalProp(nextPropIndex)) {
            director.emit("win")
            this.scheduleOnce(() => {
                this.gamePanel.Win();
            }, 1);
        }
    }

    /** 创建并显示新道具 */
    createNextProp(nextPropIndex: number, position: Vec3) {
        const prop = instantiate(this.props[nextPropIndex]);
        prop.setParent(this.touchNode);
        prop.setPosition(position);
        prop.scale = Vec3.ZERO; // 初始缩放为0

        tween(prop)
            .to(0.2, { scale: new Vec3(1, 1) })
            .start();

        console.log(`合成${this.isFinalProp(nextPropIndex) ? '最终' : ''}道具: ${prop.name}`);
    }

    /** 判断是否为最终道具 */
    private isFinalProp(nextPropIndex: number): boolean {
        return nextPropIndex + 1 === this.props.length;
    }

    TVT() {
        this.scheduleOnce(() => {
            this.touchNode.getComponent(RigidBody2D).enabled = true;
            this.touchNode.getComponent(BoxCollider2D).enabled = true;
        }, 0.5)
    }
}


