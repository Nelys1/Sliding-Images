import React, { useEffect, useState } from 'react';
import { Mouse } from 'lucide-react';

interface ScrollProgress {
  progress: number;
  isComplete: boolean;
}

function App() {
  const [scrollProgress, setScrollProgress] = useState<ScrollProgress>({
    progress: 0,
    isComplete: false
  });

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.min(scrollTop / docHeight, 1);
      
      setScrollProgress({
        progress,
        isComplete: progress >= 0.95
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial call

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getImageTransform = (index: number) => {
    const { progress } = scrollProgress;
    
    // Initial positions for each image (x%, y%)
    const initialPositions = [
      { x: -500, y: -200 }, // top-left
      { x: -75, y: -200 },  // top-center-left
      { x: 200, y: 0 },     // center-right
      { x: 500, y: -200 },  // top-right
      { x: -500, y: 100 },  // bottom-left
      { x: -200, y: 0 },    // center-left
      { x: 75, y: 200 },    // bottom-center
      { x: 500, y: 200 }    // bottom-right
    ];

    const pos = initialPositions[index];
    
    // Animation starts at 15% scroll and completes at 100%
    const animationStart = 0.15;
    const animationProgress = progress < animationStart 
      ? 0 
      : Math.min((progress - animationStart) / (1 - animationStart), 1);
    
    const currentX = pos.x * (1 - animationProgress);
    const currentY = pos.y * (1 - animationProgress);
    
    return `translate(${currentX}%, ${currentY}%)`;
  };

  const getCenterTransform = () => {
    const { progress } = scrollProgress;
    
    // Center element shrinks and moves during scroll
    let width = 600;
    let translateX = -250;
    let translateY = -250;
    let textOpacity = 1;
    let mouseRotate = 0;
    
    if (progress >= 0.25 && progress < 0.65) {
      width = 300;
      translateX = -100;
      translateY = -100;
      textOpacity = 0;
    } else if (progress >= 0.65) {
      const finalProgress = (progress - 0.65) / 0.35;
      width = 300 - (200 * finalProgress);
      translateX = -100 + (100 * finalProgress);
      translateY = -100 + (100 * finalProgress);
      textOpacity = 0;
      mouseRotate = 180 * Math.min(finalProgress / 0.8, 1);
    }
    
    return {
      width: `${width}px`,
      transform: `translate(${translateX}px, ${translateY}px)`,
      textOpacity,
      mouseRotate
    };
  };

  const images = [
    'https://picsum.photos/id/943/800/600',
    'https://picsum.photos/id/553/800/600',
    'https://picsum.photos/id/380/800/600',
    'https://picsum.photos/id/1072/800/600',
    'https://picsum.photos/id/824/800/600',
    'https://picsum.photos/id/820/800/600',
    'https://picsum.photos/id/702/800/600',
    'https://picsum.photos/id/883/800/600'
  ];

  const centerStyles = getCenterTransform();

  return (
    <div className="min-h-[500vh] bg-gray-900">
      {/* Browser Support Message */}
      <div className="fixed top-0 left-0 right-0 bg-red-600 text-white text-center py-4 px-6 z-50 hidden">
        <p>Sorry, your browser does not support <code>animation-timeline</code></p>
      </div>

      {/* Fixed Grid Container */}
      <div className="fixed inset-0 w-full h-screen">
        <div className="grid grid-cols-15 grid-rows-3 gap-4 w-full h-full p-4" style={{
          gridTemplateColumns: 'repeat(7, 1fr) 100px repeat(7, 1fr)',
          gridTemplateRows: '1fr 100px 1fr',
          gridTemplateAreas: `
            "one one one two two two two center three three three three four four four"
            "one one one six six six six center three three three three eight eight eight"
            "five five five six six six six seven seven seven seven seven eight eight eight"
          `
        }}>
          
          {/* Image Elements */}
          {images.map((src, index) => {
            const gridAreas = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight'];
            return (
              <div
                key={index}
                className="bg-cover bg-center transition-transform duration-100 ease-linear rounded-lg overflow-hidden"
                style={{
                  gridArea: gridAreas[index],
                  backgroundImage: `url(${src})`,
                  transform: getImageTransform(index)
                }}
              />
            );
          })}

          {/* Center Element */}
          <div
            className="bg-gray-800 text-white flex flex-col items-center justify-center rounded-lg transition-all duration-100 ease-linear relative"
            style={{
              gridArea: 'center',
              width: centerStyles.width,
              aspectRatio: '1',
              transform: centerStyles.transform,
              backgroundImage: 'url(https://picsum.photos/id/876/600/600)',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            {/* Text Content */}
            <div 
              className="text-center transition-opacity duration-300"
              style={{ opacity: centerStyles.textOpacity }}
            >
              <h1 className="text-4xl font-light mb-2">Sliding Images</h1>
              <p className="text-lg font-light">Scroll to reveal the images</p>
            </div>

            {/* Mouse Icon */}
            <div 
              className="absolute bottom-12 left-1/2 transition-transform duration-300"
              style={{ 
                transform: `translateX(-50%) translateY(50%) rotate(${centerStyles.mouseRotate}deg)` 
              }}
            >
              <Mouse 
                size={40} 
                className="text-white animate-bounce"
                strokeWidth={2}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="fixed bottom-8 right-8 z-10">
        <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
          <div className="text-white text-sm font-light">
            Scroll: {Math.round(scrollProgress.progress * 100)}%
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;