// "use client";
// import { useEffect, useRef, useState } from "react";
// import { Canvas, useThree } from "@react-three/fiber";
// import { TextureLoader, LinearFilter } from "three";
// import avatar_img from "@/public/avatar_1.jpg";
// import gsap from "gsap";
// import Image from "next/image";

// // Image Data
// const slides = [
//   { image: "/leopard2.jpg", title: "Amur <br> Leopard", status: "Critically Endangered" },
//   { image: "/AI.jpg", title: "Asiatic <br> Lion", status: "Endangered" },
//   { image: "/leopard2.jpg", title: "Siberian <br> Tiger", status: "Endangered" },
//   { image: "/bear2.jpg", title: "Brown <br> Bear", status: "Least Concern" },
// ];

// const vertexShader = `
//   varying vec2 vUv;
//   void main() {
//     vUv = uv;
//     gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
//   }
// `;

// const fragmentShader = `
//   varying vec2 vUv;
//   uniform sampler2D currentImage;
//   uniform sampler2D nextImage;
//   uniform float dispFactor;

//   void main() {
//     vec2 uv = vUv;
//     vec4 _currentImage = texture2D(currentImage, uv);
//     vec4 _nextImage = texture2D(nextImage, uv);
//     vec4 finalTexture = mix(_currentImage, _nextImage, dispFactor);
//     gl_FragColor = finalTexture;
//   }
// `;

// const DisplacementSlider = () => {
//   const [textures, setTextures] = useState([]);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const sliderRef = useRef();
//   const titleRef = useRef();
//   const statusRef = useRef();

//   // Load Images
//   useEffect(() => {
//     const loader = new TextureLoader();
//     const loadedTextures = slides.map((slide) => {
//       const texture = loader.load(slide.image);
//       texture.magFilter = texture.minFilter = LinearFilter;
//       return texture;
//     });
//     setTextures(loadedTextures);
//   }, []);

//   const handleSlideChange = (index) => {
//     if (sliderRef.current && textures.length > 0) {
//       const material = sliderRef.current.material;

//       // Animate displacement transition
//       gsap.to(material.uniforms.dispFactor, {
//         value: 1,
//         duration: 1,
//         ease: "expo.inOut",
//         onComplete: () => {
//           // Force texture update and reset displacement
//           material.uniforms.currentImage.value = textures[index];
//           material.uniforms.nextImage.value = textures[(index + 1) % textures.length]; // Update next image
//           material.uniforms.dispFactor.value = 0; // Reset displacement
//           setCurrentIndex(index);
//         },
//       });

//       // Animate text change
//       gsap.to(titleRef.current, {
//         opacity: 0,
//         y: -20,
//         duration: 0.5,
//         onComplete: () => {
//           titleRef.current.innerHTML = slides[index].title;
//           gsap.to(titleRef.current, { opacity: 1, y: 0, duration: 0.5 });
//         },
//       });

//       gsap.to(statusRef.current, {
//         opacity: 0,
//         y: 10,
//         duration: 0.5,
//         onComplete: () => {
//           statusRef.current.innerText = slides[index].status;
//           gsap.to(statusRef.current, { opacity: 1, y: 0, duration: 0.5 });
//         },
//       });
//     }
//   };


//   return (
//     <div className="relative w-full h-screen bg-gray-900 flex items-center justify-center font-karla">
//       {/* Three.js Canvas */}
//       <Canvas className="absolute w-full h-full">
//         {textures.length > 1 && (
//           <mesh ref={sliderRef}>
//             <planeGeometry args={[2, 2]} />
//             <shaderMaterial
//               uniforms={{
//                 dispFactor: { value: 0 },
//                 currentImage: { value: textures[currentIndex] },
//                 nextImage: { value: textures[(currentIndex + 1) % textures.length] },
//               }}
//               vertexShader={vertexShader}
//               fragmentShader={fragmentShader}
//               transparent={true}
//             />
//           </mesh>
//         )}
//       </Canvas>

//       {/* Text Overlay */}
//       <div className="absolute text-white text-center top-1/4 w-full px-6">
//         <div className="text-lg uppercase opacity-70">Species</div>
//         <h2
//           ref={titleRef}
//           className="text-6xl font-bold leading-tight"
//           dangerouslySetInnerHTML={{ __html: slides[currentIndex].title }}
//         />
//         <div className="text-lg uppercase mt-4 opacity-70">Status</div>
//         <div ref={statusRef} className="text-2xl font-medium mt-2">
//           {slides[currentIndex].status}
//         </div>
//       </div>

