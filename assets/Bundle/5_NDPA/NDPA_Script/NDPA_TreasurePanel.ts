import { _decorator, Component, EventTouch, Node, Sprite } from 'cc';
import { NDPA_NUMBER } from './NDPA_GameConstant';
import { NDPA_GameManager } from './NDPA_GameManager';
import Banner from '../../../Scripts/Banner';
import { NDPA_AudioManager, NDPA_Audios } from './NDPA_AudioManager';
import { NDPA_GameUtil } from './NDPA_GameUtil';
import { NDPA_PrefsManager } from './NDPA_PrefsManager';
const { ccclass, property } = _decorator;

@ccclass('NDPA_TreasurePanel')
export class NDPA_TreasurePanel extends Component {

    public static Instance: NDPA_TreasurePanel = null;

    @property(Sprite)
    MZSprite: Sprite = null;

    @property({ type: [Node] })
    YS: Node[] = [];

    @property([Node])
    TreasureBoxItems: Node[] = [];

    @property(Node)
    TreasureBox: Node = null;

    @property(Node)
    Video: Node = null;

    @property(Node)
    TipsText: Node = null;

    @property(Node)
    MZPanel: Node = null;

    @property(Node)
    MZNode: Node = null;

    @property(Node)
    Close: Node = null;

    YSNumber: number = 3;
    isClick: boolean = true;
    MZAwardNumber: NDPA_NUMBER;

    TreasureBoxCount: number = 0;//宝箱的个数

    protected onLoad(): void {
        NDPA_TreasurePanel.Instance = this;
        this.shuffle();
    }

    protected start(): void {
        this.showUI();
    }

    //打乱宝箱的顺序
    shuffle() {
        const shuffled: Node[] = NDPA_GameUtil.shuffle(this.TreasureBoxItems);
        this.TreasureBox.removeAllChildren();
        shuffled.forEach(e => {
            this.TreasureBox.addChild(e);
        })
    }

    showUI() {
        for (let index = 0; index < this.YS.length; index++) {
            if (this.YSNumber - index > 0) {
                this.YS[index].active = true;
            } else {
                this.YS[index].active = false;
            }
        }

        if (this.YSNumber > 0) {
            this.isClick = true;
        } else {
            this.isClick = false;
        }

        //当宝箱开完之后就只显示退出按钮
        if (this.TreasureBoxCount == 0) {
            this.Close.active = true;
            this.Video.active = false;
            this.TipsText.active = false;
        } else {
            this.Close.active = false;
            this.Video.active = !this.isClick;
            this.TipsText.active = this.isClick;
        }
    }

    useYS() {
        this.YSNumber--;
        this.showUI();
    }

    addYS() {
        NDPA_AudioManager.PlaySound(NDPA_Audios.Click);
        Banner.Instance.ShowVideoAd(() => {
            NDPA_AudioManager.PlaySound(NDPA_Audios.Award);
            this.YSNumber += 3;
            this.showUI();
        })
    }

    showMZPannel() {
        this.MZPanel.active = true;
    }

    close() {
        NDPA_AudioManager.PlaySound(NDPA_Audios.Click);
        this.MZPanel.active = false;
    }

    closePanel() {
        NDPA_AudioManager.PlaySound(NDPA_Audios.Click);
        this.node.destroy();
        NDPA_GameManager.Instance.restart();
    }

    getAward(event: EventTouch) {
        NDPA_AudioManager.PlaySound(NDPA_Audios.Click);
        Banner.Instance.ShowVideoAd(() => {
            NDPA_AudioManager.PlaySound(NDPA_Audios.Award);
            NDPA_PrefsManager.Instance.userData.HaveMZ.push(this.MZAwardNumber);
            NDPA_PrefsManager.Instance.userData.UseMZ = this.MZAwardNumber;
            NDPA_PrefsManager.Instance.saveData();
            this.close();
        })
    }

    getMZWorldPos() {
        return this.MZNode.worldPosition;
    }

}


