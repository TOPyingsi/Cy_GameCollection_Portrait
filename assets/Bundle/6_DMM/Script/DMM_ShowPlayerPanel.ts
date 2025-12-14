import { _decorator, Component, Node, v3, WorldNode3DToWorldNodeUI } from 'cc';
import { DMM_ITEM } from './DMM_Constant';
import { DMM_PrefsManager } from './DMM_PrefsManager';
import { DMM_GameManager } from './DMM_GameManager';
import { DMM_PlayerController } from './DMM_PlayerController';
import { DMM_Item } from './DMM_Item';
import { DMM_GameTool } from './DMM_GameTool';
import Banner from '../../../Scripts/Banner';
const { ccclass, property } = _decorator;

const DMM_ITEMS: DMM_ITEM[] = [DMM_ITEM.ITEM1, DMM_ITEM.ITEM2, DMM_ITEM.ITEM3, DMM_ITEM.ITEM4, DMM_ITEM.ITEM5, DMM_ITEM.ITEM6]
@ccclass('DMM_ShowPlayerPanel')
export class DMM_ShowPlayerPanel extends Component {

    public static Instance: DMM_ShowPlayerPanel = null;

    @property(Node)
    ShowPlayer: Node[] = [];

    @property
    Speed: number = 1;

    Index: number = 0;

    Item: DMM_ITEM = DMM_ITEM.ITEM1;
    Gender: number = 0;
    protected onLoad(): void {
        DMM_ShowPlayerPanel.Instance = this;
    }

    protected update(dt: number): void {
        this.node.eulerAngles.add3f(0, -dt * this.Speed, 0);
        this.node.setWorldRotationFromEuler(0, this.node.eulerAngles.y, 0);
    }

    Show(): boolean {
        const arr: DMM_ITEM[] = this.getDifference(DMM_ITEMS, DMM_PrefsManager.Instance.userData.HaveItem);
        if (arr.length <= 0) return false;

        this.Item = DMM_GameTool.GetRandomItemFromArray(arr);
        this.Gender = DMM_GameTool.GetRandomIntWithMax(0, 1);
        this.Index = this.Item * 2 + this.Gender;
        this.showPlayerBuyIndex(this.Index);
        return true;
    }

    /**从数组 arr1 中筛选出不包含在 arr2 中的元素 */
    getDifference(arr1: any[], arr2: any[]): any[] {
        return arr1.filter(item => arr2.indexOf(item) == -1);
    }

    showPlayerBuyIndex(index: number) {
        this.ShowPlayer.filter(node => node.active = false);
        this.ShowPlayer[index].active = true;
    }

    Reject() {
        DMM_GameManager.Instance.gameStartBtn();
    }

    Agree() {
        Banner.Instance.ShowVideoAd(() => {
            DMM_PlayerController.Instance.TryOutPlayer(this.Item, this.Gender, () => {
                DMM_GameManager.Instance.gameStartBtn();
            });
        })
    }
}


