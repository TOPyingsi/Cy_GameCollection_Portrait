export enum NDPA_GROUP {
    Default = 1 << 0,
    CLICKABLE = 1 << 10,
    BADBALL = 1 << 11,
    FLOOR = 1 << 12,
}

export enum NDPA_PROPTYPE {
    TIPS,
    NEXT,
}

/**
 *  @param GOLD 奖励是金币类型的
 *  @param CAP 奖励是帽子类型的
 */
export enum NDPA_TREASUREBOX {
    GOLD,
    CAP,
}

/**
 *  @param MUSIC 声音按钮
 *  @param SHAKE 震动按钮
 */
export enum NDPA_BUTTON {
    MUSIC,
    SHAKE,
}

/**
 *  @param SET 设置弹窗弹出方式
 *  @param SHOP 商店弹出方式
 */
export enum NDPA_TRANSITION {
    SET,
    SHOP,
}

/**
 *  商品编号
 */
export enum NDPA_NUMBER {
    NUMBER0,
    NUMBER1,
    NUMBER2,
    NUMBER3,
    NUMBER4,
    NUMBER5,
    NUMBER6,
    NUMBER7,
    NUMBER8,
    NUMBER9,
    NUMBER10,
    NUMBER11,
    NUMBER12,
    NUMBER13,
    NUMBER14,
}

/**
 *  商品编号
 */
export enum NDPA_DW {
    null,
    狗熊,
    熊猫,
    狮子,
    猪,
    长颈鹿,
}

export const NDPA_MZNums = [NDPA_NUMBER.NUMBER2, NDPA_NUMBER.NUMBER3, NDPA_NUMBER.NUMBER4, NDPA_NUMBER.NUMBER5, NDPA_NUMBER.NUMBER6, NDPA_NUMBER.NUMBER7, NDPA_NUMBER.NUMBER8, NDPA_NUMBER.NUMBER9, NDPA_NUMBER.NUMBER10, NDPA_NUMBER.NUMBER11, NDPA_NUMBER.NUMBER12, NDPA_NUMBER.NUMBER13, NDPA_NUMBER.NUMBER14];

/**
 *  胜利--失败
 */
export enum NDPA_GAME {
    PASS = "成功表情",
    FAIL = "失败表情",
}

/**
 *  提示的顺序
 */
export enum NDPA_TIPSORDER {
    ORDER1,
    ORDER2,
    ORDER3,
    ORDER4,
    ORDER5,
    ORDER6,
    ORDER7,
    ORDER8,
    ORDER9,
    ORDER10,
    ORDER11,
    ORDER12,
    ORDER13,
    EXIT = 99,
}
/**
 *  提示的顺序
 */
export enum NDPA_LV {
    LV1,
    LV2,
    LV3,
    LV4,
    LV5,
    LV6,
    LV7,
    LV8,
    LV9,
    LV10,
    LV11,
    LV12,
    LV13,
    LV14,
    LV15,
    LV16,
    LV17,
    LV18,
    LV19,
    LV20,
    LV21,
    LV22,
    LV23,
    LV24,
    LV25,
    LV26,
    LV27,
    LV28,
    LV29,
    LV30,
    LV31,
    LV32,
    LV33,
    LV34,
    LV35,
    LV36,
    LV37,
    LV38,
    LV39,
    LV40,
    LV41,
    LV42,
    LV43,
}

