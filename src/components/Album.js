import React, { Component } from "react";
import albumData from "./../data/albums";
import PlayerBar from "./PlayerBar";

class Album extends Component {
  constructor(props) {
    super(props);

    const album = albumData.find(album => {
      return album.slug === this.props.match.params.slug;
    });

    this.state = {
      album: album,
      currentSong: album.songs[0],
      currentTime: 0,
      duration: album.songs[0].duration,
      currentVolume: 0.8,
      isPlaying: false
    };

    this.audioElement = document.createElement("audio");
    this.audioElement.src = album.songs[0].audioSrc;
  }

  componentDidMount() {
    this.eventListeners = {
      timeupdate: e => {
        this.setState({ currentTime: this.audioElement.currentTime });
        console.log(this.audioElement.currentTime);
      },
      durationchange: e => {
        this.setState({ duration: this.audioElement.duration });
        console.log(this.audioElement.duration);
      },
      volumeupdate: e => {
        this.setState({ currentVolume: this.audioElement.currentVolume });
      }
    };
    this.audioElement.addEventListener(
      "timeupdate",
      this.eventListeners.timeupdate
    );
    this.audioElement.addEventListener(
      "durationchange",
      this.eventListeners.durationchange
    );
    this.audioElement.addEventListener(
      "volumeupdate",
      this.eventListeners.volumeupdate
    );
  }

  componentWillUnmount() {
    this.audioElement.src = null;
    this.audioElement.removeEventListener(
      "timeupdate",
      this.eventListeners.timeupdate
    );
    this.audioElement.removeEventListener(
      "durationchange",
      this.eventListeners.durationchange
    );
  }

  play() {
    this.audioElement.play();
    this.setState({ isPlaying: true });
  }

  pause() {
    this.audioElement.pause();
    this.setState({ isPlaying: false });
  }

  setSong(song) {
    console.log("song: ", song);
    this.audioElement.src = song.audioSrc;
    this.setState({ currentSong: song });
  }

  handleSongClick(song) {
    const isSameSong = this.state.currentSong === song;
    if (this.state.isPlaying && isSameSong) {
      this.pause();
    } else {
      if (!isSameSong) {
        this.setSong(song);
      }
      this.play();
    }
  }

  handlePrevClick() {
    const currentIndex = this.state.album.songs.findIndex(
      song => this.state.currentSong === song
    );
    const newIndex = Math.max(0, currentIndex - 1);
    const newSong = this.state.album.songs[newIndex];
    this.setSong(newSong);
    this.play();
  }

  handleNextClick() {
    const currentIndex = this.state.album.songs.findIndex(
      song => this.state.currentSong === song
    );
    const newIndex = Math.max(0, currentIndex + 1);
    const newSong = this.state.album.songs[newIndex];
    this.setSong(newSong);
    this.play();
  }

  handleTimeChange(e) {
    const newTime = this.audioElement.duration * e.target.value;
    this.audioElement.currentTime = newTime;
    this.setState({ currentTime: newTime });
  }

  handleVolumeChange(e) {
    this.audioElement.volume = e.target.value;
    this.setState({ currentVolume: e.target.value });
  }

  formatTime(currentTime) {
    if (currentTime) {
      var minutes = Math.floor((currentTime / 60) % 60);
      minutes = minutes >= 10 ? minutes : "0" + minutes;
      var seconds = Math.floor(currentTime % 60);
      seconds = seconds >= 10 ? seconds : "0" + seconds;
      return minutes + ":" + seconds;
    }
  }

  formatDuration(duration) {
    if (duration) {
      var minutes = Math.floor((duration / 60) % 60);
      minutes = minutes >= 10 ? minutes : "0" + minutes;
      var seconds = Math.floor(duration % 60);
      seconds = seconds >= 10 ? seconds : "0" + seconds;
      return minutes + ":" + seconds;
    }
  }

  render() {
    return (
      <section className="album">
        <section id="album-info">
          <img
            id="album-cover-art"
            src={this.state.album.albumCover}
            alt={this.state.album.title}
          />
          <div className="album-details">
            <h1 id="album-title">{this.state.album.title}</h1>
            <h2 className="artist">{this.state.album.artist}</h2>
            <div id="release-info">{this.state.album.releaseInfo}</div>
          </div>
        </section>
        <table id="song-list">
          <colgroup>
            <col id="song-number-column" />
            <col id="song-title-column" />
            <col id="song-duration-column" />
          </colgroup>
          <tbody>
            {this.state.album.songs.map((song, index) => (
              <tr
                className="song"
                key={index}
                onClick={() => this.handleSongClick(song)}
                onMouseEnter={() => this.setState({ hoverSong: index })}
                onMouseLeave={() => this.setState({ hoverSong: null })}
              >
                <td>
                  {this.state.hoverSong == index ? (
                    this.state.currentSong == song ? (
                      <span className="icon ion-md-pause" />
                    ) : (
                      <span className="icon ion-md-play" />
                    )
                  ) : (
                    index + 1
                  )}
                </td>
                <td>{song.title}</td>
                <td>{this.formatDuration(song.duration)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {this.audioElement && (
          <PlayerBar
            isPlaying={this.state.isPlaying}
            currentSong={this.state.currentSong}
            currentTime={this.formatTime(this.state.currentTime)}
            currentVolume={this.audioElement.currentVolume}
            duration={this.formatDuration(this.audioElement.duration)}
            handleSongClick={() => this.handleSongClick(this.state.currentSong)}
            handlePrevClick={() => this.handlePrevClick()}
            handleNextClick={() => this.handleNextClick()}
            handleTimeChange={e => this.handleTimeChange(e)}
            handleVolumeChange={e => this.handleVolumeChange(e)}
          />
        )}
      </section>
    );
  }
}

export default Album;
