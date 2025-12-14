import { _decorator, Color, Component, Label, Node, Sprite, SpriteFrame, tween, UITransform, v2, v3, Vec2, Vec3, Widget } from 'cc';
import NodeUtil from 'db://assets/Scripts/Framework/Utils/NodeUtil';
import { SJZ_ItemData, SJZ_Quality, SJZ_QualityColorHex } from './SJZ_Data';
import { SJZ_GameManager } from './SJZ_GameManager';
const { ccclass, property } = _decorator;

@ccclass('SJZ_PropCtrl')
export class SJZ_PropCtrl extends Component {

    @property(Sprite) propIcon: Sprite = null;
    @property(Label) propName: Label = null;
    @property(Node) searchIcon: Node = null;
    @property(Node) BG: Node = null;

    static blueColor: Color = new Color(101, 139, 206, 200);
    static purpleColor: Color = new Color(155, 97, 200, 200);
    static goldColor: Color = new Color(232, 166, 78, 200);
    static redColor: Color = new Color(203, 70, 74, 200);

    static propInfo: Map<string, { quality: SJZ_Quality, size: Vec2 }> = new Map([
        ["U盘", { quality: SJZ_Quality.Rare, size: v2(1, 1) }],
        ["起舞的女郎", { quality: SJZ_Quality.Rare, size: v2(1, 2) }],
        ["额温枪", { quality: SJZ_Quality.Rare, size: v2(1, 1) }],
        ["音频播放器", { quality: SJZ_Quality.Rare, size: v2(1, 1) }],
        ["蛋白粉包", { quality: SJZ_Quality.Rare, size: v2(1, 1) }],
        ["英式袋泡茶", { quality: SJZ_Quality.Rare, size: v2(1, 1) }],
        ["维生素泡腾片", { quality: SJZ_Quality.Rare, size: v2(1, 1) }],
        ["继电器", { quality: SJZ_Quality.Rare, size: v2(1, 1) }],
        ["英式袋泡茶", { quality: SJZ_Quality.Rare, size: v2(1, 1) }],
        ["糖三角", { quality: SJZ_Quality.Rare, size: v2(1, 1) }],
        ["移动电源", { quality: SJZ_Quality.Rare, size: v2(1, 1) }],
        ["火药", { quality: SJZ_Quality.Rare, size: v2(1, 2) }],
        ["海盗银币", { quality: SJZ_Quality.Rare, size: v2(1, 1) }],
        ["海盗望远镜", { quality: SJZ_Quality.Rare, size: v2(1, 2) }],
        ["水泥", { quality: SJZ_Quality.Rare, size: v2(2, 3) }],
        ["枪械零件", { quality: SJZ_Quality.Rare, size: v2(2, 1) }],
        ["木雕烟斗", { quality: SJZ_Quality.Rare, size: v2(2, 1) }],
        ["可乐", { quality: SJZ_Quality.Rare, size: v2(1, 1) }],
        ["便携电钻", { quality: SJZ_Quality.Rare, size: v2(2, 1) }],
        ["低级燃料", { quality: SJZ_Quality.Rare, size: v2(1, 1) }],

        ["黄金饰章", { quality: SJZ_Quality.Superior, size: v2(1, 2) }],
        ["阿萨拉酒壶", { quality: SJZ_Quality.Superior, size: v2(1, 2) }],
        ["阿萨拉风情水壶", { quality: SJZ_Quality.Superior, size: v2(1, 2) }],
        ["间谍笔", { quality: SJZ_Quality.Superior, size: v2(1, 1) }],
        ["能量凝胶", { quality: SJZ_Quality.Superior, size: v2(1, 1) }],
        ["牛角", { quality: SJZ_Quality.Superior, size: v2(2, 1) }],
        ["特色提灯", { quality: SJZ_Quality.Superior, size: v2(1, 2) }],
        ["燃气喷灯", { quality: SJZ_Quality.Superior, size: v2(1, 2) }],
        ["电子干扰器", { quality: SJZ_Quality.Superior, size: v2(1, 1) }],
        ["电动车电池", { quality: SJZ_Quality.Superior, size: v2(3, 2) }],
        ["海盗弯刀", { quality: SJZ_Quality.Superior, size: v2(1, 1) }],
        ["机密档案", { quality: SJZ_Quality.Superior, size: v2(1, 2) }],
        ["广角镜头", { quality: SJZ_Quality.Superior, size: v2(2, 1) }],
        ["已损坏的热像仪", { quality: SJZ_Quality.Superior, size: v2(1, 1) }],
        ["固态硬盘", { quality: SJZ_Quality.Superior, size: v2(1, 1) }],
        ["后妃耳环", { quality: SJZ_Quality.Superior, size: v2(1, 1) }],
        ["军用热像仪", { quality: SJZ_Quality.Superior, size: v2(2, 3) }],
        ["军事情报", { quality: SJZ_Quality.Superior, size: v2(1, 1) }],
        ["内存条", { quality: SJZ_Quality.Superior, size: v2(1, 1) }],
        ["便携音响", { quality: SJZ_Quality.Superior, size: v2(2, 1) }],
        ["便携生存套组", { quality: SJZ_Quality.Superior, size: v2(2, 1) }],
        ["仪典匕首", { quality: SJZ_Quality.Superior, size: v2(3, 2) }],
        ["专业声卡", { quality: SJZ_Quality.Superior, size: v2(2, 1) }],
        ["HIFI声卡", { quality: SJZ_Quality.Superior, size: v2(2, 1) }],

        ["阿萨拉特色酒杯", { quality: SJZ_Quality.Legendary, size: v2(1, 1) }],
        ["纯金打火机", { quality: SJZ_Quality.Legendary, size: v2(1, 1) }],
        ["海盗金币", { quality: SJZ_Quality.Legendary, size: v2(1, 1) }],
        ["本地特色首饰", { quality: SJZ_Quality.Legendary, size: v2(3, 2) }],
        ["座钟", { quality: SJZ_Quality.Legendary, size: v2(2, 2) }],
        ["固体燃料", { quality: SJZ_Quality.Legendary, size: v2(1, 1) }],
        ["哈夫克机密档案", { quality: SJZ_Quality.Legendary, size: v2(1, 2) }],
        ["咖啡", { quality: SJZ_Quality.Legendary, size: v2(1, 1) }],
        ["可编程处理器", { quality: SJZ_Quality.Legendary, size: v2(1, 1) }],
        ["单反相机", { quality: SJZ_Quality.Legendary, size: v2(2, 2) }],
        ["勋章", { quality: SJZ_Quality.Legendary, size: v2(1, 1) }],
        ["军用炸药", { quality: SJZ_Quality.Legendary, size: v2(2, 2) }],
        ["军用望远镜", { quality: SJZ_Quality.Legendary, size: v2(2, 2) }],
        ["军用弹道计算机", { quality: SJZ_Quality.Legendary, size: v2(2, 1) }],
        ["军用卫星通讯仪", { quality: SJZ_Quality.Legendary, size: v2(2, 2) }],
        ["CPU", { quality: SJZ_Quality.Legendary, size: v2(1, 1) }],

        ["雷斯的留声机", { quality: SJZ_Quality.Mythic, size: v2(2, 3) }],
        ["赛伊德的怀表", { quality: SJZ_Quality.Mythic, size: v2(1, 1) }],
        ["滑膛枪展品", { quality: SJZ_Quality.Mythic, size: v2(4, 1) }],
        ["棘龙爪化石", { quality: SJZ_Quality.Mythic, size: v2(2, 1) }],
        ["名贵机械表", { quality: SJZ_Quality.Mythic, size: v2(1, 1) }],
        ["军用电台", { quality: SJZ_Quality.Mythic, size: v2(2, 2) }],
        ["军用无人机", { quality: SJZ_Quality.Mythic, size: v2(2, 2) }],
        ["军用控制终端", { quality: SJZ_Quality.Mythic, size: v2(2, 1) }],
        ["军用信息终端", { quality: SJZ_Quality.Mythic, size: v2(3, 2) }],
        ["克劳迪乌斯半身像", { quality: SJZ_Quality.Mythic, size: v2(2, 3) }],
        ["主战坦克模型", { quality: SJZ_Quality.Mythic, size: v2(3, 3) }],
        ["万足金条", { quality: SJZ_Quality.Mythic, size: v2(1, 2) }],
        ["非洲之心", { quality: SJZ_Quality.Mythic, size: v2(1, 1) }],
    ]);

