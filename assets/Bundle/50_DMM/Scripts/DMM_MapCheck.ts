import { _decorator, Component, Node, Event, instantiate, Prefab, find } from 'cc';
import { DMM_PlayerManager } from './DMM_PlayerManager';
import { Tools } from 'db://assets/Scripts/Framework/Utils/Tools';
import { DMM_GameManager } from './DMM_GameManager';
import { DMM_NpcManager } from './DMM_NpcManager';
const { ccclass, property } = _decorator;


interface GraphNode {
    id: string;// 节点唯一标识
    neighbors: string[];//能到达的其他节点ID数组
}
interface Graph {
    [key: string]: GraphNode;// 以节点ID为键的图结构
}
@ccclass('DMM_MapCheck')

export class DMM_MapCheck extends Component {
    @property(Prefab)
    Lable: Prefab = null;
    @property(Node)
    Npc: Node = null;
    play: Node = null;
    start() {
    }

    update(deltaTime: number) {

    }
    OnClick(event: Event) {
        switch (event.target.name) {

            case "躲藏点":
                const buttonNode = event.target as Node;
                DMM_PlayerManager.Instance.CheckDown(buttonNode);
                // buttonNode.active = false;

                break;


        }
    }
    PlayerChose(event: Event) {
        this.Npc.children.forEach(e => {
            if (e.name == event.target.name) {
                this.play = e;
            }
        });
        const TopLable = instantiate(this.Lable);
        const PlayerPosition = find("Canvas/BG/Player").worldPosition;
        const Player = this.play;
        Player.addChild(TopLable);

        find("Canvas/BG/Player").addChild(Player);

        Player.setWorldPosition(PlayerPosition);
        Player.name = "玩家";
        find("DMM_PlayerManager").getComponent(DMM_PlayerManager).Player = this.play;
        find("Canvas/BG/开关框").active = false;
        DMM_GameManager.Instance.startTimer();
        for (let i = 0; i < find("Canvas/BG/Npc").children.length; i++) {
            DMM_NpcManager.Instance.NpcArray.push(find("Canvas/BG/Npc").children[i]);

        };
        // for (let i = 0; i < DMM_NpcManager.Instance.NpcArray.length; i++) {

        //     DMM_NpcManager.Instance.NpcStartPos.push(find("Canvas/BG/起始位置").children[i].worldPosition);
        // };



    }


}
