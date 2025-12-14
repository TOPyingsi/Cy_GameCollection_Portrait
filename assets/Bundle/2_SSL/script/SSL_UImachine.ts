import { _decorator, Component, Node } from 'cc';
import { pageController } from './SSL_pageController';
import { ProjectEvent, ProjectEventManager } from 'db://assets/Scripts/Framework/Managers/ProjectEventManager';
const { ccclass, property } = _decorator;

@ccclass('UImachine')
export class UImachine {
    currentPage: pageController = null;

    public initPage(newPage: pageController) {
        this.currentPage = newPage;
        this.currentPage.Enter();
    }

    public changePage(newPage: pageController) {
        this.currentPage.Exit();
        this.currentPage = newPage;
        this.currentPage.Enter();
    }
}


