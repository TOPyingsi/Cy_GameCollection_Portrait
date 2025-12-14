import { _decorator, Component, director, instantiate, Node, Prefab, Sprite, SpriteFrame } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('OFNR_RoleSpawn')
export class OFNR_RoleSpawn extends Component{

    @property([SpriteFrame])
    private roleNames: SpriteFrame[] = [];

    @property(Prefab)
    private roleNamePrefab:Prefab=null;

    protected onLoad(): void {
        this.spawnRole();
    }
    start() {
        
    }

    spawnRole(){
        
            const roleNode =this.node;     
            if(this.node.name=="OFNR_Nezha"){
                const roleNameNode=instantiate(this.roleNamePrefab);
                roleNode.addChild(roleNameNode);
                roleNameNode.getComponent(Sprite).spriteFrame=this.roleNames[0];
                roleNameNode.setPosition(-200,0,0);
            }
            if(this.node.name=="OFNR_Aobin"){
                const roleNameNode=instantiate(this.roleNamePrefab);
                roleNode.addChild(roleNameNode);
                roleNameNode.getComponent(Sprite).spriteFrame=this.roleNames[1];
                roleNameNode.setPosition(200,0,0);
            }
        
           
    }

    update(deltaTime: number) {
        
    }
}


