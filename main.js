function GetDailyWord(){
    return words[day]
}
function GetRandomWord(){
    target = words[getRndInteger(0,words.length)].toUpperCase()
    Reset()
}
function isWord(word){
    if(dictionary.includes(word.join("").toLowerCase()) ||  words.includes(word.join("").toLowerCase()) || target==word.join("").toUpperCase()){
        return true
    }else{
        return false
    }
}
function Reset(){
    guess=[]
    row=0
    menu_open = true;
    for (i=1;i<=30;i++){
        box=document.getElementById(i.toString())
        box.innerHTML=String.fromCharCode(0x200b)
        box.className="emptyTile"
        box.style.backgroundColor="rgb(43, 42, 42)"
        box.style.borderColor="rgb(110, 110, 110)"
    }
    for(i=0;i<alphabet.length;i++){
        document.getElementById(alphabet[i].toLowerCase()).style = "backgroundColor:rgb(224, 224, 224)"
    }
}
async function throwErr(err){
    box=document.getElementById("errorBox");
    box.innerHTML=err;
    box.style.opacity = 1;
    await sleep(1000)
    for (i=100;i>0;i--){
        await sleep(10)
        box.style.opacity -=0.01
    }
}
function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
}
var siteWidth = 1920;
var scale = screen.width / siteWidth;
var day = Math.round(Date.now() / 86400000)-(words.length*(Math.floor(Math.round(Date.now() / 86400000)/words.length)))
var target = GetDailyWord()
// document.querySelector('meta[name="viewport"]').setAttribute('content', 'width='+siteWidth+', initial-scale='+scale+'');
var guess = []
var row = 0
var menu_open = true;
//chrome.cookies.set()
//chrome.cookies.get()
function SetCookies(target, guesses){
    if (target != ""){
        chrome.cookies.set({"name":"target_word","url":"/","value":target})
    }
    if (guess_items != ""){
        guess_data = []
        for (i=0;i<guess_items.length;i++){
            guess_data.push(guess_items[i])
        }
        chrome.cookies.set({"name":"guesses","url":"/","value":JSON.stringify(guess_data)})
    }
}
function LoadCookies(){
    if (chrome.cookies.get({"name":"target_word","url":"/"}) != ""){
        target = chrome.cookies.get({"name":"target_word","url":"/"}).value
    }
    if (chrome.cookies.get({"name":"guesses","url":"/"}) != ""){
        guess_data = JSON.parse(chrome.cookies.get({"name":"guess_items","url":"/"}).value)
        for (i=0;i<guess_data.length;i++){
            guess = guess_data[i]
            enter()
        }
    }
}
function EncodeCustomLink(){
    document.getElementById("customWord").value = encode(document.getElementById("customWord").value.toLowerCase())
    Reset()
}
function DecodeCustomWord(){
    target = decode(document.getElementById("customWord").value)
}
function ToggleMenu(){
    menu_div = document.getElementById("menuDiv")
    if (menu_open){
        menu_open = false;
        menu_div.style = "visibility:visible;"
    } else{
        menu_open = true;
        menu_div.style = "visibility:hidden;"
    }
}
var alphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]
function encode(val) {
    let t = 0;
    for (let i = val.length-1; i > -1; i--) {
        t*=alphabet.length
        t+=alphabet.indexOf(val[i]);
    }
    return t
}
function decode(num) {
    let val=""
    for (let i = 0; i<5; i++) {
        val+=alphabet[num%alphabet.length]
        num = Math.floor(num/alphabet.length)
    }
    return val
}

