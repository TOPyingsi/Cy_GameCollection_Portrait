import { _decorator, Component, Node } from 'cc';
import { TJ_GameManager } from './TJ_GameManager';
const { ccclass, property } = _decorator;

@ccclass('TJ_Check')
export class TJ_Check extends Component {

    public static instance: TJ_Check = null;

    combinations: Map<string, string[]> = new Map([
        ["仙人掌大象", ["仙人掌", "大象", "拖鞋"]],
        ["仙人掌骆驼", ["仙人掌", "骆驼", "胡子"]],
        ["土拨鼠枪手", ["雪茄", "枪", "土拨鼠"]],
        ["土星牛", ["奶牛", "土星", "脚"]],
        ["橙子长颈鹿", ["橙子", "长颈鹿", "胡子"]],
        ["西瓜长颈鹿", ["西瓜", "长颈鹿", "太空头"]],
        ["罐子兄弟", ["玻璃瓶", "罐子", "脚"]],
        ["长靴钢琴马", ["靴子", "钢琴", "小马"]],
        ["鸽子侦探", ["鸽子", "礼帽", "相机"]],
        ["鳄鱼轰炸机", ["鳄鱼", "飞机", "炸弹"]],
        ["大鹅轰炸机", ["大鹅", "飞机", "炸弹"]],

        ["冰箱骆驼", ["冰箱", "骆驼"]],
        ["大鼻猴", ["鼻子", "猴子"]],
        ["柠檬鹦鹉", ["鹦鹉", "柠檬"]],
        ["橘子老虎", ["橘子", "老虎"]],
        ["泡面马桶", ["意大利面", "马桶"]],
        ["炸弹猪", ["小猪", "炸弹"]],
        ["熊鱼", ["玩具熊", "鱼"]],
        ["犀牛面包机", ["犀牛", "面包机"]],
        ["虾猫", ["猫咪", "虾"]],
        ["西瓜斑马", ["西瓜", "斑马"]],
        ["西瓜老虎", ["西瓜", "老虎"]],
        ["西瓜鳄鱼", ["西瓜", "鳄鱼"]],
        ["耐克鲨鱼", ["鞋子", "鲨鱼"]],
        ["菠萝猴子", ["菠萝", "猴子"]],
        ["蓝莓章鱼", ["蓝莓", "章鱼"]],
        ["轮胎青蛙", ["青蛙", "轮胎"]],
        ["咖啡小姐", ["靴子", "咖啡"]],
        ["香蕉大象", ["香蕉", "大象"]],
        ["香蕉猴", ["香蕉", "猴子"]],
        ["机甲老鼠", ["机甲", "老鼠"]],
    ]);

    protected onLoad(): void {
        TJ_Check.instance = this;
    }

    check() {
        const currentRoleName = TJ_GameManager.instance.currentRole.name;
        const requiredProps = this.combinations.get(currentRoleName);

        if (!requiredProps) {
            console.error("No combination rule for role:", currentRoleName);
            return false;
        }

        const selectedProps = TJ_GameManager.instance.props.map(prop => prop.name);

        // 检查 selectedProps 是否包含所有 requiredProps
        return requiredProps.every(requiredProp => selectedProps.includes(requiredProp));
    }
}


