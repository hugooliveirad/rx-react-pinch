import React from 'react';
import Rx from 'rx';

let dom = ['touchstart', 'touchmove', 'touchend'].reduce((dom, event) => {
  dom[event] = (element, selector) => Rx.Observable.fromEvent(element, event, selector);
  return dom;
}, {});

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

  componentWillUnmount() {
    if (this.pinchSubscription) {
      this.pinchSubscription.dispose();
    }
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

    this.pinchSubscription = pinch.subscribe(scale => this.setState({ scale: scale }));
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