    private trans: UITransform = null;

    // initProp(data: SJZ_ItemData) {
    //     if (!data) return;

    //     const _propName = data.Name;
    //     this.propIcon.spriteFrame = SJZ_GameManager.instance.dbxSF.find(sf => sf.name == _propName);
    //     this.propName.string = _propName;

    //     const value = SJZ_PropCtrl.propInfo.get(_propName)
    //     const sprite = this.BG.getComponent(Sprite);

    //     switch (value.quality) {
    //         case SJZ_Quality.Rare: sprite.color = SJZ_PropCtrl.blueColor; break;
    //         case SJZ_Quality.Superior: sprite.color = SJZ_PropCtrl.purpleColor; break;
    //         case SJZ_Quality.Legendary: sprite.color = SJZ_PropCtrl.goldColor; break;
    //         case SJZ_Quality.Mythic: sprite.color = SJZ_PropCtrl.redColor; break;
    //     }

    //     const x = value.size.x
    //     const y = value.size.y

    //     this.trans = this.node.getComponent(UITransform);

    //     // this.trans.setContentSize(150 * x, 150 * y);

    //     this.trans.width = (this.trans.width * x) + (3 * x - 1)
    //     this.trans.height = (this.trans.height * y) + (3 * y - 1)
    //     this.trans.setAnchorPoint(1 / (x * 2), 1 - 1 / (y * 2));

