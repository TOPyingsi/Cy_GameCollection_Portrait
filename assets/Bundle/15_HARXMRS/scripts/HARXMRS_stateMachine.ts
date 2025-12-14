import { _decorator, Component, Node } from 'cc';
import { baseState } from './HARXMRS_baseState';
const { ccclass, property } = _decorator;

@ccclass('stateMachine')
export class stateMachine{
    
    currentState : baseState;
    
    initState(_initState : baseState){
        this.currentState = _initState;
        this.currentState.enter();
    }
    
    changeState(_newState : baseState){
        this.currentState.exit();
        this.currentState = _newState;
        this.currentState.enter();
    }


}


