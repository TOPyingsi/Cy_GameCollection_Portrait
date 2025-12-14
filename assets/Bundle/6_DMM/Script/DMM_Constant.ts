import { _decorator, color, Color, Component, Node, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('DMM_Constant')
export class DMM_Constant extends Component {

}

export enum GROUP {
    DMM_FLOOR = 1 << 5,
    DMM_BARRIER = 1 << 6,
    DMM_PLAYER = 1 << 7,
    DMM_AREA = 1 << 8,
    DMM_BADMEN = 1 << 9,
    DMM_TRIGGER1 = 1 << 10,
}

export enum DMM_ITEM {
    ITEM1,
    ITEM2,
    ITEM3,
    ITEM4,
    ITEM5,
    ITEM6,
}

export enum DMM_GENDER {
    男,
    女,
}

export enum DMM_AREATYPE {
    SAFETY,
    DANGER,
    PROBABILITY,
}

export const AIName: string[] = [
    "AIPlayer1_女",
    "AIPlayer1_男",
    "AIPlayer2_女",
    "AIPlayer2_男",
    "AIPlayer3_女",
    "AIPlayer3_男",
    "AIPlayer4_女",
    "AIPlayer4_男",
    "AIPlayer5_女",
    "AIPlayer5_男",
    "AIPlayer6_女",
    "AIPlayer6_男",
]

export const MenName: string[] = [
    "昊天", "翔宇", "明轩", "智勇", "启航", "浩然", "铭泽", "宇轩", "志远", "晨阳", "浩宇", "锦程", "嘉懿", "煜城", "昊强", "天宇", "苑博", "伟宸", "烨伟", "振国", "越泽", "瑾瑜", "皓轩", "世博", "韵华", "鸿煊", "新豪", "冠霖", "厉辉", "泽洋", "宏达", "晟睿", "彤彤", "文昊", "睿渊", "致远", "俊驰", "秀杰", "辰逸", "金傲", "劲松", "伟祺", "炎彬", "苑杰", "国豪", "君浩", "鑫鹏", "博涛", "风桦", "弘昌", "卡思", "擎宇", "韵舟", "玮伦", "沙欧", "哲瀚", "幽朋", "昊然", "晋鹏", "泽轩", "峻熙", "懿轩", "鹏涛", "星野", "荣轩", "弘文", "雪松", "靖琪", "明杰", "天佑", "建辉", "博超", "鹏煊", "达强", "炫明", "伟泽", "鸿涛", "鹤轩", "绍辉", "煜祺", "展鹏", "智轩", "睿思", "锦涛", "嘉纳", "鸿博", "德宇", "鑫傲", "结炎", "峻峰", "冠楠", "智渊", "晓啸", "峻岳", "晖煊", "越彬"
]

export const WomenName: string[] = [
    "梦琪", "嫣然", "诗涵", "欣怡", "雅静", "雨桐", "梦洁", "雪娇", "思琪", "语嫣", "依娜", "雨欣", "怡婷", "雅婷", "玥婷", "梦瑶", "婉婷", "雪怡", "思梦", "语蝶", "依婷", "雨涵", "怡君", "雅楠", "玥涵", "羽彤", "彤彤", "嫣然", "梦琪", "诗涵", "欣怡", "雅静", "雨桐", "梦洁", "雪娇", "思琪", "语嫣", "依娜", "雨欣", "怡婷", "雅婷", "玥婷", "梦瑶", "婉婷", "雪怡", "思梦", "语蝶", "依婷", "雨涵", "怡君", "雅楠", "玥涵", "羽彤", "彤彤", "梦琪", "诗涵", "欣怡", "雅静", "雨桐", "梦洁", "雪娇", "思琪", "语嫣", "依娜", "雨欣", "怡婷", "雅婷", "玥婷", "梦瑶", "婉婷", "雪怡", "思梦", "语蝶", "依婷", "雨涵", "怡君", "雅楠", "玥涵", "羽彤", "彤彤", "梦琪", "诗涵", "欣怡", "雅静", "雨桐", "梦洁", "雪娇", "思琪", "语嫣", "依娜", "雨欣", "怡婷", "雅婷", "玥婷", "梦瑶", "婉婷", "雪怡", "思梦", "语蝶", "依婷", "雨涵", "怡君", "雅楠", "玥涵"
]

export enum PLAYERTYPE {
    PLYAER,
    PROP,
}

export class COLOR {
    public static White = new Color(255, 255, 255);
    public static SkyBlue = new Color(0, 255, 255);
}

export enum BADMENNAME {
    猪 = "猪",
}

export enum DMM_PROP {
    乒乓球拍,
    刷子,
    台灯,
    地球仪,
    小熊,
    小黄鸭,
    手提包,
    杯子,
    水杯,
    水管,
    煤气罐,
    空花盆,
    花盆,
    花盆2,
    苹果,
    菜刀,
    订书机,
    锅,
}

export const DMM_PropPos = [
    new Vec3(0, -0.922, 1.042),
    new Vec3(0, -0.8570, 0),
    new Vec3(-0.191, -0.893, 0.319),
    new Vec3(-0.192, -0.806, 0.295),
    new Vec3(0, -0.837, 0.066),
    new Vec3(-0.016, -0.586, 0.126),
    new Vec3(0.097, -0.65, 0.391),
    new Vec3(0.09, -1.043, 0.114),
    new Vec3(0.019, -1.048, 0.137),
    new Vec3(-0.139, -0.781, 0.259),
    new Vec3(0, -0.818, 0.114),
    new Vec3(0.035, -0.527, 0.299),
    new Vec3(-0.011, -1.006, 0.472),
    new Vec3(-0.133, -1.008, 0.613),
    new Vec3(-0.021, -0.844, -0.513),
    new Vec3(-0.563, -0.725, -1.355),
    new Vec3(-0.057, 0, -0.106),
    new Vec3(0.083, -0.696, 0.533),

]

export enum DMM_SOUND {
    MUSIC,
    SHAKE,
}

/**
 * 颜色枚举 -- rgba跟ColorRGBA对应
 */
export enum DMM_ContentColor {
    /**黑色 */
    BLACK,
    /**白色 */
    WHITE,
    /**蓝色 */
    Blue,
    /**深红色 */
    Crimson,
    /**绿色 */
    Green,
    /**靛蓝色 */
    Indigo,
    /**粉色 */
    Pink,
    /**红色 */
    Red,
    /**黄色 */
    Yellow
}

/**
 * 颜色rgba-- rgba跟ContentColor枚举对应
 */
export const DMM_ColorRGBA = [
    color(0, 0, 0, 255),
    color(255, 255, 255, 255),
    color(0, 0, 255, 255),
    color(220, 20, 60, 255),
    color(0, 255, 0, 255),
    color(75, 0, 130, 255),
    color(255, 192, 203, 255),
    color(255, 0, 0, 255),
    color(255, 255, 0, 255),
]




