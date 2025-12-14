import { _decorator, Component, instantiate, Node, Prefab, Sprite, SpriteFrame } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('SHJXXB_RoleMgr')
export class SHJXXB_RoleMgr extends Component {

    @property([SpriteFrame])
    roleImg: SpriteFrame[] = [];

    @property(Prefab)
    roleP: Prefab;

    //保存随机后的数组
    private randomArr: SpriteFrame[];

    protected onLoad(): void {

        this.randomArr = this.getRandomElements(this.roleImg);
        
        for (let i = 0; i < 16 ; i++) {
            
            let roleN: Node = instantiate(this.roleP);
            roleN.getChildByName("role").getComponent(Sprite).spriteFrame = this.randomArr[i];
            // console.log(roleN.getComponent(Sprite).spriteFrame.name);
            
            roleN.name = roleN.getChildByName("role").getComponent(Sprite).spriteFrame.name;
            this.node.addChild(roleN);

        }

    }


    getRandomElements<T>(array: T[]): T[] {
        // 创建原数组的浅拷贝（避免修改原数组）
        const shuffled = [...array];
        let currentIndex = shuffled.length;

        // Fisher-Yates 洗牌算法
        while (currentIndex > 0) {
            // 随机生成一个 [0, currentIndex) 的整数
            const randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            // 交换当前位置和随机位置的元素
            [shuffled[currentIndex], shuffled[randomIndex]] = [
                shuffled[randomIndex],
                shuffled[currentIndex],
            ];
        }

        return shuffled;
    }


}


