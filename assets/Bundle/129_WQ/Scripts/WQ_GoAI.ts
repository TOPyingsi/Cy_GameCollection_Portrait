// GoAI.ts - 增强版围棋AI（蒙特卡洛树搜索+启发式+时间限制）
import { Component } from "cc";
import { WQ_ChessType, WQ_Pos, WQ_GoUtil } from "./WQ_GoUtil";

// MCTS节点类
class WQ_MCTSNode {
    children: Map<string, WQ_MCTSNode> = new Map();
    wins = 0;
    visits = 0;

    constructor(
        public board: WQ_ChessType[][],
        public color: WQ_ChessType,
        public pos?: WQ_Pos,
        public parent?: WQ_MCTSNode
    ) {}
}

export class WQ_GoAI extends Component {
    // private maxThinkTime = 5000; // 最大思考时间（5秒）
    // private maxIterations = 5000; // 最大迭代次数（控制性能）
    private maxThinkTime = 1; // 最大思考时间（5秒）
    private maxIterations = 1; // 最大迭代次数（控制性能）
    private c = Math.sqrt(2); // UCB探索系数

    /** 
     * 获取最优落子（带时间限制，回调版本）
     * @param board 棋盘数据
     * @param color AI落子颜色
     * @param lastCapturePos 上一次提子位置（劫争用）
     * @param callback 思考完成后的回调函数，参数为最优落子位置
     */
    getBestMove(
        board: WQ_ChessType[][], 
        color: WQ_ChessType, 
        lastCapturePos: WQ_Pos | null,
        callback: (bestMove: WQ_Pos | null) => void
    ): void {
        // 使用setTimeout将AI思考放入异步队列，避免阻塞主线程
        // setTimeout(() => {
            const colorStr = color === WQ_ChessType.BLACK ? "黑棋" : "白棋";
            console.log(`[AI思考] 开始思考${colorStr}落子，最大思考时间${this.maxThinkTime}ms，最大迭代次数${this.maxIterations}`);
            
            const validMoves = WQ_GoUtil.getValidMoves(board, color, lastCapturePos);
            if (validMoves.length === 0) {
                console.log(`[AI思考] ❌ 无合法落子位置，直接返回null`);
                callback(null); // 无合法落子，执行回调
                return;
            }

               // ===== 新增核心逻辑：优先检查己方只剩一口气的棋块，有合法保护点位直接落子 =====
            const selfLastLibertyBlocks = WQ_GoUtil.getSelfLastLibertyBlocks(board, color, lastCapturePos);
            let protectPos: WQ_Pos | null = null;
            for (const [blockId, posList] of selfLastLibertyBlocks) {
                if (posList.length > 0) {
                    protectPos = posList[0];
                    console.log(`[AI思考] 🚨 检测到己方残气棋块${blockId}，有合法保护点位[${protectPos.x},${protectPos.y}]，优先保护`);
                    callback(protectPos);
                    return;
                }
            }
            console.log(`[AI思考] ✅ 无己方残气棋块需要保护，执行常规MCTS思考`);
            // ===== 残气保护逻辑结束 =====

            const startTime = Date.now();
            const root = new WQ_MCTSNode(WQ_GoUtil.copyBoard(board), color);
            let iterations = 0;

            // 限时迭代（5秒或最大步数）
            while (Date.now() - startTime < this.maxThinkTime && iterations < this.maxIterations) {
                // 1. 选择（UCB1算法）
                const node = this.select(root);
                // 2. 扩展
                const expandNode = this.expand(node);
                // 3. 模拟（启发式模拟，提升AI强度）
                const winner = this.simulate(expandNode.board, expandNode.color);
                // 4. 回溯
                this.backpropagate(expandNode, winner);
                iterations++;
            }

            // 记录退出循环的原因
            const elapsedTime = Date.now() - startTime;
            let exitReason = "";
            if (elapsedTime >= this.maxThinkTime) {
                exitReason = `超时（已思考${elapsedTime}ms，超过最大${this.maxThinkTime}ms）`;
                console.log(`[AI思考] ⏰ 迭代退出原因：${exitReason}，完成迭代次数${iterations}`);
            } else if (iterations >= this.maxIterations) {
                exitReason = `超出最大迭代次数（已执行${iterations}次，达到上限${this.maxIterations}次）`;
                console.log(`[AI思考] 🔢 迭代退出原因：${exitReason}，耗时${elapsedTime}ms`);
            } else {
                exitReason = "未知原因";
                console.log(`[AI思考] ❓ 迭代退出原因：${exitReason}，耗时${elapsedTime}ms，迭代次数${iterations}`);
            }

            // 超时/迭代结束：优先选访问量最高的节点
            let bestNode: WQ_MCTSNode | null = null;
            if (root.children.size > 0) {
                let maxVisits = -1;
                root.children.forEach(node => {
                    if (node.visits > maxVisits) {
                        maxVisits = node.visits;
                        bestNode = node;
                    }
                });
                
                if (bestNode) {
                    console.log(`[AI思考] ✅ 找到最优节点：位置[${bestNode.pos?.x},${bestNode.pos?.y}]，访问次数${bestNode.visits}，胜率${((bestNode.wins / bestNode.visits) * 100).toFixed(2)}%`);
                } else {
                    console.log(`[AI思考] ⚠️ 有子节点但未找到最优节点（所有节点访问次数均为-1）`);
                }
            } else {
                console.log(`[AI思考] ⚠️ 根节点无子节点，无法通过MCTS选择最优点位`);
            }

            // 确定最优落子位置
            let bestMove: WQ_Pos | null = null;
            // 1. 查找围杀点和守护点（提前计算，供算法选择）
            const killMove = WQ_GoUtil.findKillMove(board, color, lastCapturePos);
            const defendMove = WQ_GoUtil.findDefendMove(board, color, lastCapturePos);
            // 2. 随机选择算法（80%守护，20%围杀，可自定义概率）
            const isUseDefend = Math.random() < 0.8;
            console.log(`[AI算法选择] ${isUseDefend ? "80%概率选中守护算法" : "20%概率选中围杀算法"}`);

            // 3. 算法执行+兜底逻辑：选中算法无有效点位则切换另一算法
            if (bestNode?.pos) {
                bestMove = bestNode.pos;
                console.log(`[AI思考] 🎯 使用MCTS最优点位：[${bestMove.x},${bestMove.y}]`);
            } else {
                if (isUseDefend) {
                    // 优先使用守护算法，无有效点位则兜底围杀算法
                    if (defendMove && WQ_GoUtil.evaluateDefendValue(board, defendMove, color) > 0) {
                        bestMove = defendMove;
                        console.log(`[AI思考] 🛡️ 无MCTS最优点位，使用守护点位：[${bestMove.x},${bestMove.y}]`);
                    } else {
                        bestMove = killMove;
                        console.log(`[AI思考] ⚔️ 守护点位无有效价值，兜底使用围杀点位：[${bestMove.x},${bestMove.y}]`);
                    }
                } else {
                    // 优先使用围杀算法，无有效点位则兜底守护算法
                    if (killMove && WQ_GoUtil.evaluateKillValue(board, killMove, color) > 0) {
                        bestMove = killMove;
                        console.log(`[AI思考] ⚔️ 无MCTS最优点位，使用围杀点位：[${bestMove.x},${bestMove.y}]`);
                    } else {
                        bestMove = defendMove;
                        console.log(`[AI思考] 🛡️ 围杀点位无有效价值，兜底使用守护点位：[${bestMove.x},${bestMove.y}]`);
                    }
                }
            }

            // 最终结果日志
            if (bestMove) {
                console.log(`[AI思考] 📝 最终落子决策：${colorStr}落子[${bestMove.x},${bestMove.y}]，总思考时间${elapsedTime}ms，总迭代次数${iterations}，退出原因：${exitReason}`);
            } else {
                console.log(`[AI思考] 📝 最终落子决策：无可用落子位置，总思考时间${elapsedTime}ms，总迭代次数${iterations}，退出原因：${exitReason}`);
            }

            callback(bestMove); // AI思考完成，执行回调
        // }, 0);
    }

