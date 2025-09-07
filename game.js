/*
 * Copyright 2025 mistekko
 *
 * This program is part of `rule34dle'. `rule34dle' is free
 * software: you can redistribute it and/or modify it under
 * the  terms of the GNU General Public License as publi
 * shed by the Free Software Foundation, either version 3 of
 * the License, or (at your  option)  any later version.
 *
 * `rule34dle is distributed in the hope that it will be
 * useful, but WITHOUT  ANY WARRANTY; without even the
 * implied warranty of  MERCHANTABILITY or FITNESS FOR A
 * PARTICULAR PURPOSE.  See the GNU General Public License
 * for more  details.
 *
 * You should have received a copy of the GNU General
 * Public License along with this program. If not, see:
 * https://www.gnu.org/licenses/
 */

let d;
let streak, peak;

let cscore = document.getElementById("current-score");
let hscore = document.getElementById("hi-score");
let btn = [document.getElementById("top-button"),
	   document.getElementById("bottom-button")];
let img = [document.getElementById("left-image"),
	   document.getElementById("right-image")];
let lbl = [document.getElementById("limg-label"),
	   document.getElementById("rimg-label")];
let pid = [document.getElementById("limg-post-id"),
	   document.getElementById("rimg-post-id")];

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
	img[i].src = `img/${match[i]["name"].replaceAll(" ","_").replaceAll("/", "+")}.jpg`;
	img[i].alt = match[i]["name"];
	pid[i].innerText = `ID: ${match[i]["pic_id"]}`;
    }
    lbl[0].innerText = `${match[0]["name"]}: ${match[0]["count"]} images`;
    lbl[1].innerText = `${match[1]["name"]}: ???`;
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
	lbl[1].innerText = `${match[1]["name"]}: ${match[1]["count"]} images`;
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