//       {/* Pagination Buttons */}
//       <div className="absolute bottom-10 flex gap-3">
//         {slides.map((_, index) => (
//           <button
//             key={index}
//             onClick={() => handleSlideChange(index)}
//             className={`w-4 h-4 rounded-full transition-all ${
//               currentIndex === index ? "bg-white scale-125" : "bg-gray-500"
//             }`}
//           />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default DisplacementSlider;





/*'use client';
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Fade } from 'react-awesome-reveal';
import Image from 'next/image';



// Data for KW&SC services
const cardsData = [
  {
    title: "Water Supply",
    image: "/karachicharminar.gif",
    subImage: "/karachicharminar.gif",
    description: "Clean Water Distribution",
  },
  {
    title: "Sewerage",
    image: "/teentalwarkarachi.gif",
    subImage: "/teentalwarkarachi.gif",
    description: "Efficient Sewerage Management",
  },
];

const ParallaxEffect = () => {
  // Function to handle parallax effect for each card
  const updateParallax = (cardRef, x, y) => {
    if (cardRef.current) {
      gsap.set(cardRef.current, {
        '--x': gsap.utils.mapRange(0, cardRef.current.clientWidth, -1, 1, x),
        '--y': gsap.utils.mapRange(0, cardRef.current.clientHeight, -1, 1, y),
      });
    }
  };

  return (
    <>
      <div className="text-center mb-8  my-10">
        <div className="inline-flex items-center gap-2 px-4 py-1 shadow-md rounded-full text-gray-700 text-sm font-medium">
          <Image
            src="/icon/magic.png"
            width={20}
            height={20}
            alt="Magic Icon"
          />
          Who We are ?
        </div>
        <Fade direction="down" triggerOnce duration={1000} delay={9}>
          <h2 className="text-4xl font-extrabold text-blue-900 mt-4">
            Our Services
          </h2>
        </Fade>
      </div>
      <div className="flex gap-20 justify-center">
        {cardsData.map((card, index) => {
          const cardRef = useRef();

          useEffect(() => {
            const update = ({ clientX: x, clientY: y }) => updateParallax(cardRef, x, y);

            const handleMouseEnter = () => {
              window.addEventListener('pointermove', update);
            };

            const handleMouseLeave = () => {
              window.removeEventListener('pointermove', update);
            };

            const cardElement = cardRef.current;
            cardElement.addEventListener('mouseenter', handleMouseEnter);
            cardElement.addEventListener('mouseleave', handleMouseLeave);

            return () => {
              cardElement.removeEventListener('mouseenter', handleMouseEnter);
              cardElement.removeEventListener('mouseleave', handleMouseLeave);
            };
          }, []);

          return (
            <div
              ref={cardRef}
              key={index}
              className="relative w-[600px] max-w-[calc(100%-2rem)] aspect-[2/1.1] min-h-[330px] overflow-hidden rounded-[4em]"
            >
              <img
                src={card.image}
                alt={card.title}
                className="absolute top-0 left-1/2 -translate-x-1/2 h-full w-[680px] object-cover saturate-[1.5] brightness-[0.9] pointer-events-none select-none"
                style={{
                  objectPosition: `calc(50% + (var(--x) * 0px)) calc(43% + (var(--y) * -20px))`,
                }}
              />
              <h3
                className="absolute left-1/2 top-[6%] text-[8rem] uppercase font-['Bebas_Neue'] text-white pointer-events-none select-none"
                style={{
                  transform: 'translate(calc(-50% + (var(--x) * -30px)), calc(var(--y) * -20px))',
                }}
              >
                {card.title}
              </h3>
              <img
                src={card.subImage}
                alt={`${card.title} Sub Image`}
                className="absolute top-0 left-1/2 -translate-x-1/2 h-full w-[660px] object-cover pointer-events-none select-none"
                style={{
                  objectPosition: `calc(-50% + (var(--x) * 40px)) calc(43% + (var(--y) * -40px))`,
                }}
              />
              <div className="absolute inset-[60%_0_-26%_0] overflow-hidden blur-[20px]">
                <img
                  src={card.image}
                  alt="Blurred"
                  className="absolute bottom-[25%] left-1/2 h-[330px] w-[660px] -translate-x-1/2 object-cover saturate-[1.5] brightness-[0.8]"
                  style={{
                    objectPosition: `calc(-50% + (var(--x) * 40px)) calc(47.5% + (var(--y) * -40px))`,
                    maskImage: 'radial-gradient(50% 100% at 50% 90%, white 50%, transparent)',
                    WebkitMaskImage: 'radial-gradient(50% 100% at 50% 90%, white 50%, transparent)',
                  }}
                />
              </div>
              <div className="absolute bottom-0 grid min-h-[32%] w-full place-items-center content-center gap-1 pb-2 text-white">
                <span className="absolute top-4 left-1/2 h-0.5 w-[6ch] -translate-x-1/2 bg-white" />
                <p className="relative m-0 flex items-center gap-2 text-[1.2rem]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-5 h-5"
                  >
                    <path d="M15.75 8.25a.75.75 0 0 1 .75.75c0 1.12-.492 2.126-1.27 2.812a.75.75 0 1 1-.992-1.124A2.243 2.243 0 0 0 15 9a.75.75 0 0 1 .75-.75Z" />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM4.575 15.6a8.25 8.25 0 0 0 9.348 4.425 1.966 1.966 0 0 0-1.84-1.275.983.983 0 0 1-.97-.822l-.073-.437c-.094-.565.25-1.11.8-1.267l.99-.282c.427-.123.783-.418.982-.816l.036-.073a1.453 1.453 0 0 1 2.328-.377L16.5 15h.628a2.25 2.25 0 0 1 1.983 1.186 8.25 8.25 0 0 0-6.345-12.4c.044.262.18.503.389.676l1.068.89c.442.369.535 1.01.216 1.49l-.51.766a2.25 2.25 0 0 1-1.161.886l-.143.048a1.107 1.107 0 0 0-.57 1.664c.369.555.169 1.307-.427 1.605L9 13.125l.423 1.059a.956.956 0 0 1-1.652.928l-.679-.906a1.125 1.125 0 0 0-1.906.172L4.575 15.6Z"
                    />
                  </svg>
                  <span>{card.description}</span>
                </p>
                <p className="m-0 opacity-80">{card.description}</p>
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex gap-20 justify-center my-20">
        {cardsData.map((card, index) => {
          const cardRef = useRef();

          useEffect(() => {
            const update = ({ clientX: x, clientY: y }) => updateParallax(cardRef, x, y);

            const handleMouseEnter = () => {
              window.addEventListener('pointermove', update);
            };

            const handleMouseLeave = () => {
              window.removeEventListener('pointermove', update);
            };

            const cardElement = cardRef.current;
            cardElement.addEventListener('mouseenter', handleMouseEnter);
            cardElement.addEventListener('mouseleave', handleMouseLeave);

            return () => {
              cardElement.removeEventListener('mouseenter', handleMouseEnter);
              cardElement.removeEventListener('mouseleave', handleMouseLeave);
            };
          }, []);

          return (
            <div
              ref={cardRef}
              key={index}
              className="relative w-[600px] max-w-[calc(100%-2rem)] aspect-[2/1.1] min-h-[330px] overflow-hidden rounded-[4em]"
            >
              <img
                src={card.image}
                alt={card.title}
                className="absolute top-0 left-1/2 -translate-x-1/2 h-full w-[680px] object-cover saturate-[1.5] brightness-[0.9] pointer-events-none select-none"
                style={{
                  objectPosition: `calc(50% + (var(--x) * 0px)) calc(43% + (var(--y) * -20px))`,
                }}
              />
              <h3
                className="absolute left-1/2 top-[6%] text-[8rem] uppercase font-['Bebas_Neue'] text-white pointer-events-none select-none"
                style={{
                  transform: 'translate(calc(-50% + (var(--x) * -30px)), calc(var(--y) * -20px))',
                }}
              >
                {card.title}
              </h3>
              <img
                src={card.subImage}
                alt={`${card.title} Sub Image`}
                className="absolute top-0 left-1/2 -translate-x-1/2 h-full w-[660px] object-cover pointer-events-none select-none"
                style={{
                  objectPosition: `calc(-50% + (var(--x) * 40px)) calc(43% + (var(--y) * -40px))`,
                }}
              />
              <div className="absolute inset-[60%_0_-26%_0] overflow-hidden blur-[20px]">
                <img
                  src={card.image}
                  alt="Blurred"
                  className="absolute bottom-[25%] left-1/2 h-[330px] w-[660px] -translate-x-1/2 object-cover saturate-[1.5] brightness-[0.8]"
                  style={{
                    objectPosition: `calc(-50% + (var(--x) * 40px)) calc(47.5% + (var(--y) * -40px))`,
                    maskImage: 'radial-gradient(50% 100% at 50% 90%, white 50%, transparent)',
                    WebkitMaskImage: 'radial-gradient(50% 100% at 50% 90%, white 50%, transparent)',
                  }}
                />
              </div>
              <div className="absolute bottom-0 grid min-h-[32%] w-full place-items-center content-center gap-1 pb-2 text-white">
                <span className="absolute top-4 left-1/2 h-0.5 w-[6ch] -translate-x-1/2 bg-white" />
                <p className="relative m-0 flex items-center gap-2 text-[1.2rem]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-5 h-5"
                  >
                    <path d="M15.75 8.25a.75.75 0 0 1 .75.75c0 1.12-.492 2.126-1.27 2.812a.75.75 0 1 1-.992-1.124A2.243 2.243 0 0 0 15 9a.75.75 0 0 1 .75-.75Z" />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM4.575 15.6a8.25 8.25 0 0 0 9.348 4.425 1.966 1.966 0 0 0-1.84-1.275.983.983 0 0 1-.97-.822l-.073-.437c-.094-.565.25-1.11.8-1.267l.99-.282c.427-.123.783-.418.982-.816l.036-.073a1.453 1.453 0 0 1 2.328-.377L16.5 15h.628a2.25 2.25 0 0 1 1.983 1.186 8.25 8.25 0 0 0-6.345-12.4c.044.262.18.503.389.676l1.068.89c.442.369.535 1.01.216 1.49l-.51.766a2.25 2.25 0 0 1-1.161.886l-.143.048a1.107 1.107 0 0 0-.57 1.664c.369.555.169 1.307-.427 1.605L9 13.125l.423 1.059a.956.956 0 0 1-1.652.928l-.679-.906a1.125 1.125 0 0 0-1.906.172L4.575 15.6Z"
                    />
                  </svg>
                  <span>{card.description}</span>
                </p>
                <p className="m-0 opacity-80">{card.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default ParallaxEffect;
*/
"use client";
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { FaTint, FaWater, FaTools, FaShieldAlt, FaChartLine, FaCogs, FaDatabase, FaPhone } from "react-icons/fa";
import { FcClapperboard } from "react-icons/fc";
import gsap from "gsap";
import Loader from "@/components/Loader";

