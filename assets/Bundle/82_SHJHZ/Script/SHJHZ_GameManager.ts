import { _decorator, AudioClip, Component, director, Event, find, Node, Prefab, Sprite, SpriteFrame, tween, Vec3 } from 'cc';
import { AudioManager } from 'db://assets/Scripts/Framework/Managers/AudioManager';
import PrefsManager from 'db://assets/Scripts/Framework/Managers/PrefsManager';
import { GamePanel } from 'db://assets/Scripts/UI/Panel/GamePanel';
const { ccclass, property } = _decorator;

@ccclass('SHJHZ_GameManager')
export class SHJHZ_GameManager extends Component {

    public static instance: SHJHZ_GameManager = null;

    @property(GamePanel) gamePanel: GamePanel = null;

    @property(Node) rolePanel: Node = null;
    @property(Node) emojiPanel: Node = null;
    @property(Node) legPanel: Node = null;
    @property(Node) decorationPanel: Node = null;

    @property(Node) roleButton: Node = null;
    @property(Node) emojiButton: Node = null;
    @property(Node) legButton: Node = null;
    @property(Node) decorationButton: Node = null;
    @property(Node) confirmButton: Node = null;

    @property(Node) map: Node = null;
    @property(Node) hp: Node = null;

    @property(SpriteFrame) activeSF: SpriteFrame = null;
    @property(SpriteFrame) normalSF: SpriteFrame = null;

    @property(AudioClip) bgm: AudioClip = null;
    @property(AudioClip) click: AudioClip = null;

    @property(Prefab) answer: Prefab = null;

    currentPanel: Node = null;
    nodes: Node[] = [];
    _map: Map<Node, Node> = new Map();
    xyy: Node[] = [];

    protected onLoad(): void {
        SHJHZ_GameManager.instance = this;
    }

    protected start(): void {
        this.gamePanel.answerPrefab = this.answer;
        AudioManager.Instance.PlayBGM(this.bgm);
        this.refeshButtonSf(this.roleButton)
        this.showPanel(this.rolePanel);
    }

    onButtonClick(event: Event) {
        AudioManager.Instance.PlaySFX(SHJHZ_GameManager.instance.click)
        const n1 = this.map.getChildByName("Mask").getChildByName("Node1")
        const n2 = this.map.getChildByName("Mask").getChildByName("Node2")
        switch (event.target.name) {
            case "RoleButton":
                this.refeshButtonSf(event.target);
                this.showPanel(this.rolePanel);
                break;
            case "EmojiButton":
                this.refeshButtonSf(event.target);
                this.showPanel(this.emojiPanel);
                break;
            case "LegButton":
                this.refeshButtonSf(event.target);
                this.showPanel(this.legPanel);
                break;
            case "DecorationButton":
                this.refeshButtonSf(event.target);
                this.showPanel(this.decorationPanel);
                break;
            case "MapButton":
                this.map.active = true;
                break;
            case "LeftButton":
                if (n1.position.x <= -1080) {
                    tween(n1).to(0.3, { position: new Vec3(0, n2.position.y, n2.position.z) }).start();
                    tween(n2).to(0.3, { position: new Vec3(1080, n1.position.y, n1.position.z) }).start();
                }
                break;
            case "RightButton":
                if (n2.position.x >= 1080) {
                    tween(n2).to(0.3, { position: new Vec3(0, n2.position.y, n2.position.z) }).start();
                    tween(n1).to(0.3, { position: new Vec3(-1080, n1.position.y, n1.position.z) }).start();
                }
                break;
            case "CloseButton":
                this.map.active = false;
                break;
        }
    }

    showPanel(panel: Node) {
        director.getScene().emit("changePanel", panel);
        this.currentPanel = panel;
        this.rolePanel.active = panel == this.rolePanel;
        this.emojiPanel.active = panel == this.emojiPanel;
        this.legPanel.active = panel == this.legPanel;
        this.decorationPanel.active = panel == this.decorationPanel;
    }

    refeshButtonSf(button: Node) {
        if (this.roleButton == button) {
            this.roleButton.getComponent(Sprite).spriteFrame = this.activeSF;
            this.emojiButton.getComponent(Sprite).spriteFrame = this.normalSF;
            this.legButton.getComponent(Sprite).spriteFrame = this.normalSF;
            this.decorationButton.getComponent(Sprite).spriteFrame = this.normalSF;
        }
        else if (this.emojiButton == button) {
            this.roleButton.getComponent(Sprite).spriteFrame = this.normalSF;
            this.emojiButton.getComponent(Sprite).spriteFrame = this.activeSF;
            this.legButton.getComponent(Sprite).spriteFrame = this.normalSF;
            this.decorationButton.getComponent(Sprite).spriteFrame = this.normalSF;
        }
        else if (this.legButton == button) {
            this.roleButton.getComponent(Sprite).spriteFrame = this.normalSF;
            this.emojiButton.getComponent(Sprite).spriteFrame = this.normalSF;
            this.legButton.getComponent(Sprite).spriteFrame = this.activeSF;
            this.decorationButton.getComponent(Sprite).spriteFrame = this.normalSF;
        }
        else if (this.decorationButton == button) {
            this.roleButton.getComponent(Sprite).spriteFrame = this.normalSF;
            this.emojiButton.getComponent(Sprite).spriteFrame = this.normalSF;
            this.legButton.getComponent(Sprite).spriteFrame = this.normalSF;
            this.decorationButton.getComponent(Sprite).spriteFrame = this.activeSF;
        }
    }

