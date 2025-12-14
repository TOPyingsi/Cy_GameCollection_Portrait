import { _decorator, AudioClip, AudioSource, Component, director, instantiate, JsonAsset, Node, Prefab, Sprite, SpriteFrame, tween, v2, v3, Vec2, Vec3 } from 'cc';
import { BundleManager } from '../../../Scripts/Framework/Managers/BundleManager';
import { NZKJ_GameData } from './NZKJ_GameData';
import { NZKJ_SmallBox } from './NZKJ_SmallBox';
import { NZKJ_Player } from './NZKJ_Player';
import { UIManager } from '../../../Scripts/Framework/Managers/UIManager';
import { NZKJ_Food } from './NZKJ_Food';
const { ccclass, property } = _decorator;

@ccclass('NZKJ_GameManager')
export class NZKJ_GameManager extends Component {
    @property({ type: [Prefab] })
    public SamllBox: Prefab[] = [];//(0白1黑2灰3白角色4黑角色5白食品6黑食品7白箱子8黑箱子9空)

    @property({ type: [SpriteFrame] })
    public Sprites: SpriteFrame[] = [];//(0白底1黑底)

    @property({ type: [AudioClip] })
    public Audios: AudioClip[] = [];//(0移动1转墙2吃分3转换)

    @property(Node)
    public GameNode: Node = null;

    public static Instance: NZKJ_GameManager = null;

    public SceneData: number[][] = [];
    public MaxScene: number = 9;//最大关卡数
    public BlackPlayer: Node = null;//黑色玩家
    public WhitePlayer: Node = null;//白色玩家
    public environmentState: number = 1;//当前环境(0白色1黑色)

    public MaxScore: number = 0;//最大分数
    public Score: number = 0;//当前分数

    private _AudioSource: AudioSource = null;
    protected onLoad(): void {
        NZKJ_GameManager.Instance = this;
    }
    start() {
        this.Init();
        director.getScene().on("逆转空间_交换", this.perversion, this);
        this._AudioSource = this.node.getComponent(AudioSource);
    }



    Init() {
        BundleManager.GetBundle("124_NZKJ").load("SceneData/NZKJ_Scene" + NZKJ_GameData.Instance.Scene, (err: Error | null, asset: JsonAsset) => {
            this.parseSceneData(asset);
            this.InitMap();
            this.perversion();
            this.scheduleOnce(() => {
                director.getScene().emit("逆转空间_渲染刷新");
            }, 0.1)
        });

    }

    public parseSceneData(jsonData: any): void {
        // 初始化SceneData数组
        this.SceneData = [];
        const JsonData = jsonData.json;
        // 按顺序读取Line00到Line13的数据
        const lineKeys = [
            'Line00', 'Line01', 'Line02', 'Line03', 'Line04', 'Line05',
            'Line06', 'Line07', 'Line08', 'Line09', 'Line10', 'Line11',
            'Line12', 'Line13'
        ];
        for (let i = 0; i < lineKeys.length; i++) {
            const key = lineKeys[i];
            if (JsonData[key]) {
                // 将每一行按逗号分割，并转换为数字数组
                this.SceneData[i] = JsonData[key].split(',').map(Number);
            }
        }
    }

    //初始化地图
    InitMap() {
        for (let i = 0; i < this.SceneData.length; i++) {
            for (let j = 0; j < this.SceneData[i].length; j++) {
                if (this.SceneData[i][j] != 9) {
                    this.InitNode(j, i, this.SceneData[i][j]);
                }
            }
        }


    }

    //生成物体
    public InitNode(PosX: number, PosY: number, Nodenumber: number) {
        let smallBox = instantiate(this.SamllBox[Nodenumber]);
        switch (Nodenumber) {
            case 3: this.InitNode(PosX, PosY, 1);
                smallBox.setParent(this.GameNode.getChildByName("玩家层"));
                this.WhitePlayer = smallBox;
                break;
            case 4: this.InitNode(PosX, PosY, 0);
                smallBox.setParent(this.GameNode.getChildByName("玩家层"));
                this.BlackPlayer = smallBox;
                break;
            case 5: this.InitNode(PosX, PosY, 1);
                smallBox.setParent(this.GameNode.getChildByName("玩家层"));
                this.MaxScore++;
                break;
            case 6: this.InitNode(PosX, PosY, 0);
                smallBox.setParent(this.GameNode.getChildByName("玩家层"));
                this.MaxScore++;
                break;
            default: smallBox.setParent(this.GameNode.getChildByName("地面层"));
                this.SceneData[PosY][PosX] = Nodenumber;
                break;
        }
        let pos = this.GetPos(PosX, PosY);
        smallBox.setPosition(pos.x, pos.y);
        smallBox.getComponent(NZKJ_SmallBox)?.Init(PosX, PosY, this.SceneData[PosY][PosX]);
        smallBox.getComponent(NZKJ_Player)?.Init();
        smallBox.getComponent(NZKJ_Food)?.Init(PosX, PosY, Nodenumber == 5 ? 1 : 0);
    }