export default function Services() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loaderTimeline = gsap.timeline({
      onComplete: () => setLoading(false),
    });

    loaderTimeline
      .fromTo(
        ".loader",
        { scaleY: 0, transformOrigin: "50% 100%" },
        { scaleY: 1, duration: 0.5, ease: "power2.inOut" }
      )
      .to(".loader", {
        scaleY: 0,
        transformOrigin: "0% -100%",
        duration: 0.5,
        ease: "power2.inOut",
      })
      .to(
        ".wrapper",
        { y: "-100%", ease: "power4.inOut", duration: 1 },
        "-=0.8"
      );
  }, []);

  useEffect(() => {
    const cards = document.querySelectorAll(".card");
    cards.forEach((card) => card.addEventListener("click", onCardClick));
    return () => cards.forEach((card) => card.removeEventListener("click", onCardClick));
  }, []);

  const toggleExpansion = (element, to, duration = 350) => {
    return new Promise((res) => {
      element.animate(
        [
          {
            top: to.top,
            left: to.left,
            width: to.width,
            height: to.height,
          },
        ],
        { duration, fill: "forwards", easing: "ease-in-out" }
      );
      setTimeout(res, duration);
    });
  };

  const onCardClick = async (e) => {
    const card = e.currentTarget;
    const cardClone = card.cloneNode(true);
    const { top, left, width, height } = card.getBoundingClientRect();

    // Extract gradient class from the original card
    const gradientClass = card.classList.value.split(" ").find(cls => cls.startsWith("from-"));

    // Extract service details
    const title = card.querySelector("h2")?.innerText || "";
    const description = card.querySelector("p")?.innerText || "";
    const iconHTML = card.querySelector("div.text-6xl")?.innerHTML || "";

    cardClone.style.position = "fixed";
    cardClone.style.top = top + "px";
    cardClone.style.left = left + "px";
    cardClone.style.width = width + "px";
    cardClone.style.height = height + "px";
    card.style.opacity = "0";

    document.body.appendChild(cardClone);

    // Wait for expansion animation
    await toggleExpansion(cardClone, { top: "0px", left: "0px", width: "100vw", height: "100vh" });

    // Apply dynamic gradient and styles
    cardClone.classList.add("bg-gradient-to-br", gradientClass);
    cardClone.style.zIndex = "50";
    cardClone.style.overflow = "auto";
    cardClone.style.padding = "40px";
    cardClone.style.borderRadius = "0px";

    // Clear old content and add new content
    cardClone.innerHTML = `
      <div class="flex flex-col items-center text-center h-full justify-center p-8">
        <div class="text-7xl mb-6">${iconHTML}</div>
        <h2 class="text-4xl font-bold mb-4">${title}</h2>
        <p class="text-lg text-gray-200 max-w-2xl">${description}</p>
      </div>
    `;

    // Create and add close button
    const closeButton = document.createElement("button");
    closeButton.innerText = "X";
    closeButton.style = `
      position: fixed;
      z-index: 10000;
      top: 20px;
      right: 20px;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background-color: black;
      color: white;
      font-size: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: none;
      cursor: pointer;
    `;

    closeButton.addEventListener("click", async () => {
      closeButton.remove();
      cardClone.style.removeProperty("display");
      cardClone.style.removeProperty("padding");

      await toggleExpansion(cardClone, { top: `${top}px`, left: `${left}px`, width: `${width}px`, height: `${height}px` }, 300);

      card.style.removeProperty("opacity");
      cardClone.remove();
    });

    cardClone.appendChild(closeButton);
  };


  const services = [
    { title: "Water Supply Services", description: "Reliable clean water distribution across Karachi.", icon: <FaTint />, gradient: "from-blue-400 to-blue-600" },
    { title: "Sewerage Management", description: "Efficient wastewater collection and treatment systems.", icon: <FaWater />, gradient: "from-cyan-400 to-blue-500" },
    { title: "Infrastructure Maintenance", description: "Regular maintenance and upgrade of water infrastructure.", icon: <FaTools />, gradient: "from-indigo-400 to-purple-500" },
    { title: "Water Quality Testing", description: "Comprehensive water quality monitoring and testing.", icon: <FaShieldAlt />, gradient: "from-green-400 to-teal-500" },
    { title: "Emergency Services", description: "24/7 emergency water and sewerage services.", icon: <FaPhone />, gradient: "from-red-400 to-orange-500" },
    { title: "Customer Support", description: "Dedicated customer service and complaint resolution.", icon: <FaCogs />, gradient: "from-purple-400 to-pink-500" },
    { title: "Water Treatment", description: "Advanced water treatment and purification processes.", icon: <FaChartLine />, gradient: "from-teal-400 to-green-500" },
    { title: "Billing Services", description: "Convenient online billing and payment systems.", icon: <FaDatabase />, gradient: "from-yellow-400 to-orange-500" },
  ];


  return (
    <>
      {loading && <Loader />}  {/* Use the Loader component */}

      <section
        className={`relative h-screen transition-opacity duration-700 bg-[url('/teentalwarkarachi.gif')] bg-cover text-white flex justify-center items-center`}
      >
        <div className="absolute inset-0 bg-blue-900/60 z-0"></div>

        {/* Content (Ensures text and images are above overlay) */}
        <div className="relative z-[1] max-w-[75%] m-20 mx-auto flex items-center justify-center text-center">
          <div className="w-[85%]">
            <h2 className="text-[8vh] font-bold">
              What We Do
            </h2>
            <p className="mt-6 text-[3.5vh] ">
              Comprehensive water and sewerage services ensuring clean water supply
              and<br /> efficient wastewater management for Karachi.
            </p>
          </div>
        </div>
      </section>
      <div className="w-full py-12 mt-20">
        <div className="text-gray-900 max-w-[90%] mx-auto">
          <header className="text-center mb-10">
            <h1 className="text-4xl font-bold mb-4">What We Do</h1>
            <p className="text-gray-600 max-w-3xl mx-auto">
              KW&SC provides comprehensive water and sewerage services across Karachi, ensuring clean water supply and efficient wastewater management for all residents.
            </p>
          </header>
          
          {/* Water Supply Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8 text-blue-900">Water Supply Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h3 className="text-xl font-bold mb-4 text-blue-800">Sources of Water Supply</h3>
                <p className="text-gray-600 mb-4">
                  KW&SC sources water from multiple locations including Hub Dam, Keenjhar Lake, and other strategic water sources to ensure adequate supply for Karachi's growing population.
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li>• Hub Dam - Primary water source</li>
                  <li>• Keenjhar Lake - Secondary source</li>
                  <li>• Groundwater extraction</li>
                  <li>• Desalination plants</li>
                </ul>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h3 className="text-xl font-bold mb-4 text-blue-800">Water Filtration Process</h3>
                <p className="text-gray-600 mb-4">
                  Our state-of-the-art filtration plants ensure that water meets international quality standards before distribution to consumers.
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li>• Multi-stage filtration process</li>
                  <li>• Chlorination for disinfection</li>
                  <li>• Quality testing laboratories</li>
                  <li>• Continuous monitoring systems</li>
                </ul>
              </div>
            </div>
            
            {/* Maps Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h3 className="text-xl font-bold mb-4 text-blue-800">Bulk Water Map</h3>
                <p className="text-gray-600 mb-4">
                  View our comprehensive bulk water distribution network across Karachi.
                </p>
                <a
                  href="https://www.kwsc.gos.pk/assets/images/Bulk_map.jpeg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold"
                >
                  View Bulk Water Map
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h3 className="text-xl font-bold mb-4 text-blue-800">Distribution Map</h3>
                <p className="text-gray-600 mb-4">
                  Explore our water distribution network covering all areas of Karachi.
                </p>
                <a
                  href="https://www.kwsc.gos.pk/assets/images/Distribution_map.jpeg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold"
                >
                  View Distribution Map
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Sewerage Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8 text-blue-900">Sewerage Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h3 className="text-xl font-bold mb-4 text-blue-800">Sewerage Infrastructure</h3>
                <p className="text-gray-600 mb-4">
                  Comprehensive sewerage network covering residential, commercial, and industrial areas across Karachi.
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li>• Extensive sewerage network</li>
                  <li>• Pumping stations</li>
                  <li>• Treatment facilities</li>
                  <li>• Maintenance services</li>
                </ul>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h3 className="text-xl font-bold mb-4 text-blue-800">Sewerage Treatment</h3>
                <p className="text-gray-600 mb-4">
                  Advanced treatment plants ensure proper processing of wastewater before disposal, protecting the environment.
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li>• Primary treatment processes</li>
                  <li>• Secondary treatment systems</li>
                  <li>• Tertiary treatment facilities</li>
                  <li>• Environmental compliance</li>
                </ul>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-xl font-bold mb-4 text-blue-800">Sewerage Map</h3>
              <p className="text-gray-600 mb-4">
                View our comprehensive sewerage network and pumping stations across Karachi.
              </p>
              <a
                href="https://www.kwsc.gos.pk/assets/images/sewerage-map.jpeg"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold"
              >
                View Sewerage Map
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>

          {/* Revenue Resource Generation */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8 text-blue-900">Revenue Resource Generation</h2>
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold mb-4 text-blue-800">Billing & Collection</h3>
                  <p className="text-gray-600 mb-4">
                    Efficient billing system ensuring accurate charges and timely collection of water and sewerage fees.
                  </p>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Online billing system</li>
                    <li>• Multiple payment options</li>
                    <li>• Automated meter reading</li>
                    <li>• Customer service support</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-4 text-blue-800">Connection Services</h3>
                  <p className="text-gray-600 mb-4">
                    Streamlined process for new connections and service modifications.
                  </p>
                  <a
                    href="https://www.kwsc.gos.pk/assets/documents/Connection-Guideline-RRG.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold"
                  >
                    View Connection Guidelines
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            slidesPerView={3}
            spaceBetween={30}
            autoplay={false}
            breakpoints={{
              640: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            navigation
            pagination={{ clickable: true }}
            className="pb-12"
          >
            {services.map((service, index) => (
              <SwiperSlide key={index}>
                <div
                  className={`h-[600px] p-6 rounded-lg shadow-lg transition-all duration-300 relative overflow-hidden bg-gradient-to-br ${service.gradient} bg-opacity-100 card`}
                >
                  <div className="flex flex-col items-center text-center h-full justify-center">
                    <div className="text-6xl mb-4">{service.icon}</div>
                    <h2 className="text-2xl font-bold mb-2">{service.title}</h2>
                    <p className="text-gray-700">{service.description}</p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </>
  );
}