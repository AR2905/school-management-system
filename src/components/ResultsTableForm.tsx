// components/ResultForm.tsx
'use client';

import { MyAssignmentResultsAdd, MyResultsAdd } from '@/lib/actions';
import { useState } from 'react';
import { toast } from 'react-toastify';

type ResultFormProps = {
  students: any[];
  resultsList: any[];
  lessonInfo: any;
  lessonId: string;
  role: any;
  resultInfo: any,
  assessmentType: any,
  assessmentId:any
};

export default function ResultTableForm({
  students,
  resultsList,
  lessonInfo,
  lessonId,
  role,
  resultInfo,
  assessmentType,
  assessmentId
}: ResultFormProps) {
 

    
  const [resultsData, setResultsData] = useState(() => {
    // Initialize the results data based on existing results records
    return students.reduce((acc, student) => {
      const result = resultsList.find((res) => res.studentId === student.id);
      // Check if resultInfo is null and set default score to 0 if it is
      acc[student.id] = result ? result.score : (resultInfo && resultInfo[student?.id]?.score) || 0;
      return acc;
    }, {} as { [key: string]: number });
  });



 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission

    // Check if lessonInfo?.startTime is greater than today
    if (lessonInfo?.startTime && new Date(lessonInfo.startTime) > new Date()) {
      toast.error(`You can't assign marks to future ${assessmentType}.`);
      return; // Exit the function early
    }

    if(assessmentType === "assignment"){
      const data = students.map((student) => ({
        studentId: student.id,
        assignmentId: Number(assessmentId),  // Ensure lessonId is converted to a number
        score: resultsData[student.id], // Get score from state
        date: lessonInfo?.startTime,  // Ensure lessonInfo?.startTime is a valid date
        type : assessmentType
      }));

      try {
        // Submit the data to the database
        const result = await MyAssignmentResultsAdd(data);
        (result.success ? 
          toast.success(result.message) : 
          toast.error(result.message)
        );
        
      } catch (error: any) {
        toast.error(error.message);
        console.log("error is", error);
      } 
    }
    else {
      const data = students.map((student) => ({
        studentId: student.id,
        examId: Number(assessmentId),  // Ensure lessonId is converted to a number
        score: resultsData[student.id], // Get score from state
        date: lessonInfo?.startTime,  // Ensure lessonInfo?.startTime is a valid date
        type : assessmentType
      }));

      try {
        // Submit the data to the database
        const result = await MyResultsAdd(data);
        (result.success ? 
          toast.success(result.message) : 
          toast.error(result.message)
        );
        
      } catch (error: any) {
        toast.error(error.message);
        console.log("error is", error);
      } 
    }
  
    
  
    
  };

  const handleResultsChange = (studentId: string, value: any) => {
 
    setResultsData((prevData: any) => ({
      ...prevData,
      [studentId]: Number(value), // Ensure value is a number
    }));
  };

  return (
    <form onSubmit={handleSubmit}>
      <table className="min-w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border text-md border-gray-300 px-4 py-2 text-left">ID</th>
            <th className="border text-md border-gray-300 px-4 py-2 text-left">Name</th>
            <th className="border text-md border-gray-300 px-4 py-2 text-left">Score (x/100)</th>
            {
              (role === "teacher" || role === "admin") &&
              <th className="border text-md border-gray-300 px-4 py-2 text-left">Edit</th>
            }
          </tr>
        </thead>
        <tbody>
          {students.map((student) => {
            const score = resultsData[student.id];

            return (
              <tr key={student.id} className="border-b border-gray-300">
                <td className="text-sm px-4 py-2 text-left">{student.id}</td>
                <td className={`text-sm px-4 py-2 text-left`}>{student.name}</td>
                <td className={`text-sm px-4 py-2 text-left`}>
                  {score}
                </td>
                {
                  (role === "teacher" || role === "admin") &&
                  <td className="border text-md border-gray-300 px-2 py-2 text-left">
                    <div className="flex space-x-2 justify-around align-center">
                      <input type="number" name="score" id="score" defaultValue={score} max={100} min={0} onInput={(e) => handleResultsChange(student.id, (e.target as HTMLInputElement).value)} />
                    </div>
                  </td>
                }
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="btn-box relative flex w-100 justify-end ">
        {(role === "teacher" || role === "admin") && <button type="submit" className="mt-4 bg-blue-400 text-white p-1 transition-all duration-300 hover:bg-blue-600 shadow-md border-2 border-blue-600 rounded-xl">
          Done
        </button>}
      </div>
    </form>
  );
}

