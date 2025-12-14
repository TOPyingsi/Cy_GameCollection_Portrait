export enum XDMKQ_ENUM_STATE {
    RUN = 0,
    STAND = 1,
    FIRE = 2,
    SQUAT = 3,
    DIE = 4,
}

export enum XDMKQ_MAP {
    县城,
    军营,
    前线,
    孤城,
}

export enum XDMKQ_WEAPON {
    步枪,
    汤姆逊,
    轻机枪,
    手雷,
    燃烧弹,
    RPG,
    炮台,
    轰炸,
    金币,
}

export enum XDMKQ_SET {
    音乐,
    音效,
    震动
}

export enum XDMKQ_PANEL {
    LevelPanel,
    SetPanel,
    RolePanel,
    SupplyPanel,
    InjuredPanel,
    DiePanel,
    OverPanel,
    VideoPanel
}

export type XDMKQ_PATH = { start: string, end: string[] };

/**敌人路径 ---县城--军营--前线--孤城 */
export const XDMKQ_MAP_ENEMY_PATHS: XDMKQ_PATH[][] = [
    [
        { start: "Point_1", end: ["Point_5", "Point_6", "Point_7", "Point_8", "Point_9", "Point_10", "Point_11", "Point_12", "Point_13", "Point_14", "Point_15"] },
        { start: "Point_16", end: ["Point_19", "Point_20", "Point_21", "Point_22", "Point_24", "Point_25", "Point_26", "Point_27", "Point_28"] },
        { start: "Point_29", end: ["Point_32", "Point_33", "Point_34", "Point_35", "Point_36", "Point_37", "Point_38", "Point_39", "Point_40", "Point_41", "Point_42", "Point_43", "Point_44"] },
    ],
    [
        { start: "Point_1", end: ["Point_3", "Point_4", "Point_9", "Point_10", "Point_11", "Point_12", "Point_14", "Point_15", "Point_16", "Point_17"] },
        { start: "Point_18", end: ["Point_9", "Point_10", "Point_11", "Point_12", "Point_14", "Point_15", "Point_16", "Point_17"] },
        { start: "Point_22", end: ["Point_24", "Point_25", "Point_26", "Point_27", "Point_28", "Point_33", "Point_34", "Point_35", "Point_36", "Point_37", "Point_38", "Point_41", "Point_42", "Point_43", "Point_44", "Point_45"] },
        { start: "Point_18", end: ["Point_33", "Point_34", "Point_35", "Point_36", "Point_37", "Point_38", "Point_41", "Point_42", "Point_43"] },
    ],
    [
        { start: "Point_1", end: ["Point_3", "Point_4", "Point_5", "Point_6", "Point_7", "Point_9", "Point_10", "Point_11", "Point_12", "Point_13", "Point_14", "Point_15", "Point_16", "Point_17", "Point_18", "Point_19", "Point_20", "Point_21"] },
        { start: "Point_22", end: ["Point_23", "Point_47", "Point_35", "Point_39", "Point_36", "Point_37", "Point_38", "Point_34", "Point_28", "Point_29", "Point_30", "Point_31", "Point_26", "Point_27"] },
    ],
    [
        // { start: "Point_1", end: ["Point_3", "Point_4", "Point_5"] },
        { start: "Point_6", end: ["Point_8", "Point_9", "Point_10", "Point_11", "Point_12", "Point_13"] },
        { start: "Point_14", end: ["Point_16", "Point_17", "Point_18", "Point_19", "Point_20", "Point_21", "Point_22"] },
        { start: "Point_23", end: ["Point_25", "Point_26", "Point_27", "Point_28", "Point_29", "Point_30", "Point_31", "Point_32", "Point_33"] },
        { start: "Point_34", end: ["Point_36", "Point_37", "Point_38", "Point_39", "Point_40", "Point_41", "Point_42", "Point_44", "Point_45", "Point_46"] },
    ]
];

/**卡车路径 ---县城--军营--前线--孤城*/
export const XDMKQ_MAP_VEHICLE_PATHS: XDMKQ_PATH[][] = [
    [
        { start: "Point_45", end: ["Point_48"] },
        { start: "Point_49", end: ["Point_52"] },
    ],
    [
        { start: "Point_47", end: ["Point_48", "Point_49"] },
        { start: "Point_50", end: ["Point_54", "Point_56"] },
    ],
    [
        { start: "Point_51", end: ["Point_53"] },
        { start: "Point_48", end: ["Point_50"] },
    ],
    [
        { start: "Point_43", end: ["Point_47"] },
        { start: "Point_48", end: ["Point_49"] },
        { start: "Point_50", end: ["Point_51"] },
        { start: "Point_52", end: ["Point_53"] },
    ]
];

/**飞机路径 ---县城--军营--前线--孤城 */
export const XDMKQ_MAP_PLANE_PATHS: XDMKQ_PATH[][] = [
    [
        { start: "Point_54", end: ["Point_59"] },
    ],
    [
        { start: "Point_58", end: ["Point_63"] },
    ],
    [
        { start: "Point_59", end: ["Point_64"] },
    ],
    [
        { start: "Point_54", end: ["Point_59"] },
    ]
];

/**角色 */
export type XDMKQ_ROLE = { Name: string, Boold: string, Code: string, Birthday: string, IsLife: boolean };

