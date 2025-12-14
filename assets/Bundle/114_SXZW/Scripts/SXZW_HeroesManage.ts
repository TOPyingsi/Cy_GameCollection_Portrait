import { _decorator, Component, Material, math, Node, SpriteFrame, sys } from 'cc';
import { SXZW_HeroesItem } from './SXZW_HeroesItem';
import { SXZW_GameManage } from './SXZW_GameManage';
import Banner from 'db://assets/Scripts/Banner';
import { SXZW_Utils } from './SXZW_Utils';
const { ccclass, property } = _decorator;

@ccclass('SXZW_HeroesManage')
export class SXZW_HeroesManage extends Component {

    @property(Node)
    private border: Node = null
    @property(Node)
    private choose: Node = null

    @property(Material)
    material_1: Material = null;

    @property(Material)
    material_2: Material = null;

    @property(SpriteFrame)
    moneyIcon: SpriteFrame = null

    @property(SpriteFrame)
    videoIcon: SpriteFrame = null

    public get isUseColorMaterial(): boolean {
        return this.currentItem === this.items[0];
    }

    private items: SXZW_HeroesItem[] = []

    public currentItem: SXZW_HeroesItem = null

    private json: {} = { "equip": 0 }

    protected onLoad(): void {
        this.items = this.node.getComponentsInChildren(SXZW_HeroesItem)
        const s = sys.localStorage.getItem("sxzw_hero");
        this.json = SXZW_Utils.JsonTryParse(s, { "equip": 0 });
        for (let i = 0; i < this.items.length; i++) {
            this.items[i].init(this.json?.[this.items[i].heroesName] || false, this.equipHero.bind(this))
            this.items[i].icon.spriteFrame = this.items[i].isVideo ? this.videoIcon : this.moneyIcon
        }
        this.equipHero(this.items[math.clamp(this.json?.["equip"] || 0, 0, this.items.length - 1)])
        this.node.active = false;
    }

    start() {

    }

    update(deltaTime: number) {

    }

    private equipHero(item: SXZW_HeroesItem) {
        if (!(this.json?.[item.heroesName] || false)) {
            if (item.isVideo) {
                Banner.Instance.ShowVideoAd(() => {
                    this.json[item.heroesName] = true
                    item.init(true, this.equipHero.bind(this))
                    this._equipHero(item);
                })
            } else if (SXZW_GameManage.SubCoin(item.money)) {
                this.json[item.heroesName] = true
                item.init(true, this.equipHero.bind(this))
                this._equipHero(item);
            } else {
                SXZW_GameManage.Instance.showTips("金币不足!!");
            }
        } else {
            this._equipHero(item);
        }
    }

    private _equipHero(item: SXZW_HeroesItem) {
        this.border.parent = item.sprite.node.parent;
        this.border.setSiblingIndex(0);
        this.choose.parent = item.node;
        this.json["equip"] = this.items.indexOf(item);
        this.currentItem = item;
        sys.localStorage.setItem("sxzw_hero", JSON.stringify(this.json));
    }
}


