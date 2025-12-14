import { _decorator, Component, error, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('NDPA_GameUtil')
export class NDPA_GameUtil extends Component {
    public static formatNumber(num: number): string {
        num = Math.floor(num);
        if (Math.abs(num) >= 1e15) {
            return `999T`;
        } else if (Math.abs(num) >= 1e12) {
            const value = num / 1e12;
            return value >= 100 ? `${value.toFixed(0)}T` : value >= 10 ? `${value.toFixed(1)}T` : `${value.toFixed(2)}T`;
        } else if (Math.abs(num) >= 1e9) {
            const value = num / 1e9;
            return value >= 100 ? `${value.toFixed(0)}B` : value >= 10 ? `${value.toFixed(1)}B` : `${value.toFixed(2)}B`;
        } else if (Math.abs(num) >= 1e6) {
            const value = num / 1e6;
            return value >= 100 ? `${value.toFixed(0)}M` : value >= 10 ? `${value.toFixed(1)}M` : `${value.toFixed(2)}M`;
        } else if (Math.abs(num) >= 1e3) {
            const value = num / 1e3;
            return value >= 100 ? `${value.toFixed(0)}K` : value >= 10 ? `${value.toFixed(1)}K` : `${value.toFixed(2)}K`;
        } else {
            return num.toString();
        }
    }

    public static getBetween(num: number, min: number, max: number): number {
        if (num >= max) {
            return max;
        } else if (num <= min) {
            return min;
        } else {
            return num;
        }
    }

    /** 
     * 获取时间戳到现在时间的秒
    */
    public static getSecondByTimestamp(preTimestamp) {
        let nowDate = new Date();
        return Math.floor((nowDate.getTime() - preTimestamp) / 1000);
    }

    /**
     * 
     * @param startNode 
     * @param endNode 
     * @returns 获取两个节点之间的距离
     */
    public static getDistanceByNode(startNode: Node, endNode: Node) {
        return startNode.getWorldPosition().clone().subtract(endNode.getWorldPosition().clone()).length();
    }

    /** 获取枚举的临近属性 --- 可以从最后一个到第一个 */
    public static getAdjacentEnumCirculation<T>(
        enumObject: T,
        current: T[keyof T],
        next: boolean = true
    ): T[keyof T] {
        const enumKeys = Object.keys(enumObject).filter(k => isNaN(Number(k)));
        const currentKey = enumKeys.find(k => enumObject[k] === current);

        if (!currentKey) {
            throw new Error('Current value not found in enum');
        }

        const index = enumKeys.indexOf(currentKey);
        const adjacentIndex = (index + (next ? 1 : -1) + enumKeys.length) % enumKeys.length;
        const adjacentKey = enumKeys[adjacentIndex];

        return enumObject[adjacentKey] as T[keyof T];
    }


    /** 获取数组的临近属性 */
    public static getAdjacentElement<T>(
        arr: T[],
        current: T,
        next: boolean = true
    ): T | undefined {
        const index = arr.indexOf(current);
        if (index === -1) {
            console.error('Current element not found in array');
            return undefined;
        }

        const adjacentIndex = index + (next ? 1 : -1);

        if (adjacentIndex >= 0 && adjacentIndex < arr.length) {
            return arr[adjacentIndex];
        }
        return undefined;
    }

    // 通用数组打乱函数
    public static shuffle<T>(array: T[]): T[] {
        // 创建数组副本，避免修改原数组
        const shuffled = [...array];
        // Fisher-Yates 洗牌算法
        for (let i = shuffled.length - 1; i > 0; i--) {
            // 生成随机索引
            const j = Math.floor(Math.random() * (i + 1));
            // 交换元素
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    /** 根据枚举值找key*/
    public static GetEnumKeyByValue(enumObj: any, value: any): string | undefined {
        // 遍历枚举对象的键和值
        for (let key in enumObj) {
            if (enumObj[key] === value) {
                return key;
            }
        }
        return undefined; // 如果没有找到匹配的值，返回undefined
    }

    /** 返回一个范围在 [min, max) 的整数*/
    public static GetRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    /**
 * 获取allArr数组中不包含haveArr数组中元素集合的第num个元素
 * @param allArr 全部的数组
 * @param haveArr 已经拥有的数组
 * @param num 第几个
 */
    public static getNonIntersectForNumber(allArr: any[], haveArr: any[], num: number): any | null {
        for (let i = 0; i < allArr.length; i++) {
            if (!haveArr.find(e => e === allArr[i]) && haveArr.find(e => e === allArr[i]) != 0) {
                num--;
                if (num == 0) {
                    return allArr[i];
                }
            }
        }
        return null;
    }


}


