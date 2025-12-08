import { createContext, useContext, useState } from "react";

const LessonContext = createContext();

export const useLessons = () => useContext(LessonContext);

export const LessonProvider = ({ children }) => {
  const [lessons, setLessons] = useState([]);

  const addLesson = (lesson) => setLessons([...lessons, lesson]);

  return (
    <LessonContext.Provider value={{ lessons, addLesson }}>
      {children}
    </LessonContext.Provider>
  );
};