/**角色名字 */
export const XDMKQ_ROLE_NAME: string[] = [
    "沈墨言", "陆清砚", "林晏辞", "顾清商", "谢玄瑾", "傅云深", "周砚卿", "温书衍", "程栖梧",
    "苏慕辰", "裴景珩", "楚临渊", "秦望舒", "容肆", "凌霄", "季晨", "宋致远", "韩煜轩", "司晨", "萧驰",
    "聂明轩", "齐昭", "邢风", "商陆", "狄锋", "邹航", "安泽", "严瑾", "康磊", "靳川", "贺舟", "屈宸",
    "丁骁", "姜澈", "方屿", "陶然", "孟勋", "常赫", "邵谦", "毛弈", "文朔", "章瀚", "柳铮", "俞桓",
    "江枫", "山岚", "池雨", "岳峙", "星河", "松涛", "云帆", "闻溪", "暮雪", "南笙", "逐风", "寒松",
    "鹤卿", "惊蛰", "既白", "王睿", "张承毅", "李泽宇", "刘俊辉", "陈逸飞", "杨昊然", "黄子骏",
    "赵启明", "吴峻熙", "徐天翊", "孙皓阳", "马煜城", "朱正廷", "郑博文", "冯睿宸", "时谦", "兰亭",
    "墨北", "扶苏", "观南", "镜尘", "钧瓷", "嗣音", "梧秋", "羲和", "谒金", "澹台", "闻钟", "浮生",
    "青裁", "允礼", "怀瑾", "瑾瑜", "敏行", "慎独", "睿哲", "修远", "彦辰", "子衿", "景行"
]

/**角色血型 */
export const XDMKQ_ROLE_BOOLD: string[] = ["A型", "B型", "O型", "AB型"];

/**角色代号 */
export const XDMKQ_ROLE_CODE: string[] = ["狙击手", "冲锋手", "机枪手", "投掷手"];


export enum XDMKQ_SUPPLY {
    步枪,
    冲锋枪,
    轻机枪,
    投掷物,
    火箭筒,
    防空炮,
    生命值,
}

export enum XDMKQ_SUPPLY_GRADE {
    GRADE1,
    GRADE2,
    GRADE3,
    GRADE4,
    GRADE5,
}

export enum XDMKQ_AMPLIFICATION {
    伤害,
    换弹时间,
    弹药上限,
    队友数量,
    生命值,
}

/**补给 */
export class XDMKQ_SUPPLY_ITEM {
    Supply: XDMKQ_SUPPLY;
    Grade: XDMKQ_SUPPLY_GRADE;
    Amplification: XDMKQ_AMPLIFICATION;
    Value: number;
    Tips1: string;
    Tips2: string;
    constructor(supply: XDMKQ_SUPPLY, grade: XDMKQ_SUPPLY_GRADE, amplification: XDMKQ_AMPLIFICATION, value: number, tips1: string, tips2: string) {
        this.Supply = supply;
        this.Grade = grade;
        this.Amplification = amplification;
        this.Value = value;
        this.Tips1 = tips1;
        this.Tips2 = tips2;
    }
};

