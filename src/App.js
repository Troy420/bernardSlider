import React from "react";
import ImageSlider from "./components/ImageSlider";
import "./styles.css";

const SliderData = require("./SliderData.json");

/**
 * Convert this to class since you will be working with class!
 */
export default class App extends React.Component {
  render() {
    return (
      <>
        <ImageSlider
          active="1"
          slides={SliderData}
          slideInterval="1000"
          autoplay={false}
          infiniteMode={true}
          // slideToShow
          // centerMode
        />
      </>
    );
  }
}
