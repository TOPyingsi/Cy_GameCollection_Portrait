
import { _decorator, Component, AudioClip, Node, Prefab, Label, PhysicsSystem2D, tween, instantiate, UITransform, Widget, v3, Sprite, Color, Vec3, color, director, Button, AudioSource, game, log, find, FixedConstraint } from 'cc';
import NZLLX_TextControl from './NZLLX_TextControl';
import { GameManager } from 'db://assets/Scripts/GameManager';
import Banner from 'db://assets/Scripts/Banner';
import { ProjectEvent, ProjectEventManager } from 'db://assets/Scripts/Framework/Managers/ProjectEventManager';
import { NZLLX_Select } from './NZLLX_Select';
import { Panel, UIManager } from 'db://assets/Scripts/Framework/Managers/UIManager';
import { GamePanel } from 'db://assets/Scripts/UI/Panel/GamePanel';
import { GameData } from 'db://assets/Scripts/Framework/Managers/DataManager';
import { AudioManager } from 'db://assets/Scripts/Framework/Managers/AudioManager';
const { ccclass, property } = _decorator;





@ccclass('NZLLX_WenziGame')
export default class NZLLX_WenziGame extends Component {
    @property({ type: [AudioClip] })
    YingYue: Array<AudioClip> = [] //音乐0-5第一关，6-11第二关，12是键盘声
    // @property({ type: [Node] })
    // TishiKuan: Array<Node> = [] //0是提示框1是答案框
    @property(Prefab) //文字预制体
    WenZiPre: Prefab;
    @property(Node) //栏目
    LanMu: Node;
    @property(GamePanel)
    gamePanel: GamePanel = null;
    @property(Prefab)
    answer: Prefab[] = [];
    // @property(Label) //倒计时文本
    // Text_Djs: Label;
    // @property(Node) //提示界面
    // TishiPanel: Node;
    // @property(Node) //加时按钮
    // Btn_JiaShi: Node;
    // @property(Node) //提示按钮
    // Btn_TiShi: Node;
    // @property(Node) //主页按钮
    // Btn_ZhuYe: Node;
    // @property(Node)
    // Btn_again: Node;
    @property(Prefab)
    PenZuan: Prefab = null;

    public static scnen = 0; //0哪吒

    public Lie: number[] = [6, 6, 7, 6, 7, 7, 7, 7, 8, 8, 5, 6, 7, 8, 6, 6, 7, 5, 7, 8, 5, 5, 7, 6, 6, 7, 6, 6, 8, 6, 7, 9, 9, 8];//每行有多少格格子
    public Jindu: number = 0;//进度
    public DaoJiShi: number = 60;//倒计时
    public IsBeGin: boolean = false;//开始按下
    public GuangGaoJinDu: number = 0;//广告观看次数
    public Ispause: boolean = false;//是否涨停
    public IsWin: boolean = false;//是否获胜
    public Isdie: boolean = false;//是否输掉
    public r: number = 0;
    public g: number = 0;
    public b: number = 0;
    public d: string = "diss";