    /** 选择节点（UCB1算法） */
    private select(node: WQ_MCTSNode): WQ_MCTSNode {
        while (node.children.size > 0) {
            node = this.getBestChild(node);
        }
        return node;
    }

    /** 扩展节点（启发式优先扩展高价值点位） */
    private expand(node: WQ_MCTSNode): WQ_MCTSNode {
        const validMoves = WQ_GoUtil.getValidMoves(node.board, node.color, null);
        if (validMoves.length === 0) return node;

        // 启发式排序：优先扩展围杀价值高的点位
        const scoredMoves = validMoves.map(pos => ({
            pos,
            value: WQ_GoUtil.evaluateKillValue(node.board, pos, node.color)
        })).sort((a, b) => b.value - a.value);

        // 选择最高价值的未扩展点位
        let selectedPos: WQ_Pos | null = null;
        for (const move of scoredMoves) {
            const key = move.pos.toString();
            if (!node.children.has(key)) {
                selectedPos = move.pos;
                break;
            }
        }

        if (!selectedPos) {
            selectedPos = validMoves[Math.floor(Math.random() * validMoves.length)];
            // 可选：添加随机选择的日志
            // console.log(`[AI扩展] 所有高价值点位已扩展，随机选择点位[${selectedPos.x},${selectedPos.y}]`);
        }

        // 模拟落子
        const newBoard = WQ_GoUtil.copyBoard(node.board);
        newBoard[selectedPos.x][selectedPos.y] = node.color;
        WQ_GoUtil.captureStones(newBoard, selectedPos.x, selectedPos.y);

        // 创建子节点
        const child = new WQ_MCTSNode(
            newBoard,
            node.color === WQ_ChessType.BLACK ? WQ_ChessType.WHITE : WQ_ChessType.BLACK,
            selectedPos,
            node
        );
        node.children.set(selectedPos.toString(), child);
        return child;
    }

