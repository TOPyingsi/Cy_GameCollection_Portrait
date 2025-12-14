import { _decorator, Component, director, Label, Node, Sprite, UITransform } from 'cc';
import NodeUtil from '../../Framework/Utils/NodeUtil';
import { BundleManager } from '../../Framework/Managers/BundleManager';
import { UIManager } from '../../Framework/Managers/UIManager';
import { PhysicsManager } from '../../Framework/Managers/PhysicsManager';
import { GameManager } from '../../GameManager';

const { ccclass, property } = _decorator;

@ccclass('LoadingPanel')
export default class LoadingPanel extends Component {
    Loading: Node = null;
    MapLabel: Label | null = null;
    LoadingLabel: Label | null = null;
    LoadingFG: UITransform | null = null;

    protected onLoad(): void {
        this.Loading = NodeUtil.GetNode("Loading", this.node);
        this.LoadingLabel = NodeUtil.GetComponent("LoadingLabel", this.node, Label);
        this.MapLabel = NodeUtil.GetComponent("MapLabel", this.node, Label);
        this.LoadingFG = NodeUtil.GetComponent("LoadingFG", this.node, UITransform);
    }

    Show(scene: string, bundles?: string[], cb: Function = null) {
        this.LoadingFG.width = 0;
        this.LoadingLabel.string = `正在加载：${0}%`;
        this.Loading.active = Boolean(bundles);
        const loadScene = () => {
            PhysicsManager.SetCollisionMatrix(GameManager.GameData)
            this.Loading.active = false;
            director.preloadScene(scene, (completedCount: number, totalCount: number, item: any) => {
                let fillRange = this.LoadingFG.width / 980;
                this.LoadingFG.width = fillRange > completedCount / totalCount ? fillRange * 980 : completedCount / totalCount * 980;
                this.LoadingLabel.string = `正在加载：${Math.ceil(completedCount / totalCount * 100)}%`;
            }, () => {
                director.loadScene(scene, cb && cb());
            });
        }

        if (bundles) {
            BundleManager.LoadBundles(bundles, () => { loadScene(); }, () => {
                this.node.destroy();
                UIManager.ShowTip("网络异常，请稍后重试");
            });
        } else {
            loadScene();
        }

    }
}