import { useEffect, useMemo, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./ScrollReveal.css";

gsap.registerPlugin(ScrollTrigger);

export default function ScrollReveal({
  children,
  enableBlur = true,
  baseOpacity = 0.1,
  baseRotation = 3,
  blurStrength = 4,
  containerClassName = "",
  textClassName = "",
  rotationEnd = "bottom bottom",
  wordAnimationEnd = "bottom bottom"
}) {
  const containerRef = useRef(null);

  const splitText = useMemo(() => {
    const text = Array.isArray(children) ? children.join("") : String(children);
    return text.split(/(\s+|\n)/).map((part, index) => {
      if (part === "\n") {
        return <span className="line-break" key={`br-${index}`} />;
      }
      return (
        <span className="word" key={`${part}-${index}`}>
          {part}
        </span>
      );
    });
  }, [children]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    const words = container.querySelectorAll(".word");

    gsap.fromTo(
      container,
      { rotation: baseRotation, transformOrigin: "0% 50%" },
      {
        rotation: 0,
        ease: "none",
        scrollTrigger: {
          trigger: container,
          start: "top bottom",
          end: rotationEnd,
          scrub: true
        }
      }
    );

    gsap.fromTo(
      words,
      { opacity: baseOpacity },
      {
        opacity: 1,
        stagger: 0.05,
        ease: "none",
        scrollTrigger: {
          trigger: container,
          start: "top bottom-=20%",
          end: wordAnimationEnd,
          scrub: true
        }
      }
    );

    if (enableBlur) {
      gsap.fromTo(
        words,
        { filter: `blur(${blurStrength}px)` },
        {
          filter: "blur(0px)",
          stagger: 0.05,
          ease: "none",
          scrollTrigger: {
            trigger: container,
            start: "top bottom-=20%",
            end: wordAnimationEnd,
            scrub: true
          }
        }
      );
    }

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [baseOpacity, baseRotation, blurStrength, enableBlur, rotationEnd, wordAnimationEnd]);

  return (
    <h2 ref={containerRef} className={`scroll-reveal ${containerClassName}`}>
      <p className={`scroll-reveal-text ${textClassName}`}>{splitText}</p>
    </h2>
  );
}