    //     this.updateIconSize(this.trans.width, this.trans.height)
    // }

    initProp(sf: SpriteFrame) {
        if (!sf) return;

        const _propName = sf.name;
        this.propIcon.spriteFrame = sf
        this.propName.string = _propName;

        const value = SJZ_PropCtrl.propInfo.get(_propName)
        const sprite = this.BG.getComponent(Sprite);

        switch (value.quality) {
            case SJZ_Quality.Rare: sprite.color = SJZ_PropCtrl.blueColor; break;
            case SJZ_Quality.Superior: sprite.color = SJZ_PropCtrl.purpleColor; break;
            case SJZ_Quality.Legendary: sprite.color = SJZ_PropCtrl.goldColor; break;
            case SJZ_Quality.Mythic: sprite.color = SJZ_PropCtrl.redColor; break;
        }

        const x = value.size.x
        const y = value.size.y

        this.trans = this.node.getComponent(UITransform);

        // this.trans.setContentSize(150 * x, 150 * y);

        this.trans.width = (this.trans.width * x) + (3 * x - 1)
        this.trans.height = (this.trans.height * y) + (3 * y - 1)
        this.trans.setAnchorPoint(1 / (x * 2), 1 - 1 / (y * 2));

        this.updateIconSize(this.trans.width, this.trans.height)
    }

    updateIconSize(width: number, height: number) {
        const iconUI = this.propIcon.getComponent(UITransform)
        const w = width / iconUI.width
        const h = height / iconUI.height
        if (w < h) {
            iconUI.setContentSize(iconUI.width * w * 0.9, iconUI.height * w * 0.9)
        } else {
            iconUI.setContentSize(iconUI.width * h * 0.9, iconUI.height * h * 0.9)
        }
    }

    static getPropsByQuality(quality: SJZ_Quality): string[] {
        const result: string[] = [];
        for (const [propName, propData] of SJZ_PropCtrl.propInfo) {
            if (propData.quality === quality) {
                result.push(propName);
            }
        }
        return result;
    }
}


