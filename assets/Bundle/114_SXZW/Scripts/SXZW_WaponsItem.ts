import { _decorator, Color, Component, JsonAsset, Label, math, Node, NodeEventType, Prefab, Sprite, SpriteFrame, sys } from 'cc';
import { SXZW_WeaponsManage } from './SXZW_WeaponsManage';
import { SXZW_GameManage } from './SXZW_GameManage';
import { SXZW_Utils } from './SXZW_Utils';

const { ccclass, property } = _decorator;

@ccclass('LevelData')
export class LevelData {
    @property({ type: Number })
    money: number = 0; // 升级所需的金币
    @property({ type: Number })
    damage: number = 0; // 武器伤害
    @property({ type: Number })
    pushForce: number = 0;  // 推力
    @property({ type: Number })
    damageRange: number = 0;  // 伤害范围
}

@ccclass('SXZW_WaponsItem')
export class SXZW_WaponsItem extends Component {

    private static levelInfo: { [key: string]: number } = null;

    @property({ type: Sprite, group: '内部属性' })
    itemSprite: Sprite = null;

    @property({ type: Sprite, group: '内部属性' })
    itemSpriteTop: Sprite = null;

    @property({ type: Sprite, group: '内部属性' })
    itemSpriteIcon: Sprite = null;

    @property({ type: Label, group: '内部属性' })
    itemFloorLabel: Label = null;

    @property({ type: Label, group: '内部属性' })
    itemLevelLabel: Label = null;

    @property({ type: Sprite, group: '内部属性' })
    itemLevelBg: Sprite = null;

    @property({ type: SpriteFrame, group: '内部属性' })
    itemUpgradeIcon: SpriteFrame = null;

    @property({ type: SpriteFrame, group: '内部属性' })
    itemVideoIcon: SpriteFrame = null;

    @property({ type: String, tooltip: "武器名称", group: "自定义属性" })
    itemName: string = '';

    @property({ type: Number, tooltip: "武器初始等级", group: "自定义属性" })
    itemInitLevel: number = 0;

    @property({ type: Number, tooltip: "武器解锁关卡", group: "自定义属性" })
    itemUnlockLevel: number = 0;

    @property({ type: SpriteFrame, tooltip: "武器图片", group: "自定义属性" })
    itemImage: SpriteFrame = null;

    @property({ type: Boolean, tooltip: "是否是视频", group: "自定义属性" })
    itemIsVideo: boolean = false;

    @property({ type: Boolean, tooltip: "是顶部卡片", group: "自定义属性" })
    isTopCard: boolean = false;

    @property({ type: Prefab, tooltip: "预制体", group: "自定义属性" })
    weaponPrefab: Prefab = null;

    @property({ type: LevelData, tooltip: "武器等级数据", group: "自定义属性" })
    levelDatas: LevelData[] = []

    @property({ type: JsonAsset, tooltip: "武器等级数据JSON", group: "自定义属性" })
    levelDatasJson: JsonAsset = null;

    levelData: LevelData = null;
    itemLevel: number = 0;

    private currentNode: Node = null;
    private hashName: string = '';

    protected onLoad(): void {
        this.hashName = this.toHex(this.itemName);
        if (this.levelDatasJson || SXZW_WeaponsManage.Instance.levelDatasJson) {
            let jsonData = this.levelDatasJson?.json || SXZW_WeaponsManage.Instance.levelDatasJson.json;
            jsonData = Array.isArray(jsonData) ? jsonData : jsonData[this.itemName];
            if (jsonData) {
                if (Array.isArray(jsonData)) {
                    const valid = jsonData.every(item =>
                        typeof item.money === 'number' &&
                        typeof item.damage === 'number' &&
                        typeof item.pushForce === 'number' &&
                        typeof item.damageRange === 'number'
                    );
                    if (valid) {
                        this.levelDatas = jsonData as LevelData[];
                    } else {
                        console.error('json 数据缺失 -' + this.levelDatasJson.name + '，请检查数据格式！');
                    }
                } else {
                    console.error('json 格式错误，必须为数组！-' + this.levelDatasJson.name);
                }
            }
        }
    }

    start() {
        this.node.on(NodeEventType.TOUCH_END, this.click, this);
        this.itemSpriteTop.node.on(NodeEventType.TOUCH_END, this.clickButton, this)

    }

    protected onEnable(): void {
        this.itemSprite.spriteFrame = this.itemImage;
        if (SXZW_WaponsItem.levelInfo === null) {
            const s = sys.localStorage.getItem("sxzw_weaponsLevel");
            SXZW_WaponsItem.levelInfo = SXZW_Utils.JsonTryParse(s, {});
        }
        const level = SXZW_WaponsItem.levelInfo[this.hashName];
        this.itemLevel = level || this.itemInitLevel;
        if (this.itemLevel > this.levelDatas.length) {
            this.itemLevel = this.levelDatas.length;
        }
        this.itemLevelChange();
    }

