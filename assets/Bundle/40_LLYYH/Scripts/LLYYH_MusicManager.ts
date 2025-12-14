import { _decorator, AudioClip, AudioSource, Component, Node, Event, find, Button, Prefab } from 'cc';
import { AudioManager } from 'db://assets/Scripts/Framework/Managers/AudioManager';
import { EventManager, MyEvent } from 'db://assets/Scripts/Framework/Managers/EventManager';
import { GamePanel } from 'db://assets/Scripts/UI/Panel/GamePanel';
const { ccclass, property } = _decorator;

@ccclass('LLYYH_MusicManager')
export class LLYYH_MusicManager extends Component {
    @property({ type: [AudioClip] })
    YingYue: Array<AudioClip> = [];
    @property(GamePanel) gamePanel: GamePanel = null;
    @property(Prefab) answer: Prefab = null;
    private _currentIndex: number = 0;
    private _audioSource: AudioSource | null = null; // AudioSource 组件
    private inter: boolean = false;
    private Play: boolean = true;
    OnClick(event: Event) {
        const str = event.target.name;
        this.YingYue.forEach((music) => {


            if (str == music.name) {
                this.node.getComponent(AudioSource).stop();
                this.node.getComponent(AudioSource).clip = music;
                if (this.Play == true) {
                    this.node.getComponent(AudioSource).play();
                }

                if (this.inter == true) {
                    for (let i = 0; i < find("Canvas/Music").children.length; i++) {
                        find("Canvas/Music").children[i].getComponent(Button).interactable = false;
                    }
                }
            }
        })
    }
    OnSeting(event: Event) {
        switch (event.target.name) {
            case "暂停":
                this.node.getComponent(AudioSource).stop();
                break;
            case "单击循环":
                this.node.getComponent(AudioSource).stop();
                this.node.getComponent(AudioSource).loop = true;
                this.inter = true;
                break;
            case "取消单击循环":
                this.node.getComponent(AudioSource).loop = false;
                for (let i = 0; i < find("Canvas/Music").children.length; i++) {
                    find("Canvas/Music").children[i].getComponent(Button).interactable = true;
                }
                this.inter = false;
                break;
            case "自动播放":
                this.node.getComponent(AudioSource).stop();
                this.node.getComponent(AudioSource).loop = false;
                const str = "整句";
                this.YingYue.forEach((music) => {
                    if (str == music.name) {
                        this.node.getComponent(AudioSource).stop();
                        this.node.getComponent(AudioSource).clip = music;
                        if (this.Play == true) {
                            this.node.getComponent(AudioSource).play();
                        }
                    }
                })
                for (let i = 0; i < find("Canvas/Music").children.length; i++) {
                    find("Canvas/Music").children[i].getComponent(Button).interactable = true;
                }
                this.inter = false;
                break;
            case "取消自动播放":
                this.node.getComponent(AudioSource).stop();
                break;
        }
    }

    SetMusic(isOn: boolean = false) {
        console.error("SetMusic", isOn);
        this.Play = isOn;
    }

    protected onEnable(): void {
        EventManager.on(MyEvent.IsMusicOn, this.SetMusic, this);
    }

    protected onDisable(): void {
        EventManager.off(MyEvent.IsMusicOn, this.SetMusic, this);
    }

    // playNext() {
    //     if (this._currentIndex >= this.YingYue.length) {
    //         console.log('Playlist finished');
    //         return;
    //     }

    //     const clip = this.YingYue[this._currentIndex];
    //     if (clip && this._audioSource) {
    //         // 设置音乐文件并播放
    //         this._audioSource.clip = clip;
    //         this._audioSource.play();

    //         // 监听播放完成事件
    //         this._audioSource.node.on(AudioSource.EventType.ENDED, this.onAudioEnded, this);
    //         console.log('Playing:', clip.name);
    //     }
    // }

    // // 当前音乐播放完成时的回调
    // onAudioEnded() {
    //     // 取消监听
    //     if (this._audioSource) {
    //         this._audioSource.node.off(AudioSource.EventType.ENDED, this.onAudioEnded, this);
    //     }

    //     // 播放下一个音乐
    //     this._currentIndex++;
    //     this.playNext();
    // }
}


