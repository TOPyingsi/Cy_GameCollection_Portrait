import { _decorator, Component, Node, Event, Button, tween, v3, instantiate, Prefab } from 'cc';
import { JZHZNYY_NYY } from './JZHZNYY_NYY';
const { ccclass, property } = _decorator;

@ccclass('JZHZNYY_Chose')
export class JZHZNYY_Chose extends Component {
    @property(Node)
    ChoseFa: Node = null;
    @property(Prefab)
    Move: Prefab[] = [];
    @property(Node)
    MoveNode: Node = null;
    OnClick(event: Event) {
        if (JZHZNYY_NYY.Instance.MusicEnable == true) {
            JZHZNYY_NYY.Instance.Chlick = true;
        }
        switch (event.target.name) {

            case "打电机":
                for (let i = 0; i < this.ChoseFa.children.length; i++) {
                    if (this.ChoseFa.children[i].name == "打电机") {
                        this.ChoseFa.children[i].children[0].active = true;
                    }
                    else {
                        this.ChoseFa.children[i].children[0].active = false;
                    }
                    if (this.Move[i].name == "打电机") {
                        if (this.MoveNode.children[0] != null) {
                            this.MoveNode.children[0].destroy();
                        }
                        const AAA建材王总 = instantiate(this.Move[i]);
                        this.MoveNode.addChild(AAA建材王总);
                        AAA建材王总.active = false;



                    }
                }
                break;
            case "毛笔":
                for (let i = 0; i < this.ChoseFa.children.length; i++) {
                    if (this.ChoseFa.children[i].name == "毛笔") {
                        this.ChoseFa.children[i].children[0].active = true;
                    }
                    else {
                        this.ChoseFa.children[i].children[0].active = false;
                    }
                    if (this.Move[i].name == "毛笔") {
                        if (this.MoveNode.children[0] != null) {
                            this.MoveNode.children[0].destroy();
                        }
                        const AAA建材王总 = instantiate(this.Move[i]);
                        this.MoveNode.addChild(AAA建材王总);
                        AAA建材王总.active = false;




                    }
                }
                break;
            case "羽毛":
                for (let i = 0; i < this.ChoseFa.children.length; i++) {
                    if (this.ChoseFa.children[i].name == "羽毛") {
                        this.ChoseFa.children[i].children[0].active = true;
                    }
                    else {
                        this.ChoseFa.children[i].children[0].active = false;
                    }
                    if (this.Move[i].name == "羽毛") {
                        if (this.MoveNode.children[0] != null) {
                            this.MoveNode.children[0].destroy();
                        }
                        const AAA建材王总 = instantiate(this.Move[i]);
                        this.MoveNode.addChild(AAA建材王总);
                        AAA建材王总.active = false;


                    }
                }
                break;
            case "猫爪":
                for (let i = 0; i < this.ChoseFa.children.length; i++) {
                    if (this.ChoseFa.children[i].name == "猫爪") {
                        this.ChoseFa.children[i].children[0].active = true;
                    }
                    else {
                        this.ChoseFa.children[i].children[0].active = false;
                    }
                    if (this.Move[i].name == "猫爪") {
                        if (this.MoveNode.children[0] != null) {
                            this.MoveNode.children[0].destroy();
                        }
                        const AAA建材王总 = instantiate(this.Move[i]);
                        this.MoveNode.addChild(AAA建材王总);
                        AAA建材王总.active = false;

                    }
                }
                break;
            case "马桶刷":
                for (let i = 0; i < this.ChoseFa.children.length; i++) {
                    if (this.ChoseFa.children[i].name == "马桶刷") {
                        this.ChoseFa.children[i].children[0].active = true;
                    }
                    else {
                        this.ChoseFa.children[i].children[0].active = false;
                    }
                    if (this.Move[i].name == "马桶刷") {
                        if (this.MoveNode.children[0] != null) {
                            this.MoveNode.children[0].destroy();
                        }
                        const AAA建材王总 = instantiate(this.Move[i]);
                        this.MoveNode.addChild(AAA建材王总);
                        AAA建材王总.active = false;


                    }
                }
                break;
            case "鸡毛掸子":
                for (let i = 0; i < this.ChoseFa.children.length; i++) {
                    if (this.ChoseFa.children[i].name == "鸡毛掸子") {
                        this.ChoseFa.children[i].children[0].active = true;
                    }
                    else {
                        this.ChoseFa.children[i].children[0].active = false;
                    }
                    if (this.Move[i].name == "鸡毛掸子") {
                        if (this.MoveNode.children[0] != null) {
                            this.MoveNode.children[0].destroy();
                        }
                        const AAA建材王总 = instantiate(this.Move[i]);
                        this.MoveNode.addChild(AAA建材王总);
                        AAA建材王总.active = false;


                    }
                }
                break;


        }
    }
}