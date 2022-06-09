//  
//  main.js
//  created.by Y.Miyamoto on 2022-06-09
//  

function Game() {
    this.gameCount = 0;
    this.result = new Array();
    
    this.player = new MyHand();
    this.computer = new MyHand();

    this.FirstHandView();
}
Game.prototype = {
    HandSwap: function() {
        const NOT_SWAP = (num) => (num - 2) % 2 + 1;

        let plSwap = this.player.swapHandIndex;
        let cpSwap = this.computer.swapHandIndex;

        this.player.JoinHand(
            this.player.firstHand.filter(hand => hand.group == NOT_SWAP(plSwap)), 
            this.computer.firstHand.filter(hand => hand.group == cpSwap)
        );
        this.computer.JoinHand(
            this.player.firstHand.filter(val => val.group == plSwap), 
            this.computer.firstHand.filter(val => val.group == NOT_SWAP(cpSwap))
        );
    },

    Judge: function(a, b) {
        //  result対応表 : a が b に
        //  0 -> draw
        //  1 -> lose
        //  2 -> win
        let result = (a - b + 3) % 3; 
        switch (result) {
            case 0:
                return 'draw';
            case 1:
                return 'lose';
            case 2:
                return 'win';
            default:
                return 'error';
        }
    },

    FirstHandView: function() {
        let parentElement = document.getElementById('swap_hand');
        parentElement.appendChild(this.player.firstHandElement);
    }
}

function MyHand() {
    this.firstHand = new Array(6);
    this.finalHand = new Array();

    this.swapHandIndex = 0;

    this.firstHandElement = document.createElement('div');
    this.firstHandElement.className = 'first_hand';
    this.finalHandElement = document.createElement('div');
    this.finalHandElement.className = 'final_hand';

    this.SetFirstHand();
}
MyHand.prototype = {
    SetFirstHand: function() {
        let group0 = document.createElement('div');
        group0.className = 'group1';
        let group1 = document.createElement('div');
        group1.className = 'group2';
        let group0Content = document.createTextNode('グループ1');
        let group1Content = document.createTextNode('グループ2');
        for (let i = 0; i < this.firstHand.length; i ++) {
            let group = i < 3 ? 0 : 1;
            const HAND = new Hand(group);
            this.firstHand[i] = HAND;
    
            if (group == 0) {
                group0.appendChild(HAND.handElement);
            } else {
                group1.appendChild(HAND.handElement);
            }
        }
        group0.appendChild(group0Content);
        group1.appendChild(group1Content);
        this.firstHandElement.appendChild(group0)
        this.firstHandElement.appendChild(group1);
    },

    JoinHand: function(array1, array2) {
        let joinArray = new Array();
        joinArray.push(array1, array2);
        this.finalHand = joinArray.flat(Infinity);
    },

    Choose: function() {
        let chooseIndex = Math.floor(Math.random() * 6);
        if (this.finalHand[chooseIndex].unUsed) {
            return chooseIndex;
        } else {
            return this.Choose();
        }
    },
}

//  HANDの対応表
//  0 -> gu-
//  1 -> tyoki
//  e -> pa-
const ALL_HAND = [0, 1, 2, 999]
const HAND_IMAGE = {
    0: './img/gu-.jpg',
    1: './img/tyoki.jpg',
    2: './img/pa-.jpg',
    999: './img/ura.jpg',
}

function Hand(group) {
    let randomNum = Math.floor(Math.random() * 3);
    this.hand = ALL_HAND[randomNum];
    this.group = group;
    this.unUsed = true;

    this.handElement = document.createElement('img');
    this.handElement.src = HAND_IMAGE[this.hand];
}
Hand.prototype = {
    UseHand: function() {
        this.hand = 999;
        this.unUsed = false;
    }
}


window.onload = () => {
    let hoge = new Game();
    hoge.HandSwap();
    console.log(hoge);
}

/**
 -------------------------------------------------- *

let a = 1;  //gu
let b = 2;  //tyoki
//  result対応表 a が b に
//  0 -> draw
//  1 -> lose
//  2 -> win
let result = (a - b + 3) % 3; 

let aArray = [
    {hand: 0, group: 0, unUsed: false}, // 0
    {hand: 1, group: 0, unUsed: true},  // 1
    {hand: 2, group: 0, unUsed: false}, // 2
    {hand: 0, group: 1, unUsed: true},  // 3
    {hand: 1, group: 1, unUsed: false}, // 4
    {hand: 2, group: 1, unUsed: true},  // 5
];

function hogehoge() {
    let chooseNum = Math.floor(Math.random() * 6);
    console.log(aArray[chooseNum]);
    if (aArray[chooseNum].unUsed) {
        return chooseNum;
    } else {
        return hogehoge();
    }
}

console.log(hogehoge());



/** */