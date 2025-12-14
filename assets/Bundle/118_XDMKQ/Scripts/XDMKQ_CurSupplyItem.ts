import { _decorator, Component, find, Label, Node, Sprite, SpriteFrame } from 'cc';
import { XDMKQ_SUPPLY, XDMKQ_SUPPLY_ITEM } from './XDMKQ_Constant';
const { ccclass, property } = _decorator;

@ccclass('XDMKQ_CurSupplyItem')
export class XDMKQ_CurSupplyItem extends Component {

    @property(SpriteFrame)
    SupplySps: SpriteFrame[] = [];

    SupplyIcon: Sprite = null;
    SupplyType: Label = null;
    Stars: Node[] = [];

    CurCount: number = 0;
    Name: string = "";

    protected onLoad(): void {
        this.SupplyIcon = find("SupplyIcon", this.node).getComponent(Sprite);
        this.SupplyType = find("SupplyType", this.node).getComponent(Label);
        this.Stars = find("Stars", this.node).children;
    }

    Init(supply: XDMKQ_SUPPLY_ITEM) {
        this.CurCount = 1;
        this.Name = this.getEnumKeyByValue(XDMKQ_SUPPLY, supply.Supply);
        this.SupplyIcon.spriteFrame = this.SupplySps[supply.Supply];
        this.SupplyType.string = this.Name + " + " + this.CurCount;
        this.ShowStars();
    }

    ShowStars() {
        for (let i = 0; i < this.Stars.length; i++) {
            this.Stars[i].active = i < this.CurCount;
        }
    }

    AddCount() {
        this.CurCount++;
        this.SupplyType.string = this.Name + " + " + this.CurCount;
        this.ShowStars();
    }

    /** 根据枚举值找key*/
    private getEnumKeyByValue(enumObj: any, value: any): string | undefined {
        // 遍历枚举对象的键和值
        for (let key in enumObj) {
            if (enumObj[key] === value) {
                return key;
            }
        }
        return undefined; // 如果没有找到匹配的值，返回undefined
    }

}


