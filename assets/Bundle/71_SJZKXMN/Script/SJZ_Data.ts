import { Color, Vec2 } from "cc";

export class SJZ_ItemData {
    constructor(public Name: string, public Quality: SJZ_Quality, private size: Vec2) {
        this.Size = { width: size.x, height: size.y };
    }

    /** 所在背包二维数组的位置 */
    Point: { x, y } = { x: 0, y: 0 };

    /** 格子大小 */
    Size: { width, height } = { width: 0, height: 0 };
}

export enum SJZ_Quality {
    None,// 没有品质
    Common,// 普通（Common）
    Uncommon,// 优秀（Uncommon）
    Rare,// 稀有（Rare）
    Superior,// 精良（Superior）
    Legendary,// 传说（Legendary）
    Mythic,// 神话（Mythic）
}

export enum SJZ_QualityColorHex {
    None = "#FFFFFF00",// 透明
    Common = "#FFFFFF3C",// 普通（Common）：白色
    Uncommon = "#2FA1703C",// 优秀（Uncommon）：绿色
    Rare = "#276ABF3C",// 稀有（Rare）：蓝色
    Superior = "#7430B93C",// 精良（Superior）：紫色
    Legendary = "#E09A1A3C",// 传说（Legendary）：金色
    Mythic = "#F03A393C",// 神话（Mythic）：红色
}