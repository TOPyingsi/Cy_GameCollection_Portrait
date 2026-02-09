import { _decorator, Animation, Color, Component, instantiate, Label, Node, Sprite, tween, UIOpacity, v3, Vec3 } from 'cc';
import { WQ_ChessLinkItem, WQ_ChessType, WQ_ExpressionType, WQ_GoUtil, WQ_LinkType, WQ_Pos } from './WQ_GoUtil';
const { ccclass, property } = _decorator;

@ccclass('WQ_Chess')
export class WQ_Chess extends Component {
    @property(Node)
    public linkAnimPrefabParent: Node = null; 

    @property(Node)
    public linkAnimContainer: Node = null; 

    @property(Node)
    public expressions: Node = null; 

    
    private linkAnimMap: Map<string,{animNode:Node,linkType:WQ_LinkType} > = new Map();

    pos: WQ_Pos = null;

    currentExpressionType: WQ_ExpressionType = WQ_ExpressionType.NONE;

    public color: WQ_ChessType = WQ_ChessType.NONE;

    private isInited: boolean = false;

    protected onLoad(): void {
        if(!this.isInited){
            this.node.active = false;
        }
    }


    init(pos:WQ_Pos,color:WQ_ChessType){
        this.isInited = true;

        this.color = color;
        this.node.active = true;
        this.pos = pos;

        this.linkAnimMap.clear();

        let spColor = color === WQ_ChessType.BLACK ? "727272" : "FFFFFF";

        let changeColor  = (node:Node)=>{
            let spCom = node.getComponent(Sprite)
            if(spCom){
                spCom.color = new Color(spColor);
            }
            node.children.forEach((child)=>{
                changeColor(child);
            })
        }
        changeColor(this.linkAnimPrefabParent);
        
    }


    setExpression(expressionChessPos:WQ_Pos,expressionType:WQ_ExpressionType,targetNode?:Node){
        if(!expressionChessPos.equal(this.pos)){
            let oldExpressionNode = this.expressions.getChildByName("expression_"+this.currentExpressionType);
            if(oldExpressionNode){
                tween(oldExpressionNode.getComponent(UIOpacity))
                    .to(0.3, { opacity: 0 })
                    .call(() => {
                        oldExpressionNode.active = false;
                    })
                    .start();
            }

            this.currentExpressionType = WQ_ExpressionType.NONE;

            return;
        }

        if(this.currentExpressionType === expressionType){
            return;
        }

        let oldExpressionNode = this.expressions.getChildByName("expression_"+this.currentExpressionType);
        let delayTime = 0.3;
        if(oldExpressionNode){
            oldExpressionNode.getComponent(UIOpacity).opacity = 0;
            oldExpressionNode.active = false;
            delayTime = 0.3;
        }

        

      
        let expressionNode = this.expressions.getChildByName("expression_"+expressionType);
        if(expressionNode){
            expressionNode.active = true;
            let opacityCom = expressionNode.getComponent(UIOpacity);
            if(opacityCom){
                tween(opacityCom)
                .delay(delayTime)
                .call(() => {
                    if(targetNode){
                        // ========== 核心计算逻辑 ==========
                        // 1. 获取本节点和目标节点的世界坐标
                        const selfWorldPos = this.node.worldPosition;
                        const targetWorldPos = targetNode.worldPosition;

                        // 2. 计算两个节点在2D平面的方向向量（Y轴是2D的上方向）
                        // 注意：2D游戏中通常使用 X（水平）和 Y（垂直）轴
                        const dirX = targetWorldPos.x - selfWorldPos.x;
                        const dirY = targetWorldPos.y - selfWorldPos.y;

                        // 3. 计算弧度（atan2(y, x)，因为默认朝向正上方（Y轴））
                        // Math.atan2(dirY, dirX) 计算的是从X轴正方向到目标方向的弧度
                        // 我们需要的是从Y轴正方向（正上方）到目标方向的角度，所以需要调整
                        let radian = Math.atan2(dirX, dirY); 
                        // 4. 弧度转角度
                        let angle = radian * 180 / Math.PI+180;

                        this.expressions.setRotationFromEuler(0, 0, -angle);
                        // let label = this.node.getChildByName("label");
                        // if(label){
                        //     label.getComponent(Label).string = ""+(-angle);
                        // }

                    }
                })
                .to(0.3, { opacity: 255 })
                .start();
            }
        }
        this.currentExpressionType = expressionType;
    }


    setTotalLinks(chessNodesMap: Map<string,Node>,board: WQ_ChessType[][],chessLinks: WQ_ChessLinkItem[]){
        let totalPosKeys = []
        chessLinks.forEach((linkItem) => {
            totalPosKeys.push(`${linkItem.pos.x},${linkItem.pos.y}`);
                        console.log("创造链接");
            this.createLinkAnim(board, linkItem.linkType, linkItem.pos, chessNodesMap.get(`${linkItem.pos.x},${linkItem.pos.y}`));
        console.log("创造链接");
        });
    
        let noKeys_1 = []
        this.linkAnimMap.forEach((linkAnimItem,key)=>{
           noKeys_1.push(key);
        })

        let noKeys_2 = noKeys_1.filter((key)=>!totalPosKeys.includes(key));
        noKeys_2.forEach((key)=>{
            console.log("删除链接",key);
            this.linkAnimMap.get(key).animNode.destroy();
            console.log("删除链接成功",key);
            this.linkAnimMap.delete(key);
        })
    }
    

