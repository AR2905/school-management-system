// app/current-class/page.tsx (or your relevant server component)
 
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";

export default async function CurrentClass({
  params,
}: {
  params: {
    id: string;
    lessonid: string;
  };
}) {
  const { userId, sessionClaims } = auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;
  const currentUserId = userId;

  const attendanceList = await prisma.attendance.findMany({
    where: {
      lessonId: Number(params.lessonid),
    },
  });

  const students = await prisma.student.findMany({
    where: {
      classId: Number(params.id),
    },
  });

  const lessonInfo = await prisma.lesson.findUnique({
    where: {
      id: Number(params.lessonid),
    },
  });

  const assignmentList = await prisma.assignment.findMany({
    where : {
      lessonId : Number(params.lessonid)
    }
  })

  const examList = await prisma.exam.findMany({
    where : {
      lessonId : Number(params.lessonid)
    }
  })


  return (
    <div className="  bg-white p-4 rounded-md flex-1 m-4 mt-0">
      <h1 className="text-lg font-semibold">Lesson {params.lessonid}</h1>
      <p className="mb-4 text-gray-500">
        {lessonInfo?.startTime.toLocaleDateString()} - {lessonInfo?.day} (
        {lessonInfo?.startTime.toLocaleTimeString()} -{" "}
        {lessonInfo?.endTime.toLocaleTimeString()})
      </p>
      
      <h1 className = "mt-8 mb-2 font-xl text-gray-600 font-bold ">Assignments </h1>
      {assignmentList.length === 0 ? (
            <p className="text-red-400 text-sm">No assignments</p>
        ) : (
            <table className="min-w-full border-collapse">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border text-md border-gray-300 px-4 py-2 text-left">ID</th>
                        <th className="border text-md border-gray-300 px-4 py-2 text-left">Name</th>
                        <th className="border text-md border-gray-300 px-4 py-2 text-left">Start Date</th>
                        <th className="border text-md border-gray-300 px-4 py-2 text-left">Due Date</th>
                        <th className="border text-md border-gray-300 px-4 py-2 text-left">Actions</th>


                    </tr>
                </thead>
                <tbody>
                    {assignmentList.map((item, key) =>  
                        <tr key={key} className="border-b border-gray-300">
                            <td className="text-sm px-4 py-2 text-left">{item.id}</td>
                            <td className="text-sm px-4 py-2 text-left">{item.title}</td>
                            <td className="text-sm px-4 py-2 text-left">{item.startDate.toLocaleDateString()}</td>
                            <td className="text-sm px-4 py-2 text-left">{item.dueDate.toLocaleDateString()}</td>
                            <td className="text-sm px-4 py-2 text-left">
                              
                              <Link href={`/list/results/classes/${params.id}/lesson/${params.lessonid}/assignment/${item.id}`} className="p-1 rounded-full text-white hover:bg-blue-500 bg-blue-300 text-center">Score</Link>
                            </td>

                        </tr>
                    )}
                </tbody>
            </table>
        )}

        {/* ================= EXAM  ================= */}

<h1 className = "mt-8 mb-2 font-xl text-gray-600 font-bold ">Exams </h1>

{examList.length === 0 ? (
            <p className="text-red-400 text-sm">No exams</p>
        ) : (
            <table className="min-w-full border-collapse">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border text-md border-gray-300 px-4 py-2 text-left">ID</th>
                        <th className="border text-md border-gray-300 px-4 py-2 text-left">Name</th>
                        <th className="border text-md border-gray-300 px-4 py-2 text-left"> Date</th>
                        <th className="border text-md border-gray-300 px-4 py-2 text-left">Actions</th>

                    </tr>
                </thead>
                <tbody>
                    {examList.map((item, key) =>  
                        <tr key={key} className="border-b border-gray-300">
                        
                            <td className="text-sm px-4 py-2 text-left">{item.id}</td>
                            <td className="text-sm px-4 py-2 text-left">{item.title}</td>
                            <td className="text-sm px-4 py-2 text-left">{item.startTime.toLocaleDateString()}</td>
                            <td className="text-sm px-4 py-2 text-left">
                              
                            <Link href={`/list/results/classes/${params.id}/lesson/${params.lessonid}/exam/${item.id}`} className="p-1 rounded-full text-white hover:bg-blue-500 bg-blue-300 text-center">Score</Link>
                              
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        )}
    
      
      {/* New forms for assignments and exams */}
      {/* <AssignmentTableForm
        assignments={assignmentList}
        lessonId={params.lessonid}
        role={role}
      />
      <ExamTableForm
        exams={examList}
        lessonId={params.lessonid}
        role={role}
      /> */}
    </div>
  );
}
