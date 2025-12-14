import { _decorator, Animation, AudioClip, AudioSource, Component, Label, log, Node } from 'cc';
import { SNDMX_StateControl } from './SNDMX_StateControl';
const { ccclass, property } = _decorator;

@ccclass('SNDMX_AduioMgr')
export class SNDMX_AduioMgr extends Component {
    @property([AudioClip])
    private AudioGroup: AudioClip[] = [];

    // private static _instance:SNDMX_AduioMgr = null;
    // public static getInstance():SNDMX_AduioMgr{
    //     if (!this._instance) {
    //         this._instance = new SNDMX_AduioMgr();
    //     }
    //     return this._instance;
    // }
    // private constructor() {
    //     super();
    // }
    private _audioSource: AudioSource | null = null;
    private _clip: AudioClip = null;

    private _index: number;//保存当前音频索引

    private _isPlaying: boolean = false; // 防止重复触发

    protected onLoad(): void {
        this._audioSource = this.node.getComponent(AudioSource);
    }

    //开场音频
    public orderPlayClip(index: number) {
        this.node.getChildByName("Occlusion").active = true;
        this.Closedialog();
        // if (this._isPlaying) { return }
        if (index >= 3) {
            this.node.getChildByName("Occlusion").active = false;
            return;
        }

        // this._isPlaying = true;
        this._index = index;

        this._audioSource.stop();
        this.dialogueContent(this._index);

        this._audioSource.clip = this.AudioGroup[index];
        this._audioSource.play();
        let audioLength: number = this._audioSource.clip.getDuration()

        this.scheduleOnce(() => {
            index += 1;
            this.orderPlayClip(index);
        }, audioLength)



        // 监听播放结束事件
        // this._audioSource!.node.once(AudioSource.EventType.ENDED,()=>{
        //     console.log(222);

        // }, this);

        // index++
        // this.orderPlayClip(index);

    }

    // nextAudio() {
    //     this._isPlaying = false;

    //     // 计算下一个索引
    //     const nextIndex = this._index + 1;

    //     // 自动播放下一个或停止
    //     if (nextIndex < 3) {
    //         this.orderPlayClip(nextIndex);
    //     }
    // }
    // //游戏失败音频播放
    // public gameFailure(index: number) {
    //     this._index = index;

    //     this.node.getComponent(AudioSource).clip = this.AudioGroup[index];
    //     this.node.getComponent(AudioSource).play();
    //     if (!this.node.getComponent(AudioSource).playing) {
    //         index++;
    //         if (index === 3) {//要改        
    //             return;
    //         }
    //         this.orderPlayClip(index);

    //     }

    // }
    // //游戏胜利音频播放
    // public gameVictory(index: number) {
    //     this._index = index;

    //     this.node.getComponent(AudioSource).clip = this.AudioGroup[index];
    //     this.node.getComponent(AudioSource).play();
    //     if (!this.node.getComponent(AudioSource).playing) {
    //         index++;
    //         if (index === 3) {//要改           
    //             return;
    //         }
    //         this.orderPlayClip(index);

    //     }

    // }
    //根据索引播放指定音乐
    PlayClip(index: number) {
        this.Closedialog();
        this._index = index;
        this.dialogueContent(this._index);



        // let clip: AudioClip = this.AudioGroup[index];
        // // this.node.getComponent(AudioSource).playOneShot(clip);
        this._audioSource.stop();
        this._audioSource.clip = this.AudioGroup[index];
        this._audioSource.play();
        let audioLength: number = this._audioSource.clip.getDuration()
        this.unschedule(this.Closedialog);
        this.schedule(this.Closedialog,audioLength+0.5)

        if (index === 12) {
            let audioLength: number = this._audioSource.clip.getDuration()

            this.scheduleOnce(() => {
                if (SNDMX_StateControl.getInstance().win === 8) {
                    this.scheduleOnce(() => {
                        this.Closedialog();

                        this.PlayClip(14);
                    }, 1);
                } else {
                    this.PlayClip(13);
                }
            }, audioLength);
            
        }

        if(index == 13){
            let audioLength: number = this._audioSource.clip.getDuration()
            this.scheduleOnce(() => {
                this.node.getChildByName("木棍人").getComponent(Animation).play("stick");
                },audioLength + 0.5);
            }
        if (index === 14) {
            this.node.getChildByName("Occlusion").active = true;

            let audioLength: number = this._audioSource.clip.getDuration();
            console.log(audioLength);

            this.scheduleOnce(() => {
                this.node.getChildByName("忍者").getComponent(Animation).play("huidao");
                console.log(this.node);
                

                this.PlayClip(16);
            }, audioLength)

        }
    }


