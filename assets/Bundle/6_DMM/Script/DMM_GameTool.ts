import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('DMM_GameTool')
export class DMM_GameTool {

    /*** 获取随机数*/
    public static GetRandom(min: number, max: number) {
        let r: number = Math.random();
        let rr: number = r * (max - min) + min;
        return rr;
    }

    /*** 获取数组中随机一个元素*/
    public static GetRandomItemFromArray(arr: any[]) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    /**
 * 从arr中获取m个元素 要求m小于arr的长度
 * @param m 
 * @param arr 
 */
    public static GetRandomMFromArr(m: number, arr: any[]): null | any[] {
        if (arr.length < m) return null;
        let result: any[] = [];
        while (result.length < m) {
            const value = DMM_GameTool.GetRandomItemFromArray(arr);
            if (result.indexOf(value) == -1) {
                result.push(value);
            }
        }
        return result;
    }

    public static shuffleArray<T>(array: T[]): T[] {
        // 创建数组的副本，避免修改原数组
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            // 生成随机索引
            const j = Math.floor(Math.random() * (i + 1));

            // 交换元素
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }

        return newArray;
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

    /** 返回一个范围在 [min, max] 的整数*/
    public static GetRandomIntWithMax(min: number, max: number) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }


}


