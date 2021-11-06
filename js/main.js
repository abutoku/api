//ポイント名の配列
const dive_point = [
  { name: "志賀島",value: "sika"},
  { name: "唐津",value: "kara"},
  { name: "呼子",value: "yobu"},
  { name: "辰ノ口", value:"tatsu"},
];

//ポイント名を表示するための配列
const point_select = [];

//ポイント名にhtmlタグを付ける繰り返し処理
for (let i = 0; i < dive_point.length; i++){
  point_select.push(`<option value="${dive_point[i].value}">${dive_point[i].name}</option>`);
}

//selectに表示
$('#point').html(point_select);

//point指定のための変数を定義、初期値を設定
let pc = 40; //福岡県
let hc = 19; //西戸崎

const now = new Date();//現在時間を取得

const year = now.getFullYear();//年を取得
const month = ("0" + (now.getMonth() + 1)).slice(-2);//月を取得
const day  = ("0" + now.getDate()).slice(-2);//日を取得

//日付欄に日付を表示
$('#date').val(`${year}/${month}/${day}`);

//潮の画像を表示
$('#tide_image').html(`<img
        src="https://api.tide736.net/tide_image.php?pc=${pc}&hc=${hc}&yr=${year}&mn=${month}&dy=${day}&rg=day&w=768&h=512&lc=blue&gcs=cyan&gcf=blue&ld=on&ttd=on&tsmd=on">`);


$('#point').on('change', function () { //select部分が変更されたら発動
  const sel = $('#point').val(); //変数selに選択項目を代入
  if (sel === "kara") {
    pc = 41;//佐賀県
    hc = 1;//唐津
  } else if (sel === "yobu") {
    pc = 41;//佐賀県
    hc = 3;//名護屋浦
  } else if (sel === "tatsu") {
    pc = 42;//長崎県
    hc = 56;//伊王島
  } else {
    pc = 40;//福岡県
    hc = 19;//西戸崎
  }

  //選択された内容で画像更新
  $('#tide_image').html(`<img
        src="https://api.tide736.net/tide_image.php?pc=${pc}&hc=${hc}&yr=${year}&mn=${month}&dy=${day}&rg=day&w=768&h=512&lc=blue&gcs=cyan&gcf=blue&ld=on&ttd=on&tsmd=on">`);
  
  //tide APIを呼び出すURL
  const url = `https://api.tide736.net/get_tide.php?pc=${pc}&hc=${hc}&yr=${year}&mn=${month}&dy=${day}&rg=day`;

  //tide APIを呼び出す関数
  axios.get(url) 
    .then(function (response) { //成功すればレスポンスを受け取る
      console.log(response); //コンソールにレスポンスを表示
      let today = year + "-" + month + "-" + day; //日付をkeyにするための変数
      console.log(response.data.tide.chart[today].moon.title); //潮を取得
      $('#tide').val(response.data.tide.chart[today].moon.title); //潮をimput欄へ
    })
    .catch(function (error) { //失敗した場合に実行
      console.log(error); //コンソールにエラーを出す
    })
    .finally(function () { //処理が終了したら必ず実行
      console.log('done!');//done!
    });
  
});//////////////select部分が変更されたら発動ここまで//////////////////


//tide APIを呼び出すURL
const url = `https://api.tide736.net/get_tide.php?pc=${pc}&hc=${hc}&yr=${year}&mn=${month}&dy=${day}&rg=day`;

//tide APIを呼び出す関数
axios.get(url)
  .then(function (response) { //成功すればレスポンスを受け取る
    console.log(response);
    let today = year + "-" + month + "-" + day; //日付をkeyにするための変数
    console.log(response.data.tide.chart[today].moon.title);
    $('#tide').val(response.data.tide.chart[today].moon.title);
  })
  .catch(function (error) { //失敗した場合に実行
    console.log(error);//コンソールにエラーを出す
  })
  .finally(function () { //処理が終了したら必ず実行
    console.log('done!');//done!
  });

//位置情報取得が成功したときに実行される関数
function showPosition(position) { 
  //位置情報を取る
  //console.log(position);
  const lat = position.coords.latitude;//緯度
  const lng = position.coords.longitude;//経度
  console.log(lat, lng);//経度と緯度をコンソールに表示
  //$('#output').html(`緯度:${lat}、経度:${lng}`);

  //天気を取得するためのURL、APIkey
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=metric&lang=ja&appid=`;

  //取ってきた位置情報の天気を取得
  axios.get(url)
    .then(function (response) { //成功すればレスポンスを受け取る
      //console.log(response);
      console.log(response.data.weather[0].main); //天気をコンソールに出す
      console.log(response.data.main.temp); //気温をコンソールに出す
      $('#weather').val(response.data.weather[0].main); //天気をinput欄へ
      $('#temp').val(response.data.main.temp); //気温をinput欄へ
    })
    .catch(function (error) { //失敗した場合
      console.log(error); //コンソールにエラーを出す
    })
    .finally(function () { //処理が終了したら必ず実行
      console.log('done!'); //done!
    });
}

//エラーには番号（1, 2, 3）が振ってあり意味が決まっている
function showError(error) { //失敗したときに実行される関数
  console.log(error);//コンソールにエラー表示
  const errorMessages = [
    "位置情報が許可されてません",
    "現在位置を特定できません",
    "位置情報を取得する前にタイムアウトになりました",
  ];
  alert(`error:${errorMessages[error.code - 1]}`);//エラーは３種類
}

//取得に必要なオプション
const option = {
  enableHighAccuracy: true, //対応端末で GPS を使用するかどうかの設定．trueまたはfalseで指定．
  maximumAge: 20000, //指定時間以内であれば前回取得した位置情報の値を用いる．ミリ秒で指定．
  timeout: 1000000, //ミリ秒
};

  //位置情報の取得
  //navigator.geolocation.getCurrentPosition(成功した場合に実行される関数, 失敗した場合に実行される関数, 取得に必要なオプション);
  navigator.geolocation.getCurrentPosition(showPosition, showError, option);

$('#ok_btn').on('click', function () {
  console.log('click');
  const name = $('#fish_name').val();
  
  let point = $('#point').val();
  
  if (point === 'sika') {
      point = "志賀島";
    } else if (point === 'kara') {
        point = "唐津";
      } else if (point === 'yobu') {
          point = "呼子";
        } else if (point === 'tatsu') {
            point = "辰ノ口";
          }

  const date = $('#date').val();
  const entry = $('#entry').val();
  const exit = $('#exit').val();
  const weather = $('#weather').val();
  const temp = $('#temp').val();
  const water_temp = $('#water_temp').val();
  const depth = $('#depth').val();
  const tide = $('#tide').val();
  const tide_type = $('#tide_type').val();
  
  $('#output').html(
      `<h2>${name}</h2>
      <p>ポイント: ${point}</P>
      <p>${date}</p>
      <p>天気:${weather}</p>
      <p>気温:${temp}℃</p>
      <p>水温:${water_temp}℃</p>
      <p>水深:${depth}M</p>
      <p>${tide}:${tide_type}</p>
      `);
  
  
});








