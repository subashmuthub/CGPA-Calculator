import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { api } from '../../context/AuthContext';
import LoadingSpinner from '../common/LoadingSpinner';

const CGPACalculator = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    semester: 'ODD',
    year: new Date().getFullYear().toString(),
  });
  
  const [courses, setCourses] = useState([
    {
      courseName: '',
      courseCode: '',
      credits: 3,
      grade: 'A',
      gradePoint: 8.0
    }
  ]);
  
  const [gradePointMap, setGradePointMap] = useState({});
  const [availableGrades, setAvailableGrades] = useState([]);
  const [calculatedGPA, setCalculatedGPA] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // Fetch grade point mapping on component mount
  useEffect(() => {
    fetchGradePoints();
  }, []);

  // Calculate GPA whenever courses change
  useEffect(() => {
    calculateGPA();
  }, [courses]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchGradePoints = async () => {
    try {
      const response = await api.get('/cgpa/grade-points');
      if (response.data.success) {
        setGradePointMap(response.data.data.gradePointMap);
        setAvailableGrades(response.data.data.availableGrades);
      }
    } catch (error) {
      toast.error('Failed to fetch grade points');
    } finally {
      setIsInitialLoading(false);
    }
  };

  const calculateGPA = () => {
    const totalPoints = courses.reduce((sum, course) => {
      if (course.courseName.trim() && course.courseCode.trim()) {
        return sum + (course.gradePoint * course.credits);
      }
      return sum;
    }, 0);
    
    const totalCredits = courses.reduce((sum, course) => {
      if (course.courseName.trim() && course.courseCode.trim()) {
        return sum + course.credits;
      }
      return sum;
    }, 0);
    
    const gpa = totalCredits > 0 ? totalPoints / totalCredits : 0;
    setCalculatedGPA(gpa);
  };

  const handleFormChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCourseChange = (index, field, value) => {
    const updatedCourses = [...courses];
    
    if (field === 'grade') {
      updatedCourses[index].grade = value;
      updatedCourses[index].gradePoint = gradePointMap[value] || 0;
    } else {
      updatedCourses[index] = {
        ...updatedCourses[index],
        [field]: value
      };
    }
    
    setCourses(updatedCourses);
  };

  const addCourse = () => {
    setCourses(prev => [...prev, {
      courseName: '',
      courseCode: '',
      credits: 3,
      grade: 'A',
      gradePoint: gradePointMap['A'] || 8.0
    }]);
  };

  const removeCourse = (index) => {
    if (courses.length > 1) {
      setCourses(prev => prev.filter((_, i) => i !== index));
    }
  };

  const validateForm = (): boolean => {
    // Check semester and year
    if (!formData.semester || !formData.year) {
      toast.error('Please select semester and year');
      return false;
    }

    // Check if year is valid
    const currentYear = new Date().getFullYear();
    const year = parseInt(formData.year);
    if (year < 2000 || year > currentYear + 5) {
      toast.error('Please enter a valid year');
      return false;
    }

    // Check courses
    const validCourses = courses.filter(course => 
      course.courseName.trim() && course.courseCode.trim()
    );

    if (validCourses.length === 0) {
      toast.error('Please add at least one complete course');
      return false;
    }

    // Validate each course
    for (let i = 0; i < courses.length; i++) {
      const course = courses[i];
      if (course.courseName.trim() || course.courseCode.trim()) {
        if (!course.courseName.trim()) {
          toast.error(`Course name is required for course ${i + 1}`);
          return false;
        }
        if (!course.courseCode.trim()) {
          toast.error(`Course code is required for course ${i + 1}`);
          return false;
        }
        if (course.credits <= 0 || course.credits > 10) {
          toast.error(`Credits must be between 0.5 and 10 for course ${i + 1}`);
          return false;
        }
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const validCourses = courses.filter(course => 
      course.courseName.trim() && course.courseCode.trim()
    );

    setIsLoading(true);

    try {
      const response = await api.post('/cgpa/record', {
        semester: formData.semester,
        year: formData.year,
        courses: validCourses
      });

      if (response.data.success) {
        toast.success('CGPA record saved successfully!');
        navigate('/dashboard');
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to save CGPA record';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      semester: 'ODD',
      year: new Date().getFullYear().toString(),
    });
    setCourses([{
      courseName: '',
      courseCode: '',
      credits: 3,
      grade: 'A',
      gradePoint: gradePointMap['A'] || 8.0
    }]);
  };

  if (isInitialLoading) {
    return <LoadingSpinner size="large" message="Loading calculator..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-card p-8 space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">CGPA Calculator</h1>
            <p className="text-gray-600">Enter your semester courses and grades to calculate your GPA</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Semester and Year Selection */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Semester Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="semester" className="block text-sm font-medium text-gray-700 mb-2">
                    Semester
                  </label>
                  <select
                    id="semester"
                    value={formData.semester}
                    onChange={(e) => handleFormChange('semester', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  >
                    <option value="ODD">ODD Semester</option>
                    <option value="EVEN">EVEN Semester</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-2">
                    Year
                  </label>
                  <input
                    type="number"
                    id="year"
                    value={formData.year}
                    onChange={(e) => handleFormChange('year', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    min="2000"
                    max={new Date().getFullYear() + 5}
                  />
                </div>
              </div>
            </div>

            {/* Courses Section */}
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Courses</h3>
                <button
                  type="button"
                  onClick={addCourse}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-colors"
                >
                  + Add Course
                </button>
              </div>

              <div className="space-y-4">
                {courses.map((course, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-6">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-sm font-medium text-gray-700">Course {index + 1}</span>
                      {courses.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeCourse(index)}
                          className="text-red-500 hover:text-red-700 p-1 transition-colors"
                          title="Remove course"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Course Name</label>
                        <input
                          type="text"
                          value={course.courseName}
                          onChange={(e) => handleCourseChange(index, 'courseName', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          placeholder="e.g., Data Structures"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Course Code</label>
                        <input
                          type="text"
                          value={course.courseCode}
                          onChange={(e) => handleCourseChange(index, 'courseCode', e.target.value.toUpperCase())}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          placeholder="e.g., CS201"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Credits</label>
                        <input
                          type="number"
                          value={course.credits}
                          onChange={(e) => handleCourseChange(index, 'credits', parseFloat(e.target.value) || 0)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          min="0.5"
                          max="10"
                          step="0.5"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Grade</label>
                        <select
                          value={course.grade}
                          onChange={(e) => handleCourseChange(index, 'grade', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        >
                          {availableGrades.map(grade => (
                            <option key={grade} value={grade}>
                              {grade} ({gradePointMap[grade]?.toFixed(1)})
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* GPA Display */}
            <div className="text-center bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Calculated GPA</h3>
              <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-2">
                {calculatedGPA.toFixed(2)}
              </div>
              <p className="text-gray-600">Out of 10.00</p>
            </div>

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                Reset
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : 'Save Record'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CGPACalculator;