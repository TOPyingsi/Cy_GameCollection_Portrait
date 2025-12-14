// XDMKQ_PathManager.ts
import { _decorator, Component, Vec3, PhysicsSystem, geometry, Node, math } from 'cc';
import { XDMKQ_Point } from './XDMKQ_Point';
const { ccclass, property } = _decorator;

type Edge = { to: string, cost: number };

@ccclass('XDMKQ_PathManager')
export class XDMKQ_PathManager extends Component {
    public static Instance: XDMKQ_PathManager;

    // 可选：启用“视线可达”作为邻接过滤（两点间无障碍才视为可走）
    @property({ tooltip: '邻接是否需要无碰撞直视验证（需要物理系统与正确的碰撞层）' })
    useLOSCheck = false;

    @property({ type: Node, displayName: '轰炸范围' })
    HZ: Node[] = [];

    @property({ type: Node, displayName: '空投范围' })
    KT: Node[] = [];

    public MapPoint: Map<string, XDMKQ_Point> = new Map();
    public MapPointCount: Map<string, number> = new Map();
    protected onLoad(): void {
        XDMKQ_PathManager.Instance = this;
    }

    /** 从场景节点关系构建“邻接表”，返回 {id -> edges[]} */
    private buildGraph(): Map<string, Edge[]> {
        const graph = new Map<string, Edge[]>();
        for (const [id, p] of this.MapPoint) {
            const edges: Edge[] = [];
            for (const nbNode of p.Neighbors) {
                if (!nbNode) continue;
                const nb = nbNode.getComponent(XDMKQ_Point)!;
                if (this.useLOSCheck && !this.visible(p.WorldPosition, nb.WorldPosition)) continue;
                const cost = Vec3.distance(p.WorldPosition, nb.WorldPosition);
                edges.push({ to: nb.ID, cost });
            }
            graph.set(id, edges);
        }
        return graph;
    }

    /// 检测两个点是否“可见”
    private visible = (a: Vec3, b: Vec3) => {
        const dir = new Vec3(); Vec3.subtract(dir, b, a);
        const ray = new geometry.Ray(a.x, a.y + 0.1, a.z, dir.x, dir.y, dir.z);
        // 注意：第二个参数可以替换为你的碰撞层掩码；第三个参数是射线最大距离
        const hit = PhysicsSystem.instance.raycastClosest(ray, 0xffffffff, dir.length());
        return !hit; // 没命中障碍，视为可见
    };

    /** 返回离给定世界坐标最近的路点 id；如果启用 useLOSCheck，会优先选可视的 */
    public PickNearestPointId(pos: Vec3): string | null {
        let best: string | null = null;
        let dmin = Number.POSITIVE_INFINITY;

        // 先找“可视最近”，找不到再退化为“最近”
        for (const [, p] of this.MapPoint) {
            const d = Vec3.distance(pos, p.WorldPosition);
            if (d < dmin && (!this.useLOSCheck || this.visible(pos, p.WorldPosition))) {
                dmin = d; best = p.ID;
            }
        }
        if (best) return best;

        dmin = Number.POSITIVE_INFINITY;
        for (const [, p] of this.MapPoint) {
            const d = Vec3.distance(pos, p.WorldPosition);
            if (d < dmin) { dmin = d; best = p.ID; }
        }
        return best;
    }

    /** A*：从 startId 到 goalId，返回世界坐标路径（包含起点与终点对应的路点位置） */
    public FindPathById(startId: string, goalId: string): Vec3[] {
        if (!startId || !goalId) return [];
        if (!this.MapPoint.has(startId) || !this.MapPoint.has(goalId)) return [];
        if (startId === goalId) return [this.MapPoint.get(startId)!.WorldPosition];

        const graph = this.buildGraph();
        const h = (id: string) => {
            const a = this.MapPoint.get(id)!.WorldPosition;
            const b = this.MapPoint.get(goalId)!.WorldPosition;
            return Vec3.distance(a, b);
        };

        const open = new Set<string>([startId]);
        const came = new Map<string, string>(); // child -> parent
        const g = new Map<string, number>([[startId, 0]]);
        const f = new Map<string, number>([[startId, h(startId)]]);

        // 选 f 最小
        const popMinF = () => {
            let cur: string | null = null, fmin = Infinity;
            for (const id of open) {
                const fi = f.get(id) ?? Infinity;
                if (fi < fmin) { fmin = fi; cur = id; }
            }
            return cur!;
        };

        let safety = 100000; // 安全阈值，避免意外死循环
        while (open.size && safety-- > 0) {
            const current = popMinF();
            if (current === goalId) {
                // 回溯
                const ids = [current];
                let cur = current;
                // 防止 came 链异常造成死循环
                let guard = 100000;
                while (came.has(cur) && guard-- > 0) {
                    const prev = came.get(cur)!;
                    ids.push(prev);
                    cur = prev;
                }
                ids.reverse();
                return ids.map(id => this.MapPoint.get(id)!.WorldPosition.clone());
            }

            open.delete(current);
            const edges = graph.get(current) || [];
            for (const e of edges) {
                const tentative = (g.get(current) ?? Infinity) + e.cost;
                if (tentative < (g.get(e.to) ?? Infinity)) {
                    came.set(e.to, current);
                    g.set(e.to, tentative);
                    f.set(e.to, tentative + h(e.to));
                    open.add(e.to);
                }
            }
        }
        return [];
    }