    updateData(item: SXZW_WaponsItem) {
        if (this.currentNode) this.currentNode.active = true;
        this.currentNode = item.node;
        this.currentNode.active = false;
        this.itemName = item.itemName;
        this.hashName = this.toHex(this.itemName);
        this.itemImage = item.itemImage;
        this.itemIsVideo = item.itemIsVideo;
        this.levelDatas = item.levelDatas;
        this.itemInitLevel = item.itemInitLevel;
        this.itemUnlockLevel = item.itemUnlockLevel;
        this.itemSprite.spriteFrame = item.itemImage;
        this.weaponPrefab = item.weaponPrefab;
        this.onEnable();
    }

    update(deltaTime: number) {

    }

    public upgrade() {
        if (
            this.itemLevel < this.levelDatas.length &&
            SXZW_GameManage.SubCoin(this.levelDatas[this.itemLevel].money)
        ) {
            this.itemLevel++;
            SXZW_WaponsItem.levelInfo[this.hashName] = this.itemLevel;
            sys.localStorage.setItem("sxzw_weaponsLevel", JSON.stringify(SXZW_WaponsItem.levelInfo));
            this.itemLevelChange();
        }
    }

    itemLevelChange() {
        this.levelData = this.levelDatas[math.clamp(this.itemLevel - 1, 0, this.levelDatas.length - 1)];
        if (this.itemLevel < 1) {
            this.itemSprite.color = new Color(255, 255, 255, 128);
            this.itemLevelLabel.node.active = false;
            this.itemLevelBg.node.active = false
            if (this.itemIsVideo) {
                this.itemFloorLabel.string = '解锁';
                this.itemFloorLabel.color = new Color(255, 255, 255, 255);
                this.itemSpriteTop.node.active = true;
                this.itemSpriteIcon.node.active = true;
                this.itemSpriteIcon.spriteFrame = this.itemVideoIcon;
                this.itemSpriteTop.color = new Color(255, 255, 255, 255);
            } else {
                this.itemFloorLabel.string = '未解锁';
                this.itemFloorLabel.color = new Color(255, 255, 255, 128);
                this.itemSpriteTop.node.active = false;
            }
        } else if (this.itemLevel >= this.levelDatas.length) {
            this.itemSprite.color = new Color(255, 255, 255, 255);
            this.itemLevelLabel.node.active = true;
            this.itemLevelBg.node.active = true
            this.itemLevelBg.color = new Color(128, 255, 0, 255)
            this.itemLevelLabel.string = `Lv.${this.itemLevel}`;
            this.itemFloorLabel.string = '已满级';
            this.itemSpriteIcon.node.active = false;
            this.itemFloorLabel.color = new Color(255, 255, 0, 255);
            this.itemSpriteTop.node.active = true;
            this.itemSpriteTop.color = new Color(150, 150, 255, 255);
        } else {
            this.itemSprite.color = new Color(255, 255, 255, 255);
            this.itemLevelLabel.node.active = true;
            this.itemLevelBg.node.active = true
            this.itemSpriteTop.node.active = true;
            this.itemSpriteTop.color = new Color(0, 255, 0, 255);
            if (SXZW_GameManage.EnoughCoin(this.levelDatas[this.itemLevel].money)) {
                this.itemLevelBg.color = new Color(255, 255, 255, 255)
                this.itemFloorLabel.string = '升级';
                this.itemSpriteIcon.node.active = true;
            } else {
                this.itemLevelBg.color = new Color(0, 0, 0, 128)
                this.itemFloorLabel.string = this.isTopCard ? "已装备" : "装备";
                this.itemSpriteIcon.node.active = false;
            }

            this.itemLevelLabel.string = `Lv.${this.itemLevel}`;
            this.itemSpriteIcon.spriteFrame = this.itemUpgradeIcon;
            this.itemFloorLabel.color = new Color(255, 255, 255, 255);
        }
    }

    click() {
        SXZW_WeaponsManage.Instance.showEquipInfo(this, false);
    }

    clickButton() {
        SXZW_WeaponsManage.Instance.showEquipInfo(this, true);
    }

    onDestroy() {
        this.node?.off(NodeEventType.TOUCH_END, this.click, this);
        this.itemSpriteTop?.node?.off(NodeEventType.TOUCH_END, this.clickButton, this)
    }

    toHex(chinese: string): string {
        let hexStr = '';
        for (let i = 0; i < chinese.length; i++) {
            const code = chinese.charCodeAt(i);
            let hex = code.toString(16).toUpperCase();
            while (hex.length < 4) {
                hex = '0' + hex;
            }
            hexStr += hex;
        }
        return hexStr;
    }
}


