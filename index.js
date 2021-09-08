
const player = {
  songs: [
    {
      id: 1,
      title: 'Vortex',
      album: 'Wallflowers',
      artist: 'Jinjer',
      duration: 242,
    },
    {
      id: 2,
      title: 'Vinda',
      album: 'Godtfolk',
      artist: 'Songleikr',
      duration: 160,
    },
    {
      id: 7,
      title: 'Shiroyama',
      album: 'The Last Stand',
      artist: 'Sabaton',
      duration: 213,
    },
    {
      id: 3,
      title: 'Thunderstruck',
      album: 'The Razors Edge',
      artist: 'AC/DC',
      duration: 292,
    },
    {
      id: 4,
      title: 'All is One',
      album: 'All is One',
      artist: 'Orphaned Land',
      duration: 270,
    },
    {
      id: 5,
      title: 'As a Stone',
      album: 'Show Us What You Got',
      artist: 'Full Trunk',
      duration: 259,
    },
  ],
  playlists: [
    { id: 1, name: 'Metal', songs: [1, 7, 4] },
    { id: 5, name: 'Israeli', songs: [4, 5] },
  ],
  playSong(song) {
    console.log(`Playing ${song.title} from ${song.album} by ${song.artist} | ${durationFormat(song.duration)}.`)
  },
}

function durationFormat (secDuration) {

  let seconds = secDuration % 60;
  const fomatedSec = seconds.toString().length === 1 ? "0" + seconds : seconds;

  let minutes = Math.floor(secDuration / 60);
  const fomatedMin = minutes.toString().length === 1 ? "0" + minutes : minutes;

  return (fomatedMin + ":" + fomatedSec);
}

function playSong(id) {
  for (i = 0; i < player.songs.length; i++) {
    const song = player.songs[i];
    if (song.id === id){ 
      player.playSong(song);
      return
    }
  }
  throw "non-existent ID"
}


function removeSong(id) {
  if ( !player.songs.some( (song) => song.id === id) ) throw "non-existent ID";
  player.songs = player.songs.filter( (song) => song.id !== id);
  player.playlists = player.playlists.map((playlist) => {
    return {
      ...playlist,
      songs: playlist.songs.filter((song) => song !== id)
    };

  });
}


function addSong(title, album, artist, duration, id) {
  if ( player.songs.some( (song) => song.id === id) ) throw "ID already taken"; 
  let maxId = 0;
   player.songs.forEach((song) => {
    maxId = Math.max(song.id,maxId);     
   })
  // console.log(duration)
  durationArr = duration.split(":");
  minDuration = Number(durationArr[0])*60;
  secDuration = Number(durationArr[1]);

  const newId = id ?? maxId + 1;
  player.songs = [
    ...player.songs,
    {
      id: newId,
      title : title,
      album : album,
      artist : artist,
      duration : minDuration + secDuration,
    }
  ];
  // console.log(player)
  return newId;
}
// addSong("pipi","kaki","yotam hamelech","10:35");

function removePlaylist(id) {
  console.log(player.playlists);
  if ( !player.playlists.some( (playlist) => playlist.id === id) ) throw "non-existent ID";
  player.playlists = player.playlists.filter( (playlist) => playlist.id !== id);
  console.log(player.playlists);
}
removePlaylist(1);
function createPlaylist(name, id) {
  // your code here
}

function playPlaylist(id) {
  // your code here
}

function editPlaylist(playlistId, songId) {
  // your code here
}

function playlistDuration(id) {
  // your code here
}

function searchByQuery(query) {
  // your code here
}

function searchByDuration(duration) {
  // your code here
}

module.exports = {
  player,
  playSong,
  removeSong,
  addSong,
  removePlaylist,
  createPlaylist,
  playPlaylist,
  editPlaylist,
  playlistDuration,
  searchByQuery,
  searchByDuration,
}


