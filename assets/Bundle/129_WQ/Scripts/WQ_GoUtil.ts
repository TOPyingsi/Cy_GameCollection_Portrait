export enum WQ_ChessType {
    NONE = 0,    // 空位置
    BLACK = 1,   // 黑棋
    WHITE = 2    // 白棋
}


export enum WQ_ExpressionType {
    NONE = 0,    // 无表情
    笑脸 = 1,    // 笑脸表情
    严肃 = 2,    // 严肃表情
    惊吓 = 3,    // 惊吓表情
}

export class WQ_Pos {
    /**
     * 棋盘坐标位置类
     * @param x 横轴坐标（列）
     * @param y 纵轴坐标（行）
     */
    constructor(public x: number, public y: number) {}
    
    /**
     * 判断当前位置是否与目标位置相同
     * @param p 目标位置对象
     * @returns 坐标相同返回true，否则返回false
     */
    equal(p: WQ_Pos): boolean {
        return this.x === p.x && this.y === p.y;
    }

    /**
     * 将坐标转换为字符串格式（x,y），用于Set/Map的键值存储
     * @returns 坐标字符串，如 "3,5"
     */
    toString(): string {
        return `${this.x},${this.y}`;
    }

    /**
     * 计算与目标位置的欧几里得距离（平方）
     * 避免开根号运算，提升性能，比较距离时效果等价
     * @param p 目标位置
     * @returns 距离平方值
     */
    distanceSqTo(p: WQ_Pos): number {
        const dx = this.x - p.x;
        const dy = this.y - p.y;
        return dx * dx + dy * dy;
    }
}

export enum WQ_LinkType {
    无 = 0,   
    相邻 = 1,   
    两步直线 = 2,
    对角 = 3,
    日字型 = 4
}

// 新增连接项接口定义
export interface WQ_ChessLinkItem {
    pos: WQ_Pos;
    linkType: WQ_LinkType;
}

export class WQ_GoUtil {
    // 上下左右四个方向的偏移量（[-1,0]上、[1,0]下、[0,-1]左、[0,1]右）
    private static DIRS = [[-1, 0], [1, 0], [0, -1], [0, 1]];


    
  // ===== 新增：棋块管理核心数据 =====
    // 棋块ID生成器（全局递增）
    private static blockIdCounter = 1;
    // 棋子坐标 -> 所属棋块ID的映射
    private static posToBlockIdMap: Map<string, number> = new Map();
    // 棋块ID -> 棋块详细信息的映射
    private static blockInfoMap: Map<number, {
        stones: WQ_Pos[],          // 包含的棋子列表
        color: WQ_ChessType,       // 棋块颜色
        latestPos: WQ_Pos          // 最新落子坐标
    }> = new Map();


    private static latestPoses: WQ_Pos[]=[]



        // 连接类型优先级（数值越大优先级越高）
    private static LINK_PRIORITY = {
        [WQ_LinkType.相邻]: 4,
        [WQ_LinkType.对角]: 3,
        [WQ_LinkType.两步直线]: 2,
        [WQ_LinkType.日字型]: 1,
        [WQ_LinkType.无]: 0
    };

    /**
     * 重置棋块表情数据
     */
    static resetLastPosData(){
        this.latestPoses = [];
    }

    /**
     * 重置所有棋块数据（初始化棋盘时调用）
     */
    static resetBlockData() {
        this.blockIdCounter = 1;
        this.posToBlockIdMap.clear();
        this.blockInfoMap.clear();
    }

    /**
     * 新增方法1：获取当前棋盘所有棋块信息
     * @param board 棋盘数据
     * @returns {
     *   blockIds: {黑棋: number[], 白棋: number[]},  // 各颜色棋块ID列表
     *   blockDetails: {[blockId: number]: {stones: WQ_Pos[], color: WQ_ChessType, latestPos: WQ_Pos}} // 棋块详细信息
     * }
     */
    static getAllBlocksInfo(board: WQ_ChessType[][]): {
        blockIds: {黑棋: number[], 白棋: number[]},
        blockDetails: {[blockId: number]: {stones: WQ_Pos[], color: WQ_ChessType, latestPos: WQ_Pos}}
    } {
        console.log("重新扫描 当前所有棋子坐标到棋块ID的映射：", this.posToBlockIdMap);
        // 先全量扫描棋盘，更新棋块数据（确保数据最新）
        this.scanBoardAndUpdateBlocks(board);
        console.log("扫描后 当前所有棋子坐标到棋块ID的映射：", this.posToBlockIdMap);


        // 1. 整理各颜色棋块ID
        const blockIds = {黑棋: [] as number[], 白棋: [] as number[]};
        this.blockInfoMap.forEach((info, blockId) => {
            if (info.color === WQ_ChessType.BLACK) {
                blockIds.黑棋.push(blockId);
            } else if (info.color === WQ_ChessType.WHITE) {
                blockIds.白棋.push(blockId);
            }
        });

        // 2. 整理棋块详细信息（转换为对象格式）
        const blockDetails: {[blockId: number]: {stones: WQ_Pos[], color: WQ_ChessType, latestPos: WQ_Pos}} = {};
        this.blockInfoMap.forEach((info, blockId) => {
            blockDetails[blockId] = {
                stones: [...info.stones], // 深拷贝避免外部修改
                color: info.color,
                latestPos: new WQ_Pos(info.latestPos.x, info.latestPos.y)
            };
        });
        console.log("当前所有棋块信息：", this.blockInfoMap);

        return { blockIds, blockDetails };
    }


    /**
     * 新增方法：传入棋块ID，获取对应的棋块详细信息
     * @param blockId 棋块ID
     * @returns 棋块详细信息（深拷贝，避免外部修改原数据），棋块不存在则返回null
     */
    static getBlockInfoById(blockId: number): {
        stones: WQ_Pos[],          // 包含的棋子列表
        color: WQ_ChessType,       // 棋块颜色
        latestPos: WQ_Pos          // 最新落子坐标
    } | null {
        // 1. 参数校验：棋块ID必须为有效数字
        if (typeof blockId !== 'number' || blockId < 1) {
            console.warn(`无效的棋块ID：${blockId}，ID必须为大于0的数字`);
            return null;
        }

        // 2. 检查棋块是否存在
        const blockInfo = this.blockInfoMap.get(blockId);
        if (!blockInfo) {
            console.warn(`棋块ID ${blockId} 不存在`);
            return null;
        }

        // 3. 返回深拷贝的数据，避免外部修改原数据
        return {
            stones: blockInfo.stones.map(pos => new WQ_Pos(pos.x, pos.y)), // 深拷贝棋子坐标
            color: blockInfo.color,
            latestPos: new WQ_Pos(blockInfo.latestPos.x, blockInfo.latestPos.y) // 深拷贝最新落子坐标
        };
    }



