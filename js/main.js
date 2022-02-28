/***********************************************************************************
 * 
 * ルール
 * １．プレイヤーと敵に"グー","チョキ","パー"のいずれかが三枚入った手札を二組配る
 * ２．配られた二組のうち、どちらか一組を相手と交換する
 * ３．最初に配られた一組の手札と相手と交換した一組の手札、計二組六枚の最終手札を作成
 * ４．最終手札を使って計６回のジャンケンを行う（一度使ったカードは二度使えない）
 * ５．６回の勝負の後、勝利数が多かった方が勝利
 * 
 * 
 ***********************************************************************************/

/**
 * 画面表示の流れ
 * 
 * スタート画面（firstDisplay）
 * 　↓（ゲームスタート）
 * 手札のトレード（tradeDisplay）
 * 　↓
 * 交換後、最終手札の表示（tradeCompletDisplay）
 * 　↓
 * ※　手札の選択（handSelectDisplay）
 * 　↓
 * ※　勝負画面の表示（matchDisplay）　※を6回繰り返す
 * 　↓（6戦目終了）
 * 最終結果を表示する（finalJudgeDisplay）
 * 　↓（ゲーム終了）
 * スタート画面（firstDisplay）
 */


/**
 * "グー","チョキ","パー"
 * 1,2,3,
 */
let strTehuda = [1,2,3];

/* 最初の手札 */
let plFirstHand1 = [];
let plFirstHand2 = [];
let teFirstHand1 = [];
let teFirstHand2 = [];

/*
 最終手札
 二次元配列にする 
 use:true or false
 contents:"グー","チョキ","パー",
*/
let plLastHand ;
let teLastHand ;

/* プレイヤーの対戦結果を保存する */
let gameResult = {win: 0, lose: 0, draw: 0};

/* 画像のURL */
let tehudaURL = new Array("./img/ura.jpg", "./img/gu-.jpg", "./img/tyoki.jpg", "./img/pa-.jpg");

/* 戦数をカウント */
let gameCount;

/* プレイヤーの交換カード */
let exchangNum;

/* プレイヤーの選択カード */
let selectNum;


/********************************************
 * ゲーム準備
 * 
 * HTML　スタート画面を消して、ゲーム画面（手札の交換画面）を表示する
 * 最初の手札を作成する
 */
function gamePreparation(){
    // 画面切り替え
    document.getElementById("firstDisplay").style.display = "none";
    document.getElementById("tradeDisplay").style.display = "inline";
    
    // 手札作成
    firstHandCreate(plFirstHand1);
    firstHandCreate(plFirstHand2);
    firstHandCreate(teFirstHand1);
    firstHandCreate(teFirstHand2);

    for(let i = 1; i < 4;i++){
        document.getElementById("firstHand" + i).src = tehudaURL[plFirstHand1[i - 1]];
        document.getElementById("firstHand" + (i + 3)).src = tehudaURL[plFirstHand2[i - 1]];
    }
}

/*******************************************************************
 * 手札を作成する
 */
function firstHandCreate(firstHand){
    for(let i = 0; i < 3; i++){
        let random = Math.floor(Math.random() * 1000);
        let num = random % 3;
        firstHand[i] = strTehuda[num];
    }
    return firstHand;
}

/*******************************************************************
 * 相手とカード交換
 */
function exchangeHand(groupNum){
    exchangNum = (parseInt(groupNum.substr(5, 1)));

    document.getElementById("changeComment1").innerHTML = "交換するのは、グループ" + exchangNum + "でいいかな？";
    document.getElementById("tradeHandDecide").style.display = "inline";
    document.getElementById("group1").style.backgroundColor = "white";
    document.getElementById("group2").style.backgroundColor = "white";
    document.getElementById("group" + exchangNum).style.backgroundColor = "linen";
}

/*************************************************************************
 * ゲームの準備完了
 */
function gameReady(){
    // 画面切り替え
    document.getElementById("tradeDisplay").style.display = "none";
    document.getElementById("tradeHandDecide").style.display = "none";
    document.getElementById("tradeCompletDisplay").style.display = "inline";
    
    /* console.log("交換した手札= " + exchangNum);
    console.log(plFirstHand1);
    console.log(plFirstHand2);
    console.log(teFirstHand1);
    console.log(teFirstHand2); */
    
    if(exchangNum === 1){
        plLastHand = lastHandCreate(plFirstHand2, teFirstHand1, false);
        teLastHand = lastHandCreate(plFirstHand1, teFirstHand2, true);
    }else {
        plLastHand = lastHandCreate(plFirstHand1, teFirstHand1, false);
        teLastHand = lastHandCreate(plFirstHand2, teFirstHand2, true);
    }
    
    /* console.log(plLastHand);
    console.log(teLastHand); */

    for(let i = 1; i < 7;i++){
        document.getElementById("afterTradeHand" + i).src = tehudaURL[plLastHand[i - 1].contents];
    }
}


/*************************************************************************
 * 最終手札の作成
 * @param firstHand1 最初に配られたプレイヤー側の手札
 * @param firstHand2 最初に配られた相手側の手札
 * @param shuffle シャッフルするかどうか、相手のみ行う（論理型）
 * @returns 最終手札
 */
function lastHandCreate(firstHand1, firstHand2 ,shuffle){
    let lastHand = [
        {use: true, contents: 0},
        {use: true, contents: 0},
        {use: true, contents: 0},
        {use: true, contents: 0},
        {use: true, contents: 0},
        {use: true, contents: 0},
    ];
    if(shuffle === true){
        let arrayJoin = firstHand1.concat(firstHand2);
        for(let i = arrayJoin.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            let tmp = arrayJoin[i];
            arrayJoin[i] = arrayJoin[j];
            arrayJoin[j] = tmp;
        }
        for(let i = 0;i < 6;i++){
            lastHand[i].contents = arrayJoin[i];
        }
    }else {
        for(let i = 0;i < 3;i++){
            lastHand[i].contents = firstHand1[i];
            lastHand[i + 3].contents = firstHand2[i];
        }
    }
    return lastHand;
}


