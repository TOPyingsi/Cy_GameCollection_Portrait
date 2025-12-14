import { _decorator, Component, Enum, EventTouch, instantiate, Label, Node, Prefab, tween } from 'cc';
import { XDMKQ_AMPLIFICATION, XDMKQ_AUDIO, XDMKQ_BULLET, XDMKQ_MAP, XDMKQ_PANEL, XDMKQ_ROLE, XDMKQ_ROLE_BOOLD, XDMKQ_ROLE_CODE, XDMKQ_ROLE_NAME, XDMKQ_SUPPLY, XDMKQ_SUPPLY_GRADE, XDMKQ_SUPPLY_ITEM, XDMKQ_SUPPLY_ITEMS, XDMKQ_WEAPON, XDMKQ_WEAPON_HARM_CONFIG } from './XDMKQ_Constant';
import { XDMKQ_PanelManager } from './XDMKQ_PanelManager';
import { XDMKQ_EventManager, XDMKQ_MyEvent } from './XDMKQ_EventManager';
import { XDMKQ_EnemyManager } from './XDMKQ_EnemyManager';
import { XDMKQ_BulletManager } from './XDMKQ_BulletManager';
import { XDMKQ_GameData } from './XDMKQ_GameData';
import { XDMKQ_AudioManager } from './XDMKQ_AudioManager';
const { ccclass, property } = _decorator;

@ccclass('XDMKQ_GameManager')
export class XDMKQ_GameManager extends Component {
    static Instance: XDMKQ_GameManager = null;

    @property(Node)
    Map: Node = null;

    @property(Prefab)
    MapPrefab: Prefab[] = [];

    @property(Node)
    Aim98K: Node = null;

    @property(Node)
    UIPanel: Node = null;

    @property(Node)
    Weapons: Node = null;

    @property(Label)
    GoldLabel: Label = null;

    @property(Label)
    WaveLabel: Label = null;

    @property(Label)
    EnemyLabel: Label = null;

    @property({ displayName: "开启测试" })
    IsTest: boolean = false;

    @property({ type: Enum(XDMKQ_MAP) })
    TestMap: XDMKQ_MAP = XDMKQ_MAP.县城;

    public Roles: XDMKQ_ROLE[] = [];
    public CurRole: XDMKQ_ROLE = null;

    public Supplies: XDMKQ_SUPPLY_ITEM[] = [];
    public MapSupplies: Map<XDMKQ_SUPPLY, XDMKQ_SUPPLY_ITEM[]> = new Map();

    private _gamePause: boolean = false;

    public get GamePause(): boolean {
        return this._gamePause;
    }

    public set GamePause(value: boolean) {
        this._gamePause = value;
        value ? XDMKQ_AudioManager.Instance.GamePause() : XDMKQ_AudioManager.Instance.GameResume();
    }

    IsSwitch: boolean = true;//能否切换武器

    // CurWeaponName: string = null;

    MaxHP: number = 100;//最高生命值
    CurHP: number = 100;//最高生命值
    Damage: number = 0;//当前玩家损伤
    MapBullet: Map<XDMKQ_WEAPON, XDMKQ_BULLET> = new Map();
    CurBullet: XDMKQ_BULLET = null;

    GoldCount: number = 0;
    WaveCount: number = 0;
    EnemyCount: number = 0;

    protected onLoad(): void {
        XDMKQ_GameManager.Instance = this;
    }

    protected start(): void {
        XDMKQ_GameManager.Instance.Init(XDMKQ_GameData.Instance.CurMap);
        XDMKQ_EnemyManager.Instance.Init(XDMKQ_GameData.Instance.CurMap);
        if (this.IsTest) this.Init(this.TestMap);
        XDMKQ_AudioManager.Instance.PlayMusic(XDMKQ_AUDIO.BGM2);
    }

    protected onDisable(): void {
        this.Roles = [];
        this.CurRole = null;
        this.Supplies = [];
        this.MapSupplies.clear();
        XDMKQ_PanelManager.Instance.ClearCurSupply();
    }

    Init(map: XDMKQ_MAP) {
        this.GamePause = !this.IsTest;

        this.Map.removeAllChildren();
        const mapNode: Node = instantiate(this.MapPrefab[map]);
        mapNode.parent = this.Map;

        this.GoldCount = 0;
        this.WaveCount = 0;
        this.EnemyCount = 0;
        this.ShowGold();
        this.ShowWave();
        this.ShowEnemy(0, true);

        this.CurHP = this.MaxHP;
        this.Damage = 0;

        this.StartPutKT();
    }