        /**
         * 新增方法：获取当前棋局的所有棋块ID（支持按颜色分类或返回全部）
         * @param board 棋盘数据（确保棋块数据最新）
         * @param returnAll 是否返回所有棋块ID的扁平列表（默认false：按颜色分类）
         * @returns 若returnAll=true，返回number[]（所有棋块ID）；否则返回{黑棋: number[], 白棋: number[]}
         */
        static getAllBlockIds(
            // board: WQ_ChessType[][],
            returnAll: boolean = false
        ): number[] | {黑棋: number[], 白棋: number[]} {
            // // 1. 确保棋块数据是最新的（先扫描棋盘）
            // this.scanBoardAndUpdateBlocks(board);

            // 2. 初始化分类存储容器
            const blockIds = {黑棋: [] as number[], 白棋: [] as number[]};
            
            // 3. 遍历所有棋块，按颜色分类收集ID
            this.blockInfoMap.forEach((info, blockId) => {
                if (info.color === WQ_ChessType.BLACK) {
                    blockIds.黑棋.push(blockId);
                } else if (info.color === WQ_ChessType.WHITE) {
                    blockIds.白棋.push(blockId);
                }
            });

            // 4. 根据参数返回不同格式
            if (returnAll) {
                // 返回扁平列表（黑棋ID + 白棋ID）
                return [...blockIds.黑棋, ...blockIds.白棋];
            } else {
                // 返回按颜色分类的结构
                return blockIds;
            }
        }









    /**
     * 新增方法2：落子时更新所属棋块信息
     * @param board 棋盘数据
     * @param x 落子x坐标
     * @param y 落子y坐标
     * @param color 落子颜色
     */
    static updateBlockOnMove(board: WQ_ChessType[][], x: number, y: number, color: WQ_ChessType) {
        const pos = new WQ_Pos(x, y);
        const posKey = pos.toString();

        // 1. 检查相邻同色棋块（用于合并棋块）
        const adjacentBlockIds = new Set<number>();
        for (const [dx, dy] of this.DIRS) {
            const nx = x + dx;
            const ny = y + dy;
            if (nx < 0 || nx >= board.length || ny < 0 || ny >= board.length) continue;
            
            const neighborKey = `${nx},${ny}`;
            if (board[nx][ny] === color && this.posToBlockIdMap.has(neighborKey)) {
                adjacentBlockIds.add(this.posToBlockIdMap.get(neighborKey)!);
            }
        }

        // 2. 处理棋块合并/新建
        let targetBlockId: number;
        if (adjacentBlockIds.size === 0) {
            // 无相邻同色棋块 -> 新建棋块
            targetBlockId = this.blockIdCounter++;
            this.blockInfoMap.set(targetBlockId, {
                stones: [pos],
                color: color,
                latestPos: pos
            });
            this.latestPoses.push(pos);


        } else {
             // 无相邻同色棋块 -> 新建棋块
             targetBlockId = this.blockIdCounter++;
             this.blockInfoMap.set(targetBlockId, {
                 stones: [pos],
                 color: color,
                 latestPos: pos
             });
             this.latestPoses.push(pos);

             const targetBlock = this.blockInfoMap.get(targetBlockId);

               // 合并其他相邻棋块
            for (const blockId of adjacentBlockIds) {
                if (blockId === targetBlockId) continue;
                
                const mergeBlock = this.blockInfoMap.get(blockId)!;
                // 合并棋子列表
                targetBlock.stones.push(...mergeBlock.stones);
                // 更新棋子-棋块映射
                mergeBlock.stones.forEach(p => {
                    this.posToBlockIdMap.set(p.toString(), targetBlockId);
                });

                let isFound = false;
                let foundIndex = -1;
                this.latestPoses.forEach((pos,index)=>{
                    if(!isFound){
                        if(mergeBlock.latestPos.x == pos.x && mergeBlock.latestPos.y ==  pos.y){
                            foundIndex = index;
                            isFound = true;
                        }
                    }
                })
                if(foundIndex != -1){
                    this.latestPoses.splice(foundIndex,1)
                    console.log("删除了",foundIndex)
                }


                // 删除被合并的棋块
                this.blockInfoMap.delete(blockId);
            }


            // // // 有相邻同色棋块 -> 合并到第一个棋块，并删除其他棋块
            // // targetBlockId = Array.from(adjacentBlockIds)[0];
            // // const targetBlock = this.blockInfoMap.get(targetBlockId)!;
            
            // // 添加当前棋子到目标棋块
            // targetBlock.stones.push(pos);
            // let isFound = false;
            // let foundIndex = -1;
            // this.latestPoses.forEach((pos,index)=>{
            //     if(!isFound){
            //         if(targetBlock.latestPos.x == pos.x && targetBlock.latestPos.y ==  pos.y){
            //             foundIndex = index;
            //             isFound = true;
            //         }
            //     }
            // })
            // if(foundIndex != -1){
            //     this.latestPoses.splice(foundIndex,1)
            //     console.log("删除了",foundIndex)
            // }
            // targetBlock.latestPos = pos; // 更新最新落子坐标
            // this.latestPoses.push(pos);

            // console.log("落子坐标", pos);
            // console.log("合并棋块id", targetBlockId);

            // console.log("合并其他棋块前的所有棋块信息：", this.blockInfoMap);

            // // 合并其他相邻棋块
            // for (const blockId of adjacentBlockIds) {
            //     if (blockId === targetBlockId) continue;
                
            //     const mergeBlock = this.blockInfoMap.get(blockId)!;
            //     // 合并棋子列表
            //     targetBlock.stones.push(...mergeBlock.stones);
            //     // 更新棋子-棋块映射
            //     mergeBlock.stones.forEach(p => {
            //         this.posToBlockIdMap.set(p.toString(), targetBlockId);
            //     });
            //     // 删除被合并的棋块
            //     this.blockInfoMap.delete(blockId);
            // }
        }

        // 3. 记录当前棋子的棋块归属
        this.posToBlockIdMap.set(posKey, targetBlockId);

        console.log("更新落子 处理提子前的 棋子坐标到棋块ID的映射：", this.posToBlockIdMap);

        // 4. 处理提子后的棋块清理（删除被提子的棋块）
        this.cleanupCapturedBlocks(board);

        console.log("更新落子后的所有棋块信息：", this.blockInfoMap);

        console.log("更新落子 处理提子后的 棋子坐标到棋块ID的映射：", this.posToBlockIdMap);
    }

