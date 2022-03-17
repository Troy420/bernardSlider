import React from "react";
import { FaGenderless } from "react-icons/fa";

export default class SliderDots extends React.Component {
  render() {
    const { slides, trigger } = this.props;

    return (
      <ul className="slider-dots">
        {[...slides]
          .sort((a, b) => {
            return a.index > b.index ? 1 : -1;
          })
          .map((slide, i) => {
            return (
              <FaGenderless
                key={i}
                className={`dot ${slide.active && "active"}`}
                onClick={() => {
                  trigger(slide);
                }}
              />
            );
          })}
      </ul>
    );
  }
}
