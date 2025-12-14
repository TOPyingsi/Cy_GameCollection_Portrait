import { _decorator, Component, Node, tween, UIOpacity } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('DMM_BlankScreen')
export class DMM_BlankScreen extends Component {
    show(cb: Function = null) {
        const uiOpacity: UIOpacity = this.getComponent(UIOpacity);
        uiOpacity.opacity = 0;
        tween(uiOpacity)
            .to(1, { opacity: 255 }, { easing: `smooth` })
            .call(() => {
                cb && cb();
            })
            .start()
    }

    showDMM(cb1: Function = null, cb2: Function = null) {
        const uiOpacity: UIOpacity = this.getComponent(UIOpacity);
        uiOpacity.opacity = 0;
        tween(uiOpacity)
            .to(1, { opacity: 255 }, { easing: `smooth` })
            .call(() => {
                cb1 && cb1();
            })
            .to(1, { opacity: 0 }, { easing: `smooth` })
            .call(() => {
                cb2 && cb2();
                this.node.destroy();
            })
            .start()
    }

}


