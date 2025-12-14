import { _decorator, AudioClip, BoxCollider2D, Collider2D, Component, Contact2DType, instantiate, Label, Node, RigidBody2D, Sprite } from 'cc';
import { LDTJ_PropController } from './LDTJ_PropController';
import { AudioManager } from 'db://assets/Scripts/Framework/Managers/AudioManager';
import { LDTJ_RoleController } from './LDTJ_RoleController';
import NodeUtil from 'db://assets/Scripts/Framework/Utils/NodeUtil';
import { LDTJ_GameManager } from './LDTJ_GameManager';
const { ccclass, property } = _decorator;

@ccclass('LDTJ_BoxController')
export class LDTJ_BoxController extends Component {

    private boxCollider: BoxCollider2D = null;
    private rigidBody: RigidBody2D = null;

    @property(AudioClip)
    sAudio: AudioClip = null;

    @property(AudioClip)
    eAudio: AudioClip = null;

    isLR: boolean = false;

    private lastContactTime: number = 0;
    private debounceTime: number = 0.1; // 防抖时间，单位为秒

    nums: number[] = [];


    protected onLoad(): void {
        this.boxCollider = this.node.getComponent(BoxCollider2D);
        this.rigidBody = this.node.getComponent(RigidBody2D);
        this.boxCollider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
    }

    private onBeginContact(a: Collider2D, b: Collider2D) {

        const currentTime = Date.now();
        if (currentTime - this.lastContactTime < this.debounceTime * 1000) {
            return;
        }
        this.lastContactTime = currentTime;
        if (a.node.name == "LeftProp_1" || a.node.name == "RightProp_1") {
            LDTJ_GameManager.Instance.gameOver(false);
        } else if (a.node.name == "LeftProp" || a.node.name == "RightProp") {
            if (this.isLR) return;
            this.isLR = true;
            const label = NodeUtil.GetNode("Label", a.node).getComponent(Label);
            if (label) {
                const weightChange = label.string.trim();
                let weightLabel = LDTJ_RoleController.Instance.weight.getComponent(Label);
                LDTJ_RoleController.Instance.loadSE();
                AudioManager.Instance.PlaySFX(this.sAudio);
                if (weightLabel) {
                    let weightString = weightLabel.string.trim();
                    let weightNumber = parseFloat(weightString);
                    if (!isNaN(weightNumber)) {
                        if (weightChange.includes('+')) {
                            weightNumber += parseFloat(weightChange.replace('+', ''));
                        } else if (weightChange.includes('-')) {
                            weightNumber -= parseFloat(weightChange.replace('-', ''));
                        } else if (weightChange.includes('*')) {
                            weightNumber *= parseFloat(weightChange.replace('*', ''));
                        } else if (weightChange.includes('/')) {
                            weightNumber /= parseFloat(weightChange.replace('/', ''));
                        }
                        weightLabel.string = weightNumber.toString();
                    }
                }
            }
            LDTJ_PropController.Instance.propParent.children.forEach(child => {
                this.scheduleOnce(() => {
                    child.destroy();
                }, 0);
            });
            this.isLR = false;
        } else {
            const spriteFrame = a.node.getChildByName("Sprite").getComponent(Sprite).spriteFrame;
            let weightLabel = LDTJ_RoleController.Instance.weight.getComponent(Label);
            if (weightLabel) {
                let weightString = weightLabel.string.trim();
                let weightNumber = parseFloat(weightString);
                if (!isNaN(weightNumber)) {
                    if (spriteFrame == LDTJ_PropController.Instance.corn || spriteFrame == LDTJ_PropController.Instance.tomato || spriteFrame == LDTJ_PropController.Instance.broccoli) {
                        LDTJ_RoleController.Instance.loadSE();
                        AudioManager.Instance.PlaySFX(this.sAudio);
                        weightNumber -= 10;
                    } else if (spriteFrame == LDTJ_PropController.Instance.iceCream || spriteFrame == LDTJ_PropController.Instance.chocolate || spriteFrame == LDTJ_PropController.Instance.milkTea) {
                        AudioManager.Instance.PlaySFX(this.eAudio);
                        weightNumber += 10;
                    }
                    weightLabel.string = weightNumber.toString();

                }
            }
            this.scheduleOnce(() => {
                a.node.destroy();
                LDTJ_PropController.Instance.loadNextProp(LDTJ_PropController.Instance.nb, LDTJ_PropController.Instance.index++);
            }, 0);
        }
    }

    protected onDestroy(): void {
        this.boxCollider.off(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
    }
}