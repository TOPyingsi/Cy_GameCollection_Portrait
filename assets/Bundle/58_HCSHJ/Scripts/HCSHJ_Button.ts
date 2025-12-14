import { _decorator, Animation, AudioSource, Component, instantiate, Label, Node, Prefab, Sprite, SpriteFrame } from 'cc';
import { HCSHJ_DynamicDt } from './HCSHJ_DynamicDt';
const { ccclass, property } = _decorator;

@ccclass('HCSHJ_Button')
export class HCSHJ_Button extends Component {
    @property([SpriteFrame])
    buttonImg: SpriteFrame[] = [];

    @property([SpriteFrame])
    clickNum: SpriteFrame[] = [];

    @property([SpriteFrame])
    roleImg: SpriteFrame[] = [];

    @property(Prefab)
    hintP: Prefab;

    private _clickState: number = -1;

    private uiMgr: Node;

    protected onLoad(): void {
        this.uiMgr = this.node.parent.parent;
        console.log(this.uiMgr);

    }
    clickScreen() {
        this.node.active = false;
        this.node.parent.getChildByName("tip").active = false;
        this.node.parent.getChildByName("finger").active = false;
    }

    addNum() {
        this.node.getComponent(AudioSource).play();
        if (HCSHJ_DynamicDt.Instance.progress < 9 && this._clickState < 2) {
            HCSHJ_DynamicDt.Instance.obj[this.node.name] = this._clickState + 2;


            HCSHJ_DynamicDt.Instance.progress += 1;
            let curImg: SpriteFrame = this.node.getChildByName("icon").getComponent(Sprite).spriteFrame;
            let layer: Node = this.uiMgr.getChildByName("eggMask").getChildByName("layer" + HCSHJ_DynamicDt.Instance.progress);
            layer.active = true;
            layer.getComponent(Sprite).spriteFrame = curImg;
            // 在蛋上填充图标

        }
        if (HCSHJ_DynamicDt.Instance.progress === 9) {
            this.uiMgr.getChildByName("over").active = true;//阻止玩家点击
            HCSHJ_DynamicDt.Instance.progress = 9;
            
            // let roleId: String = HCSHJ_DynamicDt.Instance.findMaxProperty(HCSHJ_DynamicDt.Instance.obj);
            HCSHJ_DynamicDt.Instance.roleID =  HCSHJ_DynamicDt.Instance.getroleId();

            this.uiMgr.getChildByName("role").getComponent(Sprite).spriteFrame = this.roleImg[HCSHJ_DynamicDt.Instance.roleID];

            //播放锤子动画
            this.uiMgr.getChildByName("hammer").active = true;
            // this.uiMgr.getChildByName("hammer").getComponent(Animation).play();

            // this.scheduleOnce(() => {
            //     this.uiMgr.getChildByName("eggMask").active = false;
                
            //     this.uiMgr.getChildByName("egg").active = false;
            //     // this.uiMgr.getChildByName("role").active = true;
            //     this.uiMgr.getChildByName("eggAnim").active = true;
            //     this.uiMgr.getChildByName("eggAnim").getComponent(AudioSource).play();
            // }, 1);

        }

        this._clickState += 1;
        //单个按钮点击超过三次弹出提示
        if (this._clickState > 2) {
            let hintN: Node = instantiate(this.hintP);
            this.node.parent.parent.addChild(hintN);
            hintN.setPosition(0, 480, 0);
            this.uiMgr.getChildByName("hint").getComponent(Animation).play("hint")
            return;
        }

        //更改按钮进度
        // this.node.getChildByName("clickNum").getComponent(Sprite).spriteFrame = this.clickNum[this._clickState]
        if (this._clickState <= 3) {
            this.node.getChildByName("Label").getComponent(Label).string = this._clickState + 1 + "/ 3"
        }


    }
}


