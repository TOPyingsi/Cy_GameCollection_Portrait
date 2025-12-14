import { _decorator, Component, EditBox, Event, Graphics, instantiate, Label, Node, Prefab, Sprite, SpriteFrame, Tween, tween, Vec3 } from 'cc';
import { MJMJ_LineController } from './MJMJ_LineController';
import { GamePanel } from 'db://assets/Scripts/UI/Panel/GamePanel';
import { Tools } from 'db://assets/Scripts/Framework/Utils/Tools';
import { MJMJ_EffectController } from './MJMJ_EffectController';
import { MJMJ_Wipe } from './MJMJ_Wipe';
const { ccclass, property } = _decorator;

@ccclass('MJMJ_GameManager')
export class MJMJ_GameManager extends Component {

    //#region 属性
    @property(GamePanel)
    gamePanel: GamePanel = null

    @property([SpriteFrame])
    car: SpriteFrame[] = [];

    @property([SpriteFrame])
    house: SpriteFrame[] = [];

    @property([SpriteFrame])
    classLeader: SpriteFrame[] = [];

    @property([SpriteFrame])
    Zodiac: SpriteFrame[] = [];

    @property([SpriteFrame])
    pets: SpriteFrame[] = [];

    @property([SpriteFrame])
    xiuXian: SpriteFrame[] = [];

    @property([SpriteFrame])
    chineseZodiac: SpriteFrame[] = [];

    @property(Node)
    parentNode: Node = null;

    @property(Node)
    sprite2: Node = null;

    @property(Node)
    Vortex: Node = null;

    // @property(Node)
    // wipe: Node = null;

    @property(Node)
    buttons: Node = null;

    @property(Node)
    QSJS: Node = null;

    @property(Node)
    JSQS: Node = null;

    @property(Node)
    QSJSPanelButtons: Node = null;

    @property(Node)
    returnButton: Node = null;

    @property(Label)
    titel: Label = null;

    @property(Node)
    magicBookBG: Node = null;

    @property(EditBox)
    editBox: EditBox = null;

    @property(Node)
    lightBall: Node = null;

    @property(Node)
    SpriteAblation: Node = null;

    @property(Node)
    line: Node = null;

    @property(Node)
    MagicBookSke: Node = null;

    @property(Node)
    AnswerBookPanel: Node = null;

    @property(Node)
    AnswerBook: Node = null;

    @property(Node)
    Answer: Node = null;

    @property(Node)
    tipPanel: Node = null;

    @property(Node)
    tipMask: Node = null;

    // @property(Prefab)
    // wipePrefab: Prefab = null;

    startNum = null;


    /**
     * 1:车子    2:班干部    3:考试    4:星座    5:恋人6:身高    7:宠物    8:房子    9:年龄    10:修仙     11:姓    12:智慧    13:财富    14:年代    15:身份    16:生肖
     */
    private isCurrent: number = null;
    private isCurrentSprite2: Node = null;
    private surnames: string[] = ["赵", "钱", "孙", "李", "周", "吴", "郑", "王", "冯", "陈", "褚", "卫", "蒋", "沈", "韩", "杨", "朱", "秦", "尤", "许", "何", "吕", "施", "张", "孔", "曹", "严", "华", "金", "魏", "陶", "姜", "戚", "谢", "邹", "喻", "柏", "水", "窦", "章", "云", "苏", "潘", "葛", "奚", "范", "彭", "郎", "鲁", "韦", "昌", "马", "苗", "凤", "花", "方", "俞", "任", "袁", "柳",];
    private dynasties: string[] = ["夏朝", "商朝", "周朝", "春秋", "战国", "秦朝", "汉朝", "三国", "西晋", "东晋", "十六国", "南北朝", "隋朝", "唐朝", "五代", "十国", "宋朝", "辽朝", "金朝", "西夏", "元朝", "明朝", "清朝"];
    private roles: string[] = ["皇帝", "皇后", "太子", "公主", "宰相", "将军", "太监", "宫女", "文官", "武官", "农民", "商人", "工匠", "僧侣", "道士", "猎人", "渔夫", "牧童", "书生", "侠客", "刺客", "间谍", "乐师", "舞者", "医者", "药师", "卜居", "占卜师", "术士", "妖怪", "鬼怪", "神仙", "龙", "凤凰", "麒麟", "白虎", "朱雀", "玄武", "青龙", "青蛙", "草", "猴子", "兔子", "乌鸦", "蛇", "虎", "熊", "狼", "鹰", "狐狸", "蝙蝠"];
    private unit: string[] = ["分", "角", "元", "百", "万", "亿"]
    private answer: string[] = [
        `长风破浪会有时\n直挂云帆济沧海。`,
        `天生我材必有用\n千金散尽还复来。`,
        `会当凌绝顶\n一览众山小。`,
        `人生得意须尽欢\n莫使金樽空对月。`,
        `安能摧眉折腰事权贵\n使我不得开心颜。`,
        `宁可枝头抱香死\n何曾吹落北风中。`,
        `人生若只如初见\n何事秋风悲画扇。`,
        `老骥伏枥，志在千里\n烈士暮年，壮心不已。`,
        `身无彩凤双飞翼\n心有灵犀一点通。`,
        `但愿人长久\n千里共婵娟。`,
        `长风万里送秋雁\n对此可以酣高楼。`,
        `天生豪杰自为龙\n世上英雄自为凤。`,
        `莫愁前路无知己\n天下谁人不识君。`,
        `人生若只如初见\n何事秋风悲画扇。`,
        `人生得意须尽欢\n莫使金樽空对月。`,
        `宁可枝头抱香死\n何曾吹落北风中。`,
        `天生豪杰自为龙\n世上英雄自为凤。`,
    ];
    private isStart: boolean = false;
    private isButton: boolean = false;
    private isButtonLihtBall: boolean = false;
    //#endregion

