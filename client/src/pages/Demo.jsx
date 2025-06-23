import React from "react";
// import { Ellipse } from "./Ellipse";
// import { Frame } from "./Frame";
// import { HeartFill } from "./HeartFill";
// import image21 from "./image-21.png";
// import image22 from "./image-22.png";
// import image24 from "./image-24.png";
import "./Demo.css";
// import vector1 from "./vector-1.svg";
// import vector2 from "./vector-2.svg";
// import vector3 from "./vector-3.svg";

const Demo = () => {
  return (
    <div className="hero-section">
      <div className="nav">
        <div className="logo">
          <div className="overlap-group-wrapper">
            <div className="overlap-group">
              <div className="overlap">
                <img className="vector" alt="Placeholder Vector" src="https://via.placeholder.com/40x40?text=V2" />
              </div>
              <img className="vector-2" alt="Placeholder Vector" src="https://via.placeholder.com/40x40?text=V3" />
            </div>
          </div>
          <p className="foodie">
            <span className="text-wrapper">Foo</span>
            <span className="span">die</span>
          </p>
        </div>
        <div className="nav-list">
          <div className="navbar">
            <div className="frame-2">
              <div className="text-wrapper-2">Home</div>
              <img className="vector-3" alt="Placeholder Vector" src="https://via.placeholder.com/40x40?text=V1" />
            </div>
            <div className="text-wrapper-3">Our Menu</div>
            <div className="text-wrapper-3">Foods</div>
            <div className="text-wrapper-3">About us</div>
            <div className="text-wrapper-3">Contact us</div>
          </div>
          <div className="div-wrapper">
            <div className="text-wrapper-4">Login</div>
          </div>
        </div>
      </div>
      <div className="hero-content">
        <div className="left">
          <div className="frame-3">
            <div className="frame-4">
              <div className="frame-5">
                <div className="text-wrapper-5">Desire</div>
                <div className="frame-6">
                  <div className="text-wrapper-6">Food</div>
                </div>
              </div>
              <div className="text-wrapper-7">for Your Taste</div>
            </div>
            <p className="p">
              Food is what we eat to stay alive and healthy. It comes in many
              different forms and flavors, from fruits and vegetables to meats
              and grains.
            </p>
          </div>
          <div className="frame-7">
            <div className="text-wrapper-8">Order Now</div>
          </div>
        </div>
        <div className="right">
          <div className="overlap-group-2">
            <div className="image-wrapper">
              {/* <img className="image-2" alt="Image" src={image21} /> */}
              <img src="https://via.placeholder.com/150" alt="Placeholder 1" />
            </div>
            {/* <img className="image-3" alt="Image" src={image22} /> */}
            <img src="https://via.placeholder.com/150" alt="Placeholder 2" />
            {/* <Frame className="frame-14" image="image.png" /> */}
            <div className="frame-8">
              <div className="ellipse-wrapper">
                {/* <Ellipse
                  className="ellipse-2"
                  ellipse="ellipse-2-2.png"
                  ellipseClassName="ellipse-instance"
                /> */}
              </div>
              <div className="frame-9">
                <div className="text-wrapper-9">Ali Ahmad</div>
                <div className="frame-10">
                  <div className="frame-11">
                    {/* <img className="image-4" alt="Image" src={image24} /> */}
                    <img src="https://via.placeholder.com/150" alt="Placeholder 3" />
                    <div className="text-wrapper-10">4.5</div>
                  </div>
                  <div className="frame-11">
                    {/* <HeartFill className="heart-fill" /> */}
                    <div className="text-wrapper-10">1k Likes</div>
                  </div>
                </div>
              </div>
            </div>
            {/* <Frame
              className="frame-instance"
              image="image-23-2.png"
              text="Location"
              text1="at destination"
            /> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Demo;
