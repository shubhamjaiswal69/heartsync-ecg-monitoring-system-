
// Mock patients data
export const patients = [
  { id: "1", name: "John Doe", age: 45, condition: "Arrhythmia" },
  { id: "2", name: "Sarah Johnson", age: 62, condition: "Hypertension" },
  { id: "3", name: "Michael Smith", age: 57, condition: "Post-heart attack" }
];

// Mock ECG data generation function
export const generateECGData = (patternType = "normal", length = 100) => {
  const mockData = [];
  const baseValue = 80;
  
  for (let i = 0; i < length; i++) {
    let value = baseValue;
    
    if (patternType === "normal") {
      if (i % 20 === 0) value += 40;
      else if (i % 20 === 1) value -= 30;
      else if (i % 20 === 5) value += 10;
      else if (i % 20 === 10) value -= 5;
    } 
    else if (patternType === "arrhythmia") {
      if (i % 20 === 0) value += 40;
      else if (i % 20 === 1) value -= 30;
      else if (i % 16 === 0) value += 30;
      else if (i % 20 === 5) value += 10;
    }
    else if (patternType === "tachycardia") {
      if (i % 15 === 0) value += 40;
      else if (i % 15 === 1) value -= 30;
      else if (i % 15 === 4) value += 10;
    }
    
    value += Math.random() * 5;
    mockData.push({ time: i, value });
  }
  return mockData;
};
