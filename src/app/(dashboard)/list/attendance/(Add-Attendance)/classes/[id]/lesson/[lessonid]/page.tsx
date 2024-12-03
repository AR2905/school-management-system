// app/current-class/page.tsx (or your relevant server component)
 
import AttendanceTableForm from "@/components/AttendanceTableForm";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

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

  return (
    <div className="  bg-white p-4 rounded-md flex-1 m-4 mt-0">
      <h1 className="text-lg font-semibold">Lesson {params.lessonid}</h1>
      <p className="mb-4 text-gray-500">
        {lessonInfo?.startTime.toLocaleDateString()} - {lessonInfo?.day} (
        {lessonInfo?.startTime.toLocaleTimeString()} -{" "}
        {lessonInfo?.endTime.toLocaleTimeString()})
      </p>

      {/* Pass the necessary data to the Client Component */}
      <AttendanceTableForm
     
        students={students}
        attendanceList={attendanceList}
        lessonInfo={lessonInfo}
        lessonId={params.lessonid}
        role = {role}
      />
    </div>
  );
}