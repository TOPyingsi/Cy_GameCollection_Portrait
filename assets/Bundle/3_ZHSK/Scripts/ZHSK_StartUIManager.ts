import { _decorator, Component, DirectionalLight, director, find, Node, Toggle, Event, AudioSource, error } from 'cc';
import Banner from 'db://assets/Scripts/Banner';
import { AudioManager } from 'db://assets/Scripts/Framework/Managers/AudioManager';
import { ZHSK_PlayerManager } from './ZHSK_PlayerManager';
import { ProjectEvent, ProjectEventManager } from 'db://assets/Scripts/Framework/Managers/ProjectEventManager';

const { ccclass, property } = _decorator;

@ccclass('ZHSK_StartUIManager')

export class ZHSK_StartUIManager extends Component {
    @property(Node)
    Music: Node = null;
    @property(Node)
    Yinyue: Node = null;
    public static Music: boolean = true;
    public static YingYUe: boolean = true;

    //关卡选择
    ChoicesMap(event: Event) {
        find("Canvas").getComponent(AudioSource).play();
        // ZHSK_SoundManager.Instance.PlaySound(ZHSK_Sounds.DS_1);
        this.scheduleOnce(() => {
            switch (event.target.name) {
                case "经典模式":

                    director.loadScene("ZHSK_AISHJGame");
                    break;
                case "哪吒进化":

                    Banner.Instance.ShowVideoAd(() => {
                        director.loadScene("ZHSK_ZZJHGame");
                    })


                    break;
                case "悟空进化":
                    Banner.Instance.ShowVideoAd(() => {
                        director.loadScene("ZHSK_WKJHGame");
                    })

                    break;
                case "斑斑乐园":
                    Banner.Instance.ShowVideoAd(() => {
                        director.loadScene("ZHSK_BBLYGame");
                    })

                    break;
                case "缤纷盒子":
                    Banner.Instance.ShowVideoAd(() => {
                        director.loadScene("ZHSK_BFHZGame");
                    })

                    break;
                case "AI山海经":
                    Banner.Instance.ShowVideoAd(() => {
                        director.loadScene("ZHSK_JDMSGame");
                    })

                    break;
            }
        }, 0.1)
    }
    //弹出设置面板
    OpenSetPanel() {
        find("Canvas").getComponent(AudioSource).play();
        find("Canvas/设置界面").active = true;

    }
    //关闭设置面板
    CloseSetPanel() {
        find("Canvas").getComponent(AudioSource).play();
        find("Canvas/设置界面").active = false;
    }
    //返回主页
    ReturnHome() {
        find("Canvas").getComponent(AudioSource).play();
        director.loadScene("Start");//更改为主界面
    }
    MusicChage() {

        if (this.Yinyue.children[0].active == false) {
            this.node.getComponent(AudioSource).volume = 0;

        }
        else {
            this.node.getComponent(AudioSource).volume = 1;
        }
        if (this.Music.children[0].active == false) {
            find("Canvas").getComponent(AudioSource).volume = 0;

        }
        else {
            find("Canvas").getComponent(AudioSource).volume = 1;

        }
    }
    update() {


        this.MusicChage();

    }
    start() {
        AudioManager.Instance.StopBGM();//关闭
        ZHSK_PlayerManager.PlayerLevel = 0;

        this.Yinyue.children[0].active = ZHSK_StartUIManager.Music;


        this.Music.children[0].active = ZHSK_StartUIManager.YingYUe;
    }
    OntoggleCheck(event: Event) {
        switch (event.target.name) {
            case "音效开关框":
                ZHSK_StartUIManager.Music = !ZHSK_StartUIManager.Music;
                event.target.children[0].active = ZHSK_StartUIManager.Music;
                break;
            case "音乐开关框":
                ZHSK_StartUIManager.YingYUe = !ZHSK_StartUIManager.YingYUe;
                event.target.children[0].active = ZHSK_StartUIManager.YingYUe;
                break;
        }

    }
}