export const XDMKQ_SUPPLY_ITEMS: XDMKQ_SUPPLY_ITEM[] = [
    { Supply: XDMKQ_SUPPLY.步枪, Grade: XDMKQ_SUPPLY_GRADE.GRADE1, Amplification: XDMKQ_AMPLIFICATION.伤害, Value: 0.1, Tips1: "步枪*伤害", Tips2: "步枪伤害+10%" },
    { Supply: XDMKQ_SUPPLY.步枪, Grade: XDMKQ_SUPPLY_GRADE.GRADE1, Amplification: XDMKQ_AMPLIFICATION.换弹时间, Value: -0.1, Tips1: "步枪*换弹时间", Tips2: "步枪换弹时间-10%" },
    { Supply: XDMKQ_SUPPLY.步枪, Grade: XDMKQ_SUPPLY_GRADE.GRADE1, Amplification: XDMKQ_AMPLIFICATION.弹药上限, Value: 0.1, Tips1: "步枪*弹药上限", Tips2: "步枪弹药上限+10%" },

    { Supply: XDMKQ_SUPPLY.步枪, Grade: XDMKQ_SUPPLY_GRADE.GRADE2, Amplification: XDMKQ_AMPLIFICATION.伤害, Value: 0.15, Tips1: "步枪*伤害", Tips2: "步枪伤害+15%" },
    { Supply: XDMKQ_SUPPLY.步枪, Grade: XDMKQ_SUPPLY_GRADE.GRADE2, Amplification: XDMKQ_AMPLIFICATION.换弹时间, Value: -0.15, Tips1: "步枪*换弹时间", Tips2: "步枪换弹时间-15%" },
    { Supply: XDMKQ_SUPPLY.步枪, Grade: XDMKQ_SUPPLY_GRADE.GRADE2, Amplification: XDMKQ_AMPLIFICATION.弹药上限, Value: 0.15, Tips1: "步枪*弹药上限", Tips2: "步枪弹药上限+15%" },

    { Supply: XDMKQ_SUPPLY.步枪, Grade: XDMKQ_SUPPLY_GRADE.GRADE3, Amplification: XDMKQ_AMPLIFICATION.伤害, Value: 0.2, Tips1: "步枪*伤害", Tips2: "步枪伤害+20%" },
    { Supply: XDMKQ_SUPPLY.步枪, Grade: XDMKQ_SUPPLY_GRADE.GRADE3, Amplification: XDMKQ_AMPLIFICATION.换弹时间, Value: -0.20, Tips1: "步枪*换弹时间", Tips2: "步枪换弹时间-20%" },
    { Supply: XDMKQ_SUPPLY.步枪, Grade: XDMKQ_SUPPLY_GRADE.GRADE3, Amplification: XDMKQ_AMPLIFICATION.弹药上限, Value: 0.2, Tips1: "步枪*弹药上限", Tips2: "步枪弹药上限+20%" },

    { Supply: XDMKQ_SUPPLY.步枪, Grade: XDMKQ_SUPPLY_GRADE.GRADE4, Amplification: XDMKQ_AMPLIFICATION.伤害, Value: 0.3, Tips1: "步枪*伤害", Tips2: "步枪伤害+30%" },
    { Supply: XDMKQ_SUPPLY.步枪, Grade: XDMKQ_SUPPLY_GRADE.GRADE4, Amplification: XDMKQ_AMPLIFICATION.换弹时间, Value: -0.3, Tips1: "步枪*换弹时间", Tips2: "步枪换弹时间-30%" },
    { Supply: XDMKQ_SUPPLY.步枪, Grade: XDMKQ_SUPPLY_GRADE.GRADE4, Amplification: XDMKQ_AMPLIFICATION.弹药上限, Value: 0.3, Tips1: "步枪*弹药上限", Tips2: "步枪弹药上限+30%" },

    { Supply: XDMKQ_SUPPLY.步枪, Grade: XDMKQ_SUPPLY_GRADE.GRADE5, Amplification: XDMKQ_AMPLIFICATION.伤害, Value: 0.4, Tips1: "步枪*伤害", Tips2: "步枪伤害+40%" },
    { Supply: XDMKQ_SUPPLY.步枪, Grade: XDMKQ_SUPPLY_GRADE.GRADE5, Amplification: XDMKQ_AMPLIFICATION.换弹时间, Value: -0.4, Tips1: "步枪*换弹时间", Tips2: "步枪换弹时间-40%" },
    { Supply: XDMKQ_SUPPLY.步枪, Grade: XDMKQ_SUPPLY_GRADE.GRADE5, Amplification: XDMKQ_AMPLIFICATION.弹药上限, Value: 0.4, Tips1: "步枪*弹药上限", Tips2: "步枪弹药上限+40%" },


    { Supply: XDMKQ_SUPPLY.冲锋枪, Grade: XDMKQ_SUPPLY_GRADE.GRADE1, Amplification: XDMKQ_AMPLIFICATION.伤害, Value: 0.1, Tips1: "冲锋枪*伤害", Tips2: "冲锋枪伤害+10%" },
    { Supply: XDMKQ_SUPPLY.冲锋枪, Grade: XDMKQ_SUPPLY_GRADE.GRADE1, Amplification: XDMKQ_AMPLIFICATION.换弹时间, Value: -0.1, Tips1: "冲锋枪*换弹时间", Tips2: "冲锋枪换弹时间-10%" },
    { Supply: XDMKQ_SUPPLY.冲锋枪, Grade: XDMKQ_SUPPLY_GRADE.GRADE1, Amplification: XDMKQ_AMPLIFICATION.弹药上限, Value: 0.1, Tips1: "冲锋枪*弹药上限", Tips2: "冲锋枪弹药上限+10%" },

    { Supply: XDMKQ_SUPPLY.冲锋枪, Grade: XDMKQ_SUPPLY_GRADE.GRADE2, Amplification: XDMKQ_AMPLIFICATION.伤害, Value: 0.15, Tips1: "冲锋枪*伤害", Tips2: "冲锋枪伤害+15%" },
    { Supply: XDMKQ_SUPPLY.冲锋枪, Grade: XDMKQ_SUPPLY_GRADE.GRADE2, Amplification: XDMKQ_AMPLIFICATION.换弹时间, Value: -0.15, Tips1: "冲锋枪*换弹时间", Tips2: "冲锋枪换弹时间-15%" },
    { Supply: XDMKQ_SUPPLY.冲锋枪, Grade: XDMKQ_SUPPLY_GRADE.GRADE2, Amplification: XDMKQ_AMPLIFICATION.弹药上限, Value: 0.15, Tips1: "冲锋枪*弹药上限", Tips2: "冲锋枪弹药上限+15%" },

    { Supply: XDMKQ_SUPPLY.冲锋枪, Grade: XDMKQ_SUPPLY_GRADE.GRADE3, Amplification: XDMKQ_AMPLIFICATION.伤害, Value: 0.2, Tips1: "冲锋枪*伤害", Tips2: "冲锋枪伤害+20%" },
    { Supply: XDMKQ_SUPPLY.冲锋枪, Grade: XDMKQ_SUPPLY_GRADE.GRADE3, Amplification: XDMKQ_AMPLIFICATION.换弹时间, Value: -0.20, Tips1: "冲锋枪*换弹时间", Tips2: "冲锋枪换弹时间-20%" },
    { Supply: XDMKQ_SUPPLY.冲锋枪, Grade: XDMKQ_SUPPLY_GRADE.GRADE3, Amplification: XDMKQ_AMPLIFICATION.弹药上限, Value: 0.2, Tips1: "冲锋枪*弹药上限", Tips2: "冲锋枪弹药上限+20%" },

    { Supply: XDMKQ_SUPPLY.冲锋枪, Grade: XDMKQ_SUPPLY_GRADE.GRADE4, Amplification: XDMKQ_AMPLIFICATION.伤害, Value: 0.3, Tips1: "冲锋枪*伤害", Tips2: "冲锋枪伤害+30%" },
    { Supply: XDMKQ_SUPPLY.冲锋枪, Grade: XDMKQ_SUPPLY_GRADE.GRADE4, Amplification: XDMKQ_AMPLIFICATION.换弹时间, Value: -0.3, Tips1: "冲锋枪*换弹时间", Tips2: "冲锋枪换弹时间-30%" },
    { Supply: XDMKQ_SUPPLY.冲锋枪, Grade: XDMKQ_SUPPLY_GRADE.GRADE4, Amplification: XDMKQ_AMPLIFICATION.弹药上限, Value: 0.3, Tips1: "冲锋枪*弹药上限", Tips2: "冲锋枪弹药上限+30%" },

    { Supply: XDMKQ_SUPPLY.冲锋枪, Grade: XDMKQ_SUPPLY_GRADE.GRADE5, Amplification: XDMKQ_AMPLIFICATION.伤害, Value: 0.4, Tips1: "冲锋枪*伤害", Tips2: "步枪伤害+40%" },
    { Supply: XDMKQ_SUPPLY.冲锋枪, Grade: XDMKQ_SUPPLY_GRADE.GRADE5, Amplification: XDMKQ_AMPLIFICATION.换弹时间, Value: -0.4, Tips1: "冲锋枪*换弹时间", Tips2: "步枪换弹时间-40%" },
    { Supply: XDMKQ_SUPPLY.冲锋枪, Grade: XDMKQ_SUPPLY_GRADE.GRADE5, Amplification: XDMKQ_AMPLIFICATION.弹药上限, Value: 0.4, Tips1: "冲锋枪*弹药上限", Tips2: "步枪弹药上限+40%" },


    { Supply: XDMKQ_SUPPLY.轻机枪, Grade: XDMKQ_SUPPLY_GRADE.GRADE1, Amplification: XDMKQ_AMPLIFICATION.伤害, Value: 0.1, Tips1: "轻机枪*伤害", Tips2: "轻机枪伤害+10%" },
    { Supply: XDMKQ_SUPPLY.轻机枪, Grade: XDMKQ_SUPPLY_GRADE.GRADE1, Amplification: XDMKQ_AMPLIFICATION.换弹时间, Value: -0.1, Tips1: "轻机枪*换弹时间", Tips2: "轻机枪换弹时间-10%" },
    { Supply: XDMKQ_SUPPLY.轻机枪, Grade: XDMKQ_SUPPLY_GRADE.GRADE1, Amplification: XDMKQ_AMPLIFICATION.弹药上限, Value: 0.1, Tips1: "轻机枪*弹药上限", Tips2: "轻机枪弹药上限+10%" },

    { Supply: XDMKQ_SUPPLY.轻机枪, Grade: XDMKQ_SUPPLY_GRADE.GRADE2, Amplification: XDMKQ_AMPLIFICATION.伤害, Value: 0.15, Tips1: "轻机枪*伤害", Tips2: "轻机枪伤害+15%" },
    { Supply: XDMKQ_SUPPLY.轻机枪, Grade: XDMKQ_SUPPLY_GRADE.GRADE2, Amplification: XDMKQ_AMPLIFICATION.换弹时间, Value: -0.15, Tips1: "轻机枪*换弹时间", Tips2: "轻机枪换弹时间-15%" },
    { Supply: XDMKQ_SUPPLY.轻机枪, Grade: XDMKQ_SUPPLY_GRADE.GRADE2, Amplification: XDMKQ_AMPLIFICATION.弹药上限, Value: 0.15, Tips1: "轻机枪*弹药上限", Tips2: "轻机枪弹药上限+15%" },

    { Supply: XDMKQ_SUPPLY.轻机枪, Grade: XDMKQ_SUPPLY_GRADE.GRADE3, Amplification: XDMKQ_AMPLIFICATION.伤害, Value: 0.2, Tips1: "轻机枪*伤害", Tips2: "轻机枪伤害+20%" },
    { Supply: XDMKQ_SUPPLY.轻机枪, Grade: XDMKQ_SUPPLY_GRADE.GRADE3, Amplification: XDMKQ_AMPLIFICATION.换弹时间, Value: -0.20, Tips1: "轻机枪*换弹时间", Tips2: "轻机枪换弹时间-20%" },
    { Supply: XDMKQ_SUPPLY.轻机枪, Grade: XDMKQ_SUPPLY_GRADE.GRADE3, Amplification: XDMKQ_AMPLIFICATION.弹药上限, Value: 0.2, Tips1: "轻机枪*弹药上限", Tips2: "轻机枪弹药上限+20%" },

    { Supply: XDMKQ_SUPPLY.轻机枪, Grade: XDMKQ_SUPPLY_GRADE.GRADE4, Amplification: XDMKQ_AMPLIFICATION.伤害, Value: 0.3, Tips1: "轻机枪*伤害", Tips2: "轻机枪伤害+30%" },
    { Supply: XDMKQ_SUPPLY.轻机枪, Grade: XDMKQ_SUPPLY_GRADE.GRADE4, Amplification: XDMKQ_AMPLIFICATION.换弹时间, Value: -0.3, Tips1: "轻机枪*换弹时间", Tips2: "轻机枪换弹时间-30%" },
    { Supply: XDMKQ_SUPPLY.轻机枪, Grade: XDMKQ_SUPPLY_GRADE.GRADE4, Amplification: XDMKQ_AMPLIFICATION.弹药上限, Value: 0.3, Tips1: "轻机枪*弹药上限", Tips2: "轻机枪弹药上限+30%" },

    { Supply: XDMKQ_SUPPLY.轻机枪, Grade: XDMKQ_SUPPLY_GRADE.GRADE5, Amplification: XDMKQ_AMPLIFICATION.伤害, Value: 0.4, Tips1: "轻机枪*伤害", Tips2: "轻机枪伤害+40%" },
    { Supply: XDMKQ_SUPPLY.轻机枪, Grade: XDMKQ_SUPPLY_GRADE.GRADE5, Amplification: XDMKQ_AMPLIFICATION.换弹时间, Value: -0.4, Tips1: "轻机枪*换弹时间", Tips2: "轻机枪换弹时间-40%" },
    { Supply: XDMKQ_SUPPLY.轻机枪, Grade: XDMKQ_SUPPLY_GRADE.GRADE5, Amplification: XDMKQ_AMPLIFICATION.弹药上限, Value: 0.4, Tips1: "轻机枪*弹药上限", Tips2: "轻机枪弹药上限+40%" },


    { Supply: XDMKQ_SUPPLY.火箭筒, Grade: XDMKQ_SUPPLY_GRADE.GRADE1, Amplification: XDMKQ_AMPLIFICATION.伤害, Value: 0.1, Tips1: "火箭筒*伤害", Tips2: "火箭筒伤害+10%" },
    { Supply: XDMKQ_SUPPLY.火箭筒, Grade: XDMKQ_SUPPLY_GRADE.GRADE1, Amplification: XDMKQ_AMPLIFICATION.换弹时间, Value: -0.1, Tips1: "火箭筒*换弹时间", Tips2: "火箭筒换弹时间-10%" },
    { Supply: XDMKQ_SUPPLY.火箭筒, Grade: XDMKQ_SUPPLY_GRADE.GRADE1, Amplification: XDMKQ_AMPLIFICATION.弹药上限, Value: 0.1, Tips1: "火箭筒*弹药上限", Tips2: "火箭筒弹药上限+10%" },

    { Supply: XDMKQ_SUPPLY.火箭筒, Grade: XDMKQ_SUPPLY_GRADE.GRADE2, Amplification: XDMKQ_AMPLIFICATION.伤害, Value: 0.15, Tips1: "火箭筒*伤害", Tips2: "火箭筒伤害+15%" },
    { Supply: XDMKQ_SUPPLY.火箭筒, Grade: XDMKQ_SUPPLY_GRADE.GRADE2, Amplification: XDMKQ_AMPLIFICATION.换弹时间, Value: -0.15, Tips1: "火箭筒*换弹时间", Tips2: "火箭筒换弹时间-15%" },
    { Supply: XDMKQ_SUPPLY.火箭筒, Grade: XDMKQ_SUPPLY_GRADE.GRADE2, Amplification: XDMKQ_AMPLIFICATION.弹药上限, Value: 0.15, Tips1: "火箭筒*弹药上限", Tips2: "火箭筒弹药上限+15%" },

    { Supply: XDMKQ_SUPPLY.火箭筒, Grade: XDMKQ_SUPPLY_GRADE.GRADE3, Amplification: XDMKQ_AMPLIFICATION.伤害, Value: 0.2, Tips1: "火箭筒*伤害", Tips2: "火箭筒伤害+20%" },
    { Supply: XDMKQ_SUPPLY.火箭筒, Grade: XDMKQ_SUPPLY_GRADE.GRADE3, Amplification: XDMKQ_AMPLIFICATION.换弹时间, Value: -0.20, Tips1: "火箭筒*换弹时间", Tips2: "火箭筒换弹时间-20%" },
    { Supply: XDMKQ_SUPPLY.火箭筒, Grade: XDMKQ_SUPPLY_GRADE.GRADE3, Amplification: XDMKQ_AMPLIFICATION.弹药上限, Value: 0.2, Tips1: "火箭筒*弹药上限", Tips2: "火箭筒弹药上限+20%" },

    { Supply: XDMKQ_SUPPLY.火箭筒, Grade: XDMKQ_SUPPLY_GRADE.GRADE4, Amplification: XDMKQ_AMPLIFICATION.伤害, Value: 0.3, Tips1: "火箭筒*伤害", Tips2: "火箭筒伤害+30%" },
    { Supply: XDMKQ_SUPPLY.火箭筒, Grade: XDMKQ_SUPPLY_GRADE.GRADE4, Amplification: XDMKQ_AMPLIFICATION.换弹时间, Value: -0.3, Tips1: "火箭筒*换弹时间", Tips2: "火箭筒换弹时间-30%" },
    { Supply: XDMKQ_SUPPLY.火箭筒, Grade: XDMKQ_SUPPLY_GRADE.GRADE4, Amplification: XDMKQ_AMPLIFICATION.弹药上限, Value: 0.3, Tips1: "火箭筒*弹药上限", Tips2: "火箭筒弹药上限+30%" },

    { Supply: XDMKQ_SUPPLY.火箭筒, Grade: XDMKQ_SUPPLY_GRADE.GRADE5, Amplification: XDMKQ_AMPLIFICATION.伤害, Value: 0.4, Tips1: "火箭筒*伤害", Tips2: "火箭筒伤害+40%" },
    { Supply: XDMKQ_SUPPLY.火箭筒, Grade: XDMKQ_SUPPLY_GRADE.GRADE5, Amplification: XDMKQ_AMPLIFICATION.换弹时间, Value: -0.4, Tips1: "火箭筒*换弹时间", Tips2: "火箭筒换弹时间-40%" },
    { Supply: XDMKQ_SUPPLY.火箭筒, Grade: XDMKQ_SUPPLY_GRADE.GRADE5, Amplification: XDMKQ_AMPLIFICATION.弹药上限, Value: 0.4, Tips1: "火箭筒*弹药上限", Tips2: "火箭筒弹药上限+40%" },


    { Supply: XDMKQ_SUPPLY.投掷物, Grade: XDMKQ_SUPPLY_GRADE.GRADE1, Amplification: XDMKQ_AMPLIFICATION.伤害, Value: 0.1, Tips1: "投掷物*伤害", Tips2: "投掷物伤害+10%" },
    { Supply: XDMKQ_SUPPLY.投掷物, Grade: XDMKQ_SUPPLY_GRADE.GRADE1, Amplification: XDMKQ_AMPLIFICATION.换弹时间, Value: -0.1, Tips1: "投掷物*换弹时间", Tips2: "投掷物换弹时间-10%" },

    { Supply: XDMKQ_SUPPLY.投掷物, Grade: XDMKQ_SUPPLY_GRADE.GRADE2, Amplification: XDMKQ_AMPLIFICATION.伤害, Value: 0.15, Tips1: "投掷物*伤害", Tips2: "投掷物伤害+15%" },
    { Supply: XDMKQ_SUPPLY.投掷物, Grade: XDMKQ_SUPPLY_GRADE.GRADE2, Amplification: XDMKQ_AMPLIFICATION.换弹时间, Value: -0.15, Tips1: "投掷物*换弹时间", Tips2: "投掷物换弹时间-15%" },

    { Supply: XDMKQ_SUPPLY.投掷物, Grade: XDMKQ_SUPPLY_GRADE.GRADE3, Amplification: XDMKQ_AMPLIFICATION.伤害, Value: 0.2, Tips1: "投掷物*伤害", Tips2: "投掷物伤害+20%" },
    { Supply: XDMKQ_SUPPLY.投掷物, Grade: XDMKQ_SUPPLY_GRADE.GRADE3, Amplification: XDMKQ_AMPLIFICATION.换弹时间, Value: -0.20, Tips1: "投掷物*换弹时间", Tips2: "投掷物换弹时间-20%" },

    { Supply: XDMKQ_SUPPLY.投掷物, Grade: XDMKQ_SUPPLY_GRADE.GRADE4, Amplification: XDMKQ_AMPLIFICATION.伤害, Value: 0.3, Tips1: "投掷物*伤害", Tips2: "投掷物伤害+30%" },
    { Supply: XDMKQ_SUPPLY.投掷物, Grade: XDMKQ_SUPPLY_GRADE.GRADE4, Amplification: XDMKQ_AMPLIFICATION.换弹时间, Value: -0.3, Tips1: "投掷物*换弹时间", Tips2: "投掷物换弹时间-30%" },

    { Supply: XDMKQ_SUPPLY.投掷物, Grade: XDMKQ_SUPPLY_GRADE.GRADE5, Amplification: XDMKQ_AMPLIFICATION.伤害, Value: 0.4, Tips1: "投掷物*伤害", Tips2: "投掷物伤害+40%" },
    { Supply: XDMKQ_SUPPLY.投掷物, Grade: XDMKQ_SUPPLY_GRADE.GRADE5, Amplification: XDMKQ_AMPLIFICATION.换弹时间, Value: -0.4, Tips1: "投掷物*换弹时间", Tips2: "投掷物弹时间-40%" },


    { Supply: XDMKQ_SUPPLY.防空炮, Grade: XDMKQ_SUPPLY_GRADE.GRADE1, Amplification: XDMKQ_AMPLIFICATION.伤害, Value: 0.1, Tips1: "防空炮*伤害", Tips2: "防空炮伤害+10%" },
    { Supply: XDMKQ_SUPPLY.防空炮, Grade: XDMKQ_SUPPLY_GRADE.GRADE2, Amplification: XDMKQ_AMPLIFICATION.伤害, Value: 0.15, Tips1: "防空炮*伤害", Tips2: "防空炮伤害+15%" },
    { Supply: XDMKQ_SUPPLY.防空炮, Grade: XDMKQ_SUPPLY_GRADE.GRADE3, Amplification: XDMKQ_AMPLIFICATION.伤害, Value: 0.2, Tips1: "防空炮*伤害", Tips2: "防空炮伤害+20%" },
    { Supply: XDMKQ_SUPPLY.防空炮, Grade: XDMKQ_SUPPLY_GRADE.GRADE4, Amplification: XDMKQ_AMPLIFICATION.伤害, Value: 0.3, Tips1: "防空炮*伤害", Tips2: "防空炮伤害+30%" },
    { Supply: XDMKQ_SUPPLY.防空炮, Grade: XDMKQ_SUPPLY_GRADE.GRADE5, Amplification: XDMKQ_AMPLIFICATION.伤害, Value: 0.4, Tips1: "防空炮*伤害", Tips2: "防空炮伤害+40%" },

    { Supply: XDMKQ_SUPPLY.生命值, Grade: XDMKQ_SUPPLY_GRADE.GRADE1, Amplification: XDMKQ_AMPLIFICATION.生命值, Value: 0.1, Tips1: "生命值", Tips2: "玩家生命值+10%" },
    { Supply: XDMKQ_SUPPLY.生命值, Grade: XDMKQ_SUPPLY_GRADE.GRADE2, Amplification: XDMKQ_AMPLIFICATION.生命值, Value: 0.2, Tips1: "生命值", Tips2: "玩家生命值+20%" },
    { Supply: XDMKQ_SUPPLY.生命值, Grade: XDMKQ_SUPPLY_GRADE.GRADE3, Amplification: XDMKQ_AMPLIFICATION.生命值, Value: 0.3, Tips1: "生命值", Tips2: "玩家生命值+30%" },
    { Supply: XDMKQ_SUPPLY.生命值, Grade: XDMKQ_SUPPLY_GRADE.GRADE4, Amplification: XDMKQ_AMPLIFICATION.生命值, Value: 0.4, Tips1: "生命值", Tips2: "玩家生命值+40%" },
    { Supply: XDMKQ_SUPPLY.生命值, Grade: XDMKQ_SUPPLY_GRADE.GRADE5, Amplification: XDMKQ_AMPLIFICATION.生命值, Value: 0, Tips1: "生命值", Tips2: "小队+1人" },

]