    // ===== 内部辅助方法 =====
    /**
     * 全量扫描棋盘，重建棋块数据（确保数据一致性）
     */
    private static scanBoardAndUpdateBlocks(board: WQ_ChessType[][]) {
        // 重置现有棋块数据
        this.resetBlockData();
        const size = board.length;
        const visited = Array(size).fill(0).map(() => Array(size).fill(false));

        // 遍历所有棋子位置
        for (let x = 0; x < size; x++) {
            for (let y = 0; y < size; y++) {
                const color = board[x][y];
                if (color === WQ_ChessType.NONE || visited[x][y]) continue;

                // BFS找当前棋块的所有棋子
                const queue: WQ_Pos[] = [new WQ_Pos(x, y)];
                const stones: WQ_Pos[] = [];
                visited[x][y] = true;

                while (queue.length > 0) {
                    const p = queue.shift()!;
                    stones.push(p);

                    for (const [dx, dy] of this.DIRS) {
                        const nx = p.x + dx;
                        const ny = p.y + dy;
                        if (nx < 0 || nx >= size || ny < 0 || ny >= size) continue;
                        
                        if (board[nx][ny] === color && !visited[nx][ny]) {
                            visited[nx][ny] = true;
                            queue.push(new WQ_Pos(nx, ny));
                        }
                    }
                }

                // 创建棋块数据
                const blockId = this.blockIdCounter++;
                this.blockInfoMap.set(blockId, {
                    stones: stones,
                    color: color,
                    latestPos: stones[stones.length - 1] // 假设最后遍历到的是最新落子（初始化时可忽略）
                });

                let isFound = false;
                let latestPos :WQ_Pos= null;

                // 更新棋子-棋块映射
                stones.forEach(p => {
                    this.posToBlockIdMap.set(p.toString(), blockId);
                    this.latestPoses.forEach((pos)=>{
                        if(!isFound){
                            if(pos.x == p.x && pos.y == p.y){
                                isFound = true;
                                latestPos = p;
                            }
                        }
                    })
                });

                this.blockInfoMap.set(blockId, {
                    stones: stones,
                    color: color,
                    latestPos: latestPos // 假设最后遍历到的是最新落子（初始化时可忽略）
                });

            }
        }
    }

    /**
     * 清理被提子的棋块数据
     */
    private static cleanupCapturedBlocks(board: WQ_ChessType[][]) {
        // 收集需要删除的棋块ID
        const blocksToDelete: number[] = [];
        this.blockInfoMap.forEach((info, blockId) => {
            // 检查棋块是否有棋子被提掉（棋盘上无对应棋子）
            const hasValidStone = info.stones.some(p => {
                return board[p.x][p.y] === info.color;
            });
            
            if (!hasValidStone) {
                blocksToDelete.push(blockId);
            }
        });

        // 删除无效棋块
        blocksToDelete.forEach(blockId => {
            const block = this.blockInfoMap.get(blockId)!;
            // 移除棋子-棋块映射
            block.stones.forEach(p => {
                this.posToBlockIdMap.delete(p.toString());
            });
            // 移除棋块信息
            this.blockInfoMap.delete(blockId);
        });
    }





    // 获取2步范围内的指定颜色的所有棋子位置
    getChessIn2StepsRange(board: WQ_ChessType[][], x: number, y: number, isSelfColor: boolean): WQ_Pos[] {
        const selfColor = board[x][y];
        const opponentColor = selfColor === WQ_ChessType.WHITE ? WQ_ChessType.BLACK : WQ_ChessType.WHITE;
        const color = isSelfColor ? selfColor : opponentColor;

        const size = board.length;
        const chessIn2StepsRange: WQ_Pos[] = [];

        let xDir = [-2,-1,0,1,2];
        let yDir = [-2,-1,0,1,2];

        for(let i = 0;i<xDir.length;i++){
            for(let j = 0;j<yDir.length;j++){
                let nx = x + xDir[i];
                let ny = y + yDir[j];
                if (nx < 0 || nx >= size || ny < 0 || ny >= size) continue;
                if (board[nx][ny] === color && nx !== x && ny !== y) {
                    chessIn2StepsRange.push(new WQ_Pos(nx, ny));
                }
            }
        }

        return chessIn2StepsRange;
    }










    // ========== 新增核心方法：获取所有棋子的总连接列表 ==========
    /**
     * 为棋盘上所有棋子建立总连接列表
     * @param board 棋盘数据
     * @returns Map<string, ChessLinkItem[]> - 棋子坐标字符串 -> 该棋子的总连接列表
     */
    static getAllChessTotalLinks(board: WQ_ChessType[][]): Map<string, WQ_ChessLinkItem[]> {
        // 1. 初始化：获取最新棋块信息，创建总连接列表Map
        const blockInfo = this.getAllBlocksInfo(board);
        const totalLinksMap = new Map<string, WQ_ChessLinkItem[]>();
        
        // 初始化所有有棋子位置的连接列表为空
        for (let x = 0; x < board.length; x++) {
            for (let y = 0; y < board.length; y++) {
                if (board[x][y] !== WQ_ChessType.NONE) {
                    const posKey = new WQ_Pos(x, y).toString();
                    totalLinksMap.set(posKey, []);
                }
            }
        }

        // 2. 处理棋块内部连接（相邻连接）
        this.processIntraBlockLinks(board, blockInfo, totalLinksMap);

        // 3. 处理棋块外部连接（对角、两步直线、日字型）
        this.processInterBlockLinks(board, blockInfo, totalLinksMap);

        return totalLinksMap;
    }

    // ========== 内部辅助方法：处理棋块内部相邻连接 ==========
    private static processIntraBlockLinks(
        board: WQ_ChessType[][],
        blockInfo: ReturnType<typeof WQ_GoUtil['getAllBlocksInfo']>,
        totalLinksMap: Map<string, WQ_ChessLinkItem[]>
    ) {
        // 遍历所有棋块
        Object.values(blockInfo.blockDetails).forEach(block => {
            const stones = block.stones;
            const color = block.color;

            // 遍历棋块内每个棋子
            stones.forEach(stone => {
                const stoneKey = stone.toString();
                
                // 检查该棋子的四个相邻方向
                this.DIRS.forEach(([dx, dy]) => {
                    const nx = stone.x + dx;
                    const ny = stone.y + dy;
                    
                    // 边界检查
                    if (nx < 0 || nx >= board.length || ny < 0 || ny >= board.length) return;
                    
                    // 检查相邻位置是否是同棋块的棋子
                    const neighborPos = new WQ_Pos(nx, ny);
                    const neighborKey = neighborPos.toString();
                    
                    if (board[nx][ny] === color && totalLinksMap.has(neighborKey)) {
                        // 确认相邻棋子属于同一棋块
                        const stoneBlockId = this.posToBlockIdMap.get(stoneKey);
                        const neighborBlockId = this.posToBlockIdMap.get(neighborKey);
                        
                        if (stoneBlockId === neighborBlockId) {
                            // 添加相邻连接到双方的总连接列表
                            const linkItem: WQ_ChessLinkItem = {
                                pos: neighborPos,
                                linkType: WQ_LinkType.相邻
                            };
                            
                            // 添加到当前棋子的连接列表（去重）
                            const currentLinks = totalLinksMap.get(stoneKey)!;
                            if (!currentLinks.some(item => item.pos.equal(neighborPos))) {
                                currentLinks.push(linkItem);
                                totalLinksMap.set(stoneKey, currentLinks);
                            }
                            
                            // 添加到相邻棋子的连接列表（去重）
                            const neighborLinks = totalLinksMap.get(neighborKey)!;
                            if (!neighborLinks.some(item => item.pos.equal(stone))) {
                                neighborLinks.push({
                                    pos: stone,
                                    linkType: WQ_LinkType.相邻
                                });
                                totalLinksMap.set(neighborKey, neighborLinks);
                            }
                        }
                    }
                });
            });
        });
    }

