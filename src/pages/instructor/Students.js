import { useState, useEffect } from "react";
import { instructorApi } from "../../api/instructorApi";

const InstructorStudents = () => {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterCourse, setFilterCourse] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = filterCourse ? { course_offering: filterCourse } : {};
        const [studentsRes, coursesRes] = await Promise.all([instructorApi.getStudents(params), instructorApi.getCourses()]);
        setStudents(studentsRes.data);
        setCourses(coursesRes.data);
      } catch (err) { console.error("Failed to fetch:", err); }
      finally { setLoading(false); }
    };
    fetchData();
  }, [filterCourse]);

  if (loading) return <div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div></div>;

  return (
    <div className="flex-1 flex flex-col overflow-y-auto p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Students</h1>
        <p className="text-sm text-gray-400">View students across your courses</p>
      </div>

      <div className="mb-4">
        <select value={filterCourse} onChange={(e) => setFilterCourse(e.target.value)} className="px-4 py-2 border border-gray-200 rounded-xl">
          <option value="">All Courses</option>
          {courses.map(c => <option key={c.id} value={c.id}>{c.course_name}</option>)}
        </select>
      </div>

      <div className="space-y-3">
        {students.map(s => (
          <div key={s.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-medium text-gray-800">{s.full_name}</h3>
                <p className="text-sm text-gray-500">{s.email}</p>
                <p className="text-xs text-gray-400">ID: {s.student_id} • GPA: {s.current_gpa}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">{s.enrolled_courses?.length || 0} courses</p>
              </div>
            </div>
          </div>
        ))}
        {students.length === 0 && <p className="text-gray-400 text-center py-8">No students found</p>}
      </div>
    </div>
  );
};

export default InstructorStudents;