    //根据XY获得位置
    GetPos(x: number, y: number): Vec2 {
        return new Vec2(x * 70 + 50, y * 70 + 50);
    }


    //判断能否移动(方向按照上0右1下2左3)
    public CanMove(PosX: number, PosY: number, ColorNum: number, direction: number): boolean {
        switch (direction) {
            case 0: PosY += 1; break;
            case 1: PosX += 1; break;
            case 2: PosY -= 1; break;
            case 3: PosX -= 1; break;
            default:
                break;
        }
        let MoveNodeColor = this.SceneData[PosY][PosX];
        console.log(MoveNodeColor);
        if (ColorNum == 0) {//白色需要判断是否为黑色地带
            console.log("移动玩家为白色");
            return MoveNodeColor == 1;
        }
        if (ColorNum == 1) {//白色需要判断是否为黑色地带
            console.log("移动玩家为黑色");
            return MoveNodeColor == 0;
        }
        return false;
    }

    //移动节点
    MovePlayer(PlayerNode: Node, direction: number) {
        let PosX = PlayerNode.getComponent(NZKJ_SmallBox).PosX;
        let PosY = PlayerNode.getComponent(NZKJ_SmallBox).PosY;
        switch (direction) {
            case 0: PosY += 1; break;
            case 1: PosX += 1; break;
            case 2: PosY -= 1; break;
            case 3: PosX -= 1; break;
            default:
                break;
        }
        let pos = this.GetPos(PosX, PosY);
        tween(PlayerNode)
            .to(0.25, { position: v3(pos.x, pos.y, 0), scale: v3(1, 1, 1) }, { easing: "backOut" })
            .start();
        PlayerNode.getComponent(NZKJ_SmallBox).PosX = PosX;
        PlayerNode.getComponent(NZKJ_SmallBox).PosY = PosY;
        director.getScene().emit("逆转空间_玩家移动", PlayerNode.getComponent(NZKJ_SmallBox).NodeColor, v2(PosX, PosY));
    }

    //颠倒黑白
    perversion() {
        let pos = v2(this.WhitePlayer.getComponent(NZKJ_SmallBox).PosX, this.WhitePlayer.getComponent(NZKJ_SmallBox).PosY);
        let pos2 = v2(this.BlackPlayer.getComponent(NZKJ_SmallBox).PosX, this.BlackPlayer.getComponent(NZKJ_SmallBox).PosY);
        if (pos.x == pos2.x && pos.y == pos2.y) {
            NZKJ_GameManager.Instance.AudioPlay(1);
            UIManager.ShowTip("两个角色叠加时不能切换状态！");
            return;
        }
        this.environmentState = this.environmentState == 0 ? 1 : 0;
        this.SceneData[pos.y][pos.x] = this.environmentState == 0 ? 1 : 0;

        this.SceneData[pos2.y][pos2.x] = this.environmentState == 0 ? 1 : 0;
        this.ChanggeBGColor(this.environmentState);
        NZKJ_GameManager.Instance.AudioPlay(3);
    }

    //更换背景色(0白色1黑)
    ChanggeBGColor(Color: number) {
        this.GameNode.getComponent(Sprite).spriteFrame = Color == 0 ? this.Sprites[0] : this.Sprites[1];
    }

    //增加分数
    AddScore() {
        NZKJ_GameManager.Instance.AudioPlay(2);
        this.Score++;
        if (this.Score >= this.MaxScore) {
            director.getScene().emit("逆转空间_游戏胜利");
            NZKJ_GameData.Instance.Scene++;
            if (NZKJ_GameData.Instance.Scene > this.MaxScene) {
                NZKJ_GameData.Instance.Scene = 0;
            }
            NZKJ_GameData.DateSave();
        }
    }
    //播放音效
    AudioPlay(id: number) {
        this._AudioSource.playOneShot(this.Audios[id]);
    }
}