    // ========== 内部辅助方法：处理棋块外部连接 ==========
    private static processInterBlockLinks(
        board: WQ_ChessType[][],
        blockInfo: ReturnType<typeof WQ_GoUtil['getAllBlocksInfo']>,
        totalLinksMap: Map<string, WQ_ChessLinkItem[]>
    ) {
        const boardSize = board.length;
        const colorTypes = ['黑棋', '白棋'] as const;

        // 遍历两种颜色的棋块
        colorTypes.forEach(colorKey => {
            const blockIds = blockInfo.blockIds[colorKey];
            const color = colorKey === '黑棋' ? WQ_ChessType.BLACK : WQ_ChessType.WHITE;


            

            // 遍历所有同色棋块组合（i < j 避免重复处理）
            for (let i = 0; i < blockIds.length; i++) {
                for (let j = i + 1; j < blockIds.length; j++) {
                    const blockAId = blockIds[i];
                    const blockBId = blockIds[j];
                    
                    const blockA = blockInfo.blockDetails[blockAId];
                    const blockB = blockInfo.blockDetails[blockBId];

                    // 步骤1：一轮筛选 - 距离平方小于5的棋子
                    const candidateLinks = this.filterByDistance(blockA.stones, blockB.stones);
                    console.log("有效距离连接:");
                    console.log(candidateLinks);
                    
                    if (candidateLinks.length === 0) continue;

                    // 步骤2：二轮筛选 - 满足连接类型且无阻挡（新增传入board参数）
                    const validLinks = this.filterByLinkType(candidateLinks, boardSize, board);

                    console.log("有效类型连接:");
                    console.log(validLinks);
                    
                    if (validLinks.length === 0) continue;

                    // 步骤3：三轮筛选 - 按优先级保留最高连接类型
                    const priorityLinks = this.filterByPriority(validLinks);

                    console.log("有效优先级连接:");
                    console.log(priorityLinks);


                    // 步骤4：四轮筛选 - 棋块对维度保留最高优先级连接类型
                    const finalLinks = this.filterByBlockPairPriority(priorityLinks, blockAId, blockBId);
                                
                    console.log("最终连接（棋块对维度，仅保留最高优先级类型）:");
                    console.log(finalLinks);

                    // 步骤5：将筛选后的连接添加到总连接列表
                    finalLinks.forEach(link => {
                        const sourceKey = link.source.toString();
                        const targetKey = link.target.toString();
                        
                        // 添加到源棋子的连接列表
                        const sourceLinks = totalLinksMap.get(sourceKey)!;
                        if (!sourceLinks.some(item => item.pos.equal(link.target))) {
                            sourceLinks.push({
                                pos: link.target,
                                linkType: link.linkType
                            });
                            totalLinksMap.set(sourceKey, sourceLinks);
                        }
                        
                        // 添加到目标棋子的连接列表（反向）
                        const targetLinks = totalLinksMap.get(targetKey)!;
                        if (!targetLinks.some(item => item.pos.equal(link.source))) {
                            targetLinks.push({
                                pos: link.source,
                                linkType: link.linkType
                            });
                            totalLinksMap.set(targetKey, targetLinks);
                        }
                    });
                }
            }



        });
    }

    // ========== 连接筛选辅助方法 ==========
    /**
     * 一轮筛选：距离平方小于5的棋子对
     * @param stonesA 棋块A的棋子列表
     * @param stonesB 棋块B的棋子列表
     * @returns 符合距离条件的棋子对列表
     */
    private static filterByDistance(stonesA: WQ_Pos[], stonesB: WQ_Pos[]) {
        interface DistanceLink {
            source: WQ_Pos;
            target: WQ_Pos;
            distanceSq: number;
        }

        const result: DistanceLink[] = [];
        
        stonesA.forEach(source => {
            stonesB.forEach(target => {
                // 计算距离平方 (x1-x2)² + (y1-y2)²
                const dx = source.x - target.x;
                const dy = source.y - target.y;
                const distanceSq = dx * dx + dy * dy;
                
                // 距离平方小于5（即距离≤2）
                if (distanceSq > 0 && distanceSq <= 5) {
                    result.push({ source, target, distanceSq });
                }
            });
        });
        
        return result;
    }

  // ========== 二轮筛选：判断棋子对是否满足对角/两步直线/日字型连接（新增阻挡点位判断） ==========
    /**
     * 二轮筛选：判断棋子对是否满足对角/两步直线/日字型连接，并检查阻挡点位
     * @param distanceLinks 距离筛选后的棋子对
     * @param boardSize 棋盘大小
     * @param board 棋盘数据（用于检查阻挡点位）
     * @returns 符合连接类型且无阻挡的棋子对（包含连接类型）
     */
    private static filterByLinkType(
        distanceLinks: ReturnType<typeof WQ_GoUtil['filterByDistance']>, 
        boardSize: number,
        board: WQ_ChessType[][] // 新增：传入棋盘数据用于检查阻挡
    ) {
        interface TypeLink {
            source: WQ_Pos;
            target: WQ_Pos;
            linkType: WQ_LinkType;
        }

        const result: TypeLink[] = [];
        
        distanceLinks.forEach(link => {
            const { source, target } = link;
            const dx = Math.abs(source.x - target.x);
            const dy = Math.abs(source.y - target.y);
            let linkType: WQ_LinkType = WQ_LinkType.无;

            // 1. 判断基础连接类型
            if ((dx === 1 && dy === 1)) {
                linkType = WQ_LinkType.对角;
            } else if ((dx === 2 && dy === 0) || (dx === 0 && dy === 2)) {
                linkType = WQ_LinkType.两步直线;
            } else if ((dx === 1 && dy === 2) || (dx === 2 && dy === 1)) {
                linkType = WQ_LinkType.日字型;
            }

            // 2. 连接类型为无则直接跳过
            if (linkType === WQ_LinkType.无) return;

            // 3. 获取该连接类型对应的所有阻挡点位
            const blockPoints = this.getBlockPointsForLinkType(source, target, linkType);
            
            
            // 4. 检查所有阻挡点位是否有棋子（有则连接不成立）
            let hasBlock = false;
            for (const bp of blockPoints) {
                // 边界检查：阻挡点位超出棋盘则视为无阻挡
                if (bp.x < 0 || bp.x >= boardSize || bp.y < 0 || bp.y >= boardSize) continue;
                // 阻挡点位有棋子（无论黑白）则连接不成立
                if (board[bp.x][bp.y] !== WQ_ChessType.NONE) {
                    hasBlock = true;
                    break;
                }
            }

            // 5. 无阻挡则加入结果列表
            if (!hasBlock) {
                result.push({ source, target, linkType });
            }
        });
        
        return result;
    }

