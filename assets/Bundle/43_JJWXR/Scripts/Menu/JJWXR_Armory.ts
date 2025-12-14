import { _decorator, Button, Component, Node, Sprite, SpriteFrame, Label, Event } from 'cc';
import { eventCenter } from '../Utils/JJWXR_EventCenter';
import { JJWXR_Events } from '../Utils/JJWXR_Events';
import { JJWXR_MoneyManager } from './JJWXR_MoneyManager';
const { ccclass, property } = _decorator;

@ccclass('JJWXR_Armory')
export class JJWXR_Armory extends Component {
    @property(SpriteFrame)
    public using: SpriteFrame = null;
    @property(SpriteFrame)
    public selected: SpriteFrame = null;
    @property(SpriteFrame)
    public normal: SpriteFrame = null;

    // @property({ type: Node })
    // public btnUse: Node = null;
    // @property({ type: Node })
    // public btnCanBuy: Node = null;
    // @property({ type: Node })
    // public btnCanNotBuy: Node = null;

    private buttonNode: Node[] = [];
    private buttonIndex: number = 0;
    private gunData: any[] = [];
    private money: number = 0; // 金币
    // 获取子节点
    start() {
        const gunIndex = parseInt(localStorage.getItem('gunIndex'));
        this.buttonIndex = gunIndex - 1; // 获取当前使用枪的索引
        this.initIndexData();
        this.updateBtnState();
        eventCenter.on(JJWXR_Events.UPDATE_MONEY, this.updateMoney, this);
        eventCenter.on(JJWXR_Events.UPDATE_BUTTON_STATE, this.updateBtnState, this);
    }
    protected onDestroy(): void {
        eventCenter.off(JJWXR_Events.UPDATE_MONEY, this.updateMoney, this);
        eventCenter.off(JJWXR_Events.UPDATE_BUTTON_STATE, this.updateBtnState, this);
    }

    // 初始化默认数据
    private initIndexData() {
        // const money = JSON.parse(localStorage.getItem('money'));
        // this.money = money;

        this.updateMoney();

        const gun1 = JSON.parse(localStorage.getItem('gun1'));
        const gun2 = JSON.parse(localStorage.getItem('gun2'));
        const gun3 = JSON.parse(localStorage.getItem('gun3'));
        const gun4 = JSON.parse(localStorage.getItem('gun4'));
        const gun5 = JSON.parse(localStorage.getItem('gun5'));
        const gun6 = JSON.parse(localStorage.getItem('gun6'));
        // console.log(gun1 + '\n', gun2 + '\n', gun3 + '\n', gun4 + '\n', gun5 + '\n', gun6 + '\n');
        this.gunData = [gun1, gun2, gun3, gun4, gun5, gun6];

        // // 读取本地存储数据，gun1~gun6的gun属性
        // console.log(gun1.gun, gun1.price, gun1.isBuy, gun2.gun, gun3.gun, gun4.gun, gun5.gun, gun6.gun);

        console.log(this.gunData[1].price);
    }

    // 更新按钮状态
    private updateBtnState() {
        this.buttonNode = this.node.children;
        console.log(this.buttonNode);

        // 设置大按钮状态
        for (let i = 0; i < this.buttonNode.length; i++) {
            let bigBtn = this.buttonNode[i].getComponent(Button);
            bigBtn.getComponent(Sprite).spriteFrame = this.normal;
            // 设置按钮点击事件,点击后切换选中状态
            bigBtn.node.on(Button.EventType.CLICK, this.onClickSelected.bind(this, bigBtn.node));

            const spriteBtn = bigBtn.getComponent(Sprite);
            // 设置默认使用状态
            if (i == this.buttonIndex) {
                console.log('当前使用枪为：' + i);
                spriteBtn.spriteFrame = this.using;   // 默认第 buttonIndex 个按钮为使用状态
                let btnSmall = this.buttonNode[i].children; // 获取小按钮
                // 设置小按钮状态
                for (let j = 0; j < btnSmall.length; j++) {
                    btnSmall[j].active = false;
                    // console.log(btnSmall[j].name);
                }
                bigBtn.node.getChildByName('UsingLabel').active = true;

                this.buttonIndex = i;
            }

            this.updateSmallBtnState(); // 设置小按钮状态
        }
    }

