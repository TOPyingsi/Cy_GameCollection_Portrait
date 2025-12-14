import { _decorator, Vec2 } from 'cc';
export enum AStar_Node_Type {
        Normal,
        Obstacle
}

export class AStarManager {
        private static _instance: AStarManager = null;
        public static get Instance() {
                if (!this._instance) {
                        this._instance = new AStarManager;
                }
                return this._instance;
        };

        public MapWidth: number;

        public MapHeight: number;

        public Nodes: AStarNode[][] = [];

        private _openList: AStarNode[] = [];
        private _closeList: AStarNode[] = [];

        public InitMapInfo(w: number, h: number) {
                this.MapWidth = w;
                this.MapHeight = h;
                for (let i = 0; i < w; i++) {
                        if (!this.Nodes[i]) {
                                this.Nodes[i] = [];
                        }
                }
        }
        public SetMap(i: number, j: number, type: AStar_Node_Type) {
                let node = new AStarNode(i, j, type);
                this.Nodes[i][j] = node;
        }
        public SetNodeType(i: number, j: number, type: AStar_Node_Type) {
                if (i == 12 && j == 17) {
                        console.log(this.Nodes[i][j]);
                }
                if (this.Nodes[i][j]) {
                        this.Nodes[i][j].type = type;
                }
        }
        // public InitMapInfo(w: number, h: number) {
        //     this.MapWidth = w;
        //     this.MapHeight = h;
        //     for (let i = 0; i < w; i++) {
        //         for (let j = 0; j < h; j++) {
        //             let node = new AStarNode(i, j, AStar_Node_Type.Normal);
        //             this.Nodes[i][j] = node;
        //         }
        //     }
        // }
        public FindPath(startPos: Vec2, endPos: Vec2): AStarNode[] {
                //在地图范围内
                if (startPos.x < 0 || startPos.x >= this.MapWidth || startPos.y < 0 || startPos.y >= this.MapHeight ||
                        endPos.x < 0 || endPos.x >= this.MapWidth || endPos.y < 0 || endPos.y >= this.MapHeight) {
                        console.log(startPos.x < 0);
                        console.log(startPos.x >= this.MapWidth);
                        console.log(startPos.y < 0);
                        console.log(startPos.y >= this.MapHeight);
                        console.log(endPos.x < 0);
                        console.log(endPos.x >= this.MapWidth);
                        console.log(endPos.y < 0);
                        console.log(endPos.y >= this.MapHeight);
                        console.log("在地图范围外");
                        return null;
                }

                //不可阻挡
                let start: AStarNode = this.Nodes[startPos.x][startPos.y];
                let end: AStarNode = this.Nodes[endPos.x][endPos.y];
                if (start.type == AStar_Node_Type.Obstacle || end.type == AStar_Node_Type.Obstacle) {
                        console.log("起始点或终点为不可到达点");
                        return null;
                }

                //把开始点放入到关闭列表中
                this._openList = [];
                this._closeList = [];
                start.father = null;
                start.f = 0;
                start.g = 0;
                start.h = 0;
                this._closeList.push(start);

                while (true) {
                        //左上
                        // this.FindRoundNodeToOpenList(start.x - 1, start.y + 1, 1, start, end);
                        //上
                        this.FindRoundNodeToOpenList(start.x, start.y - 1, 1, start, end);
                        //右上
                        // this.FindRoundNodeToOpenList(start.x + 1, start.y + 1, 1, start, end);
                        //左
                        this.FindRoundNodeToOpenList(start.x - 1, start.y, 1, start, end);
                        //右
                        this.FindRoundNodeToOpenList(start.x + 1, start.y, 1, start, end);
                        //左下
                        // this.FindRoundNodeToOpenList(start.x - 1, start.y - 1, 1, start, end);
                        //下
                        this.FindRoundNodeToOpenList(start.x, start.y + 1, 1, start, end);
                        //右下
                        // this.FindRoundNodeToOpenList(start.x + 1, start.y - 1, 1, start, end);

                        //死路判断，当前开启列表为空。表示所有的路径都被寻找完毕
                        if (this._openList.length == 0) {
                                console.log("终点不可到达");
                                return null;
                        }

                        //选出开启列表中寻路消耗最小的那个点
                        this._openList.sort((a, b) => a.f - b.f);

                        //放入关闭列表再从开启列表中移除
                        this._closeList.push(this._openList[0]);
                        start = this._openList[0];
                        this._openList.splice(0, 1);

                        //找到路径
                        if (start == end) {
                                let path: AStarNode[] = [];
                                path.push(end);
                                while (end.father != null) {
                                        path.push(end.father);
                                        end = end.father;
                                }

                                path.reverse();
                                return path;
                        }
                }
        }
        //第二种寻路(不会贴边行走)
        public FindPath2(startPos: Vec2, endPos: Vec2): AStarNode[] {
                //在地图范围内
                if (startPos.x < 0 || startPos.x >= this.MapWidth || startPos.y < 0 || startPos.y >= this.MapHeight ||
                        endPos.x < 0 || endPos.x >= this.MapWidth || endPos.y < 0 || endPos.y >= this.MapHeight) {
                        console.log("在地图范围外");
                        return null;
                }

                //不可阻挡
                let start: AStarNode = this.Nodes[startPos.x][startPos.y];
                let end: AStarNode = this.Nodes[endPos.x][endPos.y];
                if (start.type == AStar_Node_Type.Obstacle || end.type == AStar_Node_Type.Obstacle) {
                        console.log("起始点或终点为不可到达点");
                        return null;
                }

                //把开始点放入到关闭列表中
                this._openList = [];
                this._closeList = [];
                start.father = null;
                start.g = 0;
                start.h = this.calculateHeuristic(start, end);
                start.f = start.g + start.h;
                this._closeList.push(start);

                while (true) {
                        // 只考虑上下左右四个方向
                        this.FindRoundNodeToOpenList2(start.x, start.y - 1, 1, start, end); // 上
                        this.FindRoundNodeToOpenList2(start.x - 1, start.y, 1, start, end); // 左
                        this.FindRoundNodeToOpenList2(start.x + 1, start.y, 1, start, end); // 右
                        this.FindRoundNodeToOpenList2(start.x, start.y + 1, 1, start, end); // 下

                        // 死路判断
                        if (this._openList.length == 0) {
                                console.log("终点不可到达");
                                return null;
                        }

                        // 选出开启列表中寻路消耗最小的那个点
                        this._openList.sort((a, b) => a.f - b.f);

                        // 放入关闭列表再从开启列表中移除
                        this._closeList.push(this._openList[0]);
                        start = this._openList[0];
                        this._openList.splice(0, 1);

                        // 找到路径
                        if (start == end) {
                                let path: AStarNode[] = [];
                                path.push(end);
                                while (end.father != null) {
                                        path.push(end.father);
                                        end = end.father;
                                }
                                path.reverse();

                                // 关键优化：添加路径平滑处理
                                return this.smoothPath(path);
                        }
                }
        }
        // 修改后的启发函数计算（避免贴边）
        private calculateHeuristic(node: AStarNode, end: AStarNode): number {
                const dx = Math.abs(end.x - node.x);
                const dy = Math.abs(end.y - node.y);
                const baseH = dx + dy; // 曼哈顿距离

                // 边缘惩罚（距离地图边缘越近惩罚越大）
                const edgeDistX = Math.min(node.x, this.MapWidth - 1 - node.x);
                const edgeDistY = Math.min(node.y, this.MapHeight - 1 - node.y);
                const edgePenalty = Math.max(0, 3 - Math.min(edgeDistX, edgeDistY)) * 10; // 动态惩罚值

                // 障碍物惩罚（检查3x3范围内的障碍物）
                let obstaclePenalty = 0;
                for (let x = node.x - 1; x <= node.x + 1; x++) {
                        for (let y = node.y - 1; y <= node.y + 1; y++) {
                                if (x >= 0 && x < this.MapWidth && y >= 0 && y < this.MapHeight) {
                                        if (this.Nodes[x][y]?.type === AStar_Node_Type.Obstacle) {
                                                const dist = Math.abs(node.x - x) + Math.abs(node.y - y);
                                                obstaclePenalty += (4 - dist) * 8; // 越近惩罚越大
                                        }
                                }
                        }
                }

                return baseH + edgePenalty + obstaclePenalty;
        }
        private FindRoundNodeToOpenList2(x: number, y: number, g: number, father: AStarNode, end: AStarNode) {
                // 边界判断
                if (x < 0 || x >= this.MapWidth || y < 0 || y >= this.MapHeight) return;

                let node: AStarNode = this.Nodes[x][y];
                if (node == null || node.type == AStar_Node_Type.Obstacle ||
                        this._closeList.some(e => e == node) ||
                        this._openList.some(e => e == node))
                        return;

                // 核心计算
                node.father = father;
                node.g = father.g + g;

                // 使用新的启发函数计算
                node.h = this.calculateHeuristic(node, end);
                node.f = node.g + node.h;

                this._openList.push(node);
        }
        private smoothPath(originalPath: AStarNode[]): AStarNode[] {
                if (originalPath.length < 3) return originalPath;

                const smoothed: AStarNode[] = [originalPath[0]];

                // 仅允许水平和垂直方向移动
                for (let i = 1; i < originalPath.length - 1; i++) {
                        const prev = originalPath[i - 1];
                        const current = originalPath[i];
                        const next = originalPath[i + 1];

                        // 检查是否在水平/垂直直线上 (关键修改)
                        const isHorizontalLine = prev.y === current.y && current.y === next.y;
                        const isVerticalLine = prev.x === current.x && current.x === next.x;

                        // 只有在直线上的点才考虑跳过
                        if (isHorizontalLine || isVerticalLine) {
                                // 检查直线是否可达
                                if (this.isWalkableBetween(prev, next)) {
                                        continue; // 跳过当前点
                                }
                        }
                        smoothed.push(current);
                }

                smoothed.push(originalPath[originalPath.length - 1]);
                return smoothed;
        }


