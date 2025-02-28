
// A simple response database for our voice assistant demo
const responseDatabase = {
  greeting: [
    "Hello, how can I help you today?",
    "Hi there! What can I do for you?",
    "Hello! How may I assist you?",
  ],
  weather: [
    "Currently, it's 72 degrees and sunny outside.",
    "The forecast shows clear skies with a high of 75 degrees.",
    "It's a beautiful day with temperatures around 70 degrees.",
  ],
  time: [
    `It's currently ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.`,
    `The time is ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.`,
  ],
  date: [
    `Today is ${new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}.`,
    `It's ${new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}.`,
  ],
  joke: [
    "Why don't scientists trust atoms? Because they make up everything!",
    "What do you call fake spaghetti? An impasta!",
    "Why did the scarecrow win an award? Because he was outstanding in his field!",
  ],
  music: [
    "I can play your favorite music. What would you like to hear?",
    "I'll start your music playlist now.",
    "Playing your most recent playlist.",
  ],
  unknown: [
    "I'm sorry, I didn't understand that. Could you try again?",
    "I didn't quite catch that. How else can I help you?",
    "I'm not sure I understand. Could you rephrase that?",
  ],
};

/**
 * Processes the user's input and returns an appropriate response
 */
export const processUserInput = (input: string): string => {
  const lowerInput = input.toLowerCase();
  
  // Simple keyword matching
  if (lowerInput.includes("hello") || lowerInput.includes("hi")) {
    return getRandomResponse("greeting");
  } else if (lowerInput.includes("weather")) {
    return getRandomResponse("weather");
  } else if (lowerInput.includes("time")) {
    return getRandomResponse("time");
  } else if (lowerInput.includes("date") || lowerInput.includes("day")) {
    return getRandomResponse("date");
  } else if (lowerInput.includes("joke")) {
    return getRandomResponse("joke");
  } else if (lowerInput.includes("music") || lowerInput.includes("play")) {
    return getRandomResponse("music");
  } else {
    return getRandomResponse("unknown");
  }
};

/**
 * Returns a random response from the given category
 */
export const getRandomResponse = (category: keyof typeof responseDatabase): string => {
  const responses = responseDatabase[category];
  const randomIndex = Math.floor(Math.random() * responses.length);
  return responses[randomIndex];
};

/**
 * Delays execution for the specified amount of time
 */
export const delay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Creates a unique ID
 */
export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};