    public str: string[] = ["我杀人不眨一是小妖吃眼口逍遥怪人不七肚又自在放八子要撑破盐个",
        "日月同生千灵逆天雷滚滚重天怕怕好我元改身浑我的劈命掉渣渣突专我我劫天破和吹笑哈哈嘀老喇嘀嗒嘀嗒六叭嘀嗒干着对",
        "我乃今天生辰宴红哪吒三太子作烧猪手随便吃诗你们我在你就别饭吃一年闲得捣我嗦蒜到头不乱给咱小弟搞点甜",
        "茅房想起忘带生去拉屎没纸活你全是死就越倒霉泪活得腾折是越受罪越有追从来生垂死求看都死扎挣越淡不如你累悲床在瘫累不催上睡专干着对天老和",
        "魔人逢三我活我丸事喜花聚不只降精神爽顶活要生不掉削被无你叫如觉你这所来哪在大怪妖谓相吒这睡去死吧会",
        "斩妖除魔我最擅不成功便成仁长一春节吉祥好时起塑吒哪给我辰遁肉身公不运命入底到斗屁狗是虚空门别人看法",
        "天火尖枪混天绫地龙还这是给你无族不励奖的们量犯快替天行道乾滔束收你们是坤天手就玩来使圈罪行擒把戏命",
        "今日到此除奸恶我小降妖来会作命爷能倦疲很诗由成小爷也是遍我魔来回回千百不不来罐瓶摔干由成翻墙捣瓦事天仙关在府里无尔等妖孽快受死",
        "你是谁只有你自己去你个鸟命，我说若我说过你是命了命人心中的我由算运一是见成唯我，不座友朋的一不永公大山到底天由远就和它斗弃放要不",
        "天雷滚滚我好怕怕你留得青山在不我打撒了若前方怕命我我来我路无没由撒打们便踏出柴我~你你路条一烧不还吃收山大座一由人心中的成见是天",
        "自己吓自己自己吓自己自己吓自己自己吓自己自己吓自己",//文字连梗
        "我今闪把爱你是夜闪爱想的奶星光你你心龙龙心的一都我奶满又晚填才是满一晚满",//我是奶龙文字连梗
        "摆满香蕉睡蕉小吃岛小的爱的猴完就睡觉巢恼烦香蕉快快乐乐没睡蕉小猴真是好幸福美满没烦恼",//睡觉小猴文字连梗
        "沙威玛~噢沙威玛有了你玛威沙噢~威沙生活美好没烦玛传奇奇妙至极恼最棒游戏人人赞叹不就那紧不果如你对今晚没番茄否则无论白天叫吼会我玛威沙还是夜晚翩的味道让我舞动翩",//沙威玛传奇连梗
        "总有一条蜿蜒七里镇话童在彩的河沾染魔息气张乖的法却又在爱里曲扬息不流川折起水花又卷入水入光时帘一让所有很久很到走都前以久幸福结局时刻",//童话镇文字连梗
        "六星街里还传了吗南苑卤来炉尖舌是香八出上的故事杨巴浪让你啊琴列迹天涯的声房梦啊子孩吗包中回家吧阿面拉德桑克里",//苹果香连梗
        "卡皮巴拉做一只拉巴巴皮皮卡卡拉卡皮巴拉吃吃卡卡皮皮巴巴喝拉巴皮卡拉拉喝就算世界马上睡关无我与灭毁睡啦啦去过就玩玩",//卡皮巴拉连梗
        "搞点动静狗咚咚咚咚咚咚咚咚咚咚咚咚咚咚咚咚咚咚咚咚",//搞点动静狗连梗
        "大菠萝大菠萝你阳太的中心我是香气扑鼻味道疯无法停止品尝狂大菠萝大菠萝你挡能人无力魔的让我痴让我狂大王的我是你萝菠",//大菠萝连梗
        "大香蕉一条大香蕉你的感觉真的很奇飘呀飘呀摇呀摇妙你的感觉神魂颠倒大香蕉一条大香蕉你的感觉真的很奇飘呀飘呀摇呀摇妙你的感觉神魂颠倒",//大香蕉连梗
        "我是毒液我液毒强最是叮咚叮叮咚曼波呀呀呀哈哈你别笑叮咚叮叮咚",//毒液连梗
        "天雷滚滚劈怕怕好我的劫天破突我我笑哈哈浑逆叭嘀嗒身天喇嗒嘀掉改吹嘀嘀渣命我嗒嘀渣",//哪吒歌词连梗
        "无人扶我青云志我自踏雪至山巅若是命中无此运亦可孤身登昆仑",//听泉战歌
        "老鼠怕猫这把只一传谣是猫小猫有啥可打胆鼠起壮怕翻",//老鼠怕猫，
        "假假鸡鸡脚脚如如脚~~鸡生爱脚乐多脚活情鸡快钱脚将让脚越抓~你你脚吃了吃折蹉~越脚脚磨跎就吃个鸡就吃个鸡脚脚",//鸡鸭收纳师
        "哈还啥恹竭尽竭腰在事恹力力力点谨都的竭尽竭头慎去一力力力的着伸天咚蹦咚我我手到竭尽竭最最回底力力力终终应最竭尽竭到到上后力力力达达班真咚蹦咚的的看正了谁蹦大大到取悦卑力门门谁学会谦尽尽力尽力蹦尽力",//乐意效劳
        "你好我有一个我要在网上帽之上穿问问衫后显得很忠诚像谢夫涅谢像怎么买到夫个大大子帽涅大的漂漂亮人耳衫帽的亮矮朵",//我有一个帽衫
        "谢地谢地我要谢地谢地我锤谢谢你锤要你地地这是写给谢谢的爷爷我地地不谁是写我我是告爷给要要写诉爷我锤锤给你我奶你你我不给奶的奶奶是写的",//谢帝我要diss你
        "臣妾要告发熹贵妃后宫罪不容诛通私乱翠果打烂他的嘴秽三阿哥又长高了",//臣妾告发惠熹贵妃
        "我在5点2013点14睡主沉起时准觉打溺爱你在本个在碎花洋职浪爱在站裙里漫河我的前面上不那时候帅岸电闪像就的",//款词连梗520am
        "你是内内个内内内个内个内内内内个内内内个内个内内阳光彩虹滴哒滴滴马白小滴哒我是内内个内内内内个内内内个内个内内阳滴马白小虹彩光滴哒滴滴哒滴滴滴哒滴滴哒滴哒哒内个内个内内",
        "他们朝我扔鸡蛋我拿我拿泥饭炒蛋做蛋鸡没座巴做披萨他们朝没座我拿泥巴泥扔我他挞蛋做巴我不闪躲们朝我扔白菜我拿白只里眼的我菜白炒菜有阿通他们朝我扔烟我捡起烟头抽两口头",
        "我别墅里里池水他研送k唱面面直笔下墨阿叔鱼龙银接给我四具茶大展鸿图大师个大展鸿鸿运不手亲字来搬图是总能提笔说放在办当都点头字大他室公头公关图鸿展说要玩就要玩的大贼下的坐才鼠老大越船",   //大展鸿图
        "挖掘机咿呀咿呀挖萝腌里咿呀咿哟掘卜挖掘机里呀哟机呀咿呀咿腌萝卜里哟咿呀萝腌掘挖腌哟呀咿卜里机卜萝",  //挖掘机里腌萝卜
    ]
    public Daan: string[][] = [
        ["我是小妖怪", "逍遥又自在", "杀人不眨眼", "吃人不放盐", "一口七八个", "肚子要撑破"],
        ["日月同生千灵重元", "嘀嗒嘀嗒嘀嘀嗒", "逆天改命我吹喇叭", "突破天劫我笑哈哈", "劈的我浑身掉渣渣", "天雷滚滚我好怕怕", "专和老六对着干"],
        ["我乃哪吒三太子", "今天生辰宴作诗", "红烧猪手随便吃", "你们吃饭我嗦蒜", "我在你就别捣乱", "一年到头不得闲", "给咱小弟搞点甜"],
        ["茅房去拉屎", "想起忘带纸", "从来生死都看淡", "专和老天对着干", "生活你全是泪", "没死就得活受罪", "越是折腾越倒霉", "越有追求越悲催", "垂死挣扎你累不累", "不如瘫在床上睡"],
        ["魔丸降生叫哪吒", "你这妖怪去死吧", "人逢喜事精神爽", "三花聚顶被削掉", "不如在这睡大觉", "我活不活无所谓", "我只要你来相会",],
        ["斩妖除魔我最擅长", "不成功便成仁", "一起遁入虚空门", "春节吉祥好时辰", "我给哪吒塑肉身", "命运不公斗到底", "别人看法是狗屁",],
        ["收你们来玩把戏", "这是给你们的奖励", "龙族犯滔天罪行", "还不快束手就擒", "火尖枪混天绫", "替天行道是使命", "天地无量乾坤圈",],
        ["我命由我不由天", "小爷成魔不成仙", "关在府里无事干", "翻墙捣瓦摔瓶罐", "来来回回千百遍", "小爷也是很疲倦", "能降妖来会作诗", "今日到此除奸恶", "尔等妖孽快受死"],
        ["人心中的成见是一座大山", "若命运不公就和它斗到底", "你是谁只有你自己说了算，永远不要放弃", "我说过你是我唯一的朋友", "去你个鸟命，我命由我不由天"],
        ["人心中的成见是一座大山", "我命由我不由天", "天雷滚滚我好怕怕", "你打我撒~你打我撒", "留得青山在不怕没柴烧", "还吃收你们来了", "若前方无路我便踏出一条路"],
        ["自己吓自己", "自己吓自己", "自己吓自己", "自己吓自己", "自己吓自己"],
        ["我是奶龙我才是奶龙", "今夜星光闪闪", "爱你的心满满", "想你一晚又一晚", "把爱你的心都填满"],
        ["摆满香蕉的小岛", "睡蕉小猴的爱巢", "吃完香蕉就睡觉", "快快乐乐没烦恼", "睡蕉小猴真是好", "幸福美满没烦恼"],
        ["沙威玛~噢沙威玛~噢沙威玛", "有了你生活美好没烦恼", "沙威玛传奇奇妙至极", "最棒游戏人人赞叹你", "如果不紧那就不对", "今晚没番茄否则我会吼叫", "无论白天还是夜晚", "沙威玛的味道让我舞动翩翩"],
        ["总有一条蜿蜒在童话镇里七彩的河", "沾染魔法的乖张气息却又在爱里曲折", "川流不息扬起水花又卷入一帘时光入水", "让所有很久很久以前都走到幸福结局时刻"],
        ["六星街里还传来八杨琴声吗", "阿里克桑德拉面包房列巴出炉了吗", "南苑卤香是舌尖上的故事啊", "你让浪迹天涯的孩子啊梦中回家吧"],
        ["卡皮巴拉", "做一只卡卡皮皮巴巴拉拉卡皮巴拉", "吃吃喝喝睡睡玩玩就过去啦", "卡卡皮皮巴巴拉拉卡皮巴拉", "就算世界马上毁灭与我无关啦"],
        ["搞点动静狗", "咚咚咚咚", "咚咚咚咚", "咚咚咚咚", "咚咚咚咚", "咚咚咚咚"],
        ["大菠萝大菠萝你是我心中的太阳", "香气扑鼻味道疯狂", "无法停止品尝", "大菠萝大菠萝你的魔力无人能挡", "让我痴让我狂大菠萝你是我的王"],
        ["大香蕉一条大香蕉", "你的感觉真的很奇妙", "飘呀飘呀摇呀摇", "你的感觉神魂颠倒", "大香蕉一条大香蕉", "你的感觉真的很奇妙", "飘呀飘呀摇呀摇", "你的感觉神魂颠倒"],
        ["我是毒液我是最强毒液", "叮咚叮叮咚", "曼波呀呀呀", "哈哈你别笑", "叮咚叮叮咚"],
        ["天雷滚滚我好怕怕", "劈的我浑身掉渣渣", "突破天劫我笑哈哈", "逆天改命我吹喇叭", "嘀嗒嘀嗒嘀嘀嘀嗒"],
        ["无人扶我青云志", "我自踏雪至山巅", "若是命中无此运", "亦可孤身登昆仑"],
        ["老鼠怕猫", "这是谣传", "一只小猫", "有啥可怕", "壮起鼠胆", "把猫打翻"],
        ["假如生活将你折磨就吃个鸡脚脚", "假如爱情让你蹉跎就吃个鸡脚脚", "鸡脚脚鸡脚脚~越吃越快乐~", "鸡脚脚鸡脚脚~吃了抓钱多~"],
        ["哈腰点头的", "我最终到达的大门", "还在谨慎着", "我最终到达的大门", "啥事都去伸手回应", "上班看到谁学会谦卑", "恹恹的一天到底最后真正取悦了谁", "竭力竭力咚竭力竭力咚", "尽力尽力蹦尽力尽力蹦", "竭力竭力咚竭力竭力咚", "尽力尽力蹦尽力尽力蹦"],
        ["你好我有一个帽衫", "我要在网上问问", "穿上之后显得很忠诚像个大耳朵矮人", "像谢夫涅谢夫涅", "怎么买到帽子大大的", "漂漂亮亮的帽衫"],
        ["谢地谢地我要锤你", "谢地谢地我要锤你", "谢地谢地我要锤你", "谢地谢地我要锤你", "这是写给我爷爷的不是写给我奶奶的", "谁告诉你不是写给我爷爷是写给我奶奶的"],
        ["臣妾要告发熹贵妃私通", "秽乱后宫罪不容诛", "翠果打烂他的嘴", "三阿哥又长高了"],
        ["我在5点20睡觉", "13点14准时起", "主打个浪漫", "沉溺在爱河不上岸", "爱你在本职里", "碎花洋裙站在我的前面", "那时候帅的就像闪电"],
        ["你是内内个内内", "内个内个内内", "内内个内内", "内个内个内内", "阳光彩虹小白马", "滴滴哒滴滴哒", "我是内内个内内", "内个内个内内", "内内个内内", "内个内个内内", "阳光彩虹小白马", "滴滴哒滴滴哒", "滴滴哒滴哒滴滴哒滴哒"],
        ["他们朝我扔白菜", "我拿白菜炒白菜", "他们朝我扔烟头", "我捡起烟头抽两口", "没座", "没座", "我不闪躲", "我的眼里只有阿通", "他们朝我扔泥巴", "我拿泥巴做蛋挞", "我拿泥巴做披萨", "他们朝我扔鸡蛋", "我拿鸡蛋做蛋炒饭"],
        ["别墅里面唱k", "水池里面银龙鱼", "我送阿叔茶具", "他研墨下笔直接给我四个字说", "大展鸿图大师亲手提笔字", "大展鸿图搬来放在办公室", "大展鸿图关公都点头", "鸿运不能总是当头", "他说要玩就要玩的大", "贼船越大老鼠才坐的下"],
        ["挖掘机里腌萝卜", "咿呀咿呀哟", "挖掘机里腌萝卜", "咿呀咿呀哟", "挖掘机里腌萝卜", "咿呀咿呀哟", "挖掘机里腌萝卜", "咿呀咿呀哟"],
    ]

