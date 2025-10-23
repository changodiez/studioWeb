import { useEffect, useRef } from 'react';

const useHorizontalScroll = () => {
  const elRef = useRef();
  
  useEffect(() => {
    const el = elRef.current;
    if (el) {
      const onWheel = (e) => {
        if (e.deltaY === 0) return;
        
        // Prevenir scroll vertical
        e.preventDefault();
        
        // Usar el scroll horizontal basado en el scroll vertical
        el.scrollTo({
          left: el.scrollLeft + e.deltaY * 2,
          behavior: 'smooth'
        });
      };

      el.addEventListener('wheel', onWheel, { passive: false });
      
      return () => el.removeEventListener('wheel', onWheel);
    }
  }, []);

  return elRef;
};

export default useHorizontalScroll;