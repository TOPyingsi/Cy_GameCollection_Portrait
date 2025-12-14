import { _decorator, CCBoolean, Component, macro, Node, Prefab } from 'cc';
import { PoolManager } from 'db://assets/Scripts/Framework/Managers/PoolManager';
import { SHJCB_DataManager } from './SHJCB_DataManager';
const { ccclass, property } = _decorator;

@ccclass('SHJCB_Chats')
export class SHJCB_Chats extends Component {

    @property(Prefab)
    chat: Prefab;

    @property(Node)
    chats: Node;

    @property(Node)
    master: Node;

    protected onEnable(): void {
        this.unschedule(this._StartChat);
        this._InitChat();
        if (this.master) this.master.active = true;
    }

    _InitChat() {
        for (let i = 0; i < this.chats.children.length; i++) {
            const element = this.chats.children[i];
            PoolManager.PutNode(element);
        }
        this.schedule(this._StartChat, 1);
        // this.scheduleOnce(() => {  }, 0.5);

    }

    _StartChat() {
        PoolManager.GetNodeByPrefab(this.chat, this.chats);
    }

}
