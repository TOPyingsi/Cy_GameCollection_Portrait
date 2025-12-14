import { _decorator, Component, instantiate, Node, Prefab, tween, v3, Vec3 } from 'cc';
import { DMM_GameManager } from './DMM_GameManager';
import { DMM_GameTool } from './DMM_GameTool';
const { ccclass, property } = _decorator;

@ccclass('DMM_Award')
export class DMM_Award extends Component {
    @property(Prefab)
    GoldPrefab: Prefab = null;

    @property
    offset: Vec3 = v3(0, 0, 0);

    init(startPos: Vec3, targetPos: Vec3, cb: Function = null, goldNum: number = 10) {
        for (let i = 0; i < goldNum; i++) {
            const time: number = DMM_GameTool.GetRandom(0, 0.5);
            this.scheduleOnce(() => {
                const gold: Node = instantiate(this.GoldPrefab);
                gold.parent = DMM_GameManager.Instance.Canvas;
                const offset: Vec3 = v3(DMM_GameTool.GetRandom(-this.offset.x, this.offset.x), DMM_GameTool.GetRandom(-this.offset.y, this.offset.y));
                gold.setWorldPosition(startPos.clone().add(offset));
                tween(gold)
                    .to(1, { worldPosition: targetPos }, { easing: `quadIn` })
                    .call(() => {
                        gold.destroy();
                        if (i == goldNum - 1) {
                            cb && cb();
                        }
                    })
                    .start();
            }, time)
        }
    }
}