    private static _instance: NZLLX_WenziGame = null;
    public Wenzi_JiHe: Node[] = [];
    public static get Instance(): NZLLX_WenziGame {
        if (!this._instance) {
            this._instance = new NZLLX_WenziGame();
        }
        return this._instance;
    }
    onLoad() {
        //    // UIManager.Instance.FadeOutBlackMask();
        //     UIManager.Instance.FadeOutBlackMask();
        //     director.getCollisionManager().enabled = true;
        //     director.getPhysicsManager().enabled = true;
        NZLLX_WenziGame._instance = this;
        PhysicsSystem2D.instance.debugDrawFlags = 0;

        this.gamePanel.winStr = "梗读万遍，其义自见";
        this.gamePanel.lostStr = "鉴定为网络成分不够";
        // Banner
        if (GameManager.GameData.gameName == "哪吒连连字1") {
            NZLLX_WenziGame.scnen = 0;
            this.gamePanel.answerPrefab = this.answer[0];
        }
        else if (GameManager.GameData.gameName == "哪吒连连字2") {
            NZLLX_WenziGame.scnen = 1;
            this.gamePanel.answerPrefab = this.answer[1];
        }
        else if (GameManager.GameData.gameName == "哪吒连连字3") {
            NZLLX_WenziGame.scnen = 2;
            this.gamePanel.answerPrefab = this.answer[2];
        }
        else if (GameManager.GameData.gameName == "哪吒连连字4") {
            NZLLX_WenziGame.scnen = 3;
            this.gamePanel.answerPrefab = this.answer[3];
        }
        else if (GameManager.GameData.gameName == "哪吒连连字5") {
            NZLLX_WenziGame.scnen = 4;
            this.gamePanel.answerPrefab = this.answer[4];
        }
        else if (GameManager.GameData.gameName == "哪吒连连字6") {
            NZLLX_WenziGame.scnen = 5;
            this.gamePanel.answerPrefab = this.answer[5];
        }
        else if (GameManager.GameData.gameName == "哪吒连连字7") {
            NZLLX_WenziGame.scnen = 6;
            this.gamePanel.answerPrefab = this.answer[6];
        }
        else if (GameManager.GameData.gameName == "哪吒连连字8") {
            NZLLX_WenziGame.scnen = 7;
            this.gamePanel.answerPrefab = this.answer[7];
        }
        else if (GameManager.GameData.gameName == "哪吒连连字9") {
            NZLLX_WenziGame.scnen = 8;
            this.gamePanel.answerPrefab = this.answer[8];
        }
        else if (GameManager.GameData.gameName == "哪吒连连字10") {
            NZLLX_WenziGame.scnen = 9;
            this.gamePanel.answerPrefab = this.answer[9];
        }
        else if (GameManager.GameData.gameName == "文字连梗") {
            NZLLX_WenziGame.scnen = 10;
            this.gamePanel.answerPrefab = this.answer[10];
        }
        else if (GameManager.GameData.gameName == "我是奶龙文字连梗") {
            NZLLX_WenziGame.scnen = 11;
            this.gamePanel.answerPrefab = this.answer[11];
        }
        else if (GameManager.GameData.gameName == "睡蕉小猴文字连梗") {
            NZLLX_WenziGame.scnen = 12;
            this.gamePanel.answerPrefab = this.answer[12];
        }
        else if (GameManager.GameData.gameName == "沙威玛传奇连梗") {
            NZLLX_WenziGame.scnen = 13;
            this.gamePanel.answerPrefab = this.answer[13];
        }
        else if (GameManager.GameData.gameName == "童话镇文字连梗") {
            NZLLX_WenziGame.scnen = 14;
            this.gamePanel.answerPrefab = this.answer[14];
        }
        else if (GameManager.GameData.gameName == "苹果香文字连梗") {
            NZLLX_WenziGame.scnen = 15;
            this.gamePanel.answerPrefab = this.answer[15];
        }
        else if (GameManager.GameData.gameName == "卡皮巴拉连梗") {
            NZLLX_WenziGame.scnen = 16;
            this.gamePanel.answerPrefab = this.answer[16];
        }
        else if (GameManager.GameData.gameName == "搞点动静狗连梗") {
            NZLLX_WenziGame.scnen = 17;
            this.gamePanel.answerPrefab = this.answer[17];
        }
        else if (GameManager.GameData.gameName == "大菠萝连梗") {
            NZLLX_WenziGame.scnen = 18;
            this.gamePanel.answerPrefab = this.answer[18];
        }
        else if (GameManager.GameData.gameName == "大香蕉连梗") {
            NZLLX_WenziGame.scnen = 19;
            this.gamePanel.answerPrefab = this.answer[19];
        }
        else if (GameManager.GameData.gameName == "毒液连梗") {
            NZLLX_WenziGame.scnen = 20;
            this.gamePanel.answerPrefab = this.answer[20];
        }
        else if (GameManager.GameData.gameName == "哪吒歌词连梗") {
            NZLLX_WenziGame.scnen = 21;
            this.gamePanel.answerPrefab = this.answer[21];
        }
        else if (GameManager.GameData.gameName == "听泉战歌") {
            NZLLX_WenziGame.scnen = 22;
            this.gamePanel.answerPrefab = this.answer[22];
        }
        else if (GameManager.GameData.gameName == "老鼠怕猫") {
            NZLLX_WenziGame.scnen = 23;
            this.gamePanel.answerPrefab = this.answer[23];
        }
        else if (GameManager.GameData.gameName == "鸡鸭收纳师") {
            NZLLX_WenziGame.scnen = 24;
            this.gamePanel.answerPrefab = this.answer[24];
        }
        else if (GameManager.GameData.gameName == "乐意效劳") {
            NZLLX_WenziGame.scnen = 25;
            this.gamePanel.answerPrefab = this.answer[25];
        }
        else if (GameManager.GameData.gameName == "我有一个帽衫") {
            NZLLX_WenziGame.scnen = 26;
            this.gamePanel.answerPrefab = this.answer[26];
        }
        else if (GameManager.GameData.gameName == "谢帝我要diss你") {
            NZLLX_WenziGame.scnen = 27;
            this.gamePanel.answerPrefab = this.answer[27];
        }
        else if (GameManager.GameData.gameName == "臣妾要告发熹贵妃") {
            NZLLX_WenziGame.scnen = 28;
            this.gamePanel.answerPrefab = this.answer[28];
        }
        else if (GameManager.GameData.gameName == "歌词连梗520am") {
            NZLLX_WenziGame.scnen = 29;
            this.gamePanel.answerPrefab = this.answer[29];
        } else if (GameManager.GameData.gameName == "阳光彩虹小白马") {
            NZLLX_WenziGame.scnen = 30;
            this.gamePanel.answerPrefab = this.answer[30];
        } else if (GameManager.GameData.gameName == "他们朝我扔泥巴") {
            NZLLX_WenziGame.scnen = 31;
            this.gamePanel.answerPrefab = this.answer[31];
        } else if (GameManager.GameData.gameName == "大展鸿图") {
            NZLLX_WenziGame.scnen = 32;
            this.gamePanel.answerPrefab = this.answer[32];
        } else if (GameManager.GameData.gameName == "挖掘机里腌萝卜") {
            NZLLX_WenziGame.scnen = 33;
            this.gamePanel.answerPrefab = this.answer[33];
        }

    }
    start() {


        // find("Canvas/Bg/粒子").active = true;
        // find("Canvas/Bg/粒子").position = v3(200, 370);
        // tween(find("Canvas/Bg/粒子"))
        // .by(1.2, { y: -750 })
        // .call(() => {
        // find("Canvas/Bg/粒子").getComponent(ParticleSystem).stopSystem();
        // })
        // .to(0.5, { opacity: 0 })
        // .by(0, { y: 750 })
        // .delay(0.5)
        // .to(0, { opacity: 255 })
        // .call(() => {
        // find("Canvas/Bg/粒子").getComponent(ParticleSystem).resetSystem();
        // })
        // .union()
        // .repeatForever()
        // .start();
        // }
        // if (GameManager.Instance.GameName == "罗刹海市") {
        // WenziGame.scnen = 10;
        //            // find("Canvas/Bg/粒子").active = true;
        //            // tween(find("Canvas/Bg/粒子"))
        //            //     .by(1.2, { x: 660 })
        //            //     .by(0.3, { y: -120 })
        //            //     .by(1.2, { x: -660 })
        //            //     .call(() => {
        //            //         find("Canvas/Bg/粒子").getComponent(ParticleSystem).stopSystem();
        //            //     })
        //            //     .to(0.5, { opacity: 0 })
        //            //     .by(0, { y: 120 })
        //            //     .delay(0.5)
        //            //     .to(0, { opacity: 255 })
        //            //     .call(() => {
        //            //         find("Canvas/Bg/粒子").getComponent(ParticleSystem).resetSystem();
        //            //     })
        //            //     .union()
        //            //     .repeatForever()
        //            //     .start();
        // }
        // AudioManager.Instance.stopMusic();

        this.LoadText();
        //第一关新手教程
        if (NZLLX_WenziGame.scnen == 0) {
            //(333,334)--->(333,-175)
            find("Canvas/粒子").active = true;
            find("Canvas/粒子").position = v3(333, 190.374);
            tween(find("Canvas/粒子"))
                .delay(0.5)
                .to(0, { position: v3(333, 190.374) })
                .to(1.5, { position: v3(333, -327.095) })
                .union()
                .repeatForever()
                .start();
        }



    }


