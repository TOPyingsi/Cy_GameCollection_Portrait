import { _decorator, Component, Node, Vec3 } from 'cc';
import { JJWXR_Bullet } from '../Game/JJWXR_Bullet';
const { ccclass, property } = _decorator;

@ccclass('JJWXR_CameraFollow')
export class JJWXR_CameraFollow extends Component {

    @property(Node)
    private bulletNode: Node = null; // 子弹节点

    @property(Vec3)
    private offset: Vec3 = new Vec3(0, 2, -5); // 摄像机与子弹的偏移量

    private bulletScript: JJWXR_Bullet = null;

    start() {
        // 获取子弹脚本
        this.bulletScript = this.bulletNode.getComponent(JJWXR_Bullet);

        // 订阅子弹位置变化
        if (this.bulletScript) {
            // this.bulletScript.onPositionChange = (position: Vec3) => {
            //     this.followBullet(position);
            // };
        }
    }

    // 摄像机跟随子弹
    private followBullet(bulletPosition: Vec3) {
        // 计算摄像机的新位置
        const newPosition = new Vec3();
        Vec3.add(newPosition, bulletPosition, this.offset);

        // 更新摄像机位置
        this.node.setPosition(newPosition);
    }
}