    //#region 生命周期
    protected onLoad(): void {
        this.gamePanel.time = 300;
        this.isCurrent = 1;
        this.isCurrentSprite2 = this.sprite2;
        this.isCurrentSprite2.active = true;
        this.titel.string = "车子";
        this.startNum = this.editBox.string;
    }

    //#endregion


    //#region 事件

    onbuttonClick(event: Event) {
        switch (event.target.name) {
            case "StartTestButton":
                if (MJMJ_LineController.Instance.hasDrawnLine()) {
                    console.log(MJMJ_LineController.Instance)
                    if (this.isStart) {
                        console.log("请刷新重试");
                        this.onTipPanel('请刷新重试');
                    } else {
                        this.startTest();
                    }
                } else {
                    console.log("请先绘制线路");

                    this.onTipPanel('请先绘制线路');
                }
                break;

            case "RefreshButton":

                if (this.isButton) return;
                this.parentNode.getChildByName("Label").getComponent(Label).string = null;
                if (this.parentNode.getComponent(Sprite) != null) {
                    this.parentNode.getComponent(Sprite).destroy();
                } else if (this.parentNode.getComponent(Label) != null) {
                    this.parentNode.getComponent(Label).destroy();
                }

                MJMJ_LineController.Instance.resetGraphicsNode();
                if (MJMJ_EffectController.Instance) {
                    MJMJ_EffectController.Instance.reSet();
                } else {
                    console.error("MJJM_EffectController.Instance is not initialized");
                }
                // MJMJ_Wipe.Instance.reSet();


                // this.wipe.destroyAllChildren()
                this.SpriteAblation.active = false;
                this.isStart = false;
                this.Vortex.angle = 0;

                break;

            case "CarButton":
                this.isCurrent = 1;
                this.titel.string = "车子";
                this.isCurrentSprite2.active = false;
                this.getChildren(event.target);
                break

            case "ClassLeaderButton":
                this.isCurrent = 2;
                this.titel.string = "班干部";
                this.isCurrentSprite2.active = false;
                this.getChildren(event.target);
                break

            case "ExamButton":
                this.isCurrent = 3;
                this.titel.string = "考试";
                this.isCurrentSprite2.active = false;
                this.getChildren(event.target);
                break

            case "ZodiacButton":
                this.isCurrent = 4;
                this.titel.string = "星座";
                this.isCurrentSprite2.active = false;
                this.getChildren(event.target);
                break

            case "LoversButton":
                this.isCurrent = 5;
                this.titel.string = "恋人";
                this.isCurrentSprite2.active = false;
                this.getChildren(event.target);
                break

            case "HeightButton":
                this.isCurrent = 6;
                this.titel.string = "身高";
                this.isCurrentSprite2.active = false;
                this.getChildren(event.target);
                break

            case "PetButton":
                this.isCurrent = 7;
                this.titel.string = "宠物";
                this.isCurrentSprite2.active = false;
                this.getChildren(event.target);
                break

            case "HouseButton":
                this.isCurrent = 8;
                this.titel.string = "房子";
                this.isCurrentSprite2.active = false;
                this.getChildren(event.target);
                break

            case "AgeButton":
                this.isCurrent = 9;
                this.titel.string = "年龄";
                this.isCurrentSprite2.active = false;
                this.getChildren(event.target);
                break

            case "XiuXianButton":
                this.isCurrent = 10;
                this.titel.string = "修仙";
                this.isCurrentSprite2.active = false;
                this.getChildren(event.target);
                break

            case "QSJS":
                this.buttons.active = false;
                this.QSJS.active = false;
                this.MagicBookSke.active = false;
                this.QSJSPanelButtons.active = true;
                this.JSQS.active = true;
                this.isCurrent = 11;
                this.titel.string = "姓";
                this.returnButton.active = true;
                this.isCurrentSprite2.active = false;
                this.getChildren(this.QSJSPanelButtons.getChildByName("LastNameButton"));
                this.QSJSPanelButtons.getChildByName("ZodiacButton").active = true;
                this.QSJSPanelButtons.getChildByName("CnZodiacButton").active = false;
                break

            case "JSQS":
                this.JSQS.active = false;
                this.QSJS.active = true;
                this.MagicBookSke.active = false;
                this.buttons.active = false;
                this.isCurrent = 11;
                this.titel.string = "姓";
                this, this.returnButton.active = true;
                this.isCurrentSprite2.active = false;
                this.getChildren(this.QSJSPanelButtons.getChildByName("LastNameButton"));
                this.QSJSPanelButtons.getChildByName("ZodiacButton").active = false;
                this.QSJSPanelButtons.getChildByName("CnZodiacButton").active = true;
                break

            case "LastNameButton":
                this.isCurrent = 11;
                this.titel.string = "姓";
                this.isCurrentSprite2.active = false;
                this.getChildren(event.target);
                break

            case "WisdomButton":
                this.isCurrent = 12;
                this.titel.string = "智慧";
                this.isCurrentSprite2.active = false;
                this.getChildren(event.target);
                break

            case "WealthButton":
                this.isCurrent = 13;
                this.titel.string = "财富";
                this.isCurrentSprite2.active = false;
                this.getChildren(event.target);
                break

            case "DynastiesButton":
                this.isCurrent = 14;
                this.titel.string = "年代";
                this.isCurrentSprite2.active = false;
                this.getChildren(event.target);
                break

            case "RoleButton":
                this.isCurrent = 15;
                this.titel.string = "身份";
                this.isCurrentSprite2.active = false;
                this.getChildren(event.target);
                break

            case "CnZodiacButton":
                this.isCurrent = 16;
                this.titel.string = "生肖";
                this.isCurrentSprite2.active = false;
                this.getChildren(event.target);
                break

            case "ReturnButton":
                this.QSJS.active = true;
                this.JSQS.active = false;
                this.MagicBookSke.active = true;
                this.QSJSPanelButtons.active = false;
                this.returnButton.active = false;
                this.buttons.active = true;
                this.isCurrent = 1;
                this.titel.string = "车子"
                this.getChildren(this.buttons.getChildByName("CarButton"))
                break

            case "MagicBookButton":
                this.magicBookBG.active = true;
                this.editBox.string = "0";
                this.lightBall.setPosition(0, -550, 0);
                this.onEditBoxClicked();
                break

            case "MagicBookReturnButton":
                this.magicBookBG.active = false;
                break

            case "SeeAnswerButton":
                this.AnswerBook.active = false;
                this.Answer.active = true;
                this.Answer.getChildByName("Label").getComponent(Label).string = this.answer[Tools.GetRandomInt(0, this.answer.length - 1)]
                break

            case "OffButton":
                this.AnswerBookPanel.active = false;
                this.AnswerBook.active = false;
                this.Answer.active = false;
                this.onEditBoxClicked();
                break

            case "ReTryButton":
                this.AnswerBookPanel.active = false;
                this.AnswerBook.active = false;
                this.Answer.active = false;
                this.onEditBoxClicked();
                break

            case "CloseButton":
                tween(this.tipPanel)
                    .to(0.1, { position: new Vec3(0, -1500, 0) })
                    .call(() => {
                        this.tipMask.active = false;
                        this.tipPanel.active = false;
                    })
                    .start();
                break
        }
    }


