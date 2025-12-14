import { instantiate, NodePool, Prefab, Node } from "cc";

export class XDMKQ_PoolManager {

    private static PoolDict: any = {};

    /**
    * 根据预设从对象池中获取对应节点
    */
    public static GetNodeByPrefab(prefab: Prefab): Node {
        let name = prefab.name;
        let node = null;
        if (this.PoolDict.hasOwnProperty(name)) {
            //已有对应的对象池
            let pool = this.PoolDict[name];
            if (pool.size() > 0) {
                node = pool.get();
            } else {
                node = instantiate(prefab);
            }
        } else {
            //没有对应对象池，创建他！
            this.PoolDict[name] = new NodePool();
            node = instantiate(prefab);
        }
        return node;
    }

    /**
     * 将对应节点放回对象池中
     */
    public static PutNode(node: Node) {
        if (!node) return;

        let name = node.name;
        let pool = null;
        if (this.PoolDict.hasOwnProperty(name)) {
            pool = this.PoolDict[name];
        } else {
            pool = new NodePool();
            this.PoolDict[name] = pool;
        }

        pool.put(node);
    }

    /**
     * 根据名称，清除对应对象池
     */
    public static ClearPool(name: string) {
        if (this.PoolDict.hasOwnProperty(name)) {
            let pool = this.PoolDict[name];
            pool.clear();
        }
    }

    /**
     * 向对象池里生成固定数量的 Node
     */
    public static GenerateNodesToPool(prefab: Prefab, count: number) {
        let name = prefab.name;

        //已有对应的对象池
        if (this.PoolDict.hasOwnProperty(name)) {
            let pool = this.PoolDict[name];
            if (pool.size() < count) {
                let length = count - pool.size();
                for (let i = 0; i < length; i++)pool.put(instantiate(prefab));
                console.log(`对象池已有：${name}    新添加数量：${length}`);
            }
        } else {
            this.PoolDict[name] = new NodePool();
            for (let i = 0; i < count; i++) this.PoolDict[name].put(instantiate(prefab));
            console.log(`对象池添加：${name}    添加数量：${count}`);
        }
    }

}


