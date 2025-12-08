import LessonTable from "../../../components/dashboard/LessonTable";
import useLessons from "../../../hooks/useLessons";

const ManageLessons = () => {
  const { data: lessons, loading } = useLessons("/api/admin/lessons"); 

  if (loading) return <Loader />;

  const deleteLesson = (id) => {
    console.log(id);

    // API call
  };

  const featureLesson = (id) => {
    console.log(id);

    // API call to feature
  };

  return (
    <LessonTable
      lessons={lessons}
      onDelete={deleteLesson}
      onFeature={featureLesson}
    />
  );
};

export default ManageLessons;