    // ========== 新增辅助方法：根据连接类型计算阻挡点位 ==========
    /**
     * 根据连接类型和棋子对，计算对应的所有阻挡点位
     * 逻辑与getAllLinkChesses中的阻挡点位规则完全对齐
     * @param source 源棋子位置
     * @param target 目标棋子位置
     * @param linkType 连接类型
     * @returns 该连接的所有阻挡点位列表
     */
    private static getBlockPointsForLinkType(
        source: WQ_Pos, 
        target: WQ_Pos, 
        linkType: WQ_LinkType
    ): WQ_Pos[] {
        const blockPoints: WQ_Pos[] = [];
        const dx = target.x - source.x;
        const dy = target.y - source.y;

        switch (linkType) {
            case WQ_LinkType.对角:
                // 对角阻挡点位：口字型中除source和target的另外两个点
                blockPoints.push(new WQ_Pos(source.x + dx, source.y));
                blockPoints.push(new WQ_Pos(source.x, source.y + dy));
                break;

            case WQ_LinkType.两步直线:
                // 两步直线阻挡点位：十字型中除source和target的3个点
                const midX = (source.x + target.x) / 2;
                const midY = (source.y + target.y) / 2;
                // 必有的中间交叉点
                blockPoints.push(new WQ_Pos(midX, midY));
                // 另一条线的两个端点
                if (dx === 0 && Math.abs(dy) === 2) {
                    // 垂直直线（x不变）：水平方向的左右端点
                    blockPoints.push(new WQ_Pos(midX - 1, midY));
                    blockPoints.push(new WQ_Pos(midX + 1, midY));
                } else if (dy === 0 && Math.abs(dx) === 2) {
                    // 水平直线（y不变）：垂直方向的上下端点
                    blockPoints.push(new WQ_Pos(midX, midY - 1));
                    blockPoints.push(new WQ_Pos(midX, midY + 1));
                }
                break;

            case WQ_LinkType.日字型:
                // 日字型阻挡点位：日字型中除source和target的4个点
                if (Math.abs(dx) === 1 && Math.abs(dy) === 2) {
                    blockPoints.push(new WQ_Pos(source.x + dx, source.y));
                    blockPoints.push(new WQ_Pos(source.x + dx, source.y + dy/2));
                    blockPoints.push(new WQ_Pos(source.x, source.y + dy/2));
                    blockPoints.push(new WQ_Pos(source.x, source.y + dy));
                } else if (Math.abs(dx) === 2 && Math.abs(dy) === 1) {
                    blockPoints.push(new WQ_Pos(source.x, source.y + dy));
                    blockPoints.push(new WQ_Pos(source.x + dx/2, source.y + dy));
                    blockPoints.push(new WQ_Pos(source.x + dx/2, source.y));
                    blockPoints.push(new WQ_Pos(source.x + dx, source.y));
                }
                break;

            default:
                // 相邻/无连接类型无阻挡点位
                break;
        }

        return blockPoints;
    }
    /**
     * 三轮筛选：按连接类型优先级保留最高优先级的连接
     * @param typeLinks 类型筛选后的连接列表
     * @returns 最高优先级的连接列表
     */
    private static filterByPriority(typeLinks: ReturnType<typeof WQ_GoUtil['filterByLinkType']>) {
        // 按棋子对分组
        const linkGroups = new Map<string, typeof typeLinks>();
        
        typeLinks.forEach(link => {
            // 生成唯一的棋子对键（排序避免重复）
            const key1 = link.source.toString();
            const key2 = link.target.toString();
            const groupKey = key1 < key2 ? `${key1}-${key2}` : `${key2}-${key1}`;
            
            if (!linkGroups.has(groupKey)) {
                linkGroups.set(groupKey, []);
            }
            linkGroups.get(groupKey)!.push(link);
        });

        // 每组保留最高优先级的连接
        const result: typeof typeLinks = [];
        
        linkGroups.forEach(links => {
            // 找到本组最高优先级
            const maxPriority = Math.max(...links.map(l => this.LINK_PRIORITY[l.linkType]));
            // 保留所有最高优先级的连接
            const highestPriorityLinks = links.filter(l => this.LINK_PRIORITY[l.linkType] === maxPriority);
            result.push(...highestPriorityLinks);
        });
        
        return result;
    }



    // ========== 四轮筛选：棋块对维度保留最高优先级连接类型 ==========
    /**
     * 四轮筛选：在棋块对维度上，仅保留优先级最高的连接类型的所有连接
     * @param priorityLinks 三轮筛选后的连接列表
     * @param blockAId 棋块A ID
     * @param blockBId 棋块B ID
     * @returns 棋块对中仅保留最高优先级连接类型的连接列表
     */
    private static filterByBlockPairPriority(
        priorityLinks: ReturnType<typeof WQ_GoUtil['filterByPriority']>,
        blockAId: number,
        blockBId: number
    ) {
        // 空列表直接返回
        if (priorityLinks.length === 0) return [];

        // 步骤1：找到当前棋块对所有连接中的最高优先级类型
        const typePriorityMap = new Map<WQ_LinkType, number>();
        priorityLinks.forEach(link => {
            const priority = this.LINK_PRIORITY[link.linkType];
            typePriorityMap.set(link.linkType, priority);
        });

        // 找到最高优先级值
        let maxPriority = -1;
        let highestLinkType = WQ_LinkType.无;
        typePriorityMap.forEach((priority, type) => {
            if (priority > maxPriority) {
                maxPriority = priority;
                highestLinkType = type;
            }
        });

        console.log(`棋块${blockAId}-${blockBId} 最高优先级连接类型：${WQ_LinkType[highestLinkType]}（优先级：${maxPriority}）`);

        // 步骤2：仅保留该最高优先级类型的所有连接
        const finalLinks = priorityLinks.filter(link => link.linkType === highestLinkType);
        
        return finalLinks;
    }



    static checkRelativePositionSameColor(board: WQ_ChessType[][],basePos: WQ_Pos, relativePosition: [number, number]): boolean {
        const baseColor = board[basePos.x][basePos.y];
        const targetPos = new WQ_Pos(basePos.x + relativePosition[0], basePos.y + relativePosition[1]);
        const boardSize = board.length;

         // 过滤条件1：点位在棋盘内
        if (targetPos.x < 0 || targetPos.x >= boardSize || targetPos.y < 0 || targetPos.y >= boardSize) return false;
        if (targetPos.x < 0 || targetPos.x >= boardSize || targetPos.y < 0 || targetPos.y >= boardSize) return false;
        
        const targetColor = board[targetPos.x][targetPos.y];
        return baseColor === targetColor ? true : false;
    }







