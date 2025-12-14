import { _decorator, Component, Node, tween, v3, Vec3 } from 'cc';
import Banner from 'db://assets/Scripts/Banner';
import { DataManager } from 'db://assets/Scripts/Framework/Managers/DataManager';
import { GameManager } from 'db://assets/Scripts/GameManager';
const { ccclass, property } = _decorator;

@ccclass('JJWXR_More')
export class JJWXR_More extends Component {

    start() {
        this.node.active = Banner.IsShowServerBundle;
        for (let i = 0; i < this.node.children.length; i++) {
            const element = this.node.children[i];
            tween(element)
                .to(0.5, { scale: v3(1.2, 1.2, 1.2) })
                .to(0.5, { scale: Vec3.ONE })
                .union().repeatForever().start();
        }
    }

    LLN() {
        GameManager.Instance.LoadGame(DataManager.AllGameData.find((value, index, obj) => { if (value.Bundles[0] == "4_TalkingLarry") return value; }));
    }

    SSL() {
        GameManager.Instance.LoadGame(DataManager.AllGameData.find((value, index, obj) => { if (value.Bundles[0] == "2_SSL") return value; }));
    }

    DMM() {
        GameManager.Instance.LoadGame(DataManager.AllGameData.find((value, index, obj) => { if (value.Bundles[0] == "6_DMM") return value; }));
    }

}