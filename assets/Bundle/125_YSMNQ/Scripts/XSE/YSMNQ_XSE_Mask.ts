import { _decorator, Component, Graphics, Mask, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('YSMNQ_XSE_Mask')
export class YSMNQ_XSE_Mask extends Component {

    @property(Boolean)
    isInverted: boolean = false;
    onLoad(){
       
    }

    protected start(): void {
        if(this.isInverted){
            this.node.getComponent(Mask).inverted = true;;
            this.node.getComponent(Graphics).clear();
        }
        else{
            this.node.getComponent(Mask).inverted = false;  
            let graphics = this.node.getComponent(Graphics);
            // 1. 清空原有路径
            graphics.clear();

            // ========== 核心：绘制偏移矩形，让初始无可见区域 ==========
            // 绘制一个偏移到屏幕外的矩形（完全不覆盖子节点）
            // 尺寸任意，只要位置不在子节点范围内即可
            graphics.rect(9999, 9999, 1, 1); // 偏移到屏幕外，无可见区域
            graphics.fill(); // 填充路径，Mask生效
        }
    }
}


