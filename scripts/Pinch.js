import React from 'react';
import Rx from 'rx';
import _ from 'ramda';

function eventPreventDefault(event) {
  event.preventDefault();
  return event;
}

function hasTwoTouchPoints(event) {
  return event.touches && event.touches.length === 2;
}

function logger(subject) {
  console.log(subject);
  return subject;
}

class Pinch extends React.Component {
  constructor(props) {
    super(props);
    this.state = { scale: 1 };
  }

  componentWillMount() {
    this.handlePinch();
  }

  handlePinch() {
    let touchStart = Rx.Observable.fromEvent(window, 'touchstart');
    let touchMove = Rx.Observable.fromEvent(window, 'touchmove');
    let touchEnd = Rx.Observable.fromEvent(window, 'touchend');

    let pinch = touchStart
      .map(eventPreventDefault)
      .takeWhile(hasTwoTouchPoints)
      .flatMap(() => {
        return touchMove
          .map(_.prop('scale'))
          .takeUntil(touchEnd)
      })
      .map(logger)

    pinch.subscribe(scale => this.setState({ scale: scale }));
  }

  render() {
    return (
      <div>
        {this.props.render(this.state.scale)}
      </div>
    );
  }
}

Pinch.propTypes = { render: React.PropTypes.func };

export default Pinch;
