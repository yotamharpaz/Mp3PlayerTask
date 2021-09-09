const { existsTypeAnnotation } = require("@babel/types");

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
    { id: 5, name: 'Israeli', songs: [4 , 5] },
  ],
  playSong(song) {
    console.log(`Playing ${song.title} from ${song.album} by ${song.artist} | ${durationFormat(song.duration)}.`)
  },
}

function parseDuration(duration){
  const durationArr = duration.split(":");
  const minDuration = Number(durationArr[0])*60;
  const secDuration = Number(durationArr[1]);
  return minDuration + secDuration;
}

 function throwIfNoPlaylist(id){  
   if ( !player.playlists.some( (playlist) => playlist.id === id) ) throw "non-existent ID";
 }
 function throwIfNoSong(id){
  if ( !player.songs.some( (song) => song.id === id) ) throw "non-existent ID";
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
  throwIfNoSong(id)
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

  const newId = id ?? maxId + 1;
  player.songs = [
    ...player.songs,
    {
      id: newId,
      title : title,
      album : album,
      artist : artist,
      duration : parseDuration(duration) ,
    }
  ];
  
  return newId;
}


function removePlaylist(id) {
  throwIfNoPlaylist(id);
  let newPlaylists = [];
  player.playlists.forEach( (playlist) => {
    if  (playlist.id !== id) {
      newPlaylists.append(playlist);
    }
  })
  player.playlists = newPlaylists;
}

function createPlaylist(name, id) {
  if ( player.playlists.some( (playlist) => playlist.id === id) ) throw "ID already taken"; 
  let maxId = 0;
  player.playlists.forEach((playlist) => {
    maxId = Math.max(playlist.id,maxId);})
    const newId = id ?? maxId + 1;
  player.playlists = [
    ...player.playlists,
    {
      id: newId,
      name : name,
      songs : []
    }
  ];
  return newId;
}

function playPlaylist(id) {
  throwIfNoPlaylist(id);
  player.playlists.find((playlist) => playlist.id === id).songs.forEach((songId) => playSong(songId));
}


function editPlaylist(playlistId, songId) {
  /*gets the right playlist
  checks if song id exists
  if it is dekets it if its the last song delets the playlist
  if not ads new song to playlist*/
  throwIfNoPlaylist(playlistId);
  throwIfNoSong(songId);
  const playlist = player.playlists.find((playlist) => playlist.id === playlistId)
  if (playlist.songs.some((song) => song === songId) ) {
    if (playlist.songs.length === 1) {
      removePlaylist(playlistId);
    }else {
      //removes the song from the playlist
      player.playlists = [
        ...player.playlists.filter((playlist)=>(playlist.id !== playlistId)),
        {
          ...playlist,
          songs: playlist.songs.filter((song) => song !== songId),
        },
      ]
    }
  }else{
  }
    playlist.songs.push(songId);

  }

function playlistDuration(id) {
  let duration = 0
  const playlist =  player.playlists.find( (playlist) => playlist.id === id);
  playlist.songs.forEach((songId) =>{
    duration += player.songs.find((song) => song.id === songId).duration

  })
   return duration;
}

function searchByQuery(query) {
  let newQuery = query.toLowerCase()
  let songs = player.songs.filter((song) => song.title.toLowerCase().includes(newQuery)
  ||song.artist.toLowerCase().includes(newQuery)
  ||song.album.toLowerCase().includes(newQuery));
  songs.sort((song1,song2) => song1.title > song2.title ? 1 : -1);

  let playlists = player.playlists.filter((playlist) => playlist.name.toLowerCase().includes(newQuery))
  playlists.sort((playlist1,playlist2) => playlist1.name > playlist2.name ? 1 : -1);
  return {songs : songs , playlists : playlists }
}

function searchByDuration(duration) {
  const targetDuration = parseDuration(duration);
  let bestFit ;
  let minDelta = Infinity;
  player.songs.forEach((song) => {
    if(Math.abs(song.duration - targetDuration) < minDelta){
      bestFit = song;
      minDelta = Math.abs(song.duration - targetDuration);
    }
  }
  )
  player.playlists.forEach((playlist) => {
    const dur = Math.abs(playlistDuration(playlist.id) - targetDuration);
    if(dur < minDelta){
      bestFit = playlist;
      minDelta = Math.abs(dur);
    }
    }
  )
  return bestFit;
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