    winCount: number = 0;

    confirm() {
        AudioManager.Instance.PlaySFX(SHJHZ_GameManager.instance.click)

        if (this.xyy.length == 4) {
            const a = this.xyy[0].name
            const b = this.xyy[1].name
            const c = this.xyy[2].name
            const d = this.xyy[3].name
            if (a == b && b == c && c == d) {
                this.winCount++;
                this.map.active = true;
                const n1 = this.map.getChildByName("Mask").getChildByName("Node1")
                const n2 = this.map.getChildByName("Mask").getChildByName("Node2")
                if (Number(a) <= 4) {
                    if (n1.position.x <= -1080) {
                        tween(n1).to(0.3, { position: new Vec3(0, n2.position.y, n2.position.z) })
                            .call(() => {
                                this.scheduleOnce(() => {

                                    const n = n1.children.find(node => node.name == a)
                                    n.getChildByName("Icon_Unlock").active = false;
                                    n.getChildByName("Icon_Lock").active = true;
                                    this.xyy.forEach(item => {
                                        item.active = false
                                    });

                                    console.error("clear before ===========>", this.xyy, this._map)
                                    this.xyy = []
                                    this._map.clear()
                                    console.error("clear after ===========>", this.xyy, this._map)

                                    this.scheduleOnce(() => {
                                        if (this.winCount >= 8) {
                                            this.gamePanel.Win()
                                        }
                                    }, 0.5)

                                }, 0.3)
                            })
                            .start();
                        tween(n2).to(0.3, { position: new Vec3(1080, n1.position.y, n1.position.z) }).start();
                    } else {
                        this.scheduleOnce(() => {
                            const n = n1.children.find(node => node.name == a)
                            n.getChildByName("Icon_Unlock").active = false;
                            n.getChildByName("Icon_Lock").active = true;
                            this.xyy.forEach(item => {
                                item.active = false
                            });

                            console.error("clear before ===========>", this.xyy, this._map)
                            this.xyy = []
                            this._map.clear()
                            console.error("clear after ===========>", this.xyy, this._map)

                            this.scheduleOnce(() => {
                                if (this.winCount >= 8) {
                                    this.gamePanel.Win()
                                }
                            }, 0.5)
                        }, 0.3)
                    }

                }
                else {
                    if (n2.position.x >= 1080) {
                        tween(n2).to(0.3, { position: new Vec3(0, n2.position.y, n2.position.z) })
                            .call(() => {
                                this.scheduleOnce(() => {
                                    const n = n2.children.find(node => node.name == a)
                                    n.getChildByName("Icon_Unlock").active = false;
                                    n.getChildByName("Icon_Lock").active = true;
                                    this.xyy.forEach(item => {
                                        item.active = false
                                    });

                                    console.error("clear before ===========>", this.xyy, this._map)
                                    this.xyy = []
                                    this._map.clear()
                                    console.error("clear after ===========>", this.xyy, this._map)

                                    this.scheduleOnce(() => {
                                        if (this.winCount >= 8) {
                                            this.gamePanel.Win()
                                        }
                                    }, 0.5)
                                }, 0.3)
                            })
                            .start();
                        tween(n1).to(0.3, { position: new Vec3(-1080, n1.position.y, n1.position.z) }).start();
                    } else {
                        this.scheduleOnce(() => {
                            const n = n2.children.find(node => node.name == a)
                            n.getChildByName("Icon_Unlock").active = false;
                            n.getChildByName("Icon_Lock").active = true;
                            this.xyy.forEach(item => {
                                item.active = false
                            });

                            console.error("clear before ===========>", this.xyy, this._map)
                            this.xyy = []
                            this._map.clear()
                            console.error("clear after ===========>", this.xyy, this._map)

                            this.scheduleOnce(() => {
                                if (this.winCount >= 8) {
                                    this.gamePanel.Win()
                                }
                            }, 0.5)
                        }, 0.3)
                    }
                }

            } else {
                console.log("a == b && b == c && c == d 为 false", a, b, c, d)
                if (this.hp.children.length > 0) {
                    this.hp.children[this.hp.children.length - 1].destroy()
                }
                if (this.hp.children.length == 1) {
                    this.gamePanel.Lost()
                }
            }

        } else {
            console.log("error: this.xyy.length  = 4 为 false", this.xyy.length)
            if (this.hp.children.length > 0) {
                this.hp.children[this.hp.children.length - 1].destroy()
            }
            if (this.hp.children.length == 1) {
                this.gamePanel.Lost()
            }

        }
    }
}