/**武器动画 */
export type XDMKQ_WEAPON_ANI = { IsWeaponAni: boolean, LayDown: string, TakeUp: string, Fire: string, FireOnce: string, Fires: string, Reload: string, Aim: string, AimEnd: string };

export const XDMKQ_WEAPON_ANIS: Map<XDMKQ_WEAPON, XDMKQ_WEAPON_ANI> = new Map([
    [XDMKQ_WEAPON.手雷, { IsWeaponAni: false, LayDown: "LayDown_SL", TakeUp: "TakeUp_SL", Fire: "Throw_SL", FireOnce: "", Fires: "", Reload: "Reload_SL", Aim: "", AimEnd: "" }],
    [XDMKQ_WEAPON.燃烧弹, { IsWeaponAni: false, LayDown: "LayDown_RSP", TakeUp: "TakeUp_RSP", Fire: "Throw_RSP", FireOnce: "", Fires: "", Reload: "Reload_RSP", Aim: "", AimEnd: "" }],
    [XDMKQ_WEAPON.RPG, { IsWeaponAni: true, LayDown: "LayDown_RPG", TakeUp: "TakeUp_RPG", Fire: "Fire_RPG", FireOnce: "", Fires: "", Reload: "Reload_RPG", Aim: "", AimEnd: "" }],
    [XDMKQ_WEAPON.步枪, { IsWeaponAni: true, LayDown: "LayDown_98K", TakeUp: "TakeUp_98K", Fire: "Fire_98K", FireOnce: "", Fires: "", Reload: "Reload_98K", Aim: "Aim_98K", AimEnd: "AimEnd_98K" }],
    [XDMKQ_WEAPON.汤姆逊, { IsWeaponAni: true, LayDown: "LayDown_TMX", TakeUp: "TakeUp_TMX", Fire: "", FireOnce: "FireOnce_TMX", Fires: "Fires_TMX", Reload: "Reload_TMX", Aim: "", AimEnd: "" }],
    [XDMKQ_WEAPON.轻机枪, { IsWeaponAni: true, LayDown: "LayDown_JQ", TakeUp: "TakeUp_JQ", Fire: "", FireOnce: "FireOnce_JQ", Fires: "Fires_JQ", Reload: "Reload_JQ", Aim: "", AimEnd: "" }],
    [XDMKQ_WEAPON.炮台, { IsWeaponAni: true, LayDown: "", TakeUp: "", Fire: "", FireOnce: "FireOnce_PT", Fires: "Fires_PT", Reload: "", Aim: "", AimEnd: "" }],
])

