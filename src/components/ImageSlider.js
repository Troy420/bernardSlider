import React, { createRef } from "react";
// import { FaSlidersH } from "react-icons/fa";
import {
  FaArrowAltCircleRight,
  FaArrowAltCircleLeft,
  FaPlay,
  FaSquare
} from "react-icons/fa";
import SliderDots from "./SliderDots";

/* eslint-disable consistent-return */

export default class ImageSlider extends React.Component {
  // Define the default state
  state = {
    slides: [],
    showLeft: true,
    showRight: true
  };

  slidePlayInterval = -1;
  sliderRef = createRef();

  constructor(props) {
    super(props);

    // console.log(this.state);

    // Allow user to inject different kind of props for initial state
    const { active, slides = [] } = props;
    // const length = slides.length;

    // Mutate the slides to add our internal variables
    // Currently we only need active and index
    // but when you do dot jump, you might need other variables such as is clone or group etc
    slides.map((slide, i) => {
      // We might need to use unique id?
      slide.index = i;
      slide.active = i === parseInt(active, 10);
      slide.ref = createRef();
    });

    // Inject the modified slides to state
    this.state.slides = slides;
  }

  componentDidMount() {
    const { autoplay } = this.props;

    this.scrollToActive();
    this.toggleButtons();
    this.slideToShow();

    if (autoplay) {
      this.playSlide();
    }
  }

  componentDidUpdate() {
    this.scrollToActive();
    this.toggleButtons();
  }

  slideToShow() {
    // 100% / numberOfSlides + '%'

    const { slideToShow } = this.props;
    const numberOfSlide = Number(slideToShow);
    // console.log(typeof Number(slideToShow));
    // console.log(Number(slideToShow));
    const formula = Math.floor(100 / Number(numberOfSlide)) + "%";
    // console.log(formula);

    this.sliderRef.current.style.gridAutoColumns = formula;
  }

  /**
   * Simple function for getting all the active slides
   * This should be connected to how many slides to display?
   * currently only single slides so it wont matter
   *
   * @param {*} slides
   */
  getActive(slides) {
    // filter the slides and only show the one with active = true
    return slides.filter((slide) => {
      return slide.active;
    });
  }

  /**
   * Simple function for getting all the slides index
   * This should be connected to how many slides to display?
   * currently only single slides so it wont matter
   *
   * @param {*} slides
   */
  // getSlidesIndex = (slides) => {
  //   return slides.filter((slide) => {
  //     return slide.index;
  //   });
  // };

  /**
   * Simple function for removing a single slide or
   * array of slides or reset
   * for all slides
   *
   * @param {} slides
   * @param {*} index
   * @param {*} reset
   */
  removeActive(slides, index, reset = false) {
    slides.map((slide) => {
      if (
        (Array.isArray(index)
          ? index.contains(slide.index)
          : slide.index === index) ||
        reset
      ) {
        slide.active = false;
      }
    });
  }

  /**
   * Simple function to mark slides as active for a
   * single slide or multiple slides
   * @param {} slides
   * @param {*} index
   */
  setActive(slides, index) {
    // index = [];
    slides.map((slide) => {
      if (
        Array.isArray(index)
          ? index.contains(slide.index)
          : slide.index === index
      ) {
        slide.active = true;
      }
    });
  }

  toggleButtons = () => {
    const { getActive } = this;
    const { slides, showLeft, showRight, infinite } = this.state;
    const actives = getActive(slides);
    const first = actives.slice(0, 1).pop();
    const last = actives.slice(-1).pop();
    const newStates = {
      showLeft: true,
      showRight: true,
      infinite: true
    };

    if (first && last && infinite === false) {
      if (first.index === 0) {
        newStates.showLeft = false;
      }

      if (last.index === slides.length - 1) {
        newStates.showRight = false;
      }
    }

    if (showLeft !== newStates.showLeft || showRight !== newStates.showRight) {
      this.setState(newStates);
    }
  };

  /**
   * Caller method to move back one slide
   *
   */
  prevSlide = () => {
    const { infiniteMode } = this.props;
    const { getActive, setActive, removeActive } = this;
    const { slides } = this.state;
    const active = getActive(slides);
    const activeSlideIndex = active[0] ? active[0].index : 0;

    // console.log(infiniteMode);

    // let newActiveIndex = Math.min(
    //   Math.max(activeSlideIndex - 1, 0),
    //   slides.length - 1
    // );
    let newActiveIndex = activeSlideIndex - 1;

    // The proposed active index is the current active slide
    // dont do anything.
    if (newActiveIndex === activeSlideIndex) {
      return;
    }

    if (activeSlideIndex === 0) {
      newActiveIndex = slides.length - 1;
    }

    // Since we are just moving a single slide just reset
    // all active
    removeActive(slides, activeSlideIndex, true);

    // Set the new active index
    setActive(slides, newActiveIndex);
    const numOfSlides = 2;

    if (infiniteMode && newActiveIndex === slides[numOfSlides - 1].index) {
      const { slides } = this.state;

      const slidesToSlice = slides.slice(slides.length - 1);
      slides.unshift(...slidesToSlice);
      // console.log("Slides", slides);

      // at position 10 , remove 1 item
      slides.splice(slides.length - 1, 1);
    }

    this.setState({
      slides: slides
    });
  };

