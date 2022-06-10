//  
//  main.js
//  created.by Y.Miyamoto on 2022-06-09
//  

function Game() {
    this.gameCount = 0;
    this.result = new Array();
    
    this.player = new MyHand();
    this.computer = new MyHand();

    this.playerChooseIndex = 0;
    this.computerChooseIndex = 0;

    this.FirstHandShow();
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

        console.log(this.player);

        this.FinalHandShow();
    },

    Judge: function() {
        //  result対応表 : player が computer に
        //  0 -> draw
        //  1 -> lose
        //  2 -> win
        let plHand = this.player.finalHand[this.playerChooseIndex].hand;
        let cpHand = this.computer.finalHand[this.computerChooseIndex].hand;
        let result = (plHand - cpHand + 3) % 3; 
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
    
    MessageShow: function(messageText = '') {
        let messageElement = document.getElementById('message');
        messageElement.innerHTML = messageText;

        let actionChildrenElement = document.getElementById('action').children;
        for (let i = 0; i < actionChildrenElement.length; i ++) {
            actionChildrenElement[i].style.display = 'none';
        }
    },

    FirstHandShow: function() {
        let parentElement = document.getElementById('swap_hand');
        let doSwapElement = document.getElementById('do_swap-button');
        parentElement.appendChild(this.player.firstHandElement);

        document.getElementById('group1').addEventListener('click', () => {
            this.player.swapHandIndex = 0;
            this.MessageShow('グループ1を交換しますか?');
            doSwapElement.style.display = "inline";
        });
        document.getElementById('group2').addEventListener('click', () => {
            this.player.swapHandIndex = 1;
            this.MessageShow('グループ2を交換しますか?');
            doSwapElement.style.display = "inline";
        });

        doSwapElement.addEventListener('click', () => {
            parentElement.innerHTML = '';
            this.HandSwap();
        });
    },

    FinalHandShow: function() {
        let doSelect = document.getElementById('do_select-button');

        let parentElement = document.getElementById('select_hand');
        let selectImgElement = document.createElement('div');
        selectImgElement.className = 'select_img';
        let selectImgContent = document.createElement('img');
        selectImgContent.id = 'select_img';
        selectImgContent.src = HAND_IMAGE[999];
        selectImgElement.appendChild(selectImgContent);
        parentElement.appendChild(selectImgElement);
        parentElement.appendChild(this.player.finalHandElement);

        let messageText = String(this.gameCount + 1) + '戦目<br>出す手札を選択!';
        this.MessageShow(messageText);

        let handsImg = document.getElementsByClassName('final_hand')[0].children;
        for (let index = 0; index < handsImg.length; index ++) {
            handsImg[index].addEventListener('click', () => {
                let selectHand = this.player.finalHand[index];
                if (selectHand.unUsed) {
                    this.playerChooseIndex = index;
                    let messageText = HAND_NAME[selectHand.hand] + 'でOK?';
                    this.MessageShow(messageText);
                    selectImgContent.src = HAND_IMAGE[selectHand.hand];
                    doSelect.style.display = "inline";
                }
            });
        }

        doSelect.addEventListener('click', () => {
            this.computerChooseIndex = this.computer.Choose();
            parentElement.innerHTML = '';
            this.ResultShow();
        });
    },

    ResultShow: function() {
        let parentElement = document.getElementById('result');
        
        let cpTextElement = document.createElement('h2');
        let cpTextContetn = document.createTextNode('コンピュータが出した手札は');
        cpTextElement.appendChild(cpTextContetn);
        let cpImgElement = document.createElement('div');
        let cpImgContent = this.computer.ImgShow(this.computerChooseIndex);
        cpImgElement.appendChild(cpImgContent);

        let plTextElement = document.createElement('h2');
        let plTextContetn = document.createTextNode('あなたが出した手札は');
        plTextElement.appendChild(plTextContetn);
        let plImgElement = document.createElement('div');
        let plImgContent = this.player.ImgShow(this.playerChooseIndex);
        plImgElement.appendChild(plImgContent);
        

        parentElement.appendChild(cpTextElement);
        parentElement.appendChild(cpImgElement);
        parentElement.appendChild(plTextElement);
        parentElement.appendChild(plImgElement);
        
        this.result.push(this.Judge());

        let resultText = '';
        switch (this.result[this.gameCount]) {
            case 'win':
                resultText = 'あなたの勝ち!';
                break;
            case 'lose':
                resultText = 'コンピュータの勝ち!';
                break;
            case 'draw':
                resultText = '引き分け!';
                break;
            default:
                resultText = 'Error';
        }

        this.gameCount ++;

        this.MessageShow(resultText);
        let doNext = document.getElementById('do_next-button');
        let doAllResult = document.getElementById('do_all_result-button');
        if (this.gameCount < 6) {     
            doNext.style.display = 'inline';
        } else {
            doAllResult.style.display = 'inline';
        }
        doNext.addEventListener('click', () => {
            parentElement.innerHTML = '';
            this.FinalHandShow();
        });
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
        group0.id = 'group1';
        let group1 = document.createElement('div');
        group1.id = 'group2';
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

        for (let i in this.finalHand) {
            let parentElement = document.createElement('div');
            parentElement.id = 'hand_img' + String(i);
            parentElement.appendChild(this.finalHand[i].handElement)
            this.finalHandElement.appendChild(parentElement);
        }
    },

    Choose: function() {
        let chooseIndex = Math.floor(Math.random() * 6);
        if (this.finalHand[chooseIndex].unUsed) {
            return chooseIndex;
        } else {
            return this.Choose();
        }
    },

    ImgShow: function(index) {
        let imgElement = document.createElement('img');
        imgElement.src = HAND_IMAGE[this.finalHand[index].hand];
        return imgElement;
    }
}

//  HANDの対応表
//  0 -> gu-
//  1 -> tyoki
//  e -> pa-
const ALL_HAND = [0, 1, 2, 999];
const HAND_NAME = ['グー', 'チョキ', 'パー', 'ウラ'];
const HAND_IMAGE = {
    0: './img/gu-.jpg',
    1: './img/tyoki.jpg',
    2: './img/pa-.jpg',
    999: './img/ura.jpg',
};

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
        this.handElement.src = HAND_IMAGE[this.hand];
    }
}


window.onload = () => {
    const GAME = new Game();
    console.log(GAME);
}