export class XDMKQ_BULLET {
    CurBullet: number;
    ReduceBullet: number;
    MagazineCapacity: number;
    constructor(CurBullet: number, ReduceBullet: number, MagazineCapacity: number) {
        this.CurBullet = CurBullet;
        this.ReduceBullet = ReduceBullet;
        this.MagazineCapacity = MagazineCapacity;
    }
};

export const XDMKQ_BULLET_CONFIG: Map<XDMKQ_WEAPON, XDMKQ_BULLET> = new Map([
    [XDMKQ_WEAPON.步枪, { CurBullet: 5, ReduceBullet: 10, MagazineCapacity: 5 }],
    [XDMKQ_WEAPON.汤姆逊, { CurBullet: 32, ReduceBullet: 64, MagazineCapacity: 32 }],
    [XDMKQ_WEAPON.轻机枪, { CurBullet: 100, ReduceBullet: 200, MagazineCapacity: 100 }],
    [XDMKQ_WEAPON.手雷, { CurBullet: 3, ReduceBullet: 0, MagazineCapacity: 3 }],
    [XDMKQ_WEAPON.燃烧弹, { CurBullet: 6, ReduceBullet: 0, MagazineCapacity: 6 }],
    [XDMKQ_WEAPON.RPG, { CurBullet: 1, ReduceBullet: 2, MagazineCapacity: 1 }],
    [XDMKQ_WEAPON.炮台, { CurBullet: 300, ReduceBullet: 0, MagazineCapacity: 300 }],
    [XDMKQ_WEAPON.轰炸, { CurBullet: 1, ReduceBullet: 0, MagazineCapacity: 1 }]
])