/*************************************************************************
 * ゲームスタート
 */
function gameStart(){
    // 画面切り替え
    document.getElementById("tradeCompletDisplay").style.display = "none";
    document.getElementById("gameCount").style.display = "inline";
    document.getElementById("selectHandDisplay").style.display = "inline";

    console.log(plLastHand);
    // ゲーム画面を表示する
    for(let i = 1; i < 7;i++){
        document.getElementById("plHand" + i).firstElementChild.src = tehudaURL[plLastHand[i - 1].contents];
    }

    gameCount = 1;
}

/**
 * 手札の選択
 * @param theNum 選択した手札の番号 
 */
function selectHand(theNum){
    if(plLastHand[parseInt(theNum.substr(6, 1)) - 1].use === true){
        selectNum = (parseInt(theNum.substr(6, 1)));

        document.getElementById("selectHand").src = tehudaURL[plLastHand[selectNum - 1].contents];
        document.getElementById("changeComment2").innerHTML = "この手札で勝負する？";
        document.getElementById("selectHandDecide").style.display = "inline";
    }
}

/*****************************************************************
 * 勝負
 */
function readyFight() {
    // 画面切り替え
    document.getElementById("selectHandDisplay").style.display = "none";
    document.getElementById("matchDisplay").style.display = "inline";

    let teHand = teLastHand[gameCount - 1].contents;
    let plHand = plLastHand[selectNum - 1].contents;

    plLastHand[selectNum - 1].use = false;
    document.getElementById("plHand" + selectNum).firstElementChild.src = tehudaURL[0];

    document.getElementById("teMatchHand").src = tehudaURL[teHand];
    document.getElementById("plMatchHand").src = tehudaURL[plHand];

    /**
         * 勝利判定 
         * １＝グー、２＝チョキ、３＝パー
         */
    let resultComment;
    if(plHand === 1){
        if(teHand === 1){
            gameResult.draw++;
            resultComment = "引き分け";
        }else if(teHand === 2){
            gameResult.win++;
            resultComment = "勝ち";
        }else {
            gameResult.lose ++;
            resultComment = "負け";
        }
    }else if(plHand === 2){
        if(teHand === 1){
            gameResult.lose ++;
            resultComment = "負け";
        }else if(teHand === 2){
            gameResult.draw++;
            resultComment = "引き分け";
        }else {
            gameResult.win++;
            resultComment = "勝ち";
        }
    }else {
        if(teHand === 1){
            gameResult.win++;
            resultComment = "勝ち";
        }else if(teHand === 2){
            gameResult.lose ++;
            resultComment = "負け";
        }else {
            gameResult.draw++;
            resultComment = "引き分け";
        }
    }
    
    
    document.getElementById("resultReport").innerHTML = resultComment;

    if(gameCount === 6){
        document.getElementById("changeComment3").value = "結果発表！ Click Here";
    }else {
        document.getElementById("changeComment3").value = "次のゲーム！ Click Here";
    }

    
}

/***************************************************************
 * 結果発表
 */
function gameSet(){
    
    gameCount++;

    //ゲームカウントが７になったらゲーム終了、結果表示を行う
    if(gameCount === 7){
        let endComment;
        if(gameResult.win - gameResult.lose > 0){
            endComment = "君の勝ちだ！";
        }else if(gameResult.win - gameResult.lose < 0){
            endComment = "君の負けだ！";
        }else {
            endComment = "引き分け！";
        }
        let allResultsComment = "6戦中　" + gameResult.win + "勝、" + gameResult.lose + "負、"
            + gameResult.draw + "引き分け。<br>この勝負、" + endComment;

        document.getElementById("gameCount").style.display = "none";
        document.getElementById("matchDisplay").style.display = "none";
        document.getElementById("finalJudgeDisplay").style.display = "inline";
        document.getElementById("allResults").innerHTML = allResultsComment;
    }else {
        document.getElementById("matchDisplay").style.display = "none";
        document.getElementById("selectHandDisplay").style.display = "inline";
        document.getElementById("gameCount").innerHTML = gameCount + "戦目";
        document.getElementById("selectHand").src = tehudaURL[0];
        document.getElementById("changeComment2").innerHTML = "出す手札をクリック";
        document.getElementById("selectHandDecide").style.display = "none";
    }
}

/**********************************************************************
 * スタート画面に戻る
 * 
 * 変数の初期化
 * gameResult gameCount plLastHand teLastHand selectNum
 */
function returnFirst(){
    /** 画面切り替え */
    document.getElementById("firstDisplay").style.display = "inline";
    document.getElementById("finalJudgeDisplay").style.display = "none"
    /** 変数・表示画面の初期化 */
    document.getElementById("changeComment1").innerHTML = "交換するグループをクリックしてね";
    document.getElementById("group1").style.backgroundColor = "white";
    document.getElementById("group2").style.backgroundColor = "white";
    document.getElementById("gameCount").innerHTML = "1戦目";
    document.getElementById("selectHand").src = tehudaURL[0];
    document.getElementById("changeComment2").innerHTML = "出す手札をクリック";
    document.getElementById("selectHandDecide").style.display = "none";
    gameCount = 0;
    gameResult.win = 0;
    gameResult.lose = 0;
    gameResult.draw = 0;
}