const menuBtn = document.querySelector('.menuBtn'),
      container = document.querySelector('.container');

const progressBar = document.querySelector('.bar'),
progressDot = document.querySelector('.dot'),
currentTimeEl = document.querySelector('.currentTime'),
duratuonEl = document.querySelector('.duration');


menuBtn.addEventListener('click', () => {
    container.classList.toggle("active");
});

let playing = false,
currentSong = 0,
shuffle = false,
repeat = false,
favourits = [2,3],
audio = new Audio();

const songs = [
    new Song("Would","Alice In Chains","img1.webp","Alice In Chains - Would.mp3"),
    new Song("Culling Voices","Tool","img2.jpg","Tool - Culling Voices.mp3"),
    new Song("Firestone","Kygo ft. Conrad","img3.webp","Kygo feat. Conrad - Firestone.mp3"),
    new Song("Motorbreath","Metallica","img4.jpg","Metallica - Motorbreath.mp3"),
    new Song("Lose Yourself","Eminem","img5.webp","Eminem - Lose Yourself.mp3"),
];

const playlistContainer = document.querySelector('#playlist'),
      infoWrapper = document.querySelector('.info'),
      coverImage = document.querySelector('.coverImage'),
      currentSongTitle = document.querySelector('.currentSongTitle'),
      currentFavourite = document.querySelector('#currentFavourite');

function init() {
    updatePlaylist(songs);
    loadSong(0);
}

init();

function updatePlaylist(songs){
    playlistContainer.innerHTML = "";

    songs.forEach((song,index) => {
        const tr = document.createElement("tr");
        tr.classList.add('song');

        const{name,file} = song;

        const isFavourite = favourits.includes(index);

        tr.innerHTML = `<tr class="song">
            <td class="no">
                <h5>${index + 1}</h2>
            </td>
            <td class="title">
                <h5>${name}</h2>
            </td>
            <td class="length">
                <p>2:03</p>
            </td>
            <td>
                <i class="fa fa-heart ${isFavourite ? "active" : ""}"></i>
            </td>
        </tr>`;

        playlistContainer.appendChild(tr);

        tr.addEventListener("click", (e) => {

            if (e.target.classList.contains("fa-heart")) {
                addToFavourits(index);
                e.target.classList.toggle("active");
                return;
            }

            currentSong = index;
            loadSong(currentSong);
            audio.play();
            container.classList.remove("active");
            playPauseBtn.classList.replace("fa-play","fa-pause");
            playing = true;
        });

        const audioDuration = new Audio(`../assets/music/${file}`);
        audioDuration.addEventListener('loadeddata', () => {
            const duration = audioDuration.duration;
            let songDuration = formatTime(duration);
            tr.querySelector(".length p").innerText = songDuration;
        });

    });
}

function formatTime(time){
    let minutes = Math.floor(time/60);
    let seconds = Math.floor(time % 60);
    seconds = seconds < 10 ? `0${seconds}` : seconds;
    return `${minutes}:${seconds}`;
}

function loadSong(num){
    infoWrapper.innerHTML = `
        <h2>${songs[num].name}</h2>
        <h3>${songs[num].artist}</h3>
    `;

    currentSongTitle.innerHTML = `${songs[num].name} - ${songs[num].artist}`;

    coverImage.style.backgroundImage = `url("../assets/images/${songs[num].img}")`;

    audio.src = `../assets/music/${songs[num].file}`;

    if (favourits.includes(num)) {
        currentFavourite.classList.add('active');
    }else{
        currentFavourite.classList.remove('active');
    }
}

const playPauseBtn = document.querySelector("#playpause"),
    nextBtn = document.querySelector('#next'),
    prevBtn = document.querySelector('#prev');

playPauseBtn.addEventListener('click', () => {
    if (playing) {
        playPauseBtn.classList.replace("fa-pause","fa-play");
        playing = false;
        audio.pause();
    }else{
        playPauseBtn.classList.replace("fa-play","fa-pause");
        playing = true;
        audio.play();
    }
});


function nextSong() {

    if (shuffle) {
        shuffleFunc();
        loadSong(currentSong);
    }else if (currentSong < songs.length - 1) {
        currentSong++;
    }else{
        currentSong = 0;
    }
    loadSong(currentSong);

    if (playing) {
        audio.play();
    }
}

function prevSong() {

    if (shuffle) {
        shuffleFunc();
        loadSong(currentSong);
    }else if (currentSong > 0) {
        currentSong--;
    }else{
        currentSong = songs.length - 1;
    }
    loadSong(currentSong);

    if (playing) {
        audio.play();
    }
}

nextBtn.addEventListener('click', nextSong);
prevBtn.addEventListener('click', prevSong);


function addToFavourits(index) {
    if (favourits.includes(index)) {
        favourits = favourits.filter((item) => item !== index);
        currentFavourite.classList.add("active"); 
    }else{
        favourits.push(index);

        if (index === currentSong) {
            currentFavourite.classList.add("active");
        }
    }

    updatePlaylist(songs);

}   

currentFavourite.addEventListener("click", () => {
    addToFavourits(currentSong);
    currentFavourite.classList.toggle("active");
})

const shuffleBtn = document.querySelector('#shuffle');

function shuffleSongs() {
    shuffle = !shuffle;
    shuffleBtn.classList.toggle('active');
}

shuffleBtn.addEventListener("click", shuffleSongs);

function shuffleFunc() {
    if (shuffle) {
        currentSong = Math.floor(Math.random() * songs.length)
    }
}


const repeatBtn = document.querySelector('#repeat');

function repeatSong(){
    if (repeat === 0) {
        repeat = 1;
        repeatBtn.classList.add("active");
    }else if (repeat === 1) {
        repeat = 2;
        repeatBtn.classList.add("active");
    }else{
        repeat = 0;
        repeatBtn.classList.remove("active");
    }
}

repeatBtn.addEventListener('click', repeatSong);

audio.addEventListener("ended", () => {
    if (repeat === 1) {
        loadSong(currentSong);
        audio.play();
    }else if (repeat === 2) {
        nextSong();
        audio.play();
    }else{
        if(currentSong === songs.length - 1){
            audio.pause();
            playPauseBtn.classList.replace("fa-pause","fa-play");
            playing = false;
        }else{
            nextSong();
            audio.play();
        }
    }
});

function progress(){
    let {duration, currentTime} = audio;

    isNaN(duration) ? (duration = 0) : duration;
    isNaN(currentTime) ? (currentTime = 0) : currentTime;

    currentTimeEl.innerHTML =  formatTime(currentTime);
    duratuonEl.innerHTML = formatTime(duration);

    let progressPercentage = (currentTime / duration) * 100;
    progressDot.style.left = `${progressPercentage}%`;

}

audio.addEventListener("timeupdate" , progress);


function setProgress(e) {
    let width = this.clientWidth;
    let clickX = e.offsetX;
    let duration = audio.duration;
    audio.currentTime = (clickX / width) * duration;
}

progressBar.addEventListener("click",setProgress);