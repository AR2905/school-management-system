// components/AttendanceForm.tsx
'use client';

import { MyAttendanceAdd } from '@/lib/actions';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { string } from 'zod';

type AttendanceFormProps = {
  students: any[];
  attendanceList: any[];
  lessonInfo: any;
  lessonId: string;
  role : any
};

export default function AttendanceTableForm({
  students,
  attendanceList,
  lessonInfo,
  lessonId,
  role
}: AttendanceFormProps) {
  const [attendanceData, setAttendanceData] = useState(() => {
    // Initialize the attendance data based on existing attendance records
    return students.reduce((acc, student) => {
      const attendance = attendanceList.find((att) => att.studentId === student.id);
      acc[student.id] = attendance ? attendance.present : false; // Default to false (Absent)
      return acc;
    }, {} as { [key: string]: boolean });
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission
  
    const data = students.map((student) => ({
      studentId: student.id,
      lessonId: Number(lessonId),  // Make sure lessonId is converted to a number
      present: attendanceData[student.id], // Get attendance status from state
      date: lessonInfo?.startTime,  // Ensure lessonInfo?.startTime is a valid date
    }));
  
    try {
      // Submit the data to the database
      const result = await MyAttendanceAdd(data);
      (result.success ? 

        toast.success(result.message) : 
        toast.error(result.message)
      )
      
    } catch (error : any) {
        toast.error(error.message )
        console.log("error is" , error)
      
    } 
     
  };

  

  const handleAttendanceChange = (studentId: string, value: boolean) => {
    setAttendanceData((prevData  : any) => ({
      ...prevData,
      [studentId]: value,
    }));
  };

  return (
    <form onSubmit={handleSubmit}>
      <table className="min-w-full border-collapse">
        <thead>
          <tr className="bg-gray-200"> 
            <th className="border text-md border-gray-300 px-4 py-2 text-left">Name</th>
            <th className="border text-md border-gray-300 px-4 py-2 text-left">Attendance Status</th>
            {
              (role === "teacher" || role ==="admin") &&
              <th className="border text-md border-gray-300 px-4 py-2 text-left">Edit</th>}
          </tr>
        </thead>
        <tbody>
          {students.map((student) => {
            const attendance = attendanceList.find((att) => att.studentId === student.id);
            const isPresent = attendanceData[student.id];
 
            return (
              <tr key={student.id} className="border-b border-gray-300"> 
                <td className={`text-sm px-4 py-2 text-left`}>{student.name} {student?.surname}</td>
                <td className={` ${isPresent ? 'text-green-500' : 'text-red-500'} text-sm px-4 py-2 text-left`}>
                  {isPresent ? 'Present' : 'Absent'}
                </td>
                {
                  (role === "teacher" || role ==="admin") &&
                  <td className="border text-md border-gray-300 px-2 py-2 text-left">
                  <div className="flex space-x-2 justify-around align-center">
                    <button
                      type="button"
                      className={`p-[0.3rem] rounded shadow-md w-full ${isPresent ? 'bg-green-600 text-white transition-all duration-300 ' : 'bg-gray-200 hover:bg-green-400 hover:duration-300'}`}
                      onClick={() => handleAttendanceChange(student.id, true)}
                    >
                      P
                    </button>
                    <button
                      type="button"
                      className={`p-[0.3rem] rounded shadow-md w-full ${!isPresent ? 'bg-red-600 text-white transition-all duration-300 ' : 'bg-gray-200 hover:bg-red-400'} hover:duration-300`}
                      onClick={() => handleAttendanceChange(student.id, false)}
                    >
                      A
                    </button>
                  </div>
                </td>
                }
                
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="btn-box relative flex w-100 justify-end ">
        {(role === "teacher" || role ==="admin") &&<button type="submit" className=" mt-4 bg-blue-400 text-white p-1 transition-all duration-300  hover:bg-blue-600  shadow-md border-2   border-blue-600 rounded-xl">
          Done
        </button>}
      </div>
    </form>
  );
}