export class XDMKQ_WAVE {
    Enemy: number;
    Car: number;
    Plane: number;
    MaxCount: number;
    Duration: number;
    constructor(Enemy: number, Car: number, Plane: number, MaxCount: number, Duration: number) {
        this.Enemy = Enemy;
        this.Car = Car;
        this.Plane = Plane;
        this.MaxCount = MaxCount;
        this.Duration = Duration;
    }
};

export const XDMKQ_WAVE_CONFIG: Map<XDMKQ_MAP, XDMKQ_WAVE[]> = new Map([
    [XDMKQ_MAP.县城, [
        { Enemy: 15, Car: 0, Plane: 0, MaxCount: 3, Duration: 5 },
        { Enemy: 19, Car: 1, Plane: 0, MaxCount: 9, Duration: 5 },
        { Enemy: 25, Car: 2, Plane: 0, MaxCount: 6, Duration: 5 },
        { Enemy: 27, Car: 3, Plane: 0, MaxCount: 7, Duration: 7 },
        { Enemy: 33, Car: 3, Plane: 1, MaxCount: 5, Duration: 6 },
        { Enemy: 40, Car: 4, Plane: 1, MaxCount: 7, Duration: 6 },
        { Enemy: 50, Car: 4, Plane: 1, MaxCount: 9, Duration: 8 },
        { Enemy: 55, Car: 5, Plane: 2, MaxCount: 9, Duration: 5 },
        { Enemy: 60, Car: 5, Plane: 2, MaxCount: 10, Duration: 8 },
        { Enemy: 70, Car: 5, Plane: 2, MaxCount: 8, Duration: 8 },
        { Enemy: 80, Car: 6, Plane: 3, MaxCount: 10, Duration: 10 },
        { Enemy: 90, Car: 7, Plane: 3, MaxCount: 10, Duration: 10 },
        { Enemy: 100, Car: 7, Plane: 3, MaxCount: 10, Duration: 10 },
        { Enemy: 120, Car: 8, Plane: 3, MaxCount: 10, Duration: 10 },
        { Enemy: 150, Car: 8, Plane: 3, MaxCount: 10, Duration: 10 },
        { Enemy: 170, Car: 8, Plane: 3, MaxCount: 10, Duration: 10 },
        { Enemy: 200, Car: 8, Plane: 3, MaxCount: 10, Duration: 10 },
        { Enemy: 230, Car: 8, Plane: 3, MaxCount: 10, Duration: 10 },
    ]],
    [XDMKQ_MAP.军营, [
        { Enemy: 15, Car: 0, Plane: 0, MaxCount: 3, Duration: 5 },
        { Enemy: 19, Car: 1, Plane: 0, MaxCount: 9, Duration: 5 },
        { Enemy: 25, Car: 2, Plane: 0, MaxCount: 6, Duration: 5 },
        { Enemy: 27, Car: 3, Plane: 0, MaxCount: 7, Duration: 7 },
        { Enemy: 33, Car: 3, Plane: 1, MaxCount: 5, Duration: 6 },
        { Enemy: 40, Car: 4, Plane: 1, MaxCount: 7, Duration: 6 },
        { Enemy: 50, Car: 4, Plane: 1, MaxCount: 9, Duration: 8 },
        { Enemy: 55, Car: 5, Plane: 2, MaxCount: 9, Duration: 5 },
        { Enemy: 60, Car: 5, Plane: 2, MaxCount: 10, Duration: 8 },
        { Enemy: 70, Car: 5, Plane: 2, MaxCount: 8, Duration: 8 },
        { Enemy: 80, Car: 6, Plane: 3, MaxCount: 10, Duration: 10 },
        { Enemy: 90, Car: 7, Plane: 3, MaxCount: 10, Duration: 10 },
        { Enemy: 100, Car: 7, Plane: 3, MaxCount: 10, Duration: 10 },
        { Enemy: 120, Car: 8, Plane: 3, MaxCount: 10, Duration: 10 },
        { Enemy: 150, Car: 8, Plane: 3, MaxCount: 10, Duration: 10 },
        { Enemy: 170, Car: 8, Plane: 3, MaxCount: 10, Duration: 10 },
        { Enemy: 200, Car: 8, Plane: 3, MaxCount: 10, Duration: 10 },
        { Enemy: 230, Car: 8, Plane: 3, MaxCount: 10, Duration: 10 },
    ]],
    [XDMKQ_MAP.前线, [
        { Enemy: 15, Car: 0, Plane: 0, MaxCount: 3, Duration: 5 },
        { Enemy: 19, Car: 1, Plane: 0, MaxCount: 9, Duration: 5 },
        { Enemy: 25, Car: 2, Plane: 0, MaxCount: 6, Duration: 5 },
        { Enemy: 27, Car: 3, Plane: 0, MaxCount: 7, Duration: 7 },
        { Enemy: 33, Car: 3, Plane: 1, MaxCount: 5, Duration: 6 },
        { Enemy: 40, Car: 4, Plane: 1, MaxCount: 7, Duration: 6 },
        { Enemy: 50, Car: 4, Plane: 1, MaxCount: 9, Duration: 8 },
        { Enemy: 55, Car: 5, Plane: 2, MaxCount: 9, Duration: 5 },
        { Enemy: 60, Car: 5, Plane: 2, MaxCount: 10, Duration: 8 },
        { Enemy: 70, Car: 5, Plane: 2, MaxCount: 8, Duration: 8 },
        { Enemy: 80, Car: 6, Plane: 3, MaxCount: 10, Duration: 10 },
        { Enemy: 90, Car: 7, Plane: 3, MaxCount: 10, Duration: 10 },
        { Enemy: 100, Car: 7, Plane: 3, MaxCount: 10, Duration: 10 },
        { Enemy: 120, Car: 8, Plane: 3, MaxCount: 10, Duration: 10 },
        { Enemy: 150, Car: 8, Plane: 3, MaxCount: 10, Duration: 10 },
        { Enemy: 170, Car: 8, Plane: 3, MaxCount: 10, Duration: 10 },
        { Enemy: 200, Car: 8, Plane: 3, MaxCount: 10, Duration: 10 },
        { Enemy: 230, Car: 8, Plane: 3, MaxCount: 10, Duration: 10 },
    ]],
    [XDMKQ_MAP.孤城, [
        { Enemy: 15, Car: 0, Plane: 0, MaxCount: 3, Duration: 5 },
        { Enemy: 19, Car: 1, Plane: 0, MaxCount: 9, Duration: 5 },
        { Enemy: 25, Car: 2, Plane: 0, MaxCount: 6, Duration: 5 },
        { Enemy: 27, Car: 3, Plane: 0, MaxCount: 7, Duration: 7 },
        { Enemy: 33, Car: 3, Plane: 1, MaxCount: 5, Duration: 6 },
        { Enemy: 40, Car: 4, Plane: 1, MaxCount: 7, Duration: 6 },
        { Enemy: 50, Car: 4, Plane: 1, MaxCount: 9, Duration: 8 },
        { Enemy: 55, Car: 5, Plane: 2, MaxCount: 9, Duration: 5 },
        { Enemy: 60, Car: 5, Plane: 2, MaxCount: 10, Duration: 8 },
        { Enemy: 70, Car: 5, Plane: 2, MaxCount: 8, Duration: 8 },
        { Enemy: 80, Car: 6, Plane: 3, MaxCount: 10, Duration: 10 },
        { Enemy: 90, Car: 7, Plane: 3, MaxCount: 10, Duration: 10 },
        { Enemy: 100, Car: 7, Plane: 3, MaxCount: 10, Duration: 10 },
        { Enemy: 120, Car: 8, Plane: 3, MaxCount: 10, Duration: 10 },
        { Enemy: 150, Car: 8, Plane: 3, MaxCount: 10, Duration: 10 },
        { Enemy: 170, Car: 8, Plane: 3, MaxCount: 10, Duration: 10 },
        { Enemy: 200, Car: 8, Plane: 3, MaxCount: 10, Duration: 10 },
        { Enemy: 230, Car: 8, Plane: 3, MaxCount: 10, Duration: 10 },
    ]],
])

