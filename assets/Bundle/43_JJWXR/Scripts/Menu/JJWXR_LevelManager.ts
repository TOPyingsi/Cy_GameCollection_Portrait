import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('JJWXR_LevelManager')
export class JJWXR_LevelManager extends Component {

    // 配置关卡数据

    onLoad() {
        this.saveLevelData();
        // let currentLevel = parseInt(localStorage.getItem('currentLevel'));
        // console.log('level:', currentLevel);
        // currentLevel++;
        // localStorage.setItem('currentLevel', urrentLevel);
        // let curlevel = parseInt(localStorage.getItem('currentLevel'));
        // console.log('level:', curlevel);
    }

    saveLevelData() {
        // 定义关卡数据
        let data = localStorage.getItem('currentLevel');
        let currentLevel = 1;
        if (data != "" && data != null) currentLevel = parseInt(data);
        let data2 = localStorage.getItem('gunIndex');
        let gunIndex = 1;
        if (data2 != "" && data2 != null) gunIndex = parseInt(data2);
        let data3 = localStorage.getItem('setting');
        let setting = { sound: true, oscillation: true };
        if (data3 != "" && data3 != null) setting = JSON.parse(data3);

        // const gunIndex = parseInt(localStorage.getItem('gunIndex')) || 1; // 默认选择第一把枪

        // const setting = localStorage.getItem('setting') || { sound: true, oscillation: true };

        const isFirstPlay = localStorage.getItem('isFirstPlay') || "true";
        // const isFirstPlay ="true";

        // 保存关卡数据
        const level01 = { level: 1, time: 100 };
        const level02 = { level: 2, time: 120 };
        const level03 = { level: 3, time: 140 };
        const level04 = { level: 4, time: 160 };
        const level05 = { level: 5, time: 180 };
        const level06 = { level: 6, time: 200 };


        let gun1 = { gun: 1, price: 100, isBuy: true };
        let gun2 = { gun: 2, price: 200, isBuy: false };
        let gun3 = { gun: 3, price: 300, isBuy: false };
        let gun4 = { gun: 4, price: 400, isBuy: false };
        let gun5 = { gun: 5, price: 500, isBuy: false };
        let gun6 = { gun: 6, price: 600, isBuy: false };
        console.log(localStorage.getItem('gun1'));
        // 读取和初始化商店数据
        if (localStorage.getItem('gun1') != null && localStorage.getItem('gun1') != "") {
            gun1 = JSON.parse(localStorage.getItem('gun1'));
            gun2 = JSON.parse(localStorage.getItem('gun2'));
            gun3 = JSON.parse(localStorage.getItem('gun3'));
            gun4 = JSON.parse(localStorage.getItem('gun4'));
            gun5 = JSON.parse(localStorage.getItem('gun5'));
            gun6 = JSON.parse(localStorage.getItem('gun6'));
        }

        console.log('isFirstPlay:' + isFirstPlay);
        localStorage.setItem('isFirstPlay', isFirstPlay);
        // 将关卡数据保存到本地存储
        let level = localStorage.getItem('currentLevel');
        if (!level || level == '') localStorage.setItem('currentLevel', "1");///////////改当前关卡

        localStorage.setItem('gunIndex', gunIndex.toString());

        localStorage.setItem('setting', JSON.stringify(setting));
        localStorage.setItem('level01', JSON.stringify(level01));
        localStorage.setItem('level02', JSON.stringify(level02));
        localStorage.setItem('level03', JSON.stringify(level03));
        localStorage.setItem('level04', JSON.stringify(level04));
        localStorage.setItem('level05', JSON.stringify(level05));
        localStorage.setItem('level06', JSON.stringify(level06));

        // 将商店数据保存到本地存储
        localStorage.setItem('gun1', JSON.stringify(gun1));
        localStorage.setItem('gun2', JSON.stringify(gun2));
        localStorage.setItem('gun3', JSON.stringify(gun3));
        localStorage.setItem('gun4', JSON.stringify(gun4));
        localStorage.setItem('gun5', JSON.stringify(gun5));
        localStorage.setItem('gun6', JSON.stringify(gun6));

    }

    loadLevelData() {
        // 从本地存储中读取关卡数据
        const currentLevel = parseInt(localStorage.getItem('currentLevel'));
        const level01 = JSON.parse(localStorage.getItem('level01'));
        const level02 = JSON.parse(localStorage.getItem('level02'));
        const level03 = JSON.parse(localStorage.getItem('level03'));
        const level04 = JSON.parse(localStorage.getItem('level04'));
        const level05 = JSON.parse(localStorage.getItem('level05'));
        const level06 = JSON.parse(localStorage.getItem('level06'));
    }
}