    /**
     * 新增核心方法：获取所有只剩一气的棋块及其可围杀的棋块列表
     * @param board 棋盘数据
     * @returns 映射关系：被围杀棋块ID -> 可围杀它的棋块ID列表
     */
    static getKillableBlocks(board: WQ_ChessType[][]): Map<number, number[]> {
        // 1. 确保棋块数据最新
        this.scanBoardAndUpdateBlocks(board);
        
        // 存储结果：被围杀棋块ID -> 可围杀它的棋块ID列表
        const killableBlocks = new Map<number, number[]>();
        
        // 2. 遍历所有棋块，筛选出只剩一气的棋块
        this.blockInfoMap.forEach((blockInfo, targetBlockId) => {
            // 计算当前棋块的气数
            const liberties = this.calculateBlockLiberties(board, targetBlockId);
            
            // 只处理只剩一气的棋块
            if (liberties === 1) {
                // 获取该棋块的所有气点（包含最后一口气）
                const allLibertyPosSet = this.getBlockAllLibertyPos(board, targetBlockId);
                if (!allLibertyPosSet || allLibertyPosSet.size !== 1) return;

                // 获取最后一口气位置
                const lastLibertyPos = Array.from(allLibertyPosSet.values())[0];
                
                // 获取该棋块所有被堵住的气点（除最后一口气外的其他气点位置，这些位置有敌方棋子）
                const blockedLibertyPosList = this.getBlockedLibertyPosList(board, targetBlockId, lastLibertyPos);
                
                // 收集所有被堵住气点上的敌方棋块ID
                const killerBlockIds: number[] = [];
                blockedLibertyPosList.forEach(pos => {
                    const posKey = pos.toString();
                    const blockId = this.posToBlockIdMap.get(posKey);
                    if (blockId && !killerBlockIds.includes(blockId)) {
                        killerBlockIds.push(blockId);
                    }
                });

                // 存入结果（去重）
                killableBlocks.set(targetBlockId, Array.from(new Set(killerBlockIds)));
            }
        });

        return killableBlocks;
    }

    /**
     * 辅助方法：获取指定棋块的所有气点
     * @param board 棋盘数据
     * @param blockId 棋块ID
     * @returns 所有气点的Map（坐标字符串 -> WQ_Pos）
     */
    private static getBlockAllLibertyPos(board: WQ_ChessType[][], blockId: number): Map<string, WQ_Pos> | null {
        const blockInfo = this.blockInfoMap.get(blockId);
        if (!blockInfo) return null;

        const libertySet = new Map<string, WQ_Pos>(); // 气点坐标字符串 -> WQ_Pos
        const stones = blockInfo.stones;

        // 收集所有气点
        stones.forEach(stone => {
            this.DIRS.forEach(([dx, dy]) => {
                const nx = stone.x + dx;
                const ny = stone.y + dy;
                
                if (nx < 0 || nx >= board.length || ny < 0 || ny >= board.length) return;
                
                if (board[nx][ny] === WQ_ChessType.NONE) {
                    const posKey = `${nx},${ny}`;
                    libertySet.set(posKey, new WQ_Pos(nx, ny));
                }
            });
        });

        return libertySet;
    }

    /**
     * 辅助方法：获取指定棋块被堵住的气点列表（除最后一口气外的其他气点位置，这些位置有敌方棋子）
     * @param board 棋盘数据
     * @param blockId 棋块ID
     * @param lastLibertyPos 最后一口气位置
     * @returns 被堵住的气点列表
     */
    private static getBlockedLibertyPosList(board: WQ_ChessType[][], blockId: number, lastLibertyPos: WQ_Pos): WQ_Pos[] {
        const blockInfo = this.blockInfoMap.get(blockId);
        if (!blockInfo) return [];

        const blockedPosList: WQ_Pos[] = [];
        const targetColor = blockInfo.color;
        const enemyColor = targetColor === WQ_ChessType.BLACK ? WQ_ChessType.WHITE : WQ_ChessType.BLACK;
        const stones = blockInfo.stones;

        // 遍历棋块所有棋子的相邻位置，收集被敌方堵住的气点
        stones.forEach(stone => {
            this.DIRS.forEach(([dx, dy]) => {
                const nx = stone.x + dx;
                const ny = stone.y + dy;
                
                if (nx < 0 || nx >= board.length || ny < 0 || ny >= board.length) return;

                // 排除最后一口气位置，收集被敌方棋子占据的位置
                const currentPos = new WQ_Pos(nx, ny);
                if (!currentPos.equal(lastLibertyPos) && board[nx][ny] === enemyColor) {
                    // 去重添加
                    if (!blockedPosList.some(pos => pos.equal(currentPos))) {
                        blockedPosList.push(currentPos);
                    }
                }
            });
        });

        return blockedPosList;
    }

    /**
     * 辅助方法：计算指定棋块的气数
     * @param board 棋盘数据
     * @param blockId 棋块ID
     * @returns 棋块的气数
     */
    private static calculateBlockLiberties(board: WQ_ChessType[][], blockId: number): number {
        const blockInfo = this.blockInfoMap.get(blockId);
        if (!blockInfo) return 0;

        const libertySet = new Set<string>(); // 用Set去重气点
        const stones = blockInfo.stones;

        // 遍历棋块所有棋子，收集所有气点
        stones.forEach(stone => {
            this.DIRS.forEach(([dx, dy]) => {
                const nx = stone.x + dx;
                const ny = stone.y + dy;
                
                // 边界检查
                if (nx < 0 || nx >= board.length || ny < 0 || ny >= board.length) return;
                
                // 空点即为气
                if (board[nx][ny] === WQ_ChessType.NONE) {
                    libertySet.add(`${nx},${ny}`);
                }
            });
        });

        return libertySet.size;
    }



  /**
     * 新增核心方法：获取指定棋块中离目标位置最近的棋子
     * @param targetPos 目标位置（参考点）
     * @param blockId 棋块ID
     * @returns 棋块中离目标位置最近的棋子Pos，棋块不存在/无棋子则返回null
     */
    static getNearestStoneInBlock(targetPos: WQ_Pos, blockId: number): WQ_Pos | null {
        // 1. 校验棋块是否存在
        const blockInfo = this.blockInfoMap.get(blockId);
        if (!blockInfo || blockInfo.stones.length === 0) {
            console.warn(`棋块ID ${blockId} 不存在或无棋子`);
            return null;
        }

        // 2. 遍历棋块所有棋子，找到距离最近的
        let nearestStone: WQ_Pos | null = null;
        let minDistanceSq = Infinity;

        blockInfo.stones.forEach(stone => {
            const distanceSq = stone.distanceSqTo(targetPos);
            // 找到更近的棋子，更新最小值
            if (distanceSq < minDistanceSq) {
                minDistanceSq = distanceSq;
                nearestStone = stone;
            }
            // 优化：找到距离为0的棋子（同一位置），直接终止遍历
            else if (distanceSq === 0) {
                nearestStone = stone;
                return; // 跳出forEach循环
            }
        });

        return nearestStone;
    }



















    /**
     * 深拷贝棋盘数据，避免修改原数组
     * @param board 原始棋盘数据（二维数组）
     * @returns 新的棋盘数据副本
     */
    static copyBoard(board: WQ_ChessType[][]): WQ_ChessType[][] {
        return board.map(row => [...row]);
    }

