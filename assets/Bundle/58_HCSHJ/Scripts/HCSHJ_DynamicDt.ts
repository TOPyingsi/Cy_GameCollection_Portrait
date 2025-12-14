import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('HCSHJ_DynamicDt')
export class HCSHJ_DynamicDt extends Component {
    private static _instance: HCSHJ_DynamicDt = null;

    public static get Instance(): HCSHJ_DynamicDt {
        return this._instance;
    }

    protected onLoad(): void {
        HCSHJ_DynamicDt._instance = this;
    }

    //保存点击按钮次数，上限是9；
    public progress: number = 0;


    //保存每个按钮的点击次数
    public obj: Object = {
        "0": 0,
        "1": 0,
        "2": 0,
        "3": 0,
        "4": 0,
        "5": 0,
        "6": 0,
        "7": 0
    }

    //保存角色的索引
    public roleID:number;
 
    public findMaxProperty(obj:Object): string{
        let maxValue = -Infinity;  // 初始化为最小可能值
        let maxKeys: string[] = []; // 存储所有最大值对应的属性名

        // 遍历对象的每一个键值对
        for (let  [key, value] of Object.entries(obj)) {
            if (value > maxValue) {
                // 发现更大的值：重置最大值并更新候选列表
                maxValue = value;
                maxKeys = [key];
            } else if (value === maxValue) {
                // 遇到相同最大值：将属性加入候选列表
                maxKeys.push(key);
            }
        }
        // 随机选择
        let randomIndex = Math.floor(Math.random() * maxKeys.length);
        return maxKeys[randomIndex];
    }


    public getroleId():number{
        let id:number = Number(HCSHJ_DynamicDt.Instance.findMaxProperty(HCSHJ_DynamicDt.Instance.obj));
        return id;
    }
}


