const $ = document;
//search variable
const searchIcon = $.querySelector('.search-icon');
const close = $.querySelector('.close');
const searchContainer = $.querySelector('.search-container');
const mainContainer = $.querySelector('.main-container');
const serachInput = $.querySelector('#serach-input');
//player variable
const image = document.querySelector("#cover");
const title = document.getElementById("title");
const artist = document.getElementById("artist");
const music = document.querySelector("audio");
const currentTimeEl = document.getElementById("current-time");
const durationEl = document.getElementById("duration");
const progress = document.getElementById("progress");
const progressContainer = document.getElementById("progress-container");
const prevBtn = document.getElementById("prev");
const playBtn = document.getElementById("play");
const nextBtn = document.getElementById("next");
const background = document.getElementById("background");
//song saver
let songs = [{
        title: "Falling",
        artist: "Harry Styles",
        cover: "./img/falling.jpg",
        path: "./media/Falling.mp3"
    },
    {
        title: "Nothing like us",
        artist: "cover by Jungkook",
        cover: "./img/nothing-like-us.png",
        path: "./media/Nothing_Like_Us.mp3"
    },
    {
        title: "Happier than ever",
        artist: "Billie Eilish",
        cover: "./img/happier-than-ever.png",
        path: "./media/15. Happier Than Ever(Explicit).mp3"
    },
    {
        title: "Arcade",
        artist: "Duncan Laurence",
        cover: "./img/arcade.png",
        path: "./media/Arcade.mp3"
    },
    {
        title: "Getaway car",
        artist: "Taylor Swift",
        cover: "./img/getaway-car.png",
        path: "./media/getaway_car.mp3"
    }
];


function activeSearchBox() {
    searchContainer.classList.add('active');
    mainContainer.classList.add('active');
    serachInput.focus();
}

function diactiveSearchBox() {
    searchContainer.classList.remove('active');
    mainContainer.classList.remove('active');
    serachInput.blur();
}

searchIcon.addEventListener('click', activeSearchBox);

close.addEventListener('click', diactiveSearchBox);
//play-pause

function setAndControlSongs(songs) {
    isPlaying = false;

    function playSong() {
        isPlaying = true;
        playBtn.classList.replace('fa-play', 'fa-pause');
        playBtn.setAttribute('title', 'Pause');
        music.play();

        console.log('play');
    }

    function pauseSong() {
        isPlaying = false;
        playBtn.classList.replace('fa-pause', 'fa-play');
        playBtn.setAttribute('title', 'Play');
        music.pause();

        console.log('pause');

    }

    playBtn.addEventListener('click', () => {
        if (isPlaying) {
            pauseSong();
        } else {
            playSong();
        }
    })

    //update DOM
    function loadSong(song) {
        title.innerHTML = song.title;
        artist.innerHTML = song.artist;
        music.src = song.path;
        changeCover(song.cover);
    }

    function changeCover(cover) {
        image.classList.remove('active');
        setTimeout(() => {
            image.src = cover;
            image.classList.add('active');
        }, 100);
        background.src = cover;
    }
    //current song
    let songIndex = 0;
    loadSong(songs[songIndex]);
    //next song
    function nextSong() {
        songIndex++;
        if (songIndex >= songs.length) {
            songIndex = 0;
        }
        loadSong(songs[songIndex]);
        playSong();
    }

    //previous song
    function prevSong() {
        songIndex--;
        if (songIndex < 0) {
            songIndex = songs.length - 1;
        }
        loadSong(songs[songIndex]);
        playSong();
    }

    function firstLoadSong() {
        let durationTime = music.duration;

        let durationMinutes = Math.floor(durationTime / 60);
        let durationSeconds = Math.floor(durationTime % 60);

        if (durationSeconds < 10) {
            durationSeconds = "0" + durationSeconds;
        }
        if (durationSeconds) {
            durationEl.innerHTML = durationMinutes + ":" + durationSeconds;
        }

        currentTimeEl.innerHTML = "0:00";
    }

    function updateupdateProgressBarUnPlay(currentTime, durationTime) {
        let progressWidth = (currentTime / durationTime) * 100;
        progress.style.width = progressWidth + "%";

        let currentMinutes = Math.floor(currentTime / 60);
        let currentSeconds = Math.floor(currentTime % 60);

        if (currentSeconds < 10) {
            currentSeconds = "0" + currentSeconds;
        }
        currentTimeEl.textContent = currentMinutes + ":" + currentSeconds;
    }

    function updateProgressBar(e) {
        if (isPlaying) {
            let durationTime = e.srcElement.duration;
            let currentTime = e.srcElement.currentTime;
            updateupdateProgressBarUnPlay(currentTime, durationTime);
        }
    }

    function setProgressBar(e) {
        let proWidth = this.clientWidth;
        let clickX = e.offsetX;
        let duration = music.duration;
        music.currentTime = (clickX / proWidth) * duration;
        updateupdateProgressBarUnPlay(music.currentTime, duration);
    }

    nextBtn.addEventListener('click', nextSong);
    prevBtn.addEventListener('click', prevSong);
    music.addEventListener('ended', nextSong);
    music.addEventListener('timeupdate', updateProgressBar);
    music.addEventListener('loadedmetadata', firstLoadSong, false);
    progressContainer.addEventListener('click', setProgressBar);
}

setAndControlSongs(songs);

function getMusic(term) {
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '88e776cdf5msh7a656cf8a4916c6p10074bjsn305d92df46ae',
            'X-RapidAPI-Host': 'shazam.p.rapidapi.com'
        }
    };

    fetch(`https://shazam.p.rapidapi.com/search?term=${term}&locale=en-US&offset=0&limit=5`, options)
        .then(response => response.json())
        .then(response => {

            let tracks = response.tracks.hits;
            songs = [];
            for (let index = 0; index < tracks.length; index++) {
                let songObject = {
                    title: tracks[index].track.title,
                    artist: tracks[index].track.subtitle,
                    cover: tracks[index].track.images.coverart,
                    path: tracks[index].track.hub.actions[1].uri
                }
                songs.push(songObject);
            }
            console.log(songs);
            setAndControlSongs(songs);

        })
        .catch(err => {
            console.error(err);
            alert('Search songs if failed!')
        });
}

function serach(e) {
    if (this.value && e.which == 13) {
        getMusic(this.value);
        diactiveSearchBox();
        this.value = '';
    }
}

serachInput.addEventListener('keydown', serach)