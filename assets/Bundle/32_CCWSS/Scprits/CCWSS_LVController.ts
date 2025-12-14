import { _decorator, Component, Label, labelAssembler, Node, Prefab } from 'cc';
import { GamePanel } from '../../../Scripts/UI/Panel/GamePanel';
const { ccclass, property } = _decorator;

export enum CCWSS_WAVE {
    WAVE1,
    WAVE2,
    WAVE3,
    WAVE4,
    TARGET,
}

@ccclass('CCWSS_LVController')
export class CCWSS_LVController extends Component {

    public static Instance: CCWSS_LVController = null;

    @property(Label)
    Content: Label = null;

    @property(Label)
    FalseLabel: Label = null;

    @property()
    FalseNumber: number = 14;

    @property(Node)
    EndPanel: Node = null;

    @property(Prefab)
    AnswerPrefab: Prefab = null;

    /**
    第一轮问：是否属于截教阵营或与截教有密切关联？
    淘汰：石姬娘娘、申公豹、申小豹、敖广（4人）
    剩余：左门神、右门神、鹿童、太乙真人、殷夫人、敖钦、仙鹤、申正道、李靖、哪吒、敖丙、敖闺
    
    第二轮问：是否拥有水系/冰系法术能力？
    淘汰：左门神、右门神、鹿童、仙鹤（4人）
    剩余：太乙真人、殷夫人、敖钦、申正道、李靖、哪吒、敖丙、敖闺
    
    第三轮问：是否参与过「山河社稷图」修炼事件？
    淘汰：太乙真人（导师）、殷夫人（凡人）、申正道（未参与）、李靖（未参与）（4人）
    剩余：敖钦、哪吒、敖丙、敖闺
    
    第四轮问：是否具有双重血统/灵体转世设定？
    淘汰：敖钦（纯龙族）、敖闺（纯龙族）、哪吒（魔丸转世）（3人）
    最终剩余：敖丙（灵珠转世+龙族血统）
    
    */
    Text: string[] = ["他不属于截教阵营", "他拥有水系能力", "他参与过「山河社稷图」修炼事件", "他是灵体转世", ""]
    MapWave: Map<CCWSS_WAVE, number> = new Map();
    CurWave: CCWSS_WAVE = CCWSS_WAVE.WAVE1;

    protected onLoad(): void {
        CCWSS_LVController.Instance = this;
        this.showContent();
        this.loseFalseNumber();
        GamePanel.Instance.winStr = "太棒了！请前往别的游戏吧！"
        GamePanel.Instance.lostStr = "太可惜了！在试一次吧！"
        GamePanel.Instance.answerPrefab = this.AnswerPrefab;
    }

    addItem(wave: CCWSS_WAVE) {
        if (wave == CCWSS_WAVE.TARGET) return;
        if (!this.MapWave.has(wave)) {
            this.MapWave.set(wave, 1);
        } else {
            this.MapWave.set(wave, this.MapWave.get(wave) + 1);
        }
    }

    removeItem(wave: CCWSS_WAVE) {
        if (this.MapWave.has(wave)) {
            this.MapWave.set(wave, this.MapWave.get(wave) - 1);
            console.log(this.MapWave.get(wave));
            if (this.MapWave.get(wave) <= 0) {
                //下一波
                this.showContent(true);
            }
        } else {
            console.error(`没找到wave：${wave}`);
        }
    }

    showContent(isNext: boolean = false) {
        this.CurWave = isNext ? this.CurWave + 1 : CCWSS_WAVE.WAVE1;
        this.Content.string = this.Text[this.CurWave];
        console.log(this.CurWave);

        if (this.CurWave == CCWSS_WAVE.TARGET) {
            //结束
            this.EndPanel.active = true;
            this.scheduleOnce(() => {
                GamePanel.Instance.Win();
            }, 1)

        }
    }

    loseFalseNumber(num: number = 0) {
        this.FalseNumber -= num;
        this.FalseLabel.string = `剩余错误次数：${this.FalseNumber}`;
        if (this.FalseNumber <= 0) {
            //游戏失败
            GamePanel.Instance.Lost();
        }
    }

}


