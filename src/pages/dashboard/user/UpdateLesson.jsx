import { useParams } from "react-router-dom";
import LessonForm from "../../../components/lessons/LessonForm";
import useLessons from "../../../hooks/useLessons";

const UpdateLesson = () => {
  const { id } = useParams();
  const { data: lesson, loading } = useLessons(`/api/lessons/my/${id}`);

  if (loading) return <Loader />;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Update Lesson</h1>
      <LessonForm initialData={lesson} isUpdate={true} />
    </div>
  );
};
export default UpdateLesson;
