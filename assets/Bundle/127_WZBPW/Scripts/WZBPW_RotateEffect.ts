import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

/**
 * 旋转效果组件
 * 让节点持续旋转，用于白光等动态效果
 */
@ccclass('WZBPW_RotateEffect')
export class WZBPW_RotateEffect extends Component {
    // 旋转速度（度/秒）
    @property
    public rotationSpeed: number = 60;

    // 旋转方向（true: 顺时针, false: 逆时针）
    @property
    public clockwise: boolean = true;

    update(deltaTime: number) {
        // 计算旋转角度
        const rotationDelta = this.rotationSpeed * deltaTime * (this.clockwise ? -1 : 1);
        
        // 应用旋转
        this.node.angle += rotationDelta;
    }
}
