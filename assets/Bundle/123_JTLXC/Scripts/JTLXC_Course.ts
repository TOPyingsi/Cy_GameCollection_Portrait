import { _decorator, Component, director, Node } from 'cc';
import { JTLXC_GameData } from './JTLXC_GameData';
const { ccclass, property } = _decorator;

@ccclass('JTLXC_Course')
export class JTLXC_Course extends Component {
    start() {
        if (JTLXC_GameData.Instance.Cource < 2) {
            director.getScene().on("箭头乐消除_教程", this.CourseOver, this);
            this.Show();
        }
    }


    //根据转态来显示
    Show() {
        let state = JTLXC_GameData.Instance.Cource;
        this.node.children.forEach((element, index) => {
            element.active = index == state;
        });

    }

    CourseOver(index: number) {
        if (index == JTLXC_GameData.Instance.Cource) {
            JTLXC_GameData.Instance.Cource++;
            this.Show();
        }
    }
}


