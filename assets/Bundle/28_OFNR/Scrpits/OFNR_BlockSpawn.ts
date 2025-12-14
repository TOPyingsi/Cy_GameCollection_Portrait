import { _decorator, Collider, Collider2D, Component, Contact2DType, director, instantiate, IPhysics2DContact, Node, PhysicsSystem2D, Prefab, tween, Vec3 } from 'cc';
import { OFNR_BlockSet } from './OFNR_BlockSet';
import { ProjectEventManager } from 'db://assets/Scripts/Framework/Managers/ProjectEventManager';
import { MyEvent } from 'db://assets/Scripts/Framework/Managers/EventManager';
const { ccclass, property } = _decorator;

@ccclass('OFNR_BlockSpawn')
export class OFNR_BlockSpawn extends Component {
    @property(Prefab)
    private blockPrefab:Prefab=null;
    private currentBlockNumber: number = 0;
    private activeBlocks: Node[] = [];
    private blockNode:Node=null;
    private receivedNumbers: number[] = [];
    private  isRemove:boolean=false;
    private  isGameOver:boolean=false;
    protected onLoad(): void {
        
        director.on("isSpawn",this.spawnNode,this);
        // director.on("gameWin",this.gameWin,this);
        if (ProjectEventManager.GameStartIsShowTreasureBox) director.getScene().once(MyEvent.TreasureBoxDestroy, this.Init, this);
       else this.Init();
        
    }

    Init(){
        this.spawnTwinBlocks();
    }
    start() {
        
    }
    
    // gameWin(){
    //     this.activeBlocks.forEach(block => block.destroy());
    //     this.activeBlocks = [];
        
        
    // }
    spawnNode(){
        if(this.isRemove){
            return;
        }
        this.activeBlocks.forEach(block => block.destroy());
         this.activeBlocks = [];
         this.scheduleOnce(() => {
            for (let i = 0; i < 2; i++) {
                const blockNode = instantiate(this.blockPrefab);
                this.node.addChild(blockNode);
                blockNode.name = (i + 1).toString();
                blockNode.setPosition(new Vec3(i * 300-150 , 800, 0));
                const currentId =15 + i;
                blockNode.getComponent(OFNR_BlockSet).setBlockId(currentId);
                this.activeBlocks.push(blockNode);
            }
                this.isRemove=true;
         },3);
        
    }
   

    update(deltaTime: number) {
        
    }
    public spawnTwinBlocks(number?: number) {
        if(this.isGameOver==true){
            return;
        }
        if (typeof number === 'undefined') {
            this.activeBlocks = [];
            const startId = this.currentBlockNumber;
            for (let i = 0; i < 2; i++) {
                const blockNode = instantiate(this.blockPrefab);
                this.node.addChild(blockNode);
                blockNode.name = (i + 1).toString();
                blockNode.setPosition(new Vec3(i * 300-150 , 800, 0));
                const currentId = startId + i;
                blockNode.getComponent(OFNR_BlockSet).setBlockId(currentId);
                this.activeBlocks.push(blockNode);
            }
            return;
        }
        
         this.receivedNumbers.push(number);
         if(this.receivedNumbers[0]==12||this.receivedNumbers[0]==13){
            this.activeBlocks.forEach(block => block.destroy());
            this.activeBlocks = [];
            this.scheduleOnce(() => {
            const blockNode = instantiate(this.blockPrefab);
                this.node.addChild(blockNode);
                blockNode.name = "1";
                blockNode.setPosition(new Vec3(-150, 800, 0));
                blockNode.getComponent(OFNR_BlockSet).setBlockId(14);
                this.activeBlocks.push(blockNode);
                this.receivedNumbers = [];},3);
         }

         if (this.receivedNumbers.length === 2 && 
             this.receivedNumbers[0] !== this.receivedNumbers[1]) {
            this.activeBlocks.forEach(block => block.destroy());
            this.activeBlocks = [];
            if(this.receivedNumbers[0]==12||this.receivedNumbers[0]==13){
                return;
            }
            this.scheduleOnce(() => {
            for(var i=0;i<2;i++){
            if (this.receivedNumbers[i] % 2 === 0) {
                const blockNode = instantiate(this.blockPrefab);
                this.node.addChild(blockNode);
                blockNode.name="1";
                blockNode.setPosition(new Vec3(-150, 800, 0));
                blockNode.getComponent(OFNR_BlockSet).setBlockId(this.receivedNumbers[i]+2);
                this.activeBlocks.push(blockNode);
            } else {
                const blockNode = instantiate(this.blockPrefab);
                blockNode.name="2";
                this.node.addChild(blockNode);
                blockNode.setPosition(new Vec3(150, 800, 0));
                blockNode.getComponent(OFNR_BlockSet).setBlockId(this.receivedNumbers[i]+2);
                this.activeBlocks.push(blockNode);
            }
        }
            this.receivedNumbers = [];
        },3);
        }
    }
        
    }




