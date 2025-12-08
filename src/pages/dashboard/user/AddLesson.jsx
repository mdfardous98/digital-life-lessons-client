import LessonForm from "../../../components/lessons/LessonForm";

const AddLesson = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">Create New Life Lesson</h1>
      <div className="card bg-base-100 shadow-xl p-8">
        <LessonForm />
      </div>
    </div>
  );
};

export default AddLesson;