    /** 模拟（启发式模拟，提升AI强度） */
    private simulate(board: WQ_ChessType[][], color: WQ_ChessType): number {
        let currentBoard = WQ_GoUtil.copyBoard(board);
        let currentColor = color;
        const size = board.length;
        const maxSteps = size * size * 2; // 最大模拟步数
        let steps = 0;

        while (steps < maxSteps) {
            const validMoves = WQ_GoUtil.getValidMoves(currentBoard, currentColor, null);
            if (validMoves.length === 0) break;

            // 启发式模拟：优先选择高价值点位（而非纯随机）
            const scoredMoves = validMoves.map(pos => ({
                pos,
                value: WQ_GoUtil.evaluateKillValue(currentBoard, pos, currentColor)
            })).sort((a, b) => b.value - a.value);

            // 80%选高价值，20%随机（平衡探索与利用）
            const selectedPos = Math.random() < 0.8 
                ? scoredMoves[0].pos 
                : validMoves[Math.floor(Math.random() * validMoves.length)];

            // 落子+提子
            currentBoard[selectedPos.x][selectedPos.y] = currentColor;
            WQ_GoUtil.captureStones(currentBoard, selectedPos.x, selectedPos.y);

            // 切换回合
            currentColor = currentColor === WQ_ChessType.BLACK ? WQ_ChessType.WHITE : WQ_ChessType.BLACK;
            steps++;
        }

        // 评估胜负（AI胜利返回1，否则0）
        return this.evaluate(currentBoard, color) > 0 ? 1 : 0;
    }

    /** 回溯更新节点数据 */
    private backpropagate(node: WQ_MCTSNode, winner: number): void {
        while (node) {
            node.visits++;
            node.wins += winner;
            node = node.parent!;
        }
    }

    /** UCB1算法选择最优子节点 */
    private getBestChild(node: WQ_MCTSNode): WQ_MCTSNode {
        let bestChild: WQ_MCTSNode | null = null;
        let bestUcb = -Infinity;

        node.children.forEach(child => {
            if (child.visits === 0) {
                bestUcb = Infinity;
                bestChild = child;
            } else {
                // UCB1公式：胜率 + 探索系数
                const ucb = (child.wins / child.visits) + this.c * Math.sqrt(Math.log(node.visits) / child.visits);
                if (ucb > bestUcb) {
                    bestUcb = ucb;
                    bestChild = child;
                }
            }
        });

        return bestChild!;
    }

    /** 局面评估（中级职业棋手级别评估函数） */
    private evaluate(board: WQ_ChessType[][], aiColor: WQ_ChessType): number {
        const playerColor = aiColor === WQ_ChessType.BLACK ? WQ_ChessType.WHITE : WQ_ChessType.BLACK;
        const size = board.length;
        let aiScore = 0;
        let playerScore = 0;

        // 1. 气数价值（核心）
        const visited = Array(size).fill(0).map(() => Array(size).fill(false));
        for (let x = 0; x < size; x++) {
            for (let y = 0; y < size; y++) {
                if (visited[x][y] || board[x][y] === WQ_ChessType.NONE) continue;

                const { stones, liberties } = WQ_GoUtil.getGroup(board, x, y, visited);
                const isAi = board[x][y] === aiColor;

                // 气数价值：气越多越安全
                const libertyValue = liberties * 2;
                // 棋块大小价值：块越大越有优势
                const sizeValue = stones.length * 1;
                // 边角价值：边角更容易做活
                const cornerValue = (x === 0 || x === size-1 || y === 0 || y === size-1) ? 1.5 : 1;

                const totalValue = (libertyValue + sizeValue) * cornerValue;
                if (isAi) {
                    aiScore += totalValue;
                } else {
                    playerScore += totalValue;
                }
            }
        }

        // 2. 领地价值（控制空点）
        const emptyVisited = Array(size).fill(0).map(() => Array(size).fill(false));
        for (let x = 0; x < size; x++) {
            for (let y = 0; y < size; y++) {
                if (board[x][y] !== WQ_ChessType.NONE || emptyVisited[x][y]) continue;

                // 计算空点的控制方
                let aiControl = 0;
                let playerControl = 0;
                for (const [dx, dy] of [[-1,0],[1,0],[0,-1],[0,1]]) {
                    const nx = x + dx;
                    const ny = y + dy;
                    if (nx < 0 || nx >= size || ny < 0 || ny >= size) continue;

                    if (board[nx][ny] === aiColor) aiControl++;
                    if (board[nx][ny] === playerColor) playerControl++;
                }

                if (aiControl > playerControl) {
                    aiScore += 0.5; // AI控制的空点
                } else if (playerControl > aiControl) {
                    playerScore += 0.5; // 玩家控制的空点
                }
                emptyVisited[x][y] = true;
            }
        }

        // 返回AI相对分数
        return aiScore - playerScore;
    }
}