    /** 简单平滑：能直视后面更远的点就跳过中间点 */
    public SmoothPath(path: Vec3[]): Vec3[] {
        if (path.length <= 2) return path;
        const out: Vec3[] = [path[0].clone()];

        let i = 0;
        while (i < path.length - 1) {
            let j = path.length - 1;
            for (; j > i + 1; --j) {
                if (!this.useLOSCheck || this.visible(path[i], path[j])) break;
            }
            out.push(path[j].clone());
            i = j;
        }
        return out;
    }

    /** 通过当前Id获取随机下一个点 */
    public GetRandomPoint(curId: string): string {
        if (!curId) return "";
        if (!this.MapPoint.has(curId)) return "";
        const graph = this.buildGraph();
        const edges = graph.get(curId) || [];
        return this.GetPointByArr(edges);
    }

    /** 通过Arr 跟权重获取Point */
    private GetPointByArr(arr: Edge[]): string {
        if (arr.length <= 0) return "";

        // 默认权重
        const weights: number[] = arr.map(e => this.MapPointCount.has(e.to) && this.MapPointCount.get(e.to) > 0 ? this.MapPointCount.get(e.to) : 1000);
        const totalWeight: number = weights.reduce((a, b) => a + b, 0);
        const rand: number = math.randomRangeInt(0, totalWeight);

        let cumulative: number = 0;
        for (let i = 0; i < arr.length; i++) {
            cumulative += weights[i];
            if (rand <= cumulative) {
                return arr[i].to;
            }
        }
        return "";
    }

    /** 通过当前Id获取WorldPos */
    public GetWorldPosById(curId: string): Vec3 {
        if (!curId) return new Vec3();
        if (!this.MapPoint.has(curId)) return new Vec3();
        return this.MapPoint.get(curId)!.WorldPosition.clone();
    }


    /** 通过当前Id 和 rand获取随机有可能存在的路径 */
    public GetRandomPath(curId: string, rand: number): Vec3[] {
        if (this.GetRandomPoint(curId) == "" || rand <= 0) return [];
        const randPath: string[] = [];
        let tempId = curId;
        while (true) {
            const curRand = math.random();
            if (curRand <= rand) {
                tempId = this.GetRandomPoint(tempId);
                if (tempId == "") break;
                randPath.push(tempId);
            }
            break;
        }
        if (randPath.length <= 0) return [];
        return this.FindPathById(curId, randPath[randPath.length - 1]);
    }

    /** 添加目标地 */
    public AddTargetPoint(id: string) {
        if (this.MapPointCount.has(id)) {
            this.MapPointCount.set(id, this.MapPointCount.get(id) + 1);
        } else {
            this.MapPointCount.set(id, 1);
        }
    }

    /** 去除目标地 */
    public RemoveTargetPoint(id: string) {
        if (this.MapPointCount.has(id) && this.MapPointCount.get(id) > 0) {
            this.MapPointCount.set(id, this.MapPointCount.get(id) - 1);
        }
    }

    /** 清除目标点 */
    public ClearTargetPoint() {
        this.MapPointCount.clear();
    }

    /** 修改目标地 */
    public ChangeTargetPoint(oldId: string, newId: string) {
        this.AddTargetPoint(newId);
        this.RemoveTargetPoint(oldId);
        // console.error(this.MapPointCount);
    }

    /**获取轰炸范围内随机一点 */
    public GetPosOnHZ(): Vec3[] {
        let minX: number = 0;
        let maxX: number = 0;
        let minZ: number = 0;
        let maxZ: number = 0;
        this.HZ.forEach(e => {
            minX = Math.min(minX, e.worldPositionX);
            maxX = Math.max(maxX, e.worldPositionX);
            minZ = Math.min(minZ, e.worldPositionZ);
            maxZ = Math.max(maxZ, e.worldPositionZ);
        })

        let pos: Vec3[] = [];
        const dis: number = 8;
        for (let h = 0; h < (maxZ - minZ) / dis; h++) {
            for (let v = 0; v < (maxX - minX) / dis; v++) {
                pos.push(new Vec3(minX + v * dis, this.HZ[0].worldPositionY, minZ + h * dis));
            }
        }

        return pos;
    }

    /**获取空投范围内随机一点 */
    public GetPosOnKT(): Vec3 {
        let minX: number = 0;
        let maxX: number = 0;
        let minZ: number = 0;
        let maxZ: number = 0;
        this.KT.forEach(e => {
            minX = Math.min(minX, e.worldPositionX);
            maxX = Math.max(maxX, e.worldPositionX);
            minZ = Math.min(minZ, e.worldPositionZ);
            maxZ = Math.max(maxZ, e.worldPositionZ);
        })
        const x: number = math.randomRange(minX, maxX);
        const z: number = math.randomRange(minZ, maxZ);
        return new Vec3(x, this.KT[0].worldPositionY, z);
    }

}
