import { _decorator, AudioClip, Component, director, game, Input, input, instantiate, Label, math, Node, Prefab, Sprite, tween, UITransform, Vec2, Vec3 } from 'cc';
import { inputSystem } from './QWP_inputSystem';
import { AudioManager } from 'db://assets/Scripts/Framework/Managers/AudioManager';
import { GamePanel } from 'db://assets/Scripts/UI/Panel/GamePanel';
import { ProjectEventManager } from 'db://assets/Scripts/Framework/Managers/ProjectEventManager';
import { MyEvent } from 'db://assets/Scripts/Framework/Managers/EventManager';
const { ccclass, property } = _decorator;

@ccclass('knifeController')
export class knifeController extends Component {
    @property(Prefab)
    cut : Prefab = null;
    @property(Node)
    PlayAreaNode : Node = null;
    @property(inputSystem)
    inputSystem : inputSystem = null;
    @property(Node)
    cutBelong : Node = null;
    @property(Prefab)
    cutItem : Prefab = null;
    @property(Label)
    label : Label = null;
    @property(UITransform)
    uiT : UITransform = null;
    @property(AudioClip)
    clip : AudioClip = null;

    xstartPos : Vec3 = new Vec3(-420.557, -491.568);
    ystartPos : Vec3 = new Vec3();
    yendPos : Vec3 = new Vec3();

    onCut : boolean = false;
    @property(GamePanel)
    gamePanel : GamePanel;
    last : number = 0;
    lastPos : number = 0;

    clipList : Node[] = [];
    cnt : number = 0;

    onGame : boolean = false;

    protected onLoad(): void {
        director.getScene().once(MyEvent.TreasureBoxDestroy,()=>{ this.onGame = true})
        this.node.setPosition(this.xstartPos);
    }
    
    protected onEnable(): void {
        director.getScene().on("TOUCH_START", this.TOUCH_START, this);
        director.getScene().on("uiT", this.getui, this);
    }
    getui(cut : Node){
        cut.getComponent(UITransform).height = this.uiT.height;
    }
    EndCome : boolean = false;
    protected update(dt: number): void {
        console.log(ProjectEventManager.GameStartIsShowTreasureBox);
        if (ProjectEventManager.GameStartIsShowTreasureBox == false){
            this.onGame = true;
        }
        if (this.node.position.x >= 540 && !this.EndCome){
            this.onGame = false;
            this.EndCome = true;
            let purpose = ((Number)(director.getScene().name[director.getScene().name.length - 1]) - 1) * 100 + 500;
            if (this.cnt >= purpose){
                this.gamePanel.Win();
            }else{
                this.gamePanel.Lost();
            }
        }
        if (this.onGame){
            if (!this.onCut){
                this.node.setPosition(this.node.position.x + 1, this.node.position.y, 0);
            }
        }
    }
    
    TOUCH_START(){
        if (!this.onGame) return;
        AudioManager.Instance.PlaySFX(this.clip);
        this.cnt++;
        this.label.string = "当前得分: " + this.cnt.toString();
        this.ystartPos = this.node.position.clone();
        this.onCut = true;
        let clip = instantiate(this.cutItem);
        clip.setParent(this.cutBelong);
        
        clip.getComponent(Sprite).fillStart = this.last;
        let len = (this.node.worldPosition.x) / 1080 - this.last;
        clip.getComponent(Sprite).fillRange = len;
        this.last += len;
        this.lastPos = this.node.worldPosition.x;
        // clip.setPosition(clip.position.x + this.clipList.length * 3, clip.position.y, 0);
        this.clipList.push(clip);
        for (let i = 0; i < this.clipList.length; i++){
            this.clipList[i].setWorldPosition(this.clipList[i].worldPosition.x - 3, this.clipList[i].worldPosition.y, 0);
        }
        // this.cutBelong.setPosition(this.cutBelong.position.x - 3, this.cutBelong.position.y, 0);
        this.cutBelong.getComponent(UITransform).width = (1080 * this.last);
        // console.log(this.cutBelong.getComponent(UITransform).width - 25);
        
        // console.log((this.cutBelong.position.x + this.cutBelong.getComponent(UITransform).width) + " SDASD " + this.node.position.x); 
        tween(this.node).to(0.05, {position : new Vec3(this.node.position.x, 400, 0)}).call(() => {
            this.onCut = false;
            this.ystartPos.y = this.xstartPos.y;
            this.node.setPosition(this.ystartPos);
        }).start();
    }
    
    protected onDisable(): void {
        director.getScene().off("TOUCH_START", this.TOUCH_START, this);
        director.getScene().off("uiT", this.getui, this);
    }
    
}


