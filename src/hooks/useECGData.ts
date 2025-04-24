
import { useState, useEffect } from 'react';
import { generateECGData } from '@/data/mockEcgData';
import { useToast } from '@/hooks/use-toast';

export const useECGData = () => {
  const [patternType, setPatternType] = useState("normal");
  const [ecgData, setEcgData] = useState(generateECGData(patternType));
  const [isLive, setIsLive] = useState(false);
  const [heartRate, setHeartRate] = useState(75);
  const { toast } = useToast();

  useEffect(() => {
    if (isLive) {
      const interval = setInterval(() => {
        setEcgData(generateECGData(patternType));
        setHeartRate(prev => prev + (Math.random() > 0.5 ? 1 : -1));
      }, 1000);
      
      window.sessionStorage.setItem('doctorEcgInterval', interval.toString());
      
      return () => {
        clearInterval(interval);
        window.sessionStorage.removeItem('doctorEcgInterval');
      };
    }
  }, [isLive, patternType]);

  const handlePatternChange = (value: string) => {
    setPatternType(value);
    setEcgData(generateECGData(value));
    
    if (value === "normal") setHeartRate(72);
    else if (value === "tachycardia") setHeartRate(110);
    else if (value === "arrhythmia") setHeartRate(88);
  };

  const handleLiveToggle = (checked: boolean) => {
    setIsLive(checked);
  };

  return {
    patternType,
    ecgData,
    isLive,
    heartRate,
    handlePatternChange,
    handleLiveToggle
  };
};