  /**
   * Calleer method to move up one slide
   *
   */
  nextSlide = () => {
    const { infiniteMode } = this.props;
    const { getActive, setActive, removeActive } = this;
    const { slides } = this.state;
    const active = getActive(slides);
    // const x = getSlidesIndex(slides);
    const activeSlideIndex = active[active.length - 1]
      ? active[active.length - 1].index
      : slides.length - 1;

    // const newActiveIndex = Math.min(
    //   Math.max(activeSlideIndex + 1, 0),
    //   slides.length - 1
    // );
    let newActiveIndex = activeSlideIndex + 1;

    // The proposed active index is the current active slide
    // dont do anything.
    if (newActiveIndex === activeSlideIndex) {
      return;
    }

    if (activeSlideIndex === slides.length - 1) {
      newActiveIndex = 0;
    }

    // Since we are just moving a single slide just reset
    // all active
    removeActive(slides, activeSlideIndex, true);

    // Set the new active index
    setActive(slides, newActiveIndex);

    // console.log(newActiveIndex);
    const numOfSlides = 2;

    if (
      infiniteMode &&
      newActiveIndex === slides[slides.length - numOfSlides].index
    ) {
      const { slides } = this.state;

      // slice the array from index 0 to (10-2)
      const slidesToSlice = slides.slice(0, 1);
      slides.push(...slidesToSlice);
      // console.log(slides);

      // array.splice(index, howmany, item1, ....., itemX)
      // at position 0 , remove x items
      slides.splice(0, 1);
    } else if (newActiveIndex === slides[slides.length - 1].index) {
      this.stopSlide();
    }

    this.setState({
      slides: slides
    });
  };

  /**
   * Calleer method to set current slide active
   *
   */
  currentSlide = (slide) => {
    const { setActive, removeActive } = this;
    const { slides } = this.state;

    removeActive(slides, slide.index, true);
    setActive(slides, slide.index);

    this.setState({
      slides: slides
    });
  };

  /**
   * Build one for jumping to x slide!
   */
  jumpToSlide = (slide) => {
    // Excercise how to logically jump to any slide?

    const { getActive, setActive, removeActive } = this;
    const { slides } = this.state;

    const active = getActive(slides);
    const activeDotIndex = active[0] ? active[0].index : slides.length - 1;
    const newDotActiveIndex = slide.index;

    // Since we are just moving a single slide just reset
    // all active
    removeActive(slides, activeDotIndex, true);

    setActive(slides, newDotActiveIndex);

    this.setState({
      slides: slides
    });
  };

  playSlide = () => {
    const { slideInterval } = this.props;
    const { slides } = this.state;
    const { nextSlide } = this;
    // const active = getActive(slides);

    clearInterval(this.slidePlayInterval);

    this.slidePlayInterval = setInterval(nextSlide, Number(slideInterval));

    this.setState({
      slides: slides
    });
  };

  stopSlide = () => {
    clearInterval(this.slidePlayInterval);
  };

  scrollToActive = () => {
    const { getActive } = this;
    const { centerMode, slidesToShow } = this.props;
    const { slides } = this.state;
    const active = getActive(slides);
    const odd = Number(slidesToShow) % 2 !== 0;

    // Change this to another index if we need scroll 3 elements at once
    // with 3 element scroll then get the middle [ index 1 ] as the
    // target scrolling
    const currentSlide =
      active[0] && active[0].ref && active[0].ref.current
        ? active[0].ref.current
        : false;

    if (currentSlide) {
      if (odd && centerMode) {
        currentSlide.scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "center"
        });
      } else {
        currentSlide.scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "start"
        });
      }
    }
  };

  /**
   * Render method
   */
  render() {
    const {
      prevSlide,
      nextSlide,
      currentSlide,
      jumpToSlide,
      playSlide,
      stopSlide
    } = this;
    const { slides, showLeft, showRight } = this.state;

    // Research what attribute key really means. tldr; react will only update this kind of component if it found key different
    // that can slow or speed things up

    // Build the dotted image to jump to x slide and center them?
    return (
      <>
        {showLeft && (
          <button className="btn-arrow left-arrow" onClick={prevSlide}>
            <FaArrowAltCircleLeft />
          </button>
        )}

        <div className="slider snaps-inline">
          <div className="slide-wrapper" ref={this.sliderRef}>
            {slides.map((slide, index) => {
              return (
                <div
                  className={`slide ${slide.active ? "active" : ""}`}
                  key={"slides-" + index}
                  ref={slide.ref}
                  onClick={() => currentSlide(slide)}
                >
                  <img src={slide.image} alt="" className="image" />
                  {slide.index}
                </div>
              );
            })}
          </div>
        </div>

        {showRight && (
          <button className="btn-arrow right-arrow" onClick={nextSlide}>
            <FaArrowAltCircleRight />
          </button>
        )}

        <SliderDots
          key={JSON.stringify(
            slides.map(({ ref, ...rest }) => {
              return rest;
            })
          )}
          slides={slides}
          trigger={jumpToSlide}
        />

        <button className="btn btn-play" onClick={playSlide}>
          <FaPlay />
        </button>
        <button className="btn btn-stop" onClick={stopSlide}>
          <FaSquare />
        </button>
      </>
    );
  }
}
