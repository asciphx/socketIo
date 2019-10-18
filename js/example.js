var easing = Deck.easing
var prefix = Deck.prefix

var transform = prefix('transform')
var transition = prefix('transition')
var transitionDelay = prefix('transitionDelay')
var boxShadow = prefix('boxShadow')

var translate = Deck.translate

var $container = document.getElementById('container')
var $topbar = document.getElementById('topbar')

var $start = document.createElement('button')
var $intro = document.createElement('button')
var $shuffle = document.createElement('button')
var $bysuit = document.createElement('button')
var $poker = document.createElement('button')
var $fan = document.createElement('button')
var $sort = document.createElement('button')
$start.textContent = '开始'
$intro.textContent = '空降'
$shuffle.textContent = '洗牌'
$bysuit.textContent = '发牌'
$poker.textContent = '抽牌'
$fan.textContent = '扇形'
$sort.textContent = '顺序'
$topbar.appendChild($start)
$topbar.appendChild($intro)
$topbar.appendChild($shuffle)
$topbar.appendChild($bysuit)
$topbar.appendChild($poker)
$topbar.appendChild($fan)
$topbar.appendChild($sort)
// easter eggs start
var array
var containJoker = false, idex;
// easter eggs end
//Deck(true)为54张，默认为52张
var deck = Deck(containJoker);
$start.addEventListener('click', function () {
  if ($ready===false){alert('请等待所有人到位!');return;}
  containJoker ? idex = 54 : idex = 52
  array = [0]; for (i = idex; --i;) array.push(i);
  $start.innerHTML = "已准备"; $start.style.color = "blue";
  $start.disabled = true;
})
$shuffle.addEventListener('click', function () {
  if ($start.disabled) so.emit('shuffle', "room".Id().innerHTML, array);
})
$sort.addEventListener('click', function () {
  if ($start.disabled) so.emit('sort', "room".Id().innerHTML)
})
$bysuit.addEventListener('click', function () {
  if ($start.disabled) so.emit('bysuit', "room".Id().innerHTML)
})
$fan.addEventListener('click', function () {
  if ($start.disabled) so.emit('fan', "room".Id().innerHTML)
})
$intro.addEventListener('click', function () {
  if ($start.disabled) so.emit('intro', "room".Id().innerHTML)
})
$poker.addEventListener('click', function () {
  if ($start.disabled) so.emit('poker', "room".Id().innerHTML)
})
// secret message..
so.on("intro", function () {
  deck.intro()
})
so.on("shuffle", function (v) {
  array = v;
  deck.shuffle(flushFrist(deck.cards));
  sortFrist(deck.cards);
  deck.shuffle(deck.flushArray(array))
})
so.on("bysuit", function () {
  deck.bysuit()
})
so.on("poker", function () {
  deck.poker()
})
so.on("fan", function () {
  deck.fan()
})
so.on("sort", function () {
  deck.sort(true)
})
//假的洗牌效果模拟第一次的，第二次洗牌为后端真实数据
function flushFrist(arr) {
  var rnd, temp;
  for (i in arr) {
    rnd = Math.random() * i | 0;
    temp = arr[i];
    arr[i] = arr[rnd];
    arr[rnd] = temp;
  }
  return arr;
}
function sortFrist(arr){
  arr.sort(function (a, b) {
    return a.i - b.i;
  });
  return arr;
}
//…………
var randomDelay = 10000 + 60000 * Math.random()

setTimeout(function () {
  printMessage('Psst..I want to share a secret with you...')
}, randomDelay)

setTimeout(function () {
  printMessage('...try clicking all kings and nothing in between...')
}, randomDelay + 5000)

setTimeout(function () {
  printMessage('...have fun ;)')
}, randomDelay + 10000)

function printMessage(text) {
  var $message = document.createElement('p')
  $message.classList.add('message')
  $message.textContent = text

  document.body.appendChild($message)

  $message.style[transform] = translate(window.innerWidth + 'px', 0)

  setTimeout(function () {
    $message.style[transition] = 'all .7s ' + easing('cubicInOut')
    $message.style[transform] = translate(0, 0)
  }, 1000)

  setTimeout(function () {
    $message.style[transform] = translate(-window.innerWidth + 'px', 0)
  }, 6000)

  setTimeout(function () {
    document.body.removeChild($message)
  }, 7000)
}
