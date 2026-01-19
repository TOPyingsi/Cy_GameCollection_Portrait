import { _decorator, Component, Node, Sprite, SpriteFrame, UITransform, Vec3, view } from 'cc';
import { YSMNQ_AnimBase } from '../Common/YSMNQ_AnimBase';
const { ccclass, property } = _decorator;

@ccclass('YSMNQ_CW_Water')
export class YSMNQ_CW_WaterAnim extends YSMNQ_AnimBase {
 // 背景移动速度（像素/秒，负数表示向左移动，模拟坐车向后的视觉）
    public moveSpeed: number = -100;

    // 两个背景节点
    @property(Node)
    private water1: Node = null;
    @property(Node)
    private water2: Node = null!;
    // 背景图宽度（自动计算）
    private bgWidth: number = 0;

    private _isPlaying: boolean = false;

    onLoad() {

        // 初始化背景图
        this.initWaterSprite();

        // 计算背景图宽度（Sprite 的实际显示宽度）
        // this.bgWidth = this.bgSpriteFrame.width * this.bg1.getComponent(Sprite)!.sizeMode === 0 
        //     ? this.bg1.getComponent(UITransform)!.width 
        //     : this.bgSpriteFrame.width;

         this.bgWidth =this.water1.getComponent(UITransform)!.width 

         this.water2.setPosition(new Vec3(this.water1.position.x + this.bgWidth, this.water1.position.y, 0));

        // // 初始化两个背景的位置（Bg1 在左，Bg2 紧贴 Bg1 右侧）
        // this.bg1.setPosition(Vec3.ZERO);
        // this.bg2.setPosition(new Vec3(this.bgWidth, 0, 0));
    }

    play(){
        this._isPlaying = true;
    }

    stop(){
        this._isPlaying = false;
    }

    update(deltaTime: number) {
        if(!this._isPlaying)return;
        // 计算每帧移动的距离
        const moveDistance = this.moveSpeed * deltaTime;

        // 移动两个背景节点
        this.water1.setPosition(this.water1.position.x + moveDistance, this.water1.position.y);
        this.water2.setPosition(this.water2.position.x + moveDistance, this.water2.position.y);


        // 边界检测：当背景完全移出左侧时，重置到右侧
        if (this.water1.position.x <= -this.bgWidth) {
            this.water1.setPosition(this.water2.position.x + this.bgWidth, this.water1.position.y);
        }
        if (this.water2.position.x <= -this.bgWidth) {
            this.water2.setPosition(this.water1.position.x + this.bgWidth, this.water2.position.y);
        }
    }

    // 初始化背景 Sprite 组件
    private initWaterSprite() {
        const sprite1 = this.water1.getComponent(Sprite)!;
        const sprite2 = this.water2.getComponent(Sprite)!;

        // 设置 Sprite 尺寸适配（可选，根据需求调整）
        sprite1.sizeMode = Sprite.SizeMode.CUSTOM; // 自定义尺寸
        sprite2.sizeMode = Sprite.SizeMode.CUSTOM;
        // 适配画布高度（可选）
        const canvasWidth = view.getVisibleSize().width;
        this.water1.getComponent(UITransform).width = canvasWidth;
        this.water2.getComponent(UITransform).width = canvasWidth;
    }
}


