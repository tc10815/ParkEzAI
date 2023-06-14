import React from 'react';
import YouTube from 'react-youtube';

class LotStream extends React.Component {
  render() {
    const opts = {
      height: '390',
      width: '640',
      playerVars: {
        autoplay: 1,
      },
    };

    return <YouTube videoId="mwN6l3O1MNI" opts={opts} onReady={this._onReady} />;
  }

  _onReady(event) {
    event.target.playVideo();
  }
}
export default LotStream;