    private onEditBoxClicked() {
        // 获取 EditBox 组件
        const editBoxComponent = this.editBox.getComponent(EditBox);
        if (editBoxComponent) {
            // 启用 EditBox 组件
            editBoxComponent.enabled = true;
        }
    }

    private startTest() {
        if (this.isStart) return;
        this.isStart = true;
        this.isButton = true;
        this.Vortex.active = true;

        MJMJ_LineController.Instance.startAni();

        tween(this.Vortex)
            .to(2, { angle: 720 })
            .call(() => {
                this.Vortex.active = false;
                this.SpriteAblation.active = true;
                // this.wipe.active = true;
                // const wipeInstance = instantiate(this.wipePrefab);
                // this.wipe.addChild(wipeInstance);
            })
            .start();

        switch (this.isCurrent) {
            case 1:
                this.setSpriteFrame(this.car);
                break;
            case 2:
                this.setSpriteFrame(this.classLeader);
                break;
            case 3:
                this.setLabel(Tools.GetRandomInt(0, 100));
                break;
            case 4:
                this.setSpriteFrame(this.Zodiac);
                break;
            case 5:
                this.setLabel(this.surnames[Tools.GetRandomInt(0, this.surnames.length)] + this.surnames[Tools.GetRandomInt(0, this.surnames.length)] + this.surnames[Tools.GetRandomInt(0, this.surnames.length)])
                break;
            case 6:
                this.setLabel(Tools.GetRandomInt(150, 200) + "cm")
                break;
            case 7:
                this.setSpriteFrame(this.pets)
                break;
            case 8:
                this.setSpriteFrame(this.house)
                break;
            case 9:
                this.setLabel(Tools.GetRandomInt(1, 80) + "岁");
                break;
            case 10:
                this.setSpriteFrame(this.xiuXian)
                break;
            case 11:
                this.setLabel(this.surnames[Tools.GetRandomInt(0, this.surnames.length - 1)]);
                break;
            case 12:
                this.setLabel(Tools.GetRandomInt(80, 180))
                break;
            case 13:
                this.setLabel(Tools.GetRandomInt(0, 100) + this.unit[Tools.GetRandomInt(0, this.unit.length - 1)])
                break;
            case 14:
                this.setLabel(this.dynasties[Tools.GetRandomInt(0, this.dynasties.length - 1)])
                break;
            case 15:
                this.setLabel(this.roles[Tools.GetRandomInt(0, this.roles.length - 1)])
                break;
            case 16:
                this.setSpriteFrame(this.chineseZodiac)
                break;
        }
    }

    private setLabel(str: string) {
        this.parentNode.addComponent(Label)
        const label = this.parentNode.getComponent(Label);
        label.fontSize = 100;
        label.lineHeight = 100;
        label.isBold = true;
        label.overflow = Label.Overflow.NONE;
        label.string = str;

        this.scheduleOnce(() => {
            this.isButton = false;

        }, 2)
    }

    private setSpriteFrame(sf: SpriteFrame[]) {
        const spriteFrame = sf[Tools.GetRandomInt(0, sf.length - 1)];
        this.parentNode.addComponent(Sprite).spriteFrame = spriteFrame;
        const label = this.parentNode.getChildByName("Label");
        label.active = true;
        label.getComponent(Label).string = spriteFrame.name;

        this.scheduleOnce(() => {
            this.isButton = false;

        }, 2)
    }

    private getChildren(node: Node) {
        this.isCurrentSprite2 = node.getChildByName("Sprite").getChildByName("Sprite2");
        this.isCurrentSprite2.active = true;
    }

    private onTipPanel(string: string) {
        this.tipMask.active = true;
        this.tipPanel.active = true;
        this.tipPanel.getChildByName("TipLabel").getComponent(Label).string = string;
        tween(this.tipPanel)
            .to(0.1, { position: new Vec3(0, 0, 0) })
            .start();
    }

    magicBookCallBack() {
        const str = this.editBox.string;

        // 检查输入是否为空
        if (str === null || str.trim() === '') {
            this.onTipPanel('请输入1-396之间的数字');
            return;
        }

        // 检查输入是否为数字
        const num = parseInt(str);
        if (isNaN(num)) {
            this.onTipPanel('请输入1-396之间的数字');
            return;
        }

        // 检查数字范围
        if (num < 1 || num > 396) {
            this.onTipPanel('请输入1-396之间的数字');
        } else {
            // 获取 EditBox 组件
            const editBoxComponent = this.editBox.getComponent(EditBox);
            if (editBoxComponent) {
                // 禁用 EditBox 组件
                editBoxComponent.enabled = false;
            }

            this.lightBall.active = true;
            this.lightBall.getChildByName("Particle2D").active = true;
            tween(this.lightBall)
                .to(2, { position: new Vec3(0, 250, 0) })
                .call(() => {
                    this.lightBall.active = false;
                    this.lightBall.getChildByName("Particle2D").active = false;
                    this.lightBall.setPosition(new Vec3(0, -550, 0));
                    this.AnswerBookPanel.active = true;
                    this.AnswerBook.active = true;
                })
                .start();
        }
    }

    //#endregion
}


