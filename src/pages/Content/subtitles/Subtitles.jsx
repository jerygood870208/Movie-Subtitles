import React, { useState } from 'react';
import { styled } from '@material-ui/core/styles';
import Draggable from 'react-draggable';
import eventBus from '../EventBus';
import languageEncoding from 'detect-file-encoding-and-language';
import processSubtitles from './processSubtitles';
import timeUpdate from './timeUpdate';

const Container = styled('div')({
  position: 'absolute',
  left: '50%',
  transform: 'translateX(-50%)',
  bottom: '75px',
  maxWidth: '90%',
  zIndex: 2147483647,
});

const SubtitleWrapper = styled('div')({
  color: 'white',
  fontSize: '24px',
  backgroundColor: 'rgba(0,0,0,0.5)',
  borderRadius: '40px',
});

const SubtitleButton = styled('div')({
  display: 'inline-block',
  backgroundColor: 'transparent',
  fontWeight: 900,
  marginLeft: '5px',
  marginRight: '5px',
  color: 'white',
  border: 'none',
  userSelect: 'none',
});

const SubtitleText = styled('div')({
  display: 'inline-block',
  marginLeft: 0,
  marginRight: 0,
  marginTop: '5px',
  marginBottom: '5px',
  userSelect: 'none',
});

function Subtitles({ video }) {
  const [videoPlaying, setVideoPlaying] = useState(true);
  const [currentSubtitles, setCurrentSubtitles] = useState(
    'No subtitles loaded'
  );
  const [subtitleArr, setSubtitleArr] = useState([]);
  const [pos, setPos] = useState(0);

  eventBus.on('fileUpload', (file) => {
    languageEncoding(file)
      .then((fileInfo) => {
        const reader = new FileReader();

        reader.onload = function (evt) {
          const content = evt.target.result;
          setSubtitleArr(processSubtitles(content.split('\n')));
        };
        reader.readAsText(file, fileInfo.encoding);
      })
      .catch((err) => {
        console.log('Error caught:', err);
      });
  });

  video.ontimeupdate = () => {
    setCurrentSubtitles(timeUpdate(subtitleArr, video, pos, setPos));
  };

  const pauseHandler = () => {
    if (!video.paused) {
      video.pause();
      setVideoPlaying(false);
    }
  };

  const playHandler = () => {
    if (!videoPlaying) {
      video.play();
      setVideoPlaying(true);
    }
  };

  return (
    <Container>
      <Draggable axis="y">
        <SubtitleWrapper onMouseEnter={pauseHandler} onMouseLeave={playHandler}>
          <SubtitleButton id="prev-button">«</SubtitleButton>
          <SubtitleText>{currentSubtitles}</SubtitleText>
          <SubtitleButton id="next-button">»</SubtitleButton>
        </SubtitleWrapper>
      </Draggable>
    </Container>
  );
}

export default Subtitles;