    public createLinkAnim(board: WQ_ChessType[][],linkType:WQ_LinkType,targetPos:WQ_Pos,targetNode:Node){
        if(this.linkAnimMap.has(`${targetPos.x},${targetPos.y}`)){
            return;
        }
        let linkAnimPrefabName = "linkAnimPrefab_" + linkType; 
        let linkAnimPrefab = this.linkAnimPrefabParent.getChildByName(linkAnimPrefabName);
        if(linkAnimPrefab){
            let linkAnim = instantiate(linkAnimPrefab);
            linkAnim.setParent(this.linkAnimContainer);
            linkAnim.setPosition(0,0,0);

              // ========== 核心计算逻辑 ==========
            // 1. 获取本节点和目标节点的世界坐标
            const selfWorldPos = this.node.worldPosition;
            const targetWorldPos = targetNode.worldPosition;

            // 2. 计算两个节点在2D平面的方向向量（Y轴是2D的上方向）
            // 注意：2D游戏中通常使用 X（水平）和 Y（垂直）轴
            const dirX = targetWorldPos.x - selfWorldPos.x;
            const dirY = targetWorldPos.y - selfWorldPos.y;

            // 3. 计算弧度（atan2(y, x)，因为默认朝向正上方（Y轴））
            // Math.atan2(dirY, dirX) 计算的是从X轴正方向到目标方向的弧度
            // 我们需要的是从Y轴正方向（正上方）到目标方向的角度，所以需要调整
            let radian = Math.atan2(dirX, dirY); 
            // 4. 弧度转角度
            let angle = radian * 180 / Math.PI;
            let angleCopy = angle;

            if(linkType === WQ_LinkType.日字型  || linkType === WQ_LinkType.两步直线){
                // linkAnim.setSiblingIndex(0);
                angle = angle+0.25;
              
            }

            // ========== 设置旋转角度 ==========
            // 2D游戏中旋转只需要设置Z轴的欧拉角
            linkAnim.setRotationFromEuler(0, 0, -angle);

            // let label = this.node.getChildByName("label");
            // if(label){
            //     label.getComponent(Label).string = ""+(-angle);
            // }


            // linkAnim.setRotationFromEuler(0,0,angle);
            let posKey = `${targetPos.x},${targetPos.y}`;
            this.linkAnimMap.set(posKey, {animNode:linkAnim,linkType:linkType});
            linkAnim.active = true;

            if(linkType === WQ_LinkType.相邻){
                // linkAnim.setSiblingIndex(0);
                let angle2 = -angleCopy;
                let blankPoses = [];
                switch (angle2) {
                   case 0:
                        blankPoses = [[-1,0],[1,0]];
                        break;
                   case 90:
                        blankPoses = [[0,1],[0,-1]];
                        break;
                   case -180:
                        blankPoses = [[1,0],[-1,0]];
                        break;
                   case -90:
                        blankPoses = [[0,-1],[0,1]];
                        break;
                }
                
                blankPoses.forEach((blankPos,index)=>{
                    let isSameColor = WQ_GoUtil.checkRelativePositionSameColor(board,this.pos,blankPos);
                    if(isSameColor){
                        linkAnim.getChildByName("blankContainer").getChildByName("blank_" + index).active = true;
                    }
                })

                let spColor = this.color === WQ_ChessType.BLACK ? "727272" : "FFFFFF";
                let changeColor  = (node:Node)=>{
                    let spCom = node.getComponent(Sprite)
                    if(spCom){
                        spCom.color = new Color(spColor);
                    }
                    node.children.forEach((child)=>{
                        changeColor(child);
                    })
                }
                changeColor(linkAnim.getChildByName("blankContainer"));
                
            }

            linkAnim.getComponent(Animation).play(linkAnim.getComponent(Animation).clips[0].name);
        }
    }




    public destoryLinkAnim(pos:WQ_Pos){
        let posKey = `${pos.x},${pos.y}`;
        let linkAnim = this.linkAnimMap.get(posKey);
        if(linkAnim){
            linkAnim.animNode.destroy();
            this.linkAnimMap.delete(posKey);
        }
    }


    public destoryChess(){

        let isSetNodeAnim = false;
        this.linkAnimMap.forEach((value,key)=>{
           if(value.linkType === WQ_LinkType.相邻){
                // value.animNode.getChildByName("blankContainer").children.forEach((blank)=>{
                //     blank.active = false;
                // })
                // value.animNode.getComponent(Animation).clips[0].speed = -3;
                value.animNode.getComponent(Animation).play("linkAnim_999");
                if(!isSetNodeAnim){
                    isSetNodeAnim = true;
                    let duration = value.animNode.getComponent(Animation).clips[0].duration;
                    tween(value.animNode)
                        .delay(duration)
                        .call(() => {
                            tween(this.node)
                                .to(0.2, { scale: v3(0,0,0) })
                                .call(() => {
                                    this.node.destroy();
                                })
                                .start();
                        })
                        .start();
                }
               
           }
           else{
             value.animNode.destroy();
           }
        })

        if(!isSetNodeAnim){
            tween(this.node)
               .to(0.2, { scale: v3(0,0,0) })
               .call(() => {
                    this.node.destroy();
                })
               .start();
        }
        
    }

}


