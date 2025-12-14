import { _decorator, Component, find, instantiate, Node, Prefab, tween } from 'cc';
import { ProjectEventManager, ProjectEvent } from 'db://assets/Scripts/Framework/Managers/ProjectEventManager';
import PlayerManager from './Manage/SSL_PlayerManager';
const { ccclass, property } = _decorator;

@ccclass('pageController')
export class pageController extends Component {
    currentPageName: string;
    pagePrefab: Prefab;

    public init() {
        this.node.setParent(find("Canvas"));
        this.node.setSiblingIndex(-999);
        this.node.setScale(0, 0, 0);
    }
    public Enter() {
        this.node.setScale(1, 1, 1);

        ProjectEventManager.emit(ProjectEvent.页面转换);
    }

    public Exit() {
        this.node.setScale(0, 0, 0);
    }
}