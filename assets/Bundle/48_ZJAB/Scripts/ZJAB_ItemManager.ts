import { _decorator, Component, Enum, InstanceMaterialType, instantiate, Node, PhysicsSystem2D, Prefab, Sprite, Vec3 } from 'cc';
import { ZJAB_GRADE, ZJAB_ITEM } from './ZJAB_Constant';
import { ZJAB_Item } from './ZJAB_Item';
import { ZJAB_Item_Card } from './ZJAB_Item_Card';
import { ZJAB_NZ } from './ZJAB_NZ';
import { ZJAB_TouchController } from './ZJAB_TouchController';
import { ZJAB_LVController } from './ZJAB_LVController';
const { ccclass, property } = _decorator;

const StartPos: Vec3[] = [new Vec3(-300, 900, 0), new Vec3(0, 900, 0), new Vec3(300, 900, 0)]

@ccclass('ZJAB_ItemManager')
export class ZJAB_ItemManager extends Component {
    public static Instance: ZJAB_ItemManager = null;

    @property(Prefab)
    ItemPrefab: Prefab = null;

    @property({ type: [Enum(ZJAB_ITEM)] })
    Items: ZJAB_ITEM[] = [];

    ItemWave: ZJAB_ITEM[][] = [];
    Item_Card: ZJAB_Item_Card[] = [];

    protected onLoad(): void {
        ZJAB_ItemManager.Instance = this;
    }

    protected start(): void {
        this.loadItems();
        // this.gameStart();
    }

    loadItems() {
        if (this.Items.length <= 0) return;
        const item: ZJAB_ITEM = this.Items.shift();
        if (item == ZJAB_ITEM.Null) {
            this.ItemWave.push([]);
        } else {
            this.ItemWave[this.ItemWave.length - 1].push(item);
        }
        this.loadItems();
    }

    initItem(type: ZJAB_ITEM) {
        const index = Math.floor(Math.random() * 3);
        const item = instantiate(this.ItemPrefab);
        item.parent = this.node;
        item.setPosition(StartPos[index]);
        item.getComponent(ZJAB_Item).init(type);
    }

    initWave(wave: ZJAB_ITEM[]) {
        if (wave.length <= 0) {
            this.initCard();
            return;
        }

        const itemType = wave.shift();
        this.initItem(itemType);
        this.scheduleOnce(() => {
            this.initWave(wave);
        }, 2);
    }

    initCard() {
        if (this.Item_Card.length <= 0) return;
        this.Item_Card.shift().init();
        this.scheduleOnce(() => {
            if (this.ItemWave.length <= 0) {
                //结束
                ZJAB_NZ.Instance.FinishNode.active = false;
                ZJAB_TouchController.Instance.IsTouch = false;
                ZJAB_LVController.Instance.backScene(ZJAB_NZ.Instance.CurGrade == ZJAB_GRADE.GRADE6);
                return;
            }
            this.initWave(this.ItemWave.shift());
        }, 7);
    }

    gameStart() {
        this.initWave(this.ItemWave.shift());
    }
}