    onAudioEnded() {
        this._isPlaying = false;
    }

    //打开对话框
    dialogueContent(index: number) {
        let log1: Node = this.node.getChildByName("Dialog")
        let log2: Node = this.node.getChildByName("Dialog-001")
        let log3: Node = this.node.getChildByName("Dialog-002")

        //根据音频索引，打开对应的对话框
        switch (index) {
            case 0://打开火柴人的第一个对话框
                log1.active = true;
                log1.getChildByName("Label").getComponent(Label).string = "跟我走吧，不要跟那个穷忍者过了";
                break;
            case 1://打开女主第一个对话框
                log2.active = true;
                log2.getChildByName("Label").getComponent(Label).string = "你瞧瞧你，一点出息都没有";
                break;
            case 2://打开忍者第一个对话框
                log3.active = true;
                log3.getChildByName("Label").getComponent(Label).string = "不要呀，不要离开我啊";
                break;
            case 3://忍者：地板
                log3.active = true;
                log3.getChildByName("Label").getComponent(Label).string = "换个地板";
                break;
            case 4://忍者：墙壁
                log3.active = true;
                log3.getChildByName("Label").getComponent(Label).string = "墙壁装修一下就好了";
                break;
            case 5://忍者：金龙鱼
                log3.active = true;
                log3.getChildByName("Label").getComponent(Label).string = "这可是黄金金龙鱼";
                break;
            case 6://忍者：沙发
                log3.active = true;
                log3.getChildByName("Label").getComponent(Label).string = "这是我的黄金沙发";
                break;
            case 7://忍者：厨房
                log3.active = true;
                log3.getChildByName("Label").getComponent(Label).string = "厨房也是假象，其实很豪华";
                break;
            case 8://忍者：盆栽
                log3.active = true;
                log3.getChildByName("Label").getComponent(Label).string = "种一棵黄金盆栽";
                break;
            case 9://忍者：吊灯
                log3.active = true;
                log3.getChildByName("Label").getComponent(Label).string = "其实是个手工吊灯";
                break;
            case 10://忍者：擦脸
                log3.active = true;
                log3.getChildByName("Label").getComponent(Label).string = "擦擦脸";
                break;
            case 11://忍者：不装了
                log3.active = true;
                log3.getChildByName("Label").getComponent(Label).string = "老子不装了，摊牌了"
                break;
            case 12://火柴人进来了
                log1.active = true;
                log1.getChildByName("Label").getComponent(Label).string = "老子进来了"
                break;
            case 13://女主跟火柴人
                log2.active = true;
                log2.getChildByName("Label").getComponent(Label).string = "我要跟木棍人过了，你个穷忍者"
                break;
            case 14://女主跟忍者
                log2.active = true;
                log2.getChildByName("Label").getComponent(Label).string = "原来你这么有钱，以后我就死心塌地跟着你了"
                break;
            case 15://火柴人挥棍子

                break;
            case 16://忍者：滚吧
                log3.active = true;
                log3.getChildByName("Label").getComponent(Label).string = "滚吧你俩"
                break;
        }

    }
    Closedialog() {
        let log1: Node = this.node.getChildByName("Dialog")
        let log2: Node = this.node.getChildByName("Dialog-001")
        let log3: Node = this.node.getChildByName("Dialog-002")
        log1.active = false;
        log2.active = false;
        log3.active = false;
    }

}