        // 改进的直线行走检查（使用Bresenham算法）
        private isWalkableBetween(start: AStarNode, end: AStarNode): boolean {
                // 确保是水平或垂直线
                if (start.x !== end.x && start.y !== end.y) {
                        return false;
                }

                // 水平线检测
                if (start.y === end.y) {
                        const minX = Math.min(start.x, end.x);
                        const maxX = Math.max(start.x, end.x);
                        for (let x = minX; x <= maxX; x++) {
                                if (this.Nodes[x][start.y].type === AStar_Node_Type.Obstacle) {
                                        return false;
                                }
                        }
                        return true;
                }

                // 垂直线检测
                if (start.x === end.x) {
                        const minY = Math.min(start.y, end.y);
                        const maxY = Math.max(start.y, end.y);
                        for (let y = minY; y <= maxY; y++) {
                                if (this.Nodes[start.x][y].type === AStar_Node_Type.Obstacle) {
                                        return false;
                                }
                        }
                        return true;
                }

                return false;
        }
        // 检查两点之间是否可以直接行走（无障碍物）
        private checkDirectWalkable(start: AStarNode, end: AStarNode): boolean {
                const dx = Math.abs(end.x - start.x);
                const dy = Math.abs(end.y - start.y);

                // 如果两点在同一行或同一列，直接检查
                if (dx === 0 || dy === 0) {
                        return true;
                }

                // 使用Bresenham算法检查直线路径上的所有点
                let x = start.x;
                let y = start.y;
                const sx = start.x < end.x ? 1 : -1;
                const sy = start.y < end.y ? 1 : -1;
                let err = dx - dy;

                while (x !== end.x || y !== end.y) {
                        if (this.Nodes[x][y].type === AStar_Node_Type.Obstacle) {
                                return false;
                        }

                        const e2 = 2 * err;
                        if (e2 > -dy) {
                                err -= dy;
                                x += sx;
                        }
                        if (e2 < dx) {
                                err += dx;
                                y += sy;
                        }
                }

                return true;
        }
        // 新增直线可达性检查
        private IsWalkableInLine(from: AStarNode, to: AStarNode): boolean {
                const dx = Math.abs(to.x - from.x);
                const dy = Math.abs(to.y - from.y);
                const sx = from.x < to.x ? 1 : -1;
                const sy = from.y < to.y ? 1 : -1;
                let err = dx - dy;

                let x = from.x;
                let y = from.y;

                while (x !== to.x || y !== to.y) {
                        if (this.Nodes[x][y].type === AStar_Node_Type.Obstacle) {
                                return false;
                        }

                        const e2 = 2 * err;
                        if (e2 > -dy) {
                                err -= dy;
                                x += sx;
                        }
                        if (e2 < dx) {
                                err += dx;
                                y += sy;
                        }
                }
                return true;
        }


        private FindRoundNodeToOpenList(x: number, y: number, g: number, father: AStarNode, end: AStarNode) {
                //边界判断
                if (x < 0 || x >= this.MapWidth || y < 0 || y >= this.MapHeight) return;

                let node: AStarNode = this.Nodes[x][y];
                if (node == null || node.type == AStar_Node_Type.Obstacle || this._closeList.some(e => e == node) || this._openList.some(e => e == node))
                        return;

                //核心计算，计算 f 值 f = g + h
                node.father = father;
                //计算 g ，node 离起点的距离 = father.G + g ，有一个累加过程
                node.g = father.g + g;
                node.h = Math.abs(end.x - node.x) + Math.abs(end.y - node.y);
                node.f = node.g + node.h;

                this._openList.push(node);
        }
}

export class AStarNode {
        constructor(x: number, y: number, type: AStar_Node_Type) {
                this.x = x;
                this.y = y;
                this.type = type;
        }
        x: number;
        y: number;
        f: number;
        g: number;
        h: number;
        father: AStarNode;
        type: AStar_Node_Type;
}