    /**
     * 获取指定位置所属的棋块信息（包含所有同色棋子坐标和该棋块的气数）
     * 修复点：气点visited标记仅在当前棋块计算中生效，避免污染全局标记
     * @param board 棋盘数据
     * @param x 目标位置x坐标
     * @param y 目标位置y坐标
     * @param visited 可选的访问标记数组，用于复用标记（避免重复创建）
     * @returns 包含棋块棋子列表和气数的对象
     */
    static getGroup(board: WQ_ChessType[][], x: number, y: number, visited?: boolean[][]): { stones: WQ_Pos[], liberties: number } {
        const size = board.length;
        const color = board[x][y];
        // 空位置无棋块信息
        if (color === WQ_ChessType.NONE) return { stones: [], liberties: 0 };

        // 关键修复：外部未传入visited则创建临时数组，避免影响其他棋块计算
        const localVisited = visited || Array(size).fill(0).map(() => Array(size).fill(false));
        // 已访问过的位置直接返回空结果
        if (localVisited[x][y]) return { stones: [], liberties: 0 };

        // BFS队列初始化，从目标位置开始遍历
        const queue: WQ_Pos[] = [new WQ_Pos(x, y)];
        const stones: WQ_Pos[] = [];  // 存储当前棋块的所有棋子坐标
        let liberties = 0;            // 棋块的气数
        localVisited[x][y] = true;    // 标记当前位置已访问

        // 用Set存储气点坐标，避免重复计算同一气点
        const libertyMarks = new Set<string>();

        // BFS遍历整个棋块
        while (queue.length > 0) {
            const p = queue.shift()!;
            stones.push(p);

            // 检查四个方向
            for (const [dx, dy] of this.DIRS) {
                const nx = p.x + dx;
                const ny = p.y + dy;
                const posKey = `${nx},${ny}`;
                
                // 超出棋盘边界则跳过
                if (nx < 0 || nx >= size || ny < 0 || ny >= size) continue;

                // 空点=气（用Set去重，避免同一气点多次计数）
                if (board[nx][ny] === WQ_ChessType.NONE && !libertyMarks.has(posKey)) {
                    liberties++;
                    libertyMarks.add(posKey);
                }
                // 同色未访问的棋子加入队列，继续遍历
                if (board[nx][ny] === color && !localVisited[nx][ny]) {
                    localVisited[nx][ny] = true;
                    queue.push(new WQ_Pos(nx, ny));
                }
            }
        }
        return { stones, liberties };
    }

    /**
     * 执行提子操作：检查落子位置周围的敌方棋块，若敌方棋块无气则提掉该棋块所有棋子
     * 优化点：提子逻辑更健壮，确保棋盘数据正确更新
     * @param board 棋盘数据（会直接修改该数组）
     * @param x 落子位置x坐标
     * @param y 落子位置y坐标
     * @returns 有提子则返回落子位置，无提子返回null（用于劫争规则判断）
     */
    static captureStones(board: WQ_ChessType[][], x: number, y: number): WQ_Pos | null {
        const size = board.length;
        const selfColor = board[x][y];
        // 空位置无法提子
        if (selfColor === WQ_ChessType.NONE) return null;
        
        // 计算敌方棋子颜色
        const enemyColor = selfColor === WQ_ChessType.BLACK ? WQ_ChessType.WHITE : WQ_ChessType.BLACK;
        let captureCount = 0;       // 提子总数
        let capturePos: WQ_Pos | null = null;  // 提子触发位置

        // 为每个相邻敌棋块创建独立的visited，避免相互干扰
        for (const [dx, dy] of this.DIRS) {
            const nx = x + dx;
            const ny = y + dy;
            // 超出边界或不是敌方棋子则跳过
            if (nx < 0 || nx >= size || ny < 0 || ny >= size || board[nx][ny] !== enemyColor) continue;

            // 为当前敌棋块创建独立的访问标记
            const visited = Array(size).fill(0).map(() => Array(size).fill(false));
            // 获取敌棋块的信息
            const { stones, liberties } = this.getGroup(board, nx, ny, visited);
            // 无气的敌棋块需要提子
            if (liberties === 0) {
                // 清空棋盘上该棋块的所有棋子
                stones.forEach(p => {
                    board[p.x][p.y] = WQ_ChessType.NONE;
                    captureCount++;
                    if(stones.length === 1){
                        capturePos = new WQ_Pos(p.x, p.y);
                    }
                });
            }
        }
        // 有提子则返回落子位置，否则返回null
        return captureCount > 0 ? capturePos : null;
    }

    /**
     * 判断指定位置是否为禁入点（落子后自身无气且无法提掉对方棋子）
     * @param board 棋盘数据
     * @param x 目标位置x坐标
     * @param y 目标位置y坐标
     * @param color 要落子的颜色
     * @returns 是禁入点返回true，否则返回false
     */
    static isForbidden(board: WQ_ChessType[][], x: number, y: number, color: WQ_ChessType): boolean {
        // 已有棋子的位置直接判定为禁入
        if (board[x][y] !== WQ_ChessType.NONE) return true;

        // 创建临时棋盘，模拟落子
        const tempBoard = this.copyBoard(board);
        tempBoard[x][y] = color;

        // 检查落子后自身棋块的气数
        const visited = Array(tempBoard.length).fill(0).map(() => Array(tempBoard.length).fill(false));
        const { liberties } = this.getGroup(tempBoard, x, y, visited);
        // 自身有气则不是禁入点
        if (liberties > 0) return false;

        // 自身无气时，检查是否能提掉对方棋子
        const enemyColor = color === WQ_ChessType.BLACK ? WQ_ChessType.WHITE : WQ_ChessType.BLACK;
        for (const [dx, dy] of this.DIRS) {
            const nx = x + dx;
            const ny = y + dy;
            // 超出边界或不是敌方棋子则跳过
            if (nx < 0 || nx >= tempBoard.length || ny < 0 || ny >= tempBoard.length || tempBoard[nx][ny] !== enemyColor) continue;

            // 检查敌方相邻棋块的气数
            const v = Array(tempBoard.length).fill(0).map(() => Array(tempBoard.length).fill(false));
            const { liberties: eLib } = this.getGroup(tempBoard, nx, ny, v);
            // 有敌方棋块无气（可以提子），则不是禁入点
            if (eLib === 0) return false;
        }
        // 自身无气且无法提子，判定为禁入点
        return true;
    }

    /**
     * 获取当前局面下指定颜色的所有合法落子位置（排除禁入点和劫争位置）
     * @param board 棋盘数据
     * @param color 落子颜色
     * @param lastCapturePos 上一次提子位置（用于劫争规则判断）
     * @returns 所有合法落子位置的数组
     */
    static getValidMoves(board: WQ_ChessType[][], color: WQ_ChessType, lastCapturePos: WQ_Pos | null): WQ_Pos[] {
        const size = board.length;
        const moves: WQ_Pos[] = [];

        // 遍历整个棋盘，筛选合法位置
        for (let x = 0; x < size; x++) {
            for (let y = 0; y < size; y++) {
                // 排除禁入点和劫争位置
                if (!this.isForbidden(board, x, y, color) && !(lastCapturePos && x === lastCapturePos.x && y === lastCapturePos.y)) {
                    moves.push(new WQ_Pos(x, y));
                }
            }
        }
        return moves;
    }