    //    //开始计时
    Beging() {
        // tween(this)
        //     .delay(1)
        //     .call(() => {
        //         if (this.DaoJiShi > 0) {
        //             if (!this.IsWin) {
        //                 this.DaoJiShi--;
        //                 this.Text_Djs.string = "倒计时:" + this.DaoJiShi;
        //             }
        //         } else if (this.DaoJiShi == 0 && find("Canvas/Bg/胜利界面").active == false) {
        //             if (this.Isdie == false) {
        //                 this.Isdie = true;
        //                 this.Text_Djs.string = "倒计时:" + this.DaoJiShi;
        //                 this.Godie();
        //             }
        //         }
        //     })
        //     .union()
        //     .repeatForever()
        //     .start();
    }
    //    //初始化
    LoadText() {
        var i = 0;
        for (let char of this.str[NZLLX_WenziGame.scnen]) {
            let pre = instantiate(this.WenZiPre);
            pre.children[0].getComponent(Label).string = char;
            pre.getComponent(NZLLX_TextControl).X = i % this.Lie[NZLLX_WenziGame.scnen];
            pre.getComponent(NZLLX_TextControl).Y = Math.floor(i / this.Lie[NZLLX_WenziGame.scnen]);
            if (this.Lie[NZLLX_WenziGame.scnen] >= 5) {
                this.LanMu.getComponent(UITransform).width = pre.getComponent(UITransform).width * this.Lie[NZLLX_WenziGame.scnen] + 1;
                this.LanMu.position = v3(0, this.LanMu.position.y, 0);
                pre.children[0].getComponent(Label).fontSize = 45;
                this.LanMu.getComponent(Widget).top = 650;
            }
            pre.setParent(this.LanMu);
            i++;
        }
    }
    ColorChose() {
        const maxIndex = Math.floor(Math.random() * 3); // 0: r, 1: g, 2: b
        let minIndex = Math.floor(Math.random() * 3);
        while (minIndex === maxIndex) {
            minIndex = Math.floor(Math.random() * 3); // 确保 minIndex 不等于 maxIndex
        }



        // 设置最大值和最小值
        if (maxIndex === 0) this.r = 255;
        else if (maxIndex === 1) this.g = 255;
        else if (maxIndex === 2) this.b = 255;

        if (minIndex === 0) this.r = 162;
        else if (minIndex === 1) this.g = 162;
        else if (minIndex === 2) this.b = 162;

        // 设置剩下的变量
        const remainingIndex = 3 - maxIndex - minIndex; // 计算剩下的变量索引
        if (remainingIndex === 0) this.r = this.getRandomValue(162, 255);
        else if (remainingIndex === 1) this.g = this.getRandomValue(162, 255);
        else if (remainingIndex === 2) this.b = this.getRandomValue(162, 255);


    }
    getRandomValue(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    //    //判断成功
    YesOrNo() {
        //拿出数组所有字拼成字符串
        let strs: string = "";
        for (let i = 0; i < this.Wenzi_JiHe.length; i++) {
            strs += this.Wenzi_JiHe[i].children[0].getComponent(Label).string;
        }
        console.log(strs);

        //判断是否和数据库字符串匹配
        for (let i = 0; i < this.Daan[NZLLX_WenziGame.scnen].length; i++) {
            if (strs == this.Daan[NZLLX_WenziGame.scnen][i]) {
                //                //匹配成功
                this.Jindu++;
                if (this.Jindu >= this.Daan[NZLLX_WenziGame.scnen].length) {
                    this.scheduleOnce(() => {
                        this.Winner();

                    }, 2);//间隔一秒执行一次


                    //game.deltaTime;



                }
                if (NZLLX_WenziGame.scnen <= 33) {
                    this.YingYue.forEach((music) => {
                        if (strs == music.name) {
                            this.node.getComponent(AudioSource).stop();
                            this.node.getComponent(AudioSource).clip = music;
                            AudioManager.Instance.PlaySFX(this.node.getComponent(AudioSource).clip);
                        }
                    })



                }

                //换色
                this.ColorChose();
                let Btn_Color: Color = new Color(this.r, this.g, this.b);
                for (let i = 0; i < this.Wenzi_JiHe.length; i++) {
                    this.Wenzi_JiHe[i].getComponent(NZLLX_TextControl).ChanggeColor(Btn_Color);
                }
                //弹出提示
                let Tanc = this.LanMu.parent.getChildByName("选择正确弹窗");

                Tanc.active = true;
                find("Canvas/粒子").active = false;
                Tanc.getChildByName("box").scale = new Vec3(0, 0, 0);
                Tanc.getChildByName("box").getChildByName("文本").getComponent(Label).string = strs;
                tween(Tanc.getChildByName("box"))
                    .to(0.8, { scale: v3(1, 1, 1) }, { easing: "backOut" })
                    .start();
                return;
            }
        }
        //不匹配
        for (let i = 0; i < this.Wenzi_JiHe.length; i++) {
            this.Wenzi_JiHe[i].getComponent(NZLLX_TextControl).Jihuo = false;
            this.Wenzi_JiHe[i].getComponent(NZLLX_TextControl).ChanggeColor(color(255, 255, 255));
        }
    }
    //    //关闭文字框
    Exit_WenZiKuan() {
        this.LanMu.parent.getChildByName("选择正确弹窗").active = false;

    }
    //胜利界面弹出
    Winnerjiemian() {
        // this.LanMu.parent.getChildByName("胜利界面").active = true;
    }
    //失败界面弹出
    Losejiemian() {
        // this.LanMu.parent.getChildByName("失败界面").active = true;
    }
    //下一关
    NextChange() {
        // if (NZLLX_WenziGame.scnen <= 29) {
        //     director.loadScene("NZLLX_Game");
        // }
        // else {
        //     director.loadScene("NZLLX_Select");
        // }
    }


    //    //胜利
    Winner() {
        this.gamePanel.Win();
        // ProjectEventManager.emit(ProjectEvent.游戏结束, "哪吒连连字");

        // if (NZLLX_WenziGame.scnen <= 29) {
        //     NZLLX_WenziGame.scnen += 1
        //     //this.LanMu.parent.getChildByName("胜利界面").active = true;
        //     this.scheduleOnce(() => {
        //         this.Winnerjiemian();
        //         //director.loadScene("NZLLX_Game");
        //     }, 2);//失败界面弹出
        // }
        // else {

        //     this.IsWin = true;


        //     NZLLX_WenziGame.scnen = 0;
        //     director.loadScene("NZLLX_Select");//此处更改为调回主界面
        // }
        // this.Btn_JiaShi.active = false; //加时提示按钮关闭显示
        // this.Btn_TiShi.active = false;
        // this.Btn_ZhuYe.active = false;
        // this.Btn_again.active = false;

        // setTimeout(() => {
        // UIManager.Instance.ShowFinishPanel(true);
        // GuanGao.Instance.YuanShen(YuanShenType.GameOver);
        //            // this.Btn_JiaShi.active = false; //加时提示按钮关闭显示
        //            // this.Btn_TiShi.active = false;
        //            // this.Btn_ZhuYe.active = false;
        //            // if (WenziGame.scnen == 7) { //如果是第二关，屏蔽下一关按钮
        //            //     this.WinnerPanel.getChildByName("下一关").active = false;
        //            //     this.WinnerPanel.getChildByName("主页").getComponent(Widget).left = 350;
        //            // }
        // }, 5000)
    }
    //    //失败
    Godie() {
        this.gamePanel.Lost();
        // ProjectEventManager.emit(ProjectEvent.游戏结束, "哪吒连连字");
        // // UIManager.Instance.ShowFinishPanel(false);
        // // GuanGao.Instance.YuanShen(YuanShenType.GameOver);
        // this.Btn_JiaShi.active = false;
        // this.Btn_TiShi.active = false;
        // this.Btn_ZhuYe.active = false;
        // this.Btn_again.active = false;
        // console.log("已失败");
        // this.Losejiemian();//失败界面弹出
    }
    //    // 重新开始
    Restart() {
        // console.log("重新开始");

        // director.loadScene("NZLLX_Game");//对应的scene名；sceneNam

    }
    WinnerRestart() {
        // NZLLX_WenziGame.scnen = NZLLX_WenziGame.scnen - 1;
        // director.loadScene("NZLLX_Game");
    }
    //    ////返回
    OnSelectGameBtnClicked() {
        // director.loadScene("NZLLX_Select");
    }
    //    //返回主页
    ReMain() {

        // if (Banner.IsShowServerBundle == false) {
        //     console.log("返回主页");
        //     director.loadScene("NZLLX_Select");//对应的scene名；sceneName
        // }
        // else {
        //     UIManager.ShowPanel(Panel.MoreGamePanel);
        // }


    }


    //    //加时
    PlusTime() {
        // // GuanGao.Instance.ShiPing(this.PlusTimeCall, this);
        // // GameManager.Instance.ShowTipLabelByString("+30s");
        // Banner.Instance.ShowVideoAd(() => {
        //     console.log("游戏时间加30秒" + "当前游戏时间" + "=" + this.DaoJiShi);
        //     this.DaoJiShi = this.DaoJiShi + 30;
        // })
    }
    //    //加时回调
    PlusTimeCall() {
        // NZLLX_WenziGame.Instance.DaoJiShi += 30;
        // NZLLX_WenziGame.Instance.Text_Djs.string = "倒计时:" + NZLLX_WenziGame.Instance.DaoJiShi;
    }
    //    //提示刷新
    Tishi() {
        // this.Ispause = true;
        // this.TishiPanel.active = true;
        // if (this.GuangGaoJinDu == 0) {
        //     this.TishiKuan[0].active = true;
        //     this.TishiPanel.getChildByName("获取答案").active = true;
        //     this.TishiPanel.getChildByName("获取答案").getComponent(Button).enabled = true;
        //     this.TishiPanel.getChildByName("获取答案").getComponent(Sprite).color = new Color(255, 255, 255);
        // }
        // if (this.GuangGaoJinDu >= 0) {
        //     this.TishiKuan[0].active = true;
        //     if (NZLLX_WenziGame.scnen == 0) {
        //         this.TishiKuan[0].children[0].getComponent(Label).string =
        //             "1.我是小妖怪\n2.逍遥又自在\n3.杀人不眨眼\n4.吃人不放盐\n5.一口七八个\n6.肚子要撑破";
        //     }
        //     if (NZLLX_WenziGame.scnen == 1) {
        //         this.TishiKuan[0].children[0].getComponent(Label).string =
        //             "1.专和老六对着干\n2.天雷滚滚我好害怕\n3.突破天劫我笑哈哈\n4.嘀嗒嘀嗒滴滴嗒\n5.逆天改命我吹喇叭\n6.劈的我浑身掉渣渣\n7.日月同生千灵重元";
        //     }
        //     if (NZLLX_WenziGame.scnen == 2) {
        //         this.TishiKuan[0].children[0].getComponent(Label).string =
        //             "1.我乃哪吒三太子\n2.今天生辰宴作诗\n3.红烧猪手随便吃\n4.你们吃饭我嗦蒜\n5.我在你就别捣乱\n6.一年到头不得闲\n7.给咱小弟搞点甜";
        //     }
        //     if (NZLLX_WenziGame.scnen == 3) {
        //         this.TishiKuan[0].children[0].getComponent(Label).string =
        //             "1.茅房去拉屎\n2.想起忘带纸\n3.从来生死都看淡\n4.专和老天对着干\n5.生活你全是泪\n6.没死就得活受罪\n7.越是折腾越倒霉\n8.越有追求越悲催\n9.垂死挣扎你累不累\n10.不如摊在床上睡";
        //     }
        //     if (NZLLX_WenziGame.scnen == 4) {
        //         this.TishiKuan[0].children[0].getComponent(Label).string =
        //             "1.魔丸降生叫哪吒\n2.你这妖怪去死吧\n3.人逢喜事精神爽\n4.三花聚顶被削掉\n5.不如在这睡大觉\n6.我活不活无所谓\n7.我只要你来相会";
        //     }
        //     if (NZLLX_WenziGame.scnen == 5) {
        //         this.TishiKuan[0].children[0].getComponent(Label).string =
        //             "1.斩妖除魔我最擅长\n2.不成功便成仁\n3.一起遁入虚空门\n4.春节吉祥好时辰\n5.我给哪吒塑肉身\n6.命运不公斗到底\n7.别人看法是狗屁";
        //     }
        //     if (NZLLX_WenziGame.scnen == 6) {
        //         this.TishiKuan[0].children[0].getComponent(Label).string =
        //             "1.收你们来玩把戏\n2.这是给你们的奖励\n3.龙族犯滔天罪行\n3.还不快束手就擒\n4.火尖枪混天绫\n5.替天行道是使命\n6.天地无量乾坤圈";
        //     }
        //     if (NZLLX_WenziGame.scnen == 7) {
        //         this.TishiKuan[0].children[0].getComponent(Label).string =
        //             "1.我命由我不由天\n2.小爷成魔不成仙\n3.关在府里无事干\n4.翻墙捣瓦摔瓶罐\n5.来来回回千百遍\n6.小爷也是很疲倦\n7.能降妖来会作诗\n8.今日到此除奸恶\n9.尔等妖孽快受死";
        //     }
        //     if (NZLLX_WenziGame.scnen == 8) {
        //         this.TishiKuan[0].children[0].getComponent(Label).string =
        //             "1.人心中的成见是一座大山\n2.若命运不公就和它斗到底\n3.你是谁只有你自己说了算，永远不要放弃\n4.我说过你是我唯一的朋友\n5.去你个鸟命，我命由我不由天"

        //     }
        //     if (NZLLX_WenziGame.scnen == 9) {
        //         this.TishiKuan[0].children[0].getComponent(Label).string =
        //             "1.人心中的成见是一座大山\n2.我命由我不由天\n3.天雷滚滚我好怕怕\n4.你打我撒~你打我撒\n5.留得青山在不怕没柴烧\n6.还吃收你们来了\n7.若前方无路我便踏出一条路"
        //     }
        //     if (NZLLX_WenziGame.scnen == 10) {
        //         this.TishiKuan[0].children[0].getComponent(Label).string =
        //             "1.自己吓自己\n2.自己吓自己\n3.自己吓自己\n4.自己吓自己\n5.自己吓自己"
        //     }
        //     if (NZLLX_WenziGame.scnen == 11) {
        //         this.TishiKuan[0].children[0].getComponent(Label).string =
        //             "1.我是奶龙我才是奶龙\n2.今夜星光闪闪\n3.爱你的心满满\n4.想你一晚又一晚\n5.把爱你的心都填满";
        //     }
        //     if (NZLLX_WenziGame.scnen == 12) {
        //         this.TishiKuan[0].children[0].getComponent(Label).string =
        //             "1.摆满香蕉的小岛\n2.睡蕉小猴的爱巢\n3.吃完香蕉就睡觉\n4.快快乐乐没烦恼\n5.睡蕉小猴真是好\n6.幸福美满没烦恼";
        //     }
        //     if (NZLLX_WenziGame.scnen == 13) {
        //         this.TishiKuan[0].children[0].getComponent(Label).string =
        //             "1.沙威玛~噢沙威玛~噢沙威玛\n2.有了你生活美好没烦恼\n3.沙威玛传奇奇妙至极\n4.最棒游戏人人赞叹\n5.如果不紧那就不对\n6.今晚没番茄否则我会吼叫\n7.无论白天还是夜晚\n8.沙威玛的味道让我舞动翩翩";
        //     }
        //     if (NZLLX_WenziGame.scnen == 14) {
        //         this.TishiKuan[0].children[0].getComponent(Label).string =
        //             "1.总有一条蜿蜒在童话镇里七彩的河\n2.沾染魔法的乖张气息却又在爱里曲折\n3.川流不息扬起水花又卷入一帘时光\n4.让所有很久很久以前都走到幸福结局时刻";
        //     }
        //     if (NZLLX_WenziGame.scnen == 15) {
        //         this.TishiKuan[0].children[0].getComponent(Label).string =
        //             "1.六星街里还传来八杨琴声吗\n2.阿里克桑德拉面包房列巴出炉了吗\n3.南苑卤香是舌尖上的故事啊\n4.你让浪迹天涯的孩子啊梦中回家吧";
        //     }
        //     if (NZLLX_WenziGame.scnen == 16) {
        //         this.TishiKuan[0].children[0].getComponent(Label).string =
        //             "1.卡皮巴拉\n2.做一只卡卡皮皮巴巴拉拉卡皮巴拉\n3.吃吃喝喝睡睡玩玩就过去啦\n4.卡卡皮皮巴巴拉拉卡皮巴拉\n5.就算世界马上毁灭与我无关啦";
        //     }
        //     if (NZLLX_WenziGame.scnen == 17) {
        //         this.TishiKuan[0].children[0].getComponent(Label).string =
        //             "1.搞点动静狗\n2.咚咚咚咚\n3.咚咚咚咚\n4.咚咚咚咚\n5.咚咚咚咚\n6.咚咚咚咚";
        //     }
        //     if (NZLLX_WenziGame.scnen == 18) {
        //         this.TishiKuan[0].children[0].getComponent(Label).string =
        //             "1.大菠萝大菠萝你是我心中的太阳\n2.香气扑鼻味道疯狂\n3.无法停止品尝\n4.大菠萝大菠萝你的魔力无人能挡\n5.让我痴让我狂大菠萝你是我的王";
        //     }
        //     if (NZLLX_WenziGame.scnen == 19) {
        //         this.TishiKuan[0].children[0].getComponent(Label).string =
        //             "1.大香蕉一条大香蕉\n2.你的感觉真的很奇妙\n3.飘呀飘呀摇呀摇\n4.你的感觉神魂颠倒\n5.大香蕉一条大香蕉\n6.你的感觉真的很奇妙\n7.飘呀飘呀摇呀摇\n8.你的感觉神魂颠倒";
        //     }
        //     if (NZLLX_WenziGame.scnen == 20) {
        //         this.TishiKuan[0].children[0].getComponent(Label).string =
        //             "1.我是毒液我是最强毒液\n2.叮咚叮叮咚\n3.曼波呀呀呀\n4.哈哈你别笑\n5.叮咚叮叮咚";
        //     }
        //     if (NZLLX_WenziGame.scnen == 21) {
        //         this.TishiKuan[0].children[0].getComponent(Label).string =
        //             "1.天雷滚滚我好怕怕\n2.劈得我浑身掉渣渣\n3.突破天劫我笑哈哈\n4.逆天改命我吹喇叭\n5.嘀嗒嘀嗒嘀嘀嘀嗒";
        //     }
        //     if (NZLLX_WenziGame.scnen == 22) {
        //         this.TishiKuan[0].children[0].getComponent(Label).string =
        //             "1.无人扶我青云志\n2.我自踏雪至山巅\n3.若是命中无此运\n4.亦可孤身登昆仑";
        //     }
        //     if (NZLLX_WenziGame.scnen == 23) {
        //         this.TishiKuan[0].children[0].getComponent(Label).string =
        //             "1.老鼠怕猫\n2.这是谣传\n3.一只小猫\n4.有啥可怕\n5.壮起鼠胆\n6.把猫打翻";
        //     }
        //     if (NZLLX_WenziGame.scnen == 24) {
        //         this.TishiKuan[0].children[0].getComponent(Label).string =
        //             "1.假如生活将你折磨就吃个鸡脚脚\n2.假如爱情让你蹉跎就吃个鸡脚脚\n3.鸡脚脚鸡脚脚~越吃越快乐~\n4.鸡脚脚鸡脚脚~吃了抓钱多~";
        //     }
        //     if (NZLLX_WenziGame.scnen == 25) {
        //         this.TishiKuan[0].children[0].getComponent(Label).string =
        //             "1.哈腰点头的\n2.我最终到达的大门\n3.还在谨慎着\n4.我最终到达的大门\n5.啥事都去伸手回应\n6.上班看到谁学会谦卑\n7.恹恹的一天到底最后真正取悦了谁\n8.竭力竭力咚竭力竭力咚\n9.尽力尽力蹦尽力尽力蹦\n10.竭力竭力咚竭力竭力咚\n11.尽力尽力蹦尽力尽力蹦";
        //     }
        //     if (NZLLX_WenziGame.scnen == 26) {
        //         this.TishiKuan[0].children[0].getComponent(Label).string =
        //             "1.你好我有一个帽衫\n2.我要在网上问问\n3.穿上之后显得很忠诚像个大耳朵矮人\n4.像谢夫涅谢夫涅\n5.怎么买到帽子大大的\n6.漂漂亮亮的帽衫";
        //     }
        //     if (NZLLX_WenziGame.scnen == 27) {
        //         this.TishiKuan[0].children[0].getComponent(Label).string =
        //             "1.谢地谢地我要锤你\n2.谢地谢地我要锤你\n3.谢地谢地我要锤你\n4.谢地谢地我要锤你\n5.这是写给我爷爷的不是写给我奶奶的\n6.谁告诉你不是写给我爷爷是写给我奶奶的";
        //     }
        //     if (NZLLX_WenziGame.scnen == 28) {
        //         this.TishiKuan[0].children[0].getComponent(Label).string =
        //             "1.臣妾要告发熹贵妃私通\n2.秽乱后宫罪不容诛\n3.翠果打烂他的嘴\n4.三阿哥又长高了";
        //     }
        //     if (NZLLX_WenziGame.scnen == 29) {
        //         this.TishiKuan[0].children[0].getComponent(Label).string =
        //             "1.我在5点20睡觉\n2.13点14准时起\n3.主打个浪漫\n4.沉溺在爱河不上岸\n5.爱你在本职里\n6.碎花洋裙站在我的前面\n7.那时候帅的就像闪电";
        //     }




        // }
        // setTimeout(() => {
        //     this.TishiPanel.active = false;
        //     this.TishiPanel.active = true;
        // }, 100);
    }
    //    //点击提示广告
    OnTIshiGuanggao() {
        // // GuanGao.Instance.YuanShen(YuanShenType.Tishi);
        // Banner.Instance.ShowVideoAd(() => {
        //     console.log("广告观看次数" + "=" + this.GuangGaoJinDu);
        //     this.GuangGaoJinDu = this.GuangGaoJinDu + 1;
        //     this.Tishi();
        // })
    }
    //    //广告点击,出现提示
    GuangGaoHuidiao() {
        // GuanGao.Instance.ShiPing(this.GuangGaoHuidiaoCall, this);

    }
    GuangGaoHuidiaoCall() {
        // // WenziGame.Instance.GuangGaoJinDu++;
        // NZLLX_WenziGame.Instance.Tishi();
    }
    //    //关闭提示
    OutTishi() {
        // this.Ispause = false;
        // this.TishiPanel.active = false;
    }
    onClick1() {

        // UIManager.ShowPanel(Panel.MoreGamePanel);

    }

}


