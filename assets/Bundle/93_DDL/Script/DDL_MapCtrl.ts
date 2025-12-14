import { _decorator, Component, director, Label, Node, Size, Sprite, tween, UITransform, v3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('DDL_MapCtrl')
export class DDL_MapCtrl extends Component {

    @property(Node) previousPageBtn: Node = null;
    @property(Node) nextPageBtn: Node = null;
    @property(Node) mapPanel: Node = null;
    @property([Node]) panels: Node[] = [];
    @property(Label) pageInfo: Label = null;
    @property(Node) progress: Node = null;

    currentPage: Node = null;
    size: Size = null;

    protected onLoad(): void {
        this.size = this.mapPanel.getComponent(UITransform).contentSize;
        this.currentPage = this.panels[0];
        this.currentPage.setPosition(0, -100);
        for (let i = 1; i < this.panels.length; i++) {
            this.panels[i].setPosition(0, this.size.width);
        }
        this.refreshPageInfo(1);
        this.updateButtonStates();
    }

    init(list: string[]) {
        list.forEach(str => {
            this.panels.forEach(panel => {
                panel.children.find(child => {
                    if (child.name == str) {
                        child.getChildByName("Icon").getComponent(Sprite).grayscale = false;
                        child.getChildByName("？").active = false;
                    }
                })
            });
        });
        this.refeshProgress(list.length)
    }

    private isCanRefeshPage: boolean = true;

    nextPage() {
        if (!this.isCanRefeshPage) {
            return;
        }
        this.isCanRefeshPage = false;

        const index = this.panels.indexOf(this.currentPage);
        if (index >= this.panels.length - 1) {
            this.nextPageBtn.active = false;
        } else {
            const nextPage = this.panels[index + 1];
            tween(this.currentPage)
                .to(0.3, { position: v3(-this.size.width, -100, 0) })
                .start();
            tween(nextPage)
                .to(0.3, { position: v3(0, -100, 0) })
                .call(() => {
                    this.isCanRefeshPage = true;
                    this.currentPage = nextPage;
                    this.refreshPageInfo(index + 2);
                    this.updateButtonStates();
                })
                .start();
        }
    }

    private updateButtonStates() {
        const currentIndex = this.panels.indexOf(this.currentPage);
        this.previousPageBtn.active = currentIndex > 0;
        this.nextPageBtn.active = currentIndex < this.panels.length - 1;
    }

    previousPage() {
        if (!this.isCanRefeshPage) {
            return;
        }
        this.isCanRefeshPage = false;

        const index = this.panels.indexOf(this.currentPage);
        if (index === 0) {
            this.previousPageBtn.active = false;
        } else {
            const previousPage = this.panels[index - 1];
            tween(this.currentPage)
                .to(0.3, { position: v3(this.size.width, -100, 0) })
                .start();
            tween(previousPage)
                .to(0.3, { position: v3(0, -100, 0) })
                .call(() => {
                    this.isCanRefeshPage = true;
                    this.currentPage = previousPage;
                    this.refreshPageInfo(index);
                    this.updateButtonStates();
                })
                .start();
        }
    }

    refreshPageInfo(num: number) {
        this.pageInfo.string = `${num}/${this.panels.length}`
    }

    close() {
        this.node.destroy();
    }

    refeshProgress(num: number) {
        const a = this.progress.getChildByName("进度条底")
        const b = a.getChildByName("进度条")
        const c = a.getChildByName("Label")
        const sp = b.getComponent(Sprite)
        sp.fillRange = num * 0.0357142857
        c.getComponent(Label).string = `${num} / 28`
    }

}