export type XDMKQ_PARACARGO = { Type: XDMKQ_WEAPON, MinCount: number, MaxCount: number };

export const XDMKQ_PARACARGO_CONFIG: XDMKQ_PARACARGO[] = [
    { Type: XDMKQ_WEAPON.步枪, MinCount: 15, MaxCount: 50 },
    { Type: XDMKQ_WEAPON.汤姆逊, MinCount: 35, MaxCount: 300 },
    { Type: XDMKQ_WEAPON.轻机枪, MinCount: 200, MaxCount: 600 },
    { Type: XDMKQ_WEAPON.手雷, MinCount: 3, MaxCount: 10 },
    { Type: XDMKQ_WEAPON.燃烧弹, MinCount: 3, MaxCount: 10 },
    { Type: XDMKQ_WEAPON.RPG, MinCount: 3, MaxCount: 10 },
    { Type: XDMKQ_WEAPON.金币, MinCount: 300, MaxCount: 1000 },
]

export const XDMKQ_WEAPON_HARM_CONFIG: Map<XDMKQ_WEAPON, number> = new Map([
    [XDMKQ_WEAPON.步枪, 100],
    [XDMKQ_WEAPON.汤姆逊, 50],
    [XDMKQ_WEAPON.轻机枪, 34],
    [XDMKQ_WEAPON.手雷, 300],
    [XDMKQ_WEAPON.燃烧弹, 150],
    [XDMKQ_WEAPON.RPG, 300],
    [XDMKQ_WEAPON.炮台, 80],
])

export enum XDMKQ_AUDIO {
    BGM1 = "BG1",
    BGM2 = "BG2",
    点击 = "点击",
    FIre_98K = "98K",
    FIre_QJQ = "QJQ",
    FIre_RPG = "RPG",
    RSP = "RSP",
    SL = "SL",
    FIre_TMX = "TMX",
    FIre_PT = "PT",
    扔 = "扔",
    敌人死亡1 = "敌人死亡1",
    敌人死亡2 = "敌人死亡2",
    没子弹 = "没子弹",
    玩家中枪 = "玩家中枪",
    空投出现 = "空投出现",
    空投击落 = "空投击落",
    轰炸 = "轰炸",
    飞机出场 = "飞机出场",
    飞机开枪 = "飞机开枪",
    飞机飞行 = "飞机飞行",
    Reload_98K = "Reload_98K",
    Reload_QJQ = "Reload_QJQ",
    Reload_TMX = "Reload_TMX",
}

