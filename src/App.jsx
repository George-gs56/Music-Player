import React, { useState, useEffect, useRef, createContext, useContext } from 'react';
import { Container, Row, Col, Button, Tab, Nav, Card, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.scss';

const songsData = [
  {
    title: "'Pathikichu' from Vidamuyarchi",
    thumbnail: "https://upload.wikimedia.org/wikipedia/en/4/46/Vidaamuyarchi_%28soundtrack%29.png",
    musicUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    duration: "3:33",
    artistName: "Anirudh Ravichandran"
  },
  {
    title: "Sunset Boulevard",
    thumbnail: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Sunset_Boulevard_%281950_poster%29.jpg/250px-Sunset_Boulevard_%281950_poster%29.jpg",
    musicUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    duration: "3:50",
    artistName: "Ocean Vibe"
  },
  {
    title: "'Ranjithame' from Varisu",
    thumbnail: "https://i.ytimg.com/vi/zuVV9Y55gvc/maxresdefault.jpg",
    musicUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    duration: "5:33",
    artistName: "Thaman S"
  },
  {
    title: "'Theethiriyaai' from Brahmastra",
    thumbnail: "https://i.scdn.co/image/ab67616d0000b2736fb6977192c1051bb5a3bf5b",
    musicUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    duration: "3:56",
    artistName: "Sid Sriram"
  },
  {
    title: "'Naa Ready Tha' from LEO",
    thumbnail: "https://akm-img-a-in.tosshub.com/indiatoday/images/story/202306/sanya_0-sixteen_nine.jpg?VersionId=g1px0jNjuQFTrx4wHBXR33BxNrV6T41v",
    musicUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    duration: "6:56",
    artistName: "Anirudh Ravichandran"
  },
  {
    title: "'Pookkal Pookkum' from Matharasa Pattinam",
    thumbnail: "https://www.tamil2lyrics.com/wp-content/uploads/2018/11/MV5BZjgwNGQ0MjctNTI1Zi00MjNiLWFjNzUtOGRhMDUyNTVjYzU4XkEyXkFqcGdeQXVyMjYwMDk5NjE@._V1_.jpg",
    musicUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    duration: "5:36",
    artistName: "G V Prakesh"
  },
  {
    title: "'Vathi Coming' from Master",
    thumbnail: "https://static.india.com/wp-content/uploads/2021/04/pjimage-11-10.jpg",
    musicUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    duration: "6:36",
    artistName: "Anirudh Ravichandran"
  },
  {
    title: "'Enjoy Enjami' album song",
    thumbnail: "https://1.bp.blogspot.com/-1F71DT3KAqM/YI67OFDy8pI/AAAAAAAAAmw/vzq8wrIJmvk0f7KSqoX7eQ6qhjTnk4ymwCLcBGAsYHQ/s1200/EnjoyEnjaami_DheeArivuPoster_050321_1200.jpg",
    musicUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    duration: "3:50",
    artistName: "Rapper Arivu"
  },
  {
    title: "'Seramal Poonal' from Guleba kaavali",
    thumbnail: "https://heatrenew.weebly.com/uploads/1/2/4/8/124852532/500243139.jpg",
    musicUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    duration: "4:47",
    artistName: "AR Rahman"
  },
  {
    title: "'Kurumugil' from Sita Ramam",
    thumbnail: "https://is2-ssl.mzstatic.com/image/thumb/Music112/v4/bd/50/2a/bd502abd-0ef7-3906-bce8-ee29516d5206/196589460875.jpg/1200x1200bf-60.jpg",
    musicUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    duration: "3:56",
    artistName: "U1"
  }
]; 

const PlayerContext = createContext();

const usePlayer = () => useContext(PlayerContext);

const PlayerProvider = ({ children }) => {
  const [currentSong, setCurrentSong] = useState(null);
  const [favorites, setFavorites] = useState(() => JSON.parse(localStorage.getItem('favorites')) || []);
  const [recent, setRecent] = useState(() => JSON.parse(sessionStorage.getItem('recent')) || []);

  const playSong = (song) => {
    setCurrentSong(song);
    const updatedRecent = [song, ...recent.filter(s => s.title !== song.title)].slice(0, 10);
    setRecent(updatedRecent);
    sessionStorage.setItem('recent', JSON.stringify(updatedRecent));
  };

  const toggleFavorite = (song) => {
    const updated = favorites.some(s => s.title === song.title)
      ? favorites.filter(s => s.title !== song.title)
      : [...favorites, song];
    setFavorites(updated);
    localStorage.setItem('favorites', JSON.stringify(updated));
  };

  return (
    <PlayerContext.Provider value={{ currentSong, playSong, favorites, toggleFavorite, recent }}>
      {children}
    </PlayerContext.Provider>
  );
};

const SongCard = ({ song }) => {
  const { playSong, favorites, toggleFavorite } = usePlayer();
  return (
    <Card className="mb-3 song-card">
      <Card.Img variant="top" src={song.thumbnail} />
      <Card.Body>
        <Card.Title>{song.title}</Card.Title>
        <Card.Text>{song.artistName}</Card.Text>
        <Button onClick={() => playSong(song)} variant="primary">Play</Button>
        <Button variant="light" onClick={() => toggleFavorite(song)}>
          {favorites.some(f => f.title === song.title) ? '★' : '☆'}
        </Button>
      </Card.Body>
    </Card>
  );
};

const Player = () => {
  const { currentSong } = usePlayer();
  const audioRef = useRef();

  useEffect(() => {
    if (currentSong && audioRef.current) {
      audioRef.current.load();
      audioRef.current.play();
    }
  }, [currentSong]);

  return (
    <div className="music-player">
      {currentSong ? (
        <>
          <img src={currentSong.thumbnail} alt="cover" className="player-img" />
          <div>
            <h5>{currentSong.title}</h5>
            <p>{currentSong.artistName}</p>
            <audio ref={audioRef} controls>
              <source src={currentSong.musicUrl} type="audio/mp3" />
            </audio>
          </div>
        </>
      ) : <p>Select a song to play</p>}
    </div>
  );
};

const App = () => {
  const [search, setSearch] = useState('');
  const filteredSongs = songsData.filter(song => song.title.toLowerCase().includes(search.toLowerCase()));
  const { favorites, recent } = usePlayer();

  return (
    <Container fluid className="app-wrapper">
      <Row>
        <Col md={3} className="sidebar p-3">
          <Form.Control
            type="text"
            placeholder="Search Songs"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mb-3"
          />
          <Tab.Container defaultActiveKey="all">
            <Nav variant="pills" className="flex-column">
              <Nav.Item><Nav.Link eventKey="all">All Songs</Nav.Link></Nav.Item>
              <Nav.Item><Nav.Link eventKey="favorites">Favorites</Nav.Link></Nav.Item>
              <Nav.Item><Nav.Link eventKey="recent">Recently Played</Nav.Link></Nav.Item>
            </Nav>
            <Tab.Content className="mt-3">
              <Tab.Pane eventKey="all">
                {filteredSongs.map(song => <SongCard key={song.title} song={song} />)}
              </Tab.Pane>
              <Tab.Pane eventKey="favorites">
                {favorites.map(song => <SongCard key={song.title} song={song} />)}
              </Tab.Pane>
              <Tab.Pane eventKey="recent">
                {recent.map(song => <SongCard key={song.title} song={song} />)}
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </Col>
        <Col md={9} className="player-area">
          <Player />
        </Col>
      </Row>
    </Container>
  );
};

const RootApp = () => (
  <PlayerProvider>
    <App />
  </PlayerProvider>
);

export default RootApp;
