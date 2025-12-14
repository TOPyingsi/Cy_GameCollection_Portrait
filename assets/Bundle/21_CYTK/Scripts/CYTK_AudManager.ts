import { _decorator, AudioClip, AudioSource, BlockInputEvents, Component, director, find, Label, Node, tween, v2, v3 } from 'cc';
import { CYTK_GameManger1 } from './CYTK_GameManger1';
import { CYTK_GameManger } from './CYTK_GameManger';
import { GamePanel } from 'db://assets/Scripts/UI/Panel/GamePanel';
import { MyEvent } from 'db://assets/Scripts/Framework/Managers/EventManager';
import { ProjectEventManager } from 'db://assets/Scripts/Framework/Managers/ProjectEventManager';
import { AudioManager } from 'db://assets/Scripts/Framework/Managers/AudioManager';
const { ccclass, property } = _decorator;

@ccclass('CYTK_AudManager')
export class CYTK_AudManager extends Component {
    @property({ type: [AudioClip] })
    YingYue: Array<AudioClip> = []
    @property(GamePanel) gamePanel: GamePanel = null;
    public static Instance: CYTK_AudManager = null;
    protected onLoad(): void {
        CYTK_AudManager.Instance = this;
    }
    start() {
        if (ProjectEventManager.GameStartIsShowTreasureBox) {
            director.getScene().once(MyEvent.TreasureBoxDestroy, this.init, this);
        } else {
            this.init();
        }
    }

    init() {
        tween(this.node)
            .to(0, { position: v3(166.806, -1357.269, 0), angle: -90 })
            .to(1, { position: v3(166.806, -993.265, 0), angle: 0 }, { easing: "backOut" })
            .call(() => {
                find("Canvas/动画和音频/NPC/对话框").active = true;
                const Npcstr = "这关是看图填词";
                this.YingYue.forEach((music) => {
                    if (Npcstr == music.name) {
                        this.node.getComponent(AudioSource).clip = music;
                        AudioManager.Instance.PlaySFX(this.node.getComponent(AudioSource).clip);
                    }

                })
            })
            .delay(1.5)
            .call(() => {
                find("Canvas/动画和音频").getComponent(BlockInputEvents).enabled = false;
                find("Canvas/动画和音频/NPC/对话框").active = false;
            })
            .to(0, { position: v3(166.806, -993.265, 0), angle: 0 })
            .to(1, { position: v3(166.806, -1357.269, 0), angle: -90 }, { easing: "backOut" })
            .start();//启动
    }
    GameChange(string: string) {
        if (CYTK_GameManger1.Instance._win == 1 || CYTK_GameManger1.Instance._win == 4 || CYTK_GameManger.Instance._win == 1 || CYTK_GameManger.Instance._win == 4) {
            find("Canvas/动画和音频").getComponent(BlockInputEvents).enabled = true;
            tween(this.node)
                .to(0, { position: v3(166.806, -1357.269, 0), angle: -90 })
                .to(1, { position: v3(166.806, -993.265, 0), angle: 0 }, { easing: "backOut" })
                .call(() => {

                    find("Canvas/动画和音频/NPC/对话框").active = true;
                    find("Canvas/动画和音频/NPC/对话框/Label").getComponent(Label).string = "哎呦不错哦";
                    const Npcstr = "哎呦不错哦";
                    this.YingYue.forEach((music) => {
                        if (Npcstr == music.name) {
                            this.node.getComponent(AudioSource).clip = music;
                            AudioManager.Instance.PlaySFX(this.node.getComponent(AudioSource).clip);
                        }

                    })
                })
                .delay(1.5)

                .call(() => {
                    find("Canvas/动画和音频").getComponent(BlockInputEvents).enabled = false;
                    find("Canvas/动画和音频/NPC/对话框").active = false;
                    this.YingYue.forEach((music) => {
                        if (string == music.name) {
                            this.node.getComponent(AudioSource).clip = music;
                            AudioManager.Instance.PlaySFX(this.node.getComponent(AudioSource).clip);
                        }
                    })
                })
                .to(0, { position: v3(166.806, -993.265, 0), angle: 0 })
                .to(1, { position: v3(166.806, -1357.269, 0), angle: -90 }, { easing: "backOut" })
                .start();//启动
        }
        if (CYTK_GameManger1.Instance._win == 2 || CYTK_GameManger1.Instance._win == 5 || CYTK_GameManger.Instance._win == 2 || CYTK_GameManger.Instance._win == 5) {
            find("Canvas/动画和音频").getComponent(BlockInputEvents).enabled = true;
            tween(this.node)
                .to(0, { position: v3(166.806, -1357.269, 0), angle: -90 })
                .to(1, { position: v3(166.806, -993.265, 0), angle: 0 }, { easing: "backOut" })
                .call(() => {

                    find("Canvas/动画和音频/NPC/对话框").active = true;
                    find("Canvas/动画和音频/NPC/对话框/Label").getComponent(Label).string = "你还挺能的吗";
                    const Npcstr = "你还挺能的吗";
                    this.YingYue.forEach((music) => {
                        if (Npcstr == music.name) {
                            this.node.getComponent(AudioSource).clip = music;
                            AudioManager.Instance.PlaySFX(this.node.getComponent(AudioSource).clip);
                        }
                    })

                })
                .delay(1.5)
                .call(() => {
                    find("Canvas/动画和音频").getComponent(BlockInputEvents).enabled = false;
                    find("Canvas/动画和音频/NPC/对话框").active = false;
                    this.YingYue.forEach((music) => {
                        if (string == music.name) {
                            this.node.getComponent(AudioSource).clip = music;
                            AudioManager.Instance.PlaySFX(this.node.getComponent(AudioSource).clip);
                        }
                    })

                })
                .to(0, { position: v3(166.806, -993.265, 0), angle: 0 })
                .to(1, { position: v3(166.806, -1357.269, 0), angle: -90 }, { easing: "backOut" })
                .start();//启动
        }
        if (CYTK_GameManger1.Instance._win == 3 || CYTK_GameManger.Instance._win == 3) {
            find("Canvas/动画和音频").getComponent(BlockInputEvents).enabled = true;
            tween(this.node)
                .to(0, { position: v3(166.806, -1357.269, 0), angle: -90 })
                .to(1, { position: v3(166.806, -993.265, 0), angle: 0 }, { easing: "backOut" })
                .call(() => {

                    find("Canvas/动画和音频/NPC/对话框").active = true;
                    find("Canvas/动画和音频/NPC/对话框/Label").getComponent(Label).string = "这都被你答对了";
                    const Npcstr = "这都被你答对了";
                    this.YingYue.forEach((music) => {
                        if (Npcstr == music.name) {
                            this.node.getComponent(AudioSource).clip = music;
                            AudioManager.Instance.PlaySFX(this.node.getComponent(AudioSource).clip);
                        }
                    })

                })
                .delay(1.5)
                .call(() => {
                    find("Canvas/动画和音频").getComponent(BlockInputEvents).enabled = false;
                    find("Canvas/动画和音频/NPC/对话框").active = false;
                    this.YingYue.forEach((music) => {
                        if (string == music.name) {
                            this.node.getComponent(AudioSource).clip = music;
                            AudioManager.Instance.PlaySFX(this.node.getComponent(AudioSource).clip);
                        }
                    })

                })
                .to(0, { position: v3(166.806, -993.265, 0), angle: 0 })
                .to(1, { position: v3(166.806, -1357.269, 0), angle: -90 }, { easing: "backOut" })
                .start();//启动
        }
    }
}


