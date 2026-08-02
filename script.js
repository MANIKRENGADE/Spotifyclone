let audio;
let currentSong = new Audio();
let songs = [];
let currfolder;
let currentSongIndex = 0;

async function getSongs(folder) {
    currfolder = folder;
    let a = await fetch(`${folder}/`);
    let response = await a.text();

    console.log(response);

    let div = document.createElement("div");
    div.innerHTML = response;

    let links = div.getElementsByTagName("a");
    songs = [];

    for (let index = 0; index < links.length; index++) {
        const element = links[index];

        if (element.href.endsWith(".mp3")) {
            songs.push(decodeURIComponent(element.href.split(`${currfolder}/`)[1]));
        }
    }

    console.log("Songs:", songs);

    return songs;
}

const playMusic = (track) => {
    currentSong.src = `${currfolder}/${track}`;
    currentSong.play();

    currentSongIndex = songs.indexOf(track);

    play.src = "pause.WEBP";

    const songInfo = document.querySelector(".songinfo");

    songInfo.innerHTML = `
        <div class="marquee">
            <span>${track.replaceAll("%20", " ")}</span>
            <span>${track.replaceAll("%20", " ")}</span>
        </div>
    `;

    const marquee = songInfo.querySelector(".marquee");

    if (marquee.scrollWidth <= songInfo.clientWidth) {
        marquee.style.animation = "none";
    }

    document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
};

async function main() {

    songs = await getSongs("songs/ncl");
    console.log(songs);

    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0];

    for (const song of songs) {
        songUL.innerHTML += `<li>

            <img class="invert" src="song.svg" alt="music">
            <div class="info">
                <div>${song.replaceAll("%20", " ")}</div>
                <div></div>
            </div>

            <div class="playnow">
                <img class="invert" src="play.svg">
            </div>

        </li>`;
    }

    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach((e) => {
        e.addEventListener("click", () => {
            let track = e.querySelector(".info").firstElementChild.innerHTML.trim();
            console.log(track);
            playMusic(track);
        });
    });

    if (songs.length > 0) {
        audio = new Audio(`${currfolder}/${songs[0]}`);
    }
}

function formatTime(seconds) {
    if (isNaN(seconds)) return "00:00";

    let minutes = Math.floor(seconds / 60);
    let secs = Math.floor(seconds % 60);

    if (minutes < 10) minutes = "0" + minutes;
    if (secs < 10) secs = "0" + secs;

    return `${minutes}:${secs}`;
}

play.addEventListener("click", () => {
    if (currentSong.paused) {
        currentSong.play();
        play.src = "pause.WEBP";
    } else {
        currentSong.pause();
        play.src = "download.png";
    }
});

currentSong.addEventListener("timeupdate", () => {
    document.querySelector(".songtime").innerHTML =
        `${formatTime(currentSong.currentTime)} / ${formatTime(currentSong.duration)}`;

    let percent = (currentSong.currentTime / currentSong.duration) * 100;

    console.log(percent);

    document.querySelector(".circle").style.left =
        (3 + percent * 0.9475) + "%";
});

let seekbar = document.querySelector(".seekbar");

seekbar.addEventListener("click", (e) => {
    let rect = seekbar.getBoundingClientRect();

    let percent = ((e.clientX - rect.left) / rect.width) * 100;

    percent = Math.max(0, Math.min(100, percent));

    document.querySelector(".circle").style.left =
        (3.1 + percent * 0.969) + "%";

    currentSong.currentTime =
        (currentSong.duration * percent) / 100;
});

currentSong.addEventListener("ended", () => {
    currentSongIndex++;

    if (currentSongIndex >= songs.length) {
        currentSongIndex = 0;
    }

    playMusic(songs[currentSongIndex]);
});

document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0";
    document.querySelector(".container2").style.left = "0";
});

document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-100%";
    document.querySelector(".container2").style.left = "-100%";
});

document.getElementById("next").addEventListener("click", () => {
    currentSongIndex++;

    if (currentSongIndex >= songs.length) {
        currentSongIndex = 0;
    }

    playMusic(songs[currentSongIndex]);
});

document.getElementById("previous").addEventListener("click", () => {
    currentSongIndex--;

    if (currentSongIndex < 0) {
        currentSongIndex = songs.length - 1;
    }

    playMusic(songs[currentSongIndex]);
});

Array.from(document.getElementsByClassName("card")).forEach(e => {
    e.addEventListener("click", async (item) => {


        document.querySelector(".left").style.left = "0";
        document.querySelector(".container2").style.left = "0";
        
        songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`);

        let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0];
        songUL.innerHTML = "";

        for (const song of songs) {
            songUL.innerHTML += `<li>

                <img class="invert" src="song.svg" alt="music">

                <div class="info">
                    <div>${song.replaceAll("%20", " ")}</div>
                    <div></div>
                </div>

                <div class="playnow">
                    <img class="invert" src="play.svg">
                </div>

            </li>`;
        }

        Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach((e) => {
            e.addEventListener("click", () => {
                let track = e.querySelector(".info").firstElementChild.innerHTML.trim();
                playMusic(track);
            });
        });

    });
});





main();