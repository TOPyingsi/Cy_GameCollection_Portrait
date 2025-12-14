import { _decorator, Component, instantiate, log, Node, Prefab, random, Sprite } from 'cc';
import { HCSHJ_Button } from './HCSHJ_Button';
const { ccclass, property } = _decorator;

@ccclass('HCSHJ_createrBtn')
export class HCSHJ_createrBtn extends Component {
    @property(Prefab)
    buttonP: Prefab;
    
    protected onLoad(): void {
        for(let i=0;i<8;i++){
            this.createBtn(i);
        }
    }

    createBtn(ImgId:number){
        let buttonN:Node = instantiate(this.buttonP);
        this.node.addChild(buttonN);
        
        buttonN.name = ImgId.toString();
        let buttonTs:HCSHJ_Button = buttonN.getComponent(HCSHJ_Button);
        buttonN.getChildByName("icon").getComponent(Sprite).spriteFrame = buttonTs.buttonImg[ImgId];
        
    }
}