    // 设置小按钮状态
    updateSmallBtnState() {
        this.buttonNode = this.node.children; // 获取大按钮
        for (let i = 0; i < this.buttonNode.length; i++) {
            let bigBtn = this.buttonNode[i].getComponent(Button);
            const spriteBtn = bigBtn.getComponent(Sprite);
            let smallBtn = this.buttonNode[i]; // 获取小按钮

            // 设置小按钮状态
            if (this.gunData[i].isBuy && spriteBtn.spriteFrame != this.using) {    //如果已经购买
                smallBtn.getChildByName('btnCanUse').active = true;
                smallBtn.getChildByName('btnCanBuy').active = false;
                smallBtn.getChildByName('btnCanNotBuy').active = false;
            }
            else if (this.gunData[i].price <= this.money && spriteBtn.spriteFrame != this.using) {    //如果可以购买
                smallBtn.getChildByName('btnCanUse').active = false;
                let btnCanbuy = smallBtn.getChildByName('btnCanBuy');
                btnCanbuy.active = true;
                btnCanbuy.getChildByName('money').getComponent(Label).string = this.gunData[i].price.toString();
                smallBtn.getChildByName('btnCanNotBuy').active = false;
            }
            else if (spriteBtn.spriteFrame != this.using) {    //如果不可购买
                smallBtn.getChildByName('btnCanUse').active = false;
                smallBtn.getChildByName('btnCanBuy').active = false;
                let btnCannotbuy = smallBtn.getChildByName('btnCanNotBuy')
                btnCannotbuy.active = true;
                btnCannotbuy.getChildByName('money').getComponent(Label).string = this.gunData[i].price.toString();
            }
        }
    }

    // 更新金币数量
    updateMoney() {
        this.money = parseInt(localStorage.getItem('money')); // 获取当前金钱 
        for (let i = 0; i < this.buttonNode.length; i++) {
            if (this.gunData[i].isBuy && this.buttonNode[i].getComponent(Sprite).spriteFrame == this.using) {
                this.buttonNode[i].getChildByName('btnCanBuy').active = false;
                this.buttonNode[i].getChildByName('btnCanUse').active = false;
            } else {
                if (this.gunData[i].price <= this.money) {
                    let btnCanbuy = this.buttonNode[i].getChildByName('btnCanBuy');
                    btnCanbuy.active = true;
                    btnCanbuy.getChildByName('money').getComponent(Label).string = this.gunData[i].price.toString();
                } else {
                    let btnCannotbuy = this.buttonNode[i].getChildByName('btnCanNotBuy');
                    btnCannotbuy.active = true;
                    btnCannotbuy.getChildByName('money').getComponent(Label).string = this.gunData[i].price.toString();
                }
            }
        }
    }

    // 设置选择按钮状态
    onClickSelected(clickedButtonNode: Node) {
        // 将所有按钮恢复为 normal 状态
        for (let i = 0; i < this.buttonNode.length; i++) {
            const btn = this.buttonNode[i].getComponent(Button);
            const sprite = btn.getComponent(Sprite);
            if (sprite.spriteFrame != this.using) {
                sprite.spriteFrame = this.normal;   // 将按钮状态设置为 normal
            }
        }

        // 修改被点击按钮的状态为 selected
        const clickedSprite = clickedButtonNode.getComponent(Sprite);
        // 如果被点击按钮已经是 using 状态，则不做任何操作
        if (clickedSprite.spriteFrame == this.using) {
            clickedSprite.spriteFrame = this.using;
            return;
        }
        // 否则，将按钮状态设置为 selected
        clickedSprite.spriteFrame = this.selected;
    }

    // 设置使用按钮状态
    onUseClick(event: Event) {
        var node: Node = event.target; // 获取当前按钮
        let button = node.parent; // 获取当前按钮的父节点

        for (let i = 0; i < this.buttonNode.length; i++) {
            this.buttonNode[i].getComponent(Sprite).spriteFrame = this.normal; // 将所有按钮恢复为 normal 状态
            if (this.gunData[i].isBuy) {
                this.buttonNode[i].getChildByName('btnCanUse').active = true;   // 显示使用按钮

            } else {
                if (this.gunData[i].price <= this.money) {
                    let btnCanbuy = this.buttonNode[i].getChildByName('btnCanBuy');
                    btnCanbuy.active = true;
                    btnCanbuy.getChildByName('money').getComponent(Label).string = this.gunData[i].price.toString();
                } else {
                    let btnCannotbuy = this.buttonNode[i].getChildByName('btnCanNotBuy');
                    btnCannotbuy.active = true;
                    btnCannotbuy.getChildByName('money').getComponent(Label).string = this.gunData[i].price.toString();
                }
            }
            // console.log(this.gunData[i].gun);
        }

        button.getComponent(Sprite).spriteFrame = this.using;
        for (let i = 0; i < button.parent.children.length; i++) {
            if (button.parent.children[i].getComponent(Sprite).spriteFrame == this.using) {
                localStorage.setItem('gunIndex', JSON.stringify(this.gunData[i].gun));
            }
        }
        for (let i = 0; i < button.children.length; i++) {
            button.children[i].active = false;
        }
        button.getChildByName('UsingLabel').active = true;
        eventCenter.emit(JJWXR_Events.GUN_CHANGE); // 发送事件，更新当前使用枪
    }