    /**
     * 评估指定位置的围杀价值（用于AI启发式决策）
     * 价值计算逻辑：相邻敌方棋块气数越少，围杀价值越高
     * @param board 棋盘数据
     * @param pos 目标位置
     * @param aiColor AI落子颜色
     * @returns 围杀价值分数（分数越高越值得落子）
     */
    static evaluateKillValue(board: WQ_ChessType[][], pos: WQ_Pos, aiColor: WQ_ChessType): number {
        const size = board.length;
        const playerColor = aiColor === WQ_ChessType.BLACK ? WQ_ChessType.WHITE : WQ_ChessType.BLACK;
        let killValue = 0;

        // 模拟落子
        const tempBoard = this.copyBoard(board);
        tempBoard[pos.x][pos.y] = aiColor;
        
        // 检查四个方向的敌方棋块
        for (const [dx, dy] of this.DIRS) {
            const nx = pos.x + dx;
            const ny = pos.y + dy;
            // 超出边界或不是敌方棋子则跳过
            if (nx < 0 || nx >= size || ny < 0 || ny >= size || tempBoard[nx][ny] !== playerColor) continue;

            // 获取敌方棋块的气数
            const visited = Array(size).fill(0).map(() => Array(size).fill(false));
            const { liberties } = this.getGroup(tempBoard, nx, ny, visited);
            // 气数越少，价值越高（10/(气数+1) 确保气数为0时价值最高）
            killValue += 10 / (liberties + 1);
        }
        return killValue;
    }

    /**
     * 查找当前局面下的最优围杀点位（AI备用策略，当MCTS无结果时使用）
     * @param board 棋盘数据
     * @param aiColor AI落子颜色
     * @param lastCapturePos 上一次提子位置（劫争规则）
     * @returns 最优围杀点位，无则返回第一个合法位置
     */
    static findKillMove(board: WQ_ChessType[][], aiColor: WQ_ChessType, lastCapturePos: WQ_Pos | null): WQ_Pos | null {
        console.log("查找围杀点位");
        // 获取所有合法落子位置
        const validMoves = this.getValidMoves(board, aiColor, lastCapturePos);
        if (validMoves.length === 0) return null;

        // 按围杀价值排序
        const scoredMoves = validMoves.map(pos => ({
            pos,
            value: this.evaluateKillValue(board, pos, aiColor)
        })).sort((a, b) => b.value - a.value);

        // 价值大于0返回最优点位，否则返回第一个合法位置
        return scoredMoves[0].value > 0 ? scoredMoves[0].pos : validMoves[0];
    }

    // ========== 新增：评估指定位置的守护价值（用于AI启发式决策） ==========
    /**
     * 评估指定位置的守护价值
     * 价值计算逻辑：相邻己方棋块气数提升越多，守护价值越高（优先保护气少的己方棋块）
     * @param board 棋盘数据
     * @param pos 目标位置
     * @param aiColor AI落子颜色
     * @returns 守护价值分数（分数越高越值得落子）
     */
    static evaluateDefendValue(board: WQ_ChessType[][], pos: WQ_Pos, aiColor: WQ_ChessType): number {
        const size = board.length;
        let defendValue = 0;

        // 模拟落子
        const tempBoard = this.copyBoard(board);
        tempBoard[pos.x][pos.y] = aiColor;
        
        // 检查四个方向的己方棋块
        for (const [dx, dy] of this.DIRS) {
            const nx = pos.x + dx;
            const ny = pos.y + dy;
            // 超出边界或不是己方棋子则跳过
            if (nx < 0 || nx >= size || ny < 0 || ny >= size || tempBoard[nx][ny] !== aiColor) continue;

            // 计算落子前己方棋块的气数
            const originVisited = Array(size).fill(0).map(() => Array(size).fill(false));
            const { liberties: originLib } = this.getGroup(board, nx, ny, originVisited);
            // 计算落子后己方棋块的气数
            const newVisited = Array(size).fill(0).map(() => Array(size).fill(false));
            const { liberties: newLib } = this.getGroup(tempBoard, nx, ny, newVisited);
            
            // 气数提升量（气越少的棋块，提升1口气的价值越高，用10/(原气数+1)加权）
            const libUp = newLib - originLib;
            defendValue += libUp * (10 / (originLib + 1));
        }
        return defendValue;
    }

    // ========== 新增：查找当前局面下的最优守护点位（AI守护策略） ==========
   /**
     * 查找当前局面下的最优守护点位（优先保护残气棋块，无则常规守护）
     * @param board 棋盘数据
     * @param aiColor AI落子颜色
     * @param lastCapturePos 上一次提子位置（劫争规则）
     * @returns 最优守护点位，无则返回第一个合法位置
     */
    static findDefendMove(board: WQ_ChessType[][], aiColor: WQ_ChessType, lastCapturePos: WQ_Pos | null): WQ_Pos | null {
        console.log("查找守护点位（优先保护只剩一口气的己方棋块）");
        // 先检查己方残气棋块，若有合法保护点位直接返回
        const selfLastLibertyBlocks = this.getSelfLastLibertyBlocks(board, aiColor, lastCapturePos);
        for (const [_, protectPosList] of selfLastLibertyBlocks) {
            if (protectPosList.length > 0) return protectPosList[0];
        }

        // 无残气棋块需要保护，执行常规守护点位计算
        const validMoves = this.getValidMoves(board, aiColor, lastCapturePos);
        if (validMoves.length === 0) return null;

        const scoredMoves = validMoves.map(pos => ({
            pos,
            value: this.evaluateDefendValue(board, pos, aiColor)
        })).sort((a, b) => b.value - a.value);

        return scoredMoves[0].value > 0 ? scoredMoves[0].pos : validMoves[0];
    }


    /**
    * 新增核心方法：获取己方只剩一气的棋块及对应可保护的合法点位
    * @param board 棋盘数据
    * @param selfColor 己方颜色
    * @param lastCapturePos 上一次提子位置（劫争规则）
    * @returns Map<number, WQ_Pos[]> - 己方残气棋块ID -> 可保护该棋块的合法点位列表
    */
    static getSelfLastLibertyBlocks(board: WQ_ChessType[][], selfColor: WQ_ChessType, lastCapturePos: WQ_Pos | null): Map<number, WQ_Pos[]> {
        this.scanBoardAndUpdateBlocks(board);
        const lastLibertyBlocks = new Map<number, WQ_Pos[]>();

        // 遍历己方所有棋块，筛选只剩一气的
        this.blockInfoMap.forEach((blockInfo, blockId) => {
            if (blockInfo.color !== selfColor) return;
            const liberties = this.calculateBlockLiberties(board, blockId);
            if (liberties !== 1) return;

            // 获取该棋块最后一口气的位置（唯一气点）
            const libertySet = this.getBlockAllLibertyPos(board, blockId);
            if (!libertySet || libertySet.size !== 1) return;
            const lastLibertyPos = Array.from(libertySet.values())[0];

            // 检查该气点是否为合法落子位置（非禁入、非劫争）
            if (!this.isForbidden(board, lastLibertyPos.x, lastLibertyPos.y, selfColor) && 
                !(lastCapturePos && lastLibertyPos.equal(lastCapturePos))) {
                lastLibertyBlocks.set(blockId, [lastLibertyPos]);
            } else {
                lastLibertyBlocks.set(blockId, []); // 无合法保护点位
            }
        });

        return lastLibertyBlocks;
    }
    
}