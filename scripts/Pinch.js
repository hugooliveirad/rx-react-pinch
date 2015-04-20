import React from 'react';
import Rx from 'rx';

var dom = {};
['touchstart', 'touchmove', 'touchend'].forEach(ev => {
  dom[ev] = (element, selector) => Rx.Observable.fromEvent(element, ev, selector)
});

function eventPreventDefault(event) {
  event.preventDefault();
}

function hasTwoTouchPoints(event) {
  return event.touches && event.touches.length === 2;
}

function logger(subject) {
  console.log(subject);
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
    let touchStart = dom.touchstart(window);
    let touchMove = dom.touchmove(window);
    let touchEnd = dom.touchend(window);

    let pinch = touchStart
      .tap(eventPreventDefault)
      .takeWhile(hasTwoTouchPoints)
      .flatMap(() => {
        return touchMove
          .pluck('scale')
          .takeUntil(touchEnd)
      })
      .tap(logger)

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
