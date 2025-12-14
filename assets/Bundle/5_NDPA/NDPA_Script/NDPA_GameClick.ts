import { _decorator, Component, error, EventTouch, geometry, instantiate, Node, PhysicsSystem, Prefab, RigidBody } from 'cc';
import { NDPA_TipsManager } from './NDPA_TipsManager';
import { NDPA_GameManager } from './NDPA_GameManager';
import { NDPA_CameraController } from './NDPA_CameraController';
import { NDPA_Clickable } from './NDPA_Clickable';
import { NDPA_GROUP } from './NDPA_GameConstant';
import { BundleManager } from '../../../Scripts/Framework/Managers/BundleManager';
import { GameManager } from '../../../Scripts/GameManager';
const { ccclass, property } = _decorator;

@ccclass('NDPA_GameClick')
export class NDPA_GameClick extends Component {

    protected onLoad(): void {
        this.node.on(Node.EventType.TOUCH_END, this.click, this);
    }

    click(event: EventTouch) {
        let ray = new geometry.Ray();
        NDPA_CameraController.Instance.Camera.screenPointToRay(event.getLocationX(), event.getLocationY(), ray);
        // 以下参数可选
        const mask = 0xffffffff;
        const maxDistance = 10000000;
        const queryTrigger = true;
        if (PhysicsSystem.instance.raycastClosest(ray, mask, maxDistance, queryTrigger)) {
            const raycastClosestResult = PhysicsSystem.instance.raycastClosestResult;
            if (raycastClosestResult && raycastClosestResult.collider.getGroup() == NDPA_GROUP.CLICKABLE) {
                const target = raycastClosestResult.collider.node;
                //是否为提示模式
                if (NDPA_GameManager.Instance.isTipsPattern) {
                    if (NDPA_TipsManager.Instance.checkTarget(target)) {
                        target.getComponent(NDPA_Clickable).click();
                    } else {
                        //玩家没按照提示的点击！
                        BundleManager.LoadPrefab(GameManager.GameData.DefaultBundle, "Bundle/NDPA_Prefabs/Hint").then((prefab: Prefab) => {
                            const hintNode: Node = instantiate(prefab);
                            hintNode.parent = NDPA_GameManager.Instance.Canvas;
                        })
                    }
                } else {
                    target.getComponent(NDPA_Clickable).click();
                }
                // target.getComponent(Clickable).click();
                // TipsManager.Instance.click(target);
            }
        }
    }

}


