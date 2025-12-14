import { _decorator, JsonAsset, Node } from 'cc';
import { ResourceUtil } from '../Utils/ResourceUtil';
import Banner from '../../Banner';
import PrefsManager from './PrefsManager';
import { PhysicsManager } from './PhysicsManager';
import { GameManager } from '../../GameManager';
import { Panel, UIManager } from './UIManager';

export class DataManager {
    public static IsUnlockAll: boolean = false;
    public static EnterFirstGame: boolean = false;
    private static LocalGameData: GameData[] = [];
    private static RemoteGameData: GameData[] = [];
    private static IndieGameData: GameData[] = [];

    private static _gameData: GameData[] = [];
    public static get GameData() {
        if (GameManager.ShowAllGame) {
            this._gameData = DataManager.AllGameData;
            return this._gameData;
        }

        if (Banner.IsShowServerBundle) {
            this._gameData = [...DataManager.LocalGameData, ...DataManager.RemoteGameData]
        }
        else {
            this._gameData = DataManager.LocalGameData;
            for (let i = 0; i < this._gameData.length; i++) {
                if (i < 3) this._gameData[i].Unlock = true;
            }
        }

        return this._gameData;
    };

    static AllGameData: GameData[] = [];

    public static async LoadData() {
        try {
            const ja = await ResourceUtil.LoadJson("GameData") as JsonAsset;
            const data = ja.json as any;

            let localGameNames = [];
            let remoteGameNames = [];
            let indieGameNames = [];

            for (let i = 0; i < data.LocalGameData.length; i++) {
                localGameNames.push(data.LocalGameData[i]);
            }

            for (let i = 0; i < data.RemoteGameData.length; i++) {
                remoteGameNames.push(data.RemoteGameData[i]);
            }

            for (let i = 0; i < data.IndieGameData.length; i++) {
                indieGameNames.push(data.IndieGameData[i]);
            }

            for (let i = 0; i < data.AllGameData.length; i++) {
                let e = data.AllGameData[i];
                DataManager.AllGameData.push(new GameData(e.gameName, e.startScene, e.bundles, e.collisionMatrix));
            }

            //筛选出符合条件的数据
            for (let i = 0; i < localGameNames.length; i++) {
                const data = this.AllGameData.find(e => e.gameName == localGameNames[i]);
                this.LocalGameData.push(data);
            }

            for (let i = 0; i < remoteGameNames.length; i++) {
                const data = this.AllGameData.find(e => e.gameName == remoteGameNames[i]);
                this.RemoteGameData.push(data);
            }

            for (let i = 0; i < indieGameNames.length; i++) {
                const data = this.AllGameData.find(e => e.gameName == indieGameNames[i]);
                this.IndieGameData.push(data);
            }

            // //设置默认解锁的关卡
            // for (let i = 0; i < this.GameData.length; i++) {
            //     if (i < 6) {
            //         this.GameData[i].Unlock = true;
            //     } else break;
            // }

            let str = "";
            this.LocalGameData.forEach(e => str += `[${e.gameName}] `);
            console.log(`本地游戏：${str}`);
            str = ""
            this.RemoteGameData.forEach(e => str += `[${e.gameName}] `);
            console.log(`远程游戏：${str}`);
            str = ""
            this.IndieGameData.forEach(e => str += `[${e.gameName}] `);
            console.log(`独立游戏：${str}`);

        } catch (error) {
            console.error("Error loading game data:", error);
            return [];
        }
    }

    //**加载需要的资源 */
    public static async GetBundles(): Promise<string[]> {
        await DataManager.LoadData();

        let bundles: string[] = [];

        //添加本地分包
        this.LocalGameData.forEach(e => e.Bundles.forEach(e => { if (e) bundles.push(e) }));

        let str = ""
        bundles.forEach(e => str += `[${e}] `);
        console.log(`需要加载的本地包：${str}`);

        return bundles;
    }

    public static GetStartGameData() {
        return this.LocalGameData[0];
    }

    public static GetDataByName(name: string) {
        if (this.AllGameData.findIndex(e => e.gameName == name) !== -1) {
            return this.AllGameData.find(e => e.gameName == name);
        }

        return null;
    }

    // public static GetDataByNames(names: string[]) {
    //     return this.AllGameData.filter(item => names.indexOf(item.gameName) !== -1);
    // }

    public static GetDataByNames(names: string[]) {
        const nameToDataMap = new Map(
            this.AllGameData.map(item => [item.gameName, item])
        );

        return names
            .map(name => nameToDataMap.get(name))
            .filter(item => item !== undefined);
    }

    /**解锁下一个关卡 */
    public static UnlockNextLv(data: GameData) {
        let index = this.GameData.findIndex(e => e == data);

        if (index != -1 && index < this.GameData.length - 1) {
            this.GameData[index + 1].Unlock = true;
            return this.GameData[index + 1];
        }

        return this.GameData[0];
    }

    public static GetNextLvData(data: GameData) {
        let index = this.GameData.findIndex(e => e == data);

        if (index != -1 && index < this.GameData.length - 1) {
            return this.GameData[index + 1];
        }

        return this.GameData[0];
    }

    /**是否为独立游戏 */
    public static IsIndieGameData(data: GameData) {
        return this.IndieGameData.find(e => e == data) !== undefined;
    }

}

export class GameData {
    constructor(public gameName: string, public startScene: string, private bundles: string, public collisionMatrix: string) {
        let index = 0;
        for (let i = 1; i <= (1 << PhysicsManager.maxLayer); i <<= 1) {
            this.matrices.set(i, parseInt(this.collisionMatrix.split(`-`)[index], 2));
            index++;
        }
    }

    matrices: Map<number, number> = new Map();

    get Bundles() {
        return this.bundles.split(`,`).map(str => str.trim());
    }

    get DefaultBundle() {
        return this.Bundles[0];
    }

    get Unlock() {
        if (DataManager.IsUnlockAll) return true;
        return PrefsManager.GetBool(`${this.gameName}_Unlock`, false);
    }

    set Unlock(value: boolean) {
        PrefsManager.SetBool(`${this.gameName}_Unlock`, value);
    }

    get Pass() {
        return PrefsManager.GetBool(`${this.gameName}_Pass`, false);
    }

    set Pass(value: boolean) {
        PrefsManager.SetBool(`${this.gameName}_Pass`, value);
    }

    GetMatrixByLayer(layer: number): number {
        if (this.matrices.has(layer)) {
            return this.matrices.get(layer);
        }
        console.error(`[${this.gameName}]中没有找到层[${layer}]的物理层数据`);
        return -1;
    }
}

