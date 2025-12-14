import { _decorator, Billboard, Component, instantiate, Label, Node, Prefab, UITransform, Vec2, Vec3 } from 'cc';
import { grid } from './grid';
import { ObjectController } from './ObjectController';
const { ccclass, property } = _decorator;

@ccclass('prefabsManager')
export class prefabsManager extends Component {
    
    static instance : prefabsManager = null;
    
    @property([Prefab])
    prefabsList : Prefab[] = [];
    // @property([Vec2])
    objectInfo : Vec2[][] = [[new Vec2(2, 2), new Vec2(2, 2), new Vec2(2, 2), new Vec2(4, 4), new Vec2(4, 4)],
                            [new Vec2(2, 2), new Vec2(2, 2), new Vec2(2, 2), new Vec2(4, 4), new Vec2(4, 4), new Vec2(10, 10)],
                            [new Vec2(2, 2), new Vec2(2, 2), new Vec2(2, 2), new Vec2(4, 4), new Vec2(4, 4), new Vec2(10, 10), new Vec2(10, 10)],
                            [new Vec2(2, 2), new Vec2(2, 2), new Vec2(2, 2), new Vec2(4, 4), new Vec2(4, 4), new Vec2(10, 10), new Vec2(10, 10)],
                            [new Vec2(2, 2), new Vec2(2, 2), new Vec2(2, 2), new Vec2(4, 4), new Vec2(4, 4), new Vec2(10, 10), new Vec2(10, 10), new Vec2(10, 10)]];
    @property(Node)
    objectParent : Node;
    Grid : grid;
    @property(Label)
    title : Label;
    @property(Label)
    purpose : Label;

    currentLevel : number;

    protected onLoad(): void {
        prefabsManager.instance = this;
    }

    protected start(): void {
        this.setLevel_One();
    }
    public setLevel_One(){
        this.currentLevel = 0;
        this.purpose.string = "目标：合成石叽娘娘！"
        this.title.string = "敖丙-哪吒-申公豹-无量仙尊-石矶娘娘";
        this.build(0, 10, 0);
        this.build(0, 12, 18);

        this.build(1, 10, 18);

        this.build(2, 8, 0);
        
        this.build(3, 14, 16);
    }
    public setLevel_Tow() {
        this.currentLevel = 1;
        
        this.purpose.string = "目标：合成太乙真人！"
        this.title.string = "敖丙-哪吒-申公豹-无量仙尊-石矶娘娘\n-太乙真人";
        this.build(0, 10, 0);
        this.build(0, 15, 0);
        this.build(0, 12, 14);
        this.build(0, 10, 18);

        this.build(1, 12, 0);
        this.build(1, 14, 14);
        this.build(1, 18, 14);

        this.build(2, 18, 0);
        this.build(2, 14, 12);
        this.build(2, 16, 14);

        this.build(3, 16, 16);

        this.build(4, 16, 10);
        this.build(4, 12, 16);
    }
    public setLevel_Three(){
        this.currentLevel = 2;
        
        this.purpose.string = "目标：合成西海龙王！"
        this.title.string = "敖丙-哪吒-申公豹-无量仙尊-石矶娘娘\n-太乙真人-西海龙王";
        this.build(0, 8, 8);
        this.build(0, 14, 8);
        this.build(0, 18, 8);
        this.build(0, 8, 18);
        
        this.build(1, 12, 8);

        this.build(2, 10, 8);
        this.build(2, 16, 8);
        this.build(2, 18, 2);

        this.build(3, 16, 4);

        this.build(4, 12, 4);
        
        this.build(5, 10, 10);
    }
    public setLevel_Four(){
        this.currentLevel = 3;
        
        this.purpose.string = "目标：合成西海龙王！"
        this.title.string = "敖丙-哪吒-申公豹-无量仙尊-石矶娘娘\n-太乙真人-西海龙王";
        
        this.build(0, 8, 0);
        this.build(0, 16, 0);

        this.build(1, 4, 0);
        this.build(1, 12, 0);

        this.build(2, 6, 0);
        this.build(2, 14, 0);

        this.build(3, 15, 16);

        this.build(4, 1, 16);

        this.build(5, 5, 10);
        
    }
    public setLevel_Five(){
        this.currentLevel = 4;
        
        this.purpose.string = "目标：合成如来佛祖！"
        this.title.string = "敖丙-哪吒-申公豹-无量仙尊-石矶娘娘\n-太乙真人-西海龙王-如来佛祖";
        
        this.build(0, 10, 18);
        this.build(0, 12, 16);

        this.build(1, 8, 8);
        this.build(1, 10, 14);
        
        this.build(2, 8, 6);
        this.build(2, 10, 16);

        this.build(3, 16, 11);
        this.build(4, 16, 16);

        this.build(5, 0, 10);
        this.build(6, 10, 0);


    }

    
    build(index : number, posx : number, posy : number){ // gridposition
        let object = instantiate(this.prefabsList[index]);
        object.getComponent(UITransform).width = this.Grid.cellSize.x * this.objectInfo[this.currentLevel][index].x;
        object.getComponent(UITransform).height = this.Grid.cellSize.y * this.objectInfo[this.currentLevel][index].y;
        object.setParent(this.objectParent);
        let worldpos = this.Grid.getCelltoWorldPosition(new Vec3(posx, posy, 0));
        object.setWorldPosition(worldpos.x, worldpos.y, 0);
        object.getComponent(ObjectController).setGrid(this.Grid);
        object.getComponent(ObjectController).Level = index;
        object.getComponent(ObjectController).width = this.objectInfo[this.currentLevel][index].x;
        object.getComponent(ObjectController).height = this.objectInfo[this.currentLevel][index].y;
        object.getComponent(ObjectController).gridpos = new Vec2(posx, posy);
        this.Grid.OccupyArea(posx, posy, this.objectInfo[this.currentLevel][index].x, this.objectInfo[this.currentLevel][index].y, object.getComponent(ObjectController));
    }
}


