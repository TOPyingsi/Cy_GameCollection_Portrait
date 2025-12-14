import { _decorator, Component, Node, Rect } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Picturecontainer')
export class SNDMX_Picturecontainer{


    
    @property([Node])//保存可以变化的节点
    dropZonesContainer: Node[] = [];

    private static _instance = null;
    public static getInstance() {
        if (!this._instance) {
            this._instance = new SNDMX_Picturecontainer;
        }
        return this._instance;
    }
    private constructor() {

    }

    public getDropZonesContainer():Node[]{
        return this.dropZonesContainer;
    }

    public setDropZonesContainer(start: number, deleteCount: number){
        this.dropZonesContainer.splice(start,deleteCount);
    }

    
}


