"use server";

import { revalidatePath } from "next/cache";
import {
  AnnouncementSchema,
  AssignmentSchema,
  AttendanceSchema,
  ClassSchema,
  CustomFieldSchema,
  EventSchema,
  ExamSchema,
  LessonSchema,
  ParentSchema,
  ResultSchema,
  StudentSchema,
  SubjectSchema,
  TeacherSchema,
} from "./formValidationSchemas";
import prisma from "./prisma";
import { clerkClient } from "@clerk/nextjs/server";
import {   Day, UserType } from "@prisma/client";
 

type CurrentState = { success: boolean; error: boolean };

export const createSubject = async (
  currentState: CurrentState,
  data: SubjectSchema
) => {
  try {
    console.log("DATA --" ,data )
    const createdSubject = await prisma.subject.create({
      data: {
        name: data.name,
        teachers: {
          connect: data.teachers.map((teacherId) => ({ id: teacherId })),
        },
      },
    });
    await EntryCreation(data, "Subject", createdSubject?.id)
 
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const updateSubject = async (
  currentState: CurrentState,
  data: SubjectSchema
) => {
  try {
    await prisma.subject.update({
      where: {
        id: Number(data.id),
      },
      data: {
        name: data.name,
        teachers: {
          set: data.teachers.map((teacherId) => ({ id: teacherId })),
        },
      },
    });

    console.log("UPDATION DATA" , data)

    await EntryUpdation(data, "Subject", data?.id)
 
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const deleteSubject = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;
  try {
    await prisma.subject.delete({
      where: {
        id: parseInt(id),
      },
    });
 
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const createClass = async (
  currentState: CurrentState,
  data: ClassSchema
) => {
  try {
    console.log("DATA"  , data)
    const CreatedClass = await prisma.class.create({
      data : {
        supervisorId: data?.supervisorId,
        gradeId: Number(data?.gradeId),
        name: data?.name,
        capacity: Number(data?.capacity), 
      },
    });

     
    await EntryCreation(data, "Classes", CreatedClass?.id)
 
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const updateClass = async (
  currentState: CurrentState,
  data: ClassSchema
) => {
  try {
    await prisma.class.update({
      where: {
        id: Number(data.id),
      },
      data : {
        supervisorId: data?.supervisorId,
        gradeId: Number(data?.gradeId),
        name: data?.name,
        capacity: Number(data?.capacity), 
      },
    });

    await EntryUpdation(data, "Classes", data?.id) 
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const deleteClass = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;
  try {
    await prisma.class.delete({
      where: {
        id: parseInt(id),
      },
    }); 
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const createTeacher = async (
  currentState: CurrentState,
  data: TeacherSchema
) => {



  try {
    const user = await clerkClient.users.createUser({
      username: data.username,
      password: data.password,
      firstName: data.name,
      lastName: data.surname,
      publicMetadata: { role: "teacher" }
    });

    await prisma.teacher.create({
      data: {
        id: user.id,
        username: data.username,
        name: data.name,
        surname: data.surname,
        email: data.email || null,
        phone: data.phone || null,
        address: data.address,
        img: data.img || null,
        bloodType: data.bloodType,
        sex: data.sex,
        birthday: new Date(data.birthday),
        subjects: {
          connect: data.subjects?.map((subjectId: string) => ({
            id: parseInt(subjectId),
          })),
        }
      },
    });


    await EntryCreation(data, "Teacher", user?.id)
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const updateTeacher = async (
  currentState: CurrentState,
  data: TeacherSchema
) => {

  if (!data.id) {
    return { success: false, error: true };
  }
  try {
    const user = await clerkClient().users.updateUser(data.id, {
      username: data.username,
      ...(data.password !== "" && { password: data.password }),
      firstName: data.name,
      lastName: data.surname,
    });

    await prisma.teacher.update({
      where: {
        id: data.id,
      },
      data: {
        ...(data.password !== "" && { password: data.password }),
        username: data.username,
        name: data.name,
        surname: data.surname,
        email: data.email || null,
        phone: data.phone || null,
        address: data.address,
        img: data.img || null,
        bloodType: data.bloodType,
        sex: data.sex,
        birthday: new Date(data.birthday),
        subjects: {
          set: data.subjects?.map((subjectId: string) => ({
            id: parseInt(subjectId),
          })),
        },
      },
    });

    await EntryUpdation(data, "Teacher", data?.id)
    // revalidatePath("/list/teachers");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const deleteTeacher = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;
  try {
    await clerkClient.users.deleteUser(id);

    await prisma.teacher.delete({
      where: {
        id: id,
      },
    });

    // revalidatePath("/list/teachers");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const createStudent = async (
  currentState: CurrentState,
  data: StudentSchema
) => {
  try {
    const classItem = await prisma.class.findUnique({
      where: { id: Number(data.classId) },
      include: { _count: { select: { students: true } } },
    });

    if (classItem && classItem.capacity === classItem._count.students) {
      return { success: false, error: true };
    }

    const user = await clerkClient.users.createUser({
      username: data.username,
      password: data.password,
      firstName: data.name,
      lastName: data.surname,
      publicMetadata: { role: "student" }
    });

    await prisma.student.create({
      data: {
        id: user.id,
        username: data.username,
        name: data.name,
        surname: data.surname,
        email: data.email || null,
        phone: data.phone || null,
        address: data.address,
        img: data.img || null,
        bloodType: data.bloodType,
        sex: data.sex,
        birthday: new Date(data.birthday),
        gradeId: Number(data.gradeId),
        classId: Number(data.classId),
        parentId: data.parentId,
      },
    });

    await EntryCreation(data, "Student", user?.id)
    // revalidatePath("/list/students");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const updateStudent = async (
  currentState: CurrentState,
  data: StudentSchema
) => {
  if (!data.id) {
    return { success: false, error: true };
  }
  try {
    const user = await clerkClient.users.updateUser(data.id, {
      username: data.username,
      ...(data.password !== "" && { password: data.password }),
      firstName: data.name,
      lastName: data.surname,
    });

    await prisma.student.update({
      where: {
        id: data.id,
      },
      data: {
        ...(data.password !== "" && { password: data.password }),
        username: data.username,
        name: data.name,
        surname: data.surname,
        email: data.email || null,
        phone: data.phone || null,
        address: data.address,
        img: data.img || null,
        bloodType: data.bloodType,
        sex: data.sex,
        birthday: new Date(data.birthday),
        gradeId: Number(data.gradeId),
        classId: Number(data.classId),
        parentId: data.parentId,
      },
    });
    // revalidatePath("/list/students");
    await EntryUpdation(data, "Student", data?.id)
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const deleteStudent = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;
  try {
    await clerkClient.users.deleteUser(id);

    await prisma.student.delete({
      where: {
        id: id,
      },
    });

    // revalidatePath("/list/students");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const createExam = async (
  currentState: CurrentState,
  data: ExamSchema
) => {
 
  try {
  
    const Currlesson = await prisma.lesson.findUnique({
      where: {
        id: Number(data.lessonId)
      }
    })

    const CreatedExam  = await prisma.exam.create({
      data: {
        title: data.title,
        startTime: Currlesson!?.startTime,
        endTime: Currlesson!?.endTime,
        lessonId: Number(data.lessonId),
      },
    });

    // revalidatePath("/list/subjects");

    console.log("////////" ,)
    await EntryCreation(data, "Exam", CreatedExam?.id)

    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const updateExam = async (
  currentState: CurrentState,
  data: ExamSchema
) => { 
  try { 

    const Currlesson = await prisma.lesson.findUnique({
      where: {
        id: Number(data.lessonId)
      }
    })

    await prisma.exam.update({
      where: {
        id: Number(data.id),
      },
      data: {
        title: data.title,
        startTime: Currlesson!?.startTime,
        endTime: Currlesson!?.endTime,
        lessonId: Number(data.lessonId),
      },
    });

    // revalidatePath("/list/subjects");

    await EntryUpdation(data, "Exam", data?.id)

    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const deleteExam = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;

  // const { userId, sessionClaims } = auth();
  // const role = (sessionClaims?.metadata as { role?: string })?.role;

  try {
    await prisma.exam.delete({
      where: {
        id: parseInt(id),
        // ...(role === "teacher" ? { lesson: { teacherId: userId! } } : {}),
      },
    });

    // revalidatePath("/list/subjects");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};


export const createEvent = async (
  currentState: CurrentState,
  data: EventSchema
) => {

  try {

    const createdEvent = await prisma.event.create({
      data: {
        title: data.title,
        description: data.description,
        startTime: new Date(data.startTime),
        endTime: new Date(data.endTime),
        classId: Number(data?.classId) || null
      },
    });

    await EntryCreation(data, "Event", createdEvent?.id)
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const updateEvent = async (
  currentState: CurrentState,
  data: EventSchema
) => {

  try {


    await prisma.event.update({
      where: {
        id: Number(data.id),
      },
      data: {
        title: data.title,
        startTime: new Date(data.startTime),
        endTime: new Date(data.endTime),
        description: data.description,
        classId: Number(data?.classId) || null
      },
    });

    await EntryUpdation(data, "Event", data?.id)


    // revalidatePath("/list/subjects");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const deleteEvent = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;
 
  try {
    await prisma.event.delete({
      where: {
        id: parseInt(id), 
      },
    });

    // revalidatePath("/list/subjects");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};



export const createAnnouncement = async (
  currentState: CurrentState,
  data: AnnouncementSchema
) => {

  try {

    const createdAnnouncement = await prisma.announcement.create({
      data: {
        title: data.title,
        description: data.description,
        date: new Date(data.date),
        classId: Number(data?.classId) || null
      },
    });

    await EntryCreation(data, "Announcement", createdAnnouncement?.id)


    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const updateAnnouncement = async (
  currentState: CurrentState,
  data: AnnouncementSchema
) => {

  try {
    if (!data.id) {
      throw new Error("Announcement ID is missing.");
    }

    await prisma.announcement.update({
      where: {
        id: Number(data.id),
      },
      data: {
        title: data.title,
        date: new Date(data.date),
        description: data.description,
        classId: Number(data?.classId) || null
      },
    }); 

    await EntryUpdation(data, "Announcement", data?.id)

    return { success: true, error: false };
  } catch (err: any) {
    console.error("Error updating announcement:", err);
    return { success: false, error: true, message: err.message };
  }
};

export const deleteAnnouncement = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;
 
  try {
    await prisma.announcement.delete({
      where: {
        id: parseInt(id), 
      },
    });
 
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};


export const createParent = async (
  currentState: CurrentState,
  data: ParentSchema
) => {

  try {
    const user = await clerkClient.users.createUser({
      username: data.username,
      password: data.password,
      firstName: data.name,
      lastName: data.surname,
      publicMetadata: { role: "parent" }
    });

    await prisma.parent.create({
      data: {
        id: user.id,
        username: data.username,
        name: data.name,
        surname: data.surname,
        email: data.email || "",
        phone: data.phone || "",
        address: data.address,

      },
    });

    // revalidatePath("/list/teachers");
    await EntryCreation(data, "Parent", user?.id)
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const updateParent = async (
  currentState: CurrentState,
  data: ParentSchema
) => {
  if (!data.id) {
    return { success: false, error: true };
  }
  try {
    const user = await clerkClient.users.updateUser(data.id, {
      username: data.username,
      ...(data.password !== "" && { password: data.password }),
      firstName: data.name,
      lastName: data.surname,
    });

    await prisma.parent.update({
      where: {
        id: data.id,
      },
      data: {
        ...(data.password !== "" && { password: data.password }),
        username: data.username,
        name: data.name,
        surname: data.surname,
        email: data.email || null,
        phone: data.phone || "",
        address: data.address,
        // subjects: {
        //   set: data.subjects?.map((subjectId: string) => ({
        //     id: parseInt(subjectId),
        //   })),
        // },
      },
    });
    // revalidatePath("/list/teachers");
    await EntryUpdation(data, "Parent", data?.id)

    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const deleteParent = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;
  try {
    await clerkClient.users.deleteUser(id);

    await prisma.parent.delete({
      where: {
        id: id,
      },
    });

    // revalidatePath("/list/teachers");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const createLesson = async (
  currentState: CurrentState,
  data: LessonSchema
) => {
  try {

    // Convert startTime and endTime to Date objects
    const startDate = new Date(data.startTime);
    const endDate = new Date(data.endTime);

    // Convert to UTC ISO format
    const startTimeUTC = startDate.toISOString(); // Returns ISO string in UTC format
    const endTimeUTC = endDate.toISOString();     // Returns ISO string in UTC format



    // Get the day of the week in uppercase (for validation against weekends)
    const day = startDate.toLocaleString('en-US', { weekday: 'long' }).toUpperCase();

    if (day === 'SATURDAY' || day === 'SUNDAY') {
      throw new Error('Lessons cannot be scheduled on Saturday or Sunday.');
    }

    // Check for conflicting lessons (same day, same class, and teacher)
    const conflictingLesson = await prisma.lesson.findFirst({
      where: {
        day: day as Day,
        classId: parseInt(data.classId),
        teacherId: data.teacherId,
        OR: [
          {
            startTime: {
              lt: new Date(endTimeUTC), // If the new start time is before the existing lesson ends
            },
            endTime: {
              gt: new Date(startTimeUTC), // If the new end time is after the existing lesson starts
            },
          },
        ],
      },
    });

    if (conflictingLesson) {

      throw new Error('Time conflicts');


    }

    // Create the lesson if no conflicts
    const createdLesson = await prisma.lesson.create({
      data: {
        name: data.name,
        day: day as Day, // Use calculated day
        subjectId: parseInt(data.subjectId),
        classId: parseInt(data.classId),
        teacherId: data.teacherId,
        startTime: startTimeUTC, // Store in UTC
        endTime: endTimeUTC,     // Store in UTC
      },
    });
    await EntryCreation(data, "Lesson", createdLesson ?.id)

    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};


export const updateLesson = async (
  currentState: CurrentState,
  data: LessonSchema
) => {

  try {
    const date = new Date(data.startTime);
    const day = date.toLocaleString('en-US', { weekday: 'long' }).toUpperCase(); // Get day as string


    if (day === 'SATURDAY' || day === 'SUNDAY') {
      throw new Error('Lessons cannot be scheduled on Saturday or Sunday.');
    }


    await prisma.lesson.update({
      where: {
        id: Number(data.id),
      },
      data: {
        name: data.name,
        day: day as Day, // Ensure data.day is of type Day
        subjectId: parseInt(data.subjectId),
        classId: parseInt(data.classId),
        teacherId: data.teacherId,
        startTime: data.startTime,
        endTime: data.endTime,
      },
    });

    await EntryUpdation(data, "Lesson", data?.id)


    // revalidatePath("/list/subjects");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const deleteLesson = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;

  // const { userId, sessionClaims } = auth();
  // const role = (sessionClaims?.metadata as { role?: string })?.role;

  try {
    await prisma.lesson.delete({
      where: {
        id: parseInt(id),
        // ...(role === "teacher" ? { lesson: { teacherId: userId! } } : {}),
      },
    });

    // revalidatePath("/list/subjects");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};


export const createAssignment = async (
  currentState: CurrentState,
  data: AssignmentSchema
) => {
  // const { userId, sessionClaims } = auth();
  // const role = (sessionClaims?.metadata as { role?: string })?.role;

  try {
    // if (role === "teacher") {
    //   const teacherLesson = await prisma.lesson.findFirst({
    //     where: {
    //       teacherId: userId!,
    //       id: data.lessonId,
    //     },
    //   });

    //   if (!teacherLesson) {
    //     return { success: false, error: true };
    //   }
    // }

    const Currlesson = await prisma.lesson.findUnique({
      where: {
        id: Number(data.lessonId)
      }
    })

   const createdAssignment =  await prisma.assignment.create({
      data: {
        title: data.title,
        startDate: Currlesson!?.startTime,
        dueDate: new Date(data.dueDate),
        lessonId: Number(data.lessonId),
      },
    });



    console.log("//////// ----" ,  createdAssignment )
    await EntryCreation(data, "Assignment", createdAssignment?.id)

    // revalidatePath("/list/subjects");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const updateAssignment = async (
  currentState: CurrentState,
  data: AssignmentSchema
) => {
  // const { userId, sessionClaims } = auth();
  // const role = (sessionClaims?.metadata as { role?: string })?.role;

  try {
    // if (role === "teacher") {
    //   const teacherLesson = await prsma.lesson.findFirst({
    //     where: {
    //       teacherId: userId!,
    //       id: data.lessonId,
    //     },
    //   });

    //   if (!teacherLesson) {
    //     return { success: false, error: true };
    //   }
    // }
    const Currlesson = await prisma.lesson.findUnique({
      where: {
        id: Number(data.lessonId)
      }
    })
    await prisma.assignment.update({
      where: {
        id: Number(data.id),
      },
      data: {
        title: data.title,
        startDate: Currlesson!?.startTime,
        dueDate: new Date(data.dueDate),
        lessonId: Number(data.lessonId),
      },
    });

    console.log("------ === =====" )
    await EntryUpdation(data, "Assignment", data?.id)


    // revalidatePath("/list/subjects");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const deleteAssignment = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;

  // const { userId, sessionClaims } = auth();
  // const role = (sessionClaims?.metadata as { role?: string })?.role;

  try {
    await prisma.assignment.delete({
      where: {
        id: parseInt(id),
        // ...(role === "teacher" ? { lesson: { teacherId: userId! } } : {}),
      },
    });

    // revalidatePath("/list/subjects");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};



export const createAttendance = async (
  currentState: CurrentState,
  data: AttendanceSchema
) => {


  const lesson = await prisma.lesson.findUnique({
    where: {
      id: Number(data.lessonId)
    }
  })

  const Time = new Date(lesson?.startTime ? lesson.startTime : "");




  try {

    await prisma.attendance.create({
      data: {
        date: Time,
        present: data.present,
        studentId: data.studentId,
        lessonId:  Number(data.lessonId)
      },
    });

    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

// ======== TODO =========
export const updateAttendance = async (
  currentState: CurrentState,
  data: AttendanceSchema
) => {

  try {

    const lesson = await prisma.lesson.findUnique({
      where: {
        id: Number(data.lessonId)
      }
    })

    const Time = new Date(lesson?.startTime ? lesson.startTime : "");




    await prisma.attendance.update({
      where: {
        id: data.id,
      },
      data: {
        date: Time,
        present: data.present,
        studentId: data.studentId,
        lessonId: data.lessonId
      },
    });

    // revalidatePath("/list/subjects");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const deleteAttendance = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;

  // const { userId, sessionClaims } = auth();
  // const role = (sessionClaims?.metadata as { role?: string })?.role;

  try {
    await prisma.attendance.delete({
      where: {
        id: parseInt(id),
        // ...(role === "teacher" ? { lesson: { teacherId: userId! } } : {}),
      },
    });

    // revalidatePath("/list/subjects");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};



export const createResult = async (
  currentState: CurrentState,
  data: ResultSchema
) => {
  try {

    await prisma.result.create({
      data: {
        score: data.score,
        examId: data.examId,
        // assessmentId : data.assessmentId,
        studentId: data.studentId
      },
    });

    // revalidatePath("/list/subjects");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const updateResult = async (
  currentState: CurrentState,
  data: ResultSchema
) => {
  // const { userId, sessionClaims } = auth();
  // const role = (sessionClaims?.metadata as { role?: string })?.role;

  try {

    await prisma.result.update({
      where: {
        id: data.id,
      },
      data: {
        score: Number(data.score),
      },
    });

    // revalidatePath("/list/subjects");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const deleteResult = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;

  // const { userId, sessionClaims } = auth();
  // const role = (sessionClaims?.metadata as { role?: string })?.role;

  try {
    await prisma.result.delete({
      where: {
        id: parseInt(id),
        // ...(role === "teacher" ? { lesson: { teacherId: userId! } } : {}),
      },
    });

    // revalidatePath("/list/subjects");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};
export const MyAttendanceAdd = async (attendanceData: any[]) => {
  let flag = 0
  try {
    const updatePromises = attendanceData.map(async (attendance) => {
      const existingRecord = await prisma.attendance.findFirst({
        where: {
          studentId: attendance.studentId,
          lessonId: attendance.lessonId,
        },
      });

      const Today = new Date()
      if (attendance.date > Today) {
        flag = 1
        throw new Error("You can't see the future")

      }
      if (existingRecord) {
        // If the attendance record exists, update the 'present' status
        return prisma.attendance.update({
          where: {
            id: existingRecord.id, // Update based on the existing record's ID
          },
          data: {
            present: attendance.present,
            date: attendance.date, // Update the date if necessary
          },
        });
      } else {
        // If no record exists, insert a new one
        return prisma.attendance.create({
          data: attendance,
        });
      }
    });

    // Wait for all promises to complete
    await Promise.all(updatePromises);

    return { success: true, message: 'Successful ' };
  } catch (error) {
    console.error('Error while adding/updating attendance:', error);
    if (flag = 1) {

      throw new Error("You can't assign the attendance for future dates.");
    }
    else {
      throw new Error('Error adding/updating attendance');

    }
  }
};



export const MyResultsAdd = async (resultsData: any[]) => {
  try {
    const createPromises = resultsData.map(async (result) => {
      // Check if the result already exists for the student and exam
      const existingResult = await prisma.result.findFirst({
        where: {
          studentId: result.studentId,
          examId: result.examId,
        },
      });

      if (existingResult) {
        // If the result record exists, update the score
        return prisma.result.update({
          where: {
            id: existingResult.id, // Update based on the existing record's ID
          },
          data: {
            score: Number(result.score), // Ensure score is a number
          },
        });
      } else {
        // If no record exists, insert a new one
        return prisma.result.create({
          data: {
            score: Number(result.score), // Ensure score is a number
            examId: result.examId,
            studentId: result.studentId,
          },
        });
      }
    });

    // Wait for all promises to complete
    await Promise.all(createPromises);

    return { success: true, message: 'Results added/updated successfully.' };
  } catch (error) {
    console.error('Error while adding/updating results:', error);
    throw new Error('Error adding/updating results');
  }
};

export const MyAssignmentResultsAdd: any = async (assignmentResultsData: any[]) => {
  try {
    const createPromises = assignmentResultsData.map(async (result) => {
      // Check if the assignment result already exists for the student and assignment
      const existingResult = await prisma.result.findFirst({
        where: {
          studentId: result.studentId,
          assignmentId: Number(result.assignmentId),
        },
      });

      if (existingResult) {
        // If the result record exists, update the score
        return prisma.result.update({
          where: {
            id: existingResult.id, // Update based on the existing record's ID
          },
          data: {
            score: Number(result.score), // Ensure score is a number
          },
        });
      } else {
        // If no record exists, insert a new one
        return prisma.result.create({
          data: {
            score: Number(result.score), // Ensure score is a number
            assignmentId: Number(result.assignmentId),
            studentId: result.studentId,
          },
        });
      }
    });

    // Wait for all promises to complete
    await Promise.all(createPromises);

    return { success: true, message: 'Assignment results added/updated successfully.' };
  } catch (error) {
    console.error('Error while adding/updating assignment results:', error);
    throw new Error('Error adding/updating assignment results');
  }
};

export const createCustom = async (
  currentState: CurrentState,
  data: any
) => {
  try {
    const customFields: any = data.customFields; // Extract customFields from data

    // Process each custom field
    for (const field of customFields) {
      if (field.id) {
        // If the field has an id, update it
        await prisma.customField.update({
          where: {
            id: parseInt(field.id), // Ensure id is an integer
          },
          data: {
            fieldName: field.fieldName!.trim(),
            fieldType: field.fieldType!,
            moduleType: data.moduleType!,
            isRequired: field.isRequired,
            Options: field.Options || [],
          },
        });
      } else {
        // If the field does not have an id, create it
        await prisma.customField.create({
          data: {
            fieldName: field.fieldName!.trim(),
            fieldType: field.fieldType!,
            moduleType: data.moduleType!,
            isRequired: field.isRequired,
            Options: field.Options || [],
          },
        });
      }
    }

    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};


// This is for Testing only......... The updation and creation works from createCustom only
export const updateCustom = async (
  currentState: CurrentState,
  data: CustomFieldSchema
) => {
  try {
    await prisma.class.update({
      where: {
        id: data.id,
      },
      data,
    });

    // revalidatePath("/list/class");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const deleteCustomField = async (id: any) => {
  try {
    await prisma.customField.update({
      where: {
        id: parseInt(id),
      },
      data: {
        isDeleted: true, // Set isDeleted to true instead of deleting
      },
    });
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
}

export const UpdateTempCustomField = async (id: any, data: any) => {
  try {
    const ReplyData = await prisma.customField.update({
      where: {
        id: id
      },
      data: {
        fieldName: data.fieldName, // Example of valid property
        fieldType: data.fieldType,
        isRequired: data.isRequired,
        Options: data.Options
      }
    })
    return ReplyData
  } catch (error) {
    throw new Error("Went Wrong...")
  }

}

export const getAllPermenentCustomFields = async (inputName: any) => {


  const Replydata = await prisma.customField.findMany({
    where: {
      moduleType: inputName,
      isDeleted: false,
      isTemp: false

    }
  })



  return Replydata

}


export const EntryCreation = async (data: any, moduleType: string, USERID: any) => {

  console.log("Raw data : "  , data)
  const CustomEntry = data?.Entries;
  let TypeOfID = ""
  let isNumber = false
  switch (moduleType) {
    case "Teacher":
      TypeOfID = "teacherId"
      
      break;
    case "Student":
      TypeOfID = "studentId"
      
      break;
    case "Parent":
      TypeOfID = "parentId"
      
      break;
    case "Subject":
      TypeOfID = "subjectId"
      isNumber = true
      break;
    case "Classes":
      TypeOfID = "classesId"
      isNumber = true
      break;
    case "Lesson":
      TypeOfID = "lessonId"
      isNumber = true
      break;
    case "Exam":
      TypeOfID = "examId"
      isNumber = true
      break;
    case "Assignment":
      TypeOfID = "assignmentId"
      isNumber = true
      break;
    case "Event":
      TypeOfID = "eventId"
      isNumber = true
      break;
    case "Announcement":
      TypeOfID = "announcementId"
      isNumber = true
      break;

    default:
      break;
  }
  if (CustomEntry && CustomEntry?.length > 0) {
    const DataForEntry = CustomEntry?.filter((item: any) => item.FieldValue && item.CustomFieldId);
    // Map over the filtered entries and add the moduleType and teacherId if necessary
    const updatedData = DataForEntry?.map((item: any) => ({
      FieldValue: String(item.FieldValue),
      CustomFieldId: Number(item.CustomFieldId),
      moduleType,
      [TypeOfID]: isNumber ? Number(USERID) : USERID, 
    }));
 
    console.log("Changed data : "  , DataForEntry , updatedData)

    // Create the entries in the database
    const CreatedEntries = []

    for (let item of updatedData) {
      let CurrEntry = await prisma.entry.create({
        data:item,
        include: {
          customField: true
        }
      },



      )

      CreatedEntries.push(CurrEntry)


    }
 


    if (CreatedEntries.length > 0) {
      for (let item of CreatedEntries) {
        await prisma.csMapper.create({
          data: { 
            entry: {
              connect: { id: item.id } // Connect to the Entry with id 2
            },
            customField: {
              connect: {
                id: item.customField?.id
              }
            },
          }
        })
      }
    }

  }
 



  // Filter out invalid entries (ensure each item has a fieldValue and id)

}
export const EntryUpdation = async (data: any, moduleType: any, USERID: any) => {

  const CustomEntry = data?.Entries;


  try {
    let TypeOfID = ""
    switch (moduleType) {
      case "Teacher":
        TypeOfID = "teacherId"
        break;
      case "Student":
        TypeOfID = "studentId"
        break;
      case "Parent":
        TypeOfID = "parentId"
        break;
      case "Subject":
        TypeOfID = "subjectId"
        break;
      case "Classes":
        TypeOfID = "classesId"
        break;
      case "Lesson":
        TypeOfID = "lessonId"
        break;
      case "Exam":
        TypeOfID = "examId"
        break;
      case "Assignment":
        TypeOfID = "assignmentId"
        break;
      case "Event":
        TypeOfID = "eventId"
        break;
      case "Announcement":
        TypeOfID = "announcementId"
        break;
  
      default:
        break;
    }
    const arrayWithoutId = CustomEntry.filter((item: any) => !item.id)


    if (arrayWithoutId.length > 0) {
      let MyData: any = {}
      MyData.Entries = arrayWithoutId
      console.log("arrayWithoutId " , arrayWithoutId)
      await EntryCreation(MyData, moduleType, USERID)
    }
    else {
      for (let item of CustomEntry) {
        await prisma.entry.update({
          where: {
            id: item.id
          },
          data: {
            FieldValue: String(item.FieldValue)
          }
        })


      }


      return { success: true, error: false };
    }




  } catch (error) {

    return { success: false, error: true };

  }





}


export const CreateNestedField = async (MyData: any) => {
  try {
    if (MyData.fieldName.trim() !== "") {
      const Response = await prisma.customField.create(
        {
          data: MyData
        }
      )
      return { success: true, Response }
    }
    else {
      throw new Error("NAME REQUIRED...")
    }

  } catch (error) {
    console.log(error)
    return { success: false, Response: null }
  }
}
type FieldUpdateResult =
  | { id: number; fieldName: string; fieldType: string; isRequired: boolean | null; Options: string[]; moduleType: UserType; isDeleted: boolean | null; isTemp: boolean | null }
  | { error: string };

export const UpdateNestedFields = async (fields: any[]): Promise<{ success: boolean; updatedFields: any[]; message: string; errors?: FieldUpdateResult[] }> => {
  try {
    // Map through fields and create update promises
    const updatePromises = fields.map(async (field) => {
      try {
        if (field.id) {
          // Update the field if it has an ID
          return await prisma.customField.update({
            where: {
              id: field.id, // Ensure id exists
            },
            data: {
              fieldName: field.fieldName.trim(),
              fieldType: field.fieldType,
              isRequired: field.isRequired,
              Options: field.Options || [],
              moduleType: field.moduleType,
              isDeleted: field.isDeleted,
              isTemp: field.isTemp,
            },
          });
        } else {
          // Return error message for missing ID
          return { error: "Field ID is missing for update." };
        }
      } catch (error: any) {
        return { error: error.message };
      }
    });

    // Wait for all promises to resolve
    const updatedFields = await Promise.all(updatePromises);

    // Filter out any error objects
    const validUpdatedFields = updatedFields.filter((field) => !("error" in field));

    // Check if some fields have errors
    const errors = updatedFields.filter((field) => "error" in field) as FieldUpdateResult[];

    if (errors.length > 0) {
      return {
        success: false,
        updatedFields: validUpdatedFields,
        message: "Some fields failed to update.",
        errors,
      };
    }

    return { success: true, updatedFields: validUpdatedFields, message: "Fields updated successfully." };
  } catch (error: any) {
    console.error("Error while updating fields:", error.message);
    return { success: false, updatedFields: [], message: error.message };
  }
};




export const GetField = async (fieldId: any) => {
  const response = await prisma.customField.findUnique({
    where: {
      id: fieldId
    }
  })

  return response
}

export const GetTemporaryFields = async (fields: any[]) => {
  const responses = await Promise.all(
    fields.map(async (field) => {
      return await prisma.customField.findUnique({
        where: {
          id: field.id,
        },
      });
    })
  );


  return responses;
};

// For Deployed database
 