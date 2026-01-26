import { _decorator, Component, Vec3, BoxCollider2D, CircleCollider2D, PolygonCollider2D, Vec2, Collider2D } from 'cc';
const { ccclass, property } = _decorator;

/**
 * 墙体控制器
 * 处理墙体碰撞和法线计算
 * Requirements: 2.2 - 舌头碰到墙体会根据角度反弹
 */
@ccclass('WZBPW_WallController')
export class WZBPW_WallController extends Component {
    // 碰撞体组件引用（支持所有类型的Collider2D）
    @property({ type: Collider2D, tooltip: '碰撞体组件，支持BoxCollider2D、CircleCollider2D、PolygonCollider2D等' })
    public collider: Collider2D | null = null;

    onLoad() {
        // 如果没有手动指定碰撞体，尝试自动获取
        if (!this.collider) {
            // 尝试获取各种类型的碰撞体
            this.collider = this.getComponent(BoxCollider2D) 
                || this.getComponent(CircleCollider2D) 
                || this.getComponent(PolygonCollider2D)
                || this.getComponent(Collider2D);
            
            if (this.collider) {
                console.log(`WZBPW_WallController: Auto-detected collider type: ${this.collider.constructor.name}`);
            } else {
                console.warn('WZBPW_WallController: No collider found on this node');
            }
        }
    }

    /**
     * 获取碰撞点的法线方向
     * 根据碰撞点相对于墙体中心的位置，计算出碰撞面的法线
     * @param hitPoint 碰撞点（世界坐标）
     * @returns 法线方向（归一化向量）
     */
    public getNormal(hitPoint: Vec3): Vec3 {
        const wallWorldPos = this.node.getWorldPosition();
        
        // 获取墙体尺寸
        let halfWidth = 50;  // 默认值
        let halfHeight = 50; // 默认值
        
        if (this.collider) {
            // 根据碰撞体类型获取尺寸
            if (this.collider instanceof BoxCollider2D) {
                const boxCollider = this.collider as BoxCollider2D;
                halfWidth = boxCollider.size.width / 2;
                halfHeight = boxCollider.size.height / 2;
            } else if (this.collider instanceof CircleCollider2D) {
                const circleCollider = this.collider as CircleCollider2D;
                halfWidth = circleCollider.radius;
                halfHeight = circleCollider.radius;
            } else if (this.collider instanceof PolygonCollider2D) {
                // 对于多边形碰撞体，使用默认值或计算包围盒
                // 这里简化处理，使用默认值
                halfWidth = 50;
                halfHeight = 50;
            }
        }

        // 计算碰撞点相对于墙体中心的偏移
        const relativeX = hitPoint.x - wallWorldPos.x;
        const relativeY = hitPoint.y - wallWorldPos.y;

        // 计算碰撞点在墙体边界上的相对位置
        // 通过比较相对位置与墙体尺寸的比例来确定碰撞面
        const ratioX = Math.abs(relativeX) / halfWidth;
        const ratioY = Math.abs(relativeY) / halfHeight;

        let normal = new Vec3();

        // 根据比例判断碰撞发生在哪个面
        if (ratioX > ratioY) {
            // 碰撞发生在左右面
            normal.x = relativeX > 0 ? 1 : -1;
            normal.y = 0;
        } else {
            // 碰撞发生在上下面
            normal.x = 0;
            normal.y = relativeY > 0 ? 1 : -1;
        }

        normal.z = 0;
        normal.normalize();

        return normal;
    }

    /**
     * 获取墙体的边界框（世界坐标）
     * @returns 边界框 { min: Vec2, max: Vec2 }
     */
    public getBounds(): { min: Vec2, max: Vec2 } {
        const wallWorldPos = this.node.getWorldPosition();
        
        let halfWidth = 50;
        let halfHeight = 50;
        
        if (this.collider) {
            // 根据碰撞体类型获取尺寸
            if (this.collider instanceof BoxCollider2D) {
                const boxCollider = this.collider as BoxCollider2D;
                halfWidth = boxCollider.size.width / 2;
                halfHeight = boxCollider.size.height / 2;
            } else if (this.collider instanceof CircleCollider2D) {
                const circleCollider = this.collider as CircleCollider2D;
                halfWidth = circleCollider.radius;
                halfHeight = circleCollider.radius;
            } else if (this.collider instanceof PolygonCollider2D) {
                // 对于多边形碰撞体，使用默认值或计算包围盒
                halfWidth = 50;
                halfHeight = 50;
            }
        }

        return {
            min: new Vec2(wallWorldPos.x - halfWidth, wallWorldPos.y - halfHeight),
            max: new Vec2(wallWorldPos.x + halfWidth, wallWorldPos.y + halfHeight)
        };
    }
}