    OnButtonClick(event: EventTouch) {
        XDMKQ_AudioManager.Instance.PlaySource(XDMKQ_AUDIO.点击);
        const name: string = event.getCurrentTarget().name;
        switch (name) {
            case "Set":
                this.GamePause = true;
                XDMKQ_PanelManager.Instance.ShowPanel(XDMKQ_PANEL.SetPanel);
                break;
        }
    }

    //#region 选择角色界面
    //随机生成在1937年7月7日 — 1945年9月2日抗战期间的出生日期
    public RandomBirthday(): string {
        let year = Math.floor(Math.random() * (1945 - 1937 + 1) + 1937);
        let month = Math.floor(Math.random() * (9 - 7 + 1) + 7);
        let day = Math.floor(Math.random() * (31 - 1 + 1) + 1);
        return `${year}-${month}-${day}`;
    }

    //获取数组中随机一个满足条件的元素
    public RandomName(): string {
        //返回XDMKQ_ROLE_NAME数组中不等于Roles数组中name一样的数组
        return XDMKQ_ROLE_NAME.filter(item => !this.Roles.some(role => role.Name === item))[Math.floor(Math.random() * XDMKQ_ROLE_NAME.length)];
    }

    InitRoles(count: number) {
        for (let i = 0; i < count; i++) {
            this.CreateRole();
        }
    }

    CreateRole() {
        const name: string = this.RandomName();
        const boold: string = XDMKQ_ROLE_BOOLD[Math.floor(Math.random() * XDMKQ_ROLE_BOOLD.length)];
        const cold: string = XDMKQ_ROLE_CODE[Math.floor(Math.random() * XDMKQ_ROLE_CODE.length)];
        const birthday: string = this.RandomBirthday();
        const role: XDMKQ_ROLE = { Name: name, Boold: boold, Code: cold, Birthday: birthday, IsLife: true };
        this.Roles.push(role);
    }

    //#region 补给界面

    //随机获得一个补给
    public RandomSupply(): XDMKQ_SUPPLY_ITEM {
        return XDMKQ_SUPPLY_ITEMS[Math.floor(Math.random() * XDMKQ_SUPPLY_ITEMS.length)];
    }

    public InitSupplys() {
        this.Supplies = [];
        for (let i = 0; i < 3; i++) {
            this.Supplies.push(this.RandomSupply());
        }
    }

    public ChangeSupply(index: number): XDMKQ_SUPPLY_ITEM {
        this.Supplies[index] = this.RandomSupply();
        return this.Supplies[index];
    }

    public AddSupply(index: number) {
        const supply: XDMKQ_SUPPLY_ITEM = this.Supplies[index];
        if (!this.MapSupplies.has(supply.Supply)) {
            this.MapSupplies.set(supply.Supply, []);
        }

        this.MapSupplies.get(supply.Supply).push(supply);
        XDMKQ_PanelManager.Instance.AddCurSupplyItem(supply);
        if (supply.Supply == XDMKQ_SUPPLY.生命值) {
            if (supply.Grade == XDMKQ_SUPPLY_GRADE.GRADE5) {
                this.CreateRole();
            } else {
                this.CurHP = this.MaxHP * (1 + this.GetAmplificationCount(XDMKQ_SUPPLY.生命值, XDMKQ_AMPLIFICATION.生命值))
            }
        }
    }

    public GetAmplificationCount(supply: XDMKQ_SUPPLY, amplification: XDMKQ_AMPLIFICATION) {
        if (!this.MapSupplies.has(supply)) return 0;
        const supplies: XDMKQ_SUPPLY_ITEM[] = this.MapSupplies.get(supply);
        let count: number = 0;
        for (let i = 0; i < supplies.length; i++) {
            if (supplies[i].Amplification == amplification) count += supplies[i].Value;
        }
        return count;
    }

    public GetHarmByWeapon(weapon: XDMKQ_WEAPON): number {
        if (!XDMKQ_WEAPON_HARM_CONFIG.has(weapon)) return 1000;
        let harm: number = XDMKQ_WEAPON_HARM_CONFIG.get(weapon);
        switch (weapon) {
            case XDMKQ_WEAPON.步枪:
                harm *= (1 + this.GetAmplificationCount(XDMKQ_SUPPLY.步枪, XDMKQ_AMPLIFICATION.伤害));
                break;
            case XDMKQ_WEAPON.汤姆逊:
                harm *= (1 + this.GetAmplificationCount(XDMKQ_SUPPLY.冲锋枪, XDMKQ_AMPLIFICATION.伤害));
                break;
            case XDMKQ_WEAPON.轻机枪:
                harm *= (1 + this.GetAmplificationCount(XDMKQ_SUPPLY.轻机枪, XDMKQ_AMPLIFICATION.伤害));
                break;
            case XDMKQ_WEAPON.手雷:
                harm *= (1 + this.GetAmplificationCount(XDMKQ_SUPPLY.投掷物, XDMKQ_AMPLIFICATION.伤害));
                break;
            case XDMKQ_WEAPON.燃烧弹:
                harm *= (1 + this.GetAmplificationCount(XDMKQ_SUPPLY.投掷物, XDMKQ_AMPLIFICATION.伤害));
                break;
            case XDMKQ_WEAPON.RPG:
                harm *= (1 + this.GetAmplificationCount(XDMKQ_SUPPLY.火箭筒, XDMKQ_AMPLIFICATION.伤害));
                break;
            case XDMKQ_WEAPON.炮台:
                harm *= (1 + this.GetAmplificationCount(XDMKQ_SUPPLY.防空炮, XDMKQ_AMPLIFICATION.伤害));
                break;
        }
        return harm;
    }

    public GetAmpByWeapon(weapon: XDMKQ_WEAPON, ampType: XDMKQ_AMPLIFICATION): number {
        switch (weapon) {
            case XDMKQ_WEAPON.步枪:
                return this.GetAmplificationCount(XDMKQ_SUPPLY.步枪, ampType);
            case XDMKQ_WEAPON.汤姆逊:
                return this.GetAmplificationCount(XDMKQ_SUPPLY.冲锋枪, ampType);
            case XDMKQ_WEAPON.轻机枪:
                return this.GetAmplificationCount(XDMKQ_SUPPLY.轻机枪, ampType);
            case XDMKQ_WEAPON.手雷:
                return this.GetAmplificationCount(XDMKQ_SUPPLY.投掷物, ampType);
            case XDMKQ_WEAPON.燃烧弹:
                return this.GetAmplificationCount(XDMKQ_SUPPLY.投掷物, ampType);
            case XDMKQ_WEAPON.RPG:
                return this.GetAmplificationCount(XDMKQ_SUPPLY.火箭筒, ampType);
            case XDMKQ_WEAPON.炮台:
                return this.GetAmplificationCount(XDMKQ_SUPPLY.防空炮, ampType);
        }
        return 0;
    }

    //#region 游戏UI
    ShowAim98K(show: boolean = true) {
        this.Weapons.active = !show;
        this.Aim98K.active = show;
        XDMKQ_EventManager.Emit(XDMKQ_MyEvent.XDMKQ_FIRE_SHOW, !show);
    }

    ShowUIPanel(show: boolean) {
        this.UIPanel.active = show;
    }

    //展示游戏中金币
    ShowGold(changeGold: number = 0) {
        this.GoldCount += changeGold;
        this.GoldLabel.string = this.GoldCount.toString();
    }

    //展示游戏中Wave
    ShowWave() {
        this.WaveLabel.string = `波次：${this.WaveCount + 1}`;
    }

    //展示游戏中Enemy数量
    ShowEnemy(changeEnemy: number = 0, isInit: boolean = false) {
        this.EnemyCount += changeEnemy;
        this.EnemyLabel.string = `敌人数量：${this.EnemyCount}`;

        if (this.EnemyCount == 0 && XDMKQ_EnemyManager.Instance.IsOver && !isInit) {
            //玩家完成这一波 开始下一波
            this.scheduleOnce(() => {
                this.GamePause = true;
                this.WaveCount++;
                this.ShowWave();
                XDMKQ_EnemyManager.Instance.NextWave();
                XDMKQ_PanelManager.Instance.ShowPanel(XDMKQ_PANEL.SupplyPanel);
            }, 3);
        }
    }

    StartPutKT() {
        this.unschedule(this.PutKT);
        this.schedule(this.PutKT, 60);
    }

    PutKT() {
        if (this.GamePause) return;
        XDMKQ_BulletManager.Instance.CreateKT();
    }

    HitPlayer(harm: number) {
        this.Damage += harm;
        XDMKQ_AudioManager.Instance.PlaySource(XDMKQ_AUDIO.玩家中枪);
        if (this.Damage >= this.CurHP) {
            this.GamePause = true;
            XDMKQ_PanelManager.Instance.ShowPanel(XDMKQ_PANEL.InjuredPanel);
        }
        XDMKQ_EventManager.Emit(XDMKQ_MyEvent.XDMKQ_ROLE_SHOW);
    }
}


