let d;
let streak, peak;

let btn = [document.getElementById("top-button"),
	   document.getElementById("bottom-button")];
let cscore = document.getElementById("current-score");
let hscore = document.getElementById("hi-score");
let limg = document.getElementById("left-image");
let rimg = document.getElementById("right-image");
let img = [limg, rimg];

let match = [undefined, undefined];
let idx = [-1, -1];

async function init() {
    btn[0].disabled = true;
    btn[1].disabled = true;
    let r = await fetch("data.json");
    d = await r.json();
}

function nextMatch() {
    match[0] = match[1];
    idx[0] = idx[1];
    while ((idx[1] = Math.floor(Math.random() * 1000)) == idx[0]);
    match[1] = d[idx[1]];
    for (i in [0, 1]) {
	img[i].src = match[i]["pic_url"];
	img[i].alt = match[i]["name"];
    }
    img[0].nextElementSibling.innerText =
	`${match[0]["name"]}: ${match[0]["count"]} image\npost ID: ${match[0]["pic_id"]}`;
    img[1].nextElementSibling.innerText =
	`${match[1]["name"]}: ???\npost ID: ${match[1]["pic_id"]}`;

}

function handleGuess(higherGuess) {
    let higherReality = match[1].count > match[0].count;
    if (higherGuess  == higherReality) {
	streak += 1;
	cscore.innerText = `Current score: ${streak}`;
	if (streak > peak) {
	    peak = streak;
	    hscore.innerText = `Hi-score: ${peak}`
	}
	nextMatch();
    } else {
    img[1].nextElementSibling.innerText =
	`${match[1]["name"]}: ${match[1]["count"]} images`;
	endGame();
    }
}

async function startGame() {
    while (d == undefined) {
	await new Promise(r => setTimeout(r, 100));
    }
    streak = peak = 0;
    document.getElementById("start-button").innerText = "Reset"
    idx[1] = Math.floor(Math.random() * 1000)
    match[1] = d[idx[1]]
    btn[0].disabled = false;
    btn[1].disabled = false;
    nextMatch();
}

function endGame() {
    btn[0].disabled = true;
    btn[1].disabled = true;
}
init();
document.getElementById("start-button").addEventListener("click", startGame);
btn[0].addEventListener("click", () => handleGuess(true));
btn[1].addEventListener("click", () => handleGuess(false));
