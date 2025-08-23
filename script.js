// Add JavaScript code for your web site here and call it from index.html.
//////////////////////////////////////////////////////////////////////////
// HTML内にあるIDの取得

// button1
const IDbutton1 = document.querySelector("#button1");
const IDacd = document.querySelector("#acd");
const IDcod = document.querySelector("#cod");
const IDacod = document.querySelector("#acod");

//button2
const IDbutton2 = document.querySelector("#button2");
const IDacq = document.querySelector("#acq");

//button3
const IDbutton3 = document.querySelector("#button3");

//結果の表示
const IDresult = document.querySelector("#result");


/////////////////////////////////////////////////////////////////////////
// 関数の定義

//２次関数m
function m(x){
    return x*x/3;
}

//1次関数l (傾きa 切片b を求める。)
function l(p0, p1){
    let a = (p1[1] - p0[1])/(p1[0] - p0[0]);
    let b = -a * p0[0] + p0[1];
    return [ a, b ]; 
}

//２点間の距離
function distance(p0, p1){
    return Math.sqrt( (p1[1] - p0[1])**2 + (p1[0] - p0[0])**2 );
}

//三角形の面積を計算 (ヘロンの公式を用いて)
function heron(a, b, c){
    s = (a + b + c) / 2;
    return Math.sqrt( s*(s - a)*(s - b)*(s - c) );
}

//３点から三角形の面積を計算
function square(a, b, c){
    let aa = distance(a, b);
    let bb = distance(b, c);
    let cc = distance(c, a);
    return heron(aa, bb, cc);   
}
/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
// main

//
// 四角形ACOD, 三角形ACQの定義 
//
let acd;          //三角形ACDの面積
let cod;
let acod;
let acod2;      //ACODの２倍の面積
let acq;

let dx = 0.1;   //点Qの移動幅
let acc = 0.01; //計算精度
let error;      //誤差

let flag1 = 0;  //button1が押押されたか
let flag2 = 0;  //button2
let flag3 = 0;  //button3


//座標の設定
let o = [0, 0]
let p = [-3, 0];
let q = [6, 0];
let a = [6, m(6)];
let c = [0, l(a, p)[1]];
let d = [3, m(3)];
//document.writeln(c, d);

//
// グラフの設定(jsxgraph: 変数の設定は var を用いる。)
//
var board = JXG.JSXGraph.initBoard('box', {
    boundingbox:[-4,15,8,-3], 
    axis:true,
    keepaspectratio: true
  }
);

//関数　y=1/3x^2
board.create('functiongraph', [
    function(x){
        return x**2/3;
    }
  ]
)

//ポイントの表示
let listp = [ [o,'O'], [p,'P'], [a,'A'], [c,'C'], [d, 'D'] ];
for(let i of listp){
    board.create('point', i[0], {name: i[1]} );
}

//直線 2点(点A,点P)を通過
board.create('line',[a, p], {straightFirst:true, straightLast:true, strokeWidth:2});

//線分AD、DO、CD
board.create('line',[a, d], {straightFirst:false, straightLast:false, strokeWidth:2});
board.create('line',[d, o], {straightFirst:false, straightLast:false, strokeWidth:2});
board.create('line',[c, d], {straightFirst:false, straightLast:false, strokeWidth:2});

//線分AQ, CQ
var qpoint = board.create('point', q, {name: 'Q'});
board.create('line',[a, qpoint], {straightFirst:false, straightLast:false, strokecolor: 'red', strokeWidth:2});
board.create('line',[c, qpoint], {straightFirst:false, straightLast:false, strokecolor: 'red', strokeWidth:2});



//ボタンが押されたときの処理
//
//三角形acd, cod, 四角形acodの計算
IDbutton1.onclick = function(event){
    acd = square(a, c, d);  //三角形ACD
    cod = square(c, o, d);  //三角形COD
    acod = acd + cod;       //四角形ACOD
    acod2 = 2 * acod;       //ACODの２倍

    IDacd.innerHTML = acd.toFixed(2);
    IDcod.innerHTML = cod.toFixed(2);
    IDacod.innerHTML = acod.toFixed(2) + "---------- ➀";

    flag1 =1;
}

//三角形ACQの計算
IDbutton2.onclick = function(event){
    acq = square(a, c, q);  //三角形ACQ

   IDacq.innerHTML = acq.toFixed(2) + "---------- ➁";

   board.create('text', [6, -1.3, 
            function () { 
                return `x: ${q[0].toFixed(1)} acq: ${acq.toFixed(2)}`; 
            }
          ]
        );
  
   flag2 = 1;

 }

//四角形ACODの２倍の面積と三角形ACQの面積が等しくなる点Qを計算
IDbutton3.onclick = function(event){

    // button3が複数回押されたときの処理
    if(flag3 == 1) 
        return;

    //三角形の面積が先に押されていることを確認
    if( flag1 == 0 || flag2 == 0){
        alert("面積を求めるボタンが押されていません。");
        return;
    }

    //１秒ごとに計算
    let id = setInterval(function() {	//インt－バルタイマーの利用
        q[0] = q[0] + dx;				//精度外なので点Qを右にdxずらす
		acq = square(a, c, q);			//三角形ACQの面積の計算
		error =  acod2 - acq;			//誤差
 		if(Math.abs(error) < acc ){  	//予定精度内か？
            IDresult.innerHTML = " 解答 x = " + q[0].toFixed(1) + "のとき等しくなる。<br>";
            window.scrollTo(0, document.body.scrollHeight); //画面を一番下にスクロール
			clearInterval(id);			//精度内であったら終了
        }
        qpoint.moveTo(q, 1000);         //Q点を右にずらし描画

        board.fullupdate();                 //再描画　全体を

	    },1000								//1秒ごとにシミュレーションを多なう
    )
    
    flag3 = 1;

}

// program end