    // 设置购买按钮状态
    onCanBuyClick(event: Event) {
        var node: Node = event.target;
        let button = node.parent;

        let price = node.getChildByName('money').getComponent(Label).string;
        let btnIndex = 0;
        console.log("点击了购买按钮");
        for (let i = 0; i < this.buttonNode.length; i++) {
            if (price == this.gunData[i].price.toString()) {
                console.log(price); // 打印价格
                console.log(this.gunData[i].gun + " " + this.gunData[i].price + " " + this.gunData[i].isBuy); // 打印价格
                btnIndex = this.gunData[i].gun;
            }
        }

        console.log("btnIndex: " + btnIndex);
        switch (btnIndex) {
            case 1:
                const gun1 = JSON.parse(localStorage.getItem('gun1'));
                if (gun1.price > JJWXR_MoneyManager.Money) return
                gun1.isBuy = true;
                localStorage.setItem('gun1', JSON.stringify(gun1));
                eventCenter.emit(JJWXR_Events.SUB_MONEY, gun1.price);   // 扣钱
                button.getChildByName('btnCanNotBuy').active = false;   // 隐藏不可购买按钮
                button.getChildByName('btnCanBuy').active = false;   // 隐藏购买按钮
                button.getChildByName('btnCanUse').active = true;   // 显示使用按钮
                break;
            case 2:
                const gun2 = JSON.parse(localStorage.getItem('gun2'));
                if (gun2.price > JJWXR_MoneyManager.Money) return
                gun2.isBuy = true;
                localStorage.setItem('gun2', JSON.stringify(gun2));
                eventCenter.emit(JJWXR_Events.SUB_MONEY, gun2.price);   // 扣钱
                button.getChildByName('btnCanNotBuy').active = false;   // 隐藏不可购买按钮
                button.getChildByName('btnCanBuy').active = false;   // 隐藏购买按钮
                button.getChildByName('btnCanUse').active = true;   // 显示使用按钮
                break;
            case 3:
                const gun3 = JSON.parse(localStorage.getItem('gun3'));
                if (gun3.price > JJWXR_MoneyManager.Money) return
                gun3.isBuy = true;
                localStorage.setItem('gun3', JSON.stringify(gun3));
                eventCenter.emit(JJWXR_Events.SUB_MONEY, gun3.price);   // 扣钱
                button.getChildByName('btnCanNotBuy').active = false;   // 隐藏不可购买按钮
                button.getChildByName('btnCanBuy').active = false;   // 隐藏购买按钮
                button.getChildByName('btnCanUse').active = true;   // 显示使用按钮
                break;
            case 4:
                const gun4 = JSON.parse(localStorage.getItem('gun4'));
                if (gun4.price > JJWXR_MoneyManager.Money) return
                gun4.isBuy = true;
                localStorage.setItem('gun4', JSON.stringify(gun4));
                eventCenter.emit(JJWXR_Events.SUB_MONEY, gun4.price);   // 扣钱
                button.getChildByName('btnCanNotBuy').active = false;   // 隐藏不可购买按钮
                button.getChildByName('btnCanBuy').active = false;   // 隐藏购买按钮
                button.getChildByName('btnCanUse').active = true;   // 显示使用按钮
                break;
            case 5:
                const gun5 = JSON.parse(localStorage.getItem('gun5'));
                if (gun5.price > JJWXR_MoneyManager.Money) return
                gun5.isBuy = true;
                localStorage.setItem('gun5', JSON.stringify(gun5));
                eventCenter.emit(JJWXR_Events.SUB_MONEY, gun5.price);   // 扣钱
                button.getChildByName('btnCanNotBuy').active = false;   // 隐藏不可购买按钮
                button.getChildByName('btnCanBuy').active = false;   // 隐藏购买按钮
                button.getChildByName('btnCanUse').active = true;   // 显示使用按钮
                break;
            case 6:
                const gun6 = JSON.parse(localStorage.getItem('gun6'));
                if (gun6.price > JJWXR_MoneyManager.Money) return
                gun6.isBuy = true;
                localStorage.setItem('gun6', JSON.stringify(gun6));
                eventCenter.emit(JJWXR_Events.SUB_MONEY, gun6.price);   // 扣钱
                button.getChildByName('btnCanNotBuy').active = false;   // 隐藏不可购买按钮
                button.getChildByName('btnCanBuy').active = false;   // 隐藏购买按钮
                button.getChildByName('btnCanUse').active = true;   // 显示使用按钮
                break;
        }
        this.initIndexData();
        this.updateSmallBtnState();
    }

    // 点击不可购买按钮
    onCannotBuyClick(event: Event) {
        var node: Node = event.target;
    }
}