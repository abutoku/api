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

//point指定のための変数を定義
let pc = 40; //福岡県
let hc = 19; //西戸崎

$('#point').on('change', function () { //select部分が変更されたら発動
  const sel = $('#point').val();
  console.log(sel);
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
  //画像更新
  $('#tide_image').html(`<img
        src="https://api.tide736.net/tide_image.php?pc=${pc}&hc=${hc}&yr=${year}&mn=${month}&dy=${day}&rg=day&w=768&h=512&lc=blue&gcs=cyan&gcf=blue&ld=on&ttd=on&tsmd=on">`);
});

const now = new Date();//現在時間を取得

const year = now.getFullYear();//年を取得
const month = now.getMonth() + 1;//月を取得
const day = now.getDate();//日を取得

//日付欄に日付を表示
$('#date').val(`${year}/${month}/${day}`);

$('#tide_image').html(`<img
        src="https://api.tide736.net/tide_image.php?pc=${pc}&hc=${hc}&yr=${year}&mn=${month}&dy=${day}&rg=day&w=768&h=512&lc=blue&gcs=cyan&gcf=blue&ld=on&ttd=on&tsmd=on">`);


//tide APIを呼び出すURL
const url = `https://api.tide736.net/get_tide.php?pc=${pc}&hc=${hc}&yr=${year}&mn=${month}&dy=${day}&rg=day`;

axios.get(url)//tide APIを呼び出す関数
  .then(function (response) { //成功すればレスポンスを受け取る
    console.log(response);
  })
  .catch(function (error) { //失敗した場合はコンソールにエラーを出す
    console.log(error);
  })
  .finally(function () { //処理が終了したらdone!
    console.log('done!');
  });


function showPosition(position) { //成功したときに実行される関数
  //位置情報を取る
  console.log(position);
  const lat = position.coords.latitude;//緯度
  const lng = position.coords.longitude;//経度
  console.log(lat, lng);
  //$('#output').html(`緯度:${lat}、経度:${lng}`);

  //取ってきた位置情報の天気を取得
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=`;

  axios.get(url)
    .then(function (response) { //成功すればレスポンスを受け取る
      console.log(response);
    })
    .catch(function (error) { //失敗した場合はコンソールにエラーを出す
      console.log(error);
    })
    .finally(function () { //処理が終了したらdone!
      console.log('done!');
    });
}

//エラーには番号（1, 2, 3）が振ってあり意味が決まっている
function showError(error) { //失敗したときに実行される関数
  console.log(error);
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
    navigator.geolocation.getCurrentPosition(showPosition, showError, option);
  //navigator.geolocation.getCurrentPosition(成功した場合に実行される関数, 失敗した場合に実行される関数, 取得に必要なオプション);
