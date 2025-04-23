
import { useEffect, useState } from 'react';

export const useChartDimensions = () => {
  const [dimensions, setDimensions] = useState({
    width: 0,
    height: 300
  });

  useEffect(() => {
    const updateDimensions = () => {
      const chartContainer = document.querySelector('.chart-container');
      if (chartContainer) {
        setDimensions({
          width: chartContainer.clientWidth,
          height: 300
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  return dimensions;
};
