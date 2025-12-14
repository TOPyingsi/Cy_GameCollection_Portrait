import { _decorator, Component, director, EditBox, Node } from 'cc';
import { operatorWindowController } from './SSL_operatorWindowController';
import PlayerManager from '../Manage/SSL_PlayerManager';
import { pageController } from '../SSL_pageController';
import { sharesPageController } from './SSL_sharesPageController';
import { SoundplayManager } from '../Manage/SSL_SoundplayManager';
const { ccclass, property } = _decorator;

@ccclass('confirmButton')
export class confirmButton extends Component {

    @property(EditBox)
    editBox : EditBox = null;
    windows : operatorWindowController = null;
    page : sharesPageController = null;

    protected onLoad(): void {
        console.log(this.node.parent);
        this.page = ((this.node.parent).parent).parent.getComponent(sharesPageController);
        this.windows = (this.node.parent).parent.getComponent(operatorWindowController);
    }


    addone(){
        
        SoundplayManager.instance.playOnce("点击");
        this.editBox.string = (Number(this.editBox.string.toString()) + 1).toString();
    }
    deone(){
        SoundplayManager.instance.playOnce("点击");
        this.editBox.string = (Number(this.editBox.string.toString()) -  1).toString();
        // this.haveNumber.string = (Number(this.sharesdata.sharesHave.toString()) - 1).toString();
    }
    
    protected update(dt: number): void {
        if (this.windows.type == 1){
            this.editBox.string = (Math.max(Number(this.editBox.string.toString()), 0)).toString();
        }else{
            this.editBox.string = (Math.max(Number(this.editBox.string.toString()), 0)).toString();
            this.editBox.string = (Math.min(Number(this.editBox.string.toString()), Number(this.windows.haveNumber.string))).toString();
        }
    }

    OnButtonClick() {
        let num = this.windows.sharesdata.currentPrice * Number(this.editBox.string);
        num *= this.windows.type;
        if (PlayerManager.Instance.IsCashEnough(num)){
            director.getScene().emit("operatorShares",Number(this.editBox.string) * this.windows.type, this.windows.sharesdata.company_name);
        }else{
            this.page.tipComing();
        }
        this.editBox.string = "";
    }
}