window.onload = function () {
    document.getElementById('submit').innerHTML = String.fromCharCode(0x2713)
    document.getElementById('submit').addEventListener("click", enter)
    document.getElementById('delete').innerHTML = String.fromCharCode(0x232b)
    document.getElementById('delete').addEventListener("click", backspace)
    document.getElementById('menubutton').innerHTML = String.fromCharCode(0x2261)
    document.getElementById('menubutton').addEventListener("click", ToggleMenu)
    document.getElementById('resetbutton').innerHTML = String.fromCharCode(0x21BA)
    document.getElementById('resetbutton').addEventListener("click", Reset)
    document.getElementById('dailyword').addEventListener("click", GetDailyWord)
    document.getElementById('randomword').addEventListener("click", GetRandomWord)
    document.getElementById('customwordbutton').addEventListener("click", EncodeCustomLink)
    document.getElementById('customwordplay').addEventListener("click", DecodeCustomWord)
    for (i=0;i<26;i++){
        document.getElementById(alphabet[i].toLocaleLowerCase()).addEventListener("click",function(){keyboard(this.innerHTML)});
        }
    window.onkeydown = function (getKey) {
        if (getKey.keyCode > 64 && getKey.keyCode < 91) {
            keyboard(alphabet[(getKey.keyCode) - 65])
        };
        if (getKey.keyCode === 13) {
            enter()
        }
        if (getKey.keyCode === 8) {
            backspace()
        }
    };
};
function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }
async function enter() {
    if (guess.length == 5) {
        if (isWord(guess)){
            var currRow = 1 + (row * 5);
            for (let i = 0; i < 5; i++) {
                document.getElementById(i + currRow).className = "finishedTile"
                document.getElementById(i + currRow).style.animationPlayState = "running"
            }
            sleep(200)
            var temp_target = []
            for (let i = 0; i < 5; i++) { temp_target[i] = target[i].toUpperCase() }
            for (let i = 0; i < 5; i++) {
                if (document.getElementById(guess[i].toLowerCase()).style.backgroundColor=="rgb(43, 42, 42);"){
                    document.getElementById(guess[i].toLowerCase()).style = "background-color:rgb(105, 105, 105)"
                }
                if (guess[i] === temp_target[i]) {
                    document.getElementById(i + currRow).style = "background-color: rgb(20, 184, 83)"
                    document.getElementById(guess[i].toLowerCase()).style = "background-color: rgb(20, 184, 83)"
                    temp_target[i] = "*"
                }
            }
            for (let i = 0; i < 5; i++) {
                if (temp_target[i] == "^"){
                    document.getElementById(i + currRow).style = "background-color:rgb(105, 105, 105)"
                    document.getElementById(guess[i].toLowerCase()).style = "background-color: rgb(105, 105, 105)"
                }
                if (temp_target[i] != "*") {
                    if (temp_target.includes(guess[i])) {
                        document.getElementById(i + currRow).style = "background-color: rgb(252, 80, 0)"
                        if (document.getElementById(guess[i].toLowerCase()).style != "background-color: rgb(20, 184, 83)"){
                            document.getElementById(guess[i].toLowerCase()).style = "background-color:rgb(252, 80, 0)"
                        }
                        temp_target[temp_target.indexOf(guess[i])] = "^"
                    }
                    else {
                        document.getElementById(i + currRow).style = "background-color: rgb(105, 105, 105)"
                        document.getElementById(guess[i].toLowerCase()).style = "background-color: rgb(105, 105, 105)"
                    }
                }
            }
            if (guess.join("") == target.toUpperCase()){
                won=true
                document.getElementById("Results").innerHTML = "You Won! The word was " + target.toUpperCase()
                ToggleMenu()
            } else if (row == 5){
                won=false
                document.getElementById("Results").innerHTML = "You Lost! The word was " + target.toUpperCase()
                ToggleMenu()
            }
            row += 1
            guess = []
        }else{
            throwErr("Invalid word")
        }
    }else{
        throwErr("Word is too short")
    }
};
async function backspace() {
    if (guess.length > 0) {
        document.getElementById(guess.length + (row * 5)).className = "emptyTile"
        guess.pop();
        updateGuess();
    }
}
function keyboard(key) {
    if (guess.length < 5) {
        guess.push(key)
        document.getElementById(guess.length + (row * 5)).className = "filledTile"
        updateGuess()
    }
}
function updateGuess() {
    for (let i = 0; i < 5; i++) {
        try {
            document.getElementById(i + 1 + (row * 5)).innerHTML = guess[i].toString()
        }
        catch (err) {
            document.getElementById(i + 1 + (row * 5)).innerHTML = String.fromCharCode(0x200b)
        }
    }
}
Reset()
document.getElementById('submit').innerHTML = String.fromCharCode(0x2713)
document.getElementById('delete').innerHTML = String.fromCharCode(0x232b)
document.getElementById('menubutton').innerHTML = String.fromCharCode(0x2261)
