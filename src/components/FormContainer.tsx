import prisma from "@/lib/prisma";
import FormModal from "./FormModal";
import { auth } from "@clerk/nextjs/server";

export type FormContainerProps = {
  table:
  | "teacher"
  | "student"
  | "parent"
  | "subject"
  | "class"
  | "lesson"
  | "exam"
  | "assignment"
  | "result"
  | "attendance"
  | "event"
  | "custom"
  | "announcement";

  type: "create" | "update" | "delete";
  data?: any;
  id?: number | string;
};

const FormContainer = async ({ table, type, data, id }: FormContainerProps) => {
  let relatedData = {};
  const { userId, sessionClaims } = auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;
  const currentUserId = userId;

  if (type !== "delete") {
    switch (table) {
      case "subject":
        const subjectTeachers = await prisma.teacher.findMany({
          select: { id: true, name: true, surname: true },
        });
        const SubjectCustomFields = await prisma.customField.findMany({
          where: {
            moduleType: "Subject",
            isDeleted: false,
            isTemp: false
          }
        })
        relatedData = { teachers: subjectTeachers  ,AllCustomFields :SubjectCustomFields};
        break;
      case "class":
        const classGrades = await prisma.grade.findMany({
          select: { id: true, level: true },
        });
        const classTeachers = await prisma.teacher.findMany({
          select: { id: true, name: true, surname: true },
        });
        const AllClassCustoms = await prisma.customField.findMany({
          where: {
            moduleType: "Classes",
            isDeleted: false,
            isTemp: false
          }
        })
        relatedData = { teachers: classTeachers, grades: classGrades , AllCustomFields : AllClassCustoms };
        break;
      case "teacher":
        const teacherSubjects = await prisma.subject.findMany({
          select: { id: true, name: true },
        });
        const AllCustomFields = await prisma.customField.findMany({
          where: {
            moduleType: "Teacher",
            isDeleted: false,
            isTemp: false
          }
        })

        relatedData = { subjects: teacherSubjects, AllCustomFields };
        break;
      case "student":
        const studentGrades = await prisma.grade.findMany({
          select: { id: true, level: true },
        });
        const studentClasses = await prisma.class.findMany({
          include: { _count: { select: { students: true } } },
        });
        const parentList = await prisma.parent.findMany({
          select: {
            id: true,
            username: true
          }
        })
        const StudentCustomFields = await prisma.customField.findMany({
          where: {
            moduleType: "Student",
            isDeleted: false,
            isTemp: false

          }
        })
        relatedData = { classes: studentClasses, grades: studentGrades, parents: parentList, AllCustomFields: StudentCustomFields };
        break;
      case "exam":
        const examLessons = await prisma.lesson.findMany({
          where: {
            ...(role === "teacher" ? { teacherId: currentUserId! } : {}),
          },
          select: { id: true, name: true, startTime: true, endTime: true },
        });
        const ExamCustoms = await prisma.customField.findMany({
          where: {
            moduleType: "Exam",
            isDeleted: false,
            isTemp: false
          }
        })
        relatedData = { lessons: examLessons , AllCustomFields : ExamCustoms };
        break;
      case "assignment":
        const assignmentLessons = await prisma.lesson.findMany({
          where: {
            ...(role === "teacher" ? { teacherId: currentUserId! } : {}),
          },
          select: { id: true, name: true },
        });

        const AssignmentCustoms = await prisma.customField.findMany({
          where: {
            moduleType: "Assignment",
            isDeleted: false,
            isTemp: false
          }
        })

        relatedData = { lessons: assignmentLessons, AllCustomFields : AssignmentCustoms };
        break;

// ================================================== FOR TESTING  ==================================================
      case "custom":
        switch (data) {
          case "Teacher":
            const AllTeacherCustoms = await prisma.customField.findMany({
              where: {
                moduleType: "Teacher"
              }
            })
            relatedData = { customfields: AllTeacherCustoms }
            // console.log("You are a teacher...." , relatedData)
            break;
          case "Student":
            const AllStudentCustoms = await prisma.customField.findMany({
              where: {
                moduleType: "Student"
              }
            })
            relatedData = { customfields: AllStudentCustoms }

            // console.log("You are a student...." , relatedData)
            break;

            case "Subject":
              const AllSubjectCustoms = await prisma.customField.findMany({
                where: {
                  moduleType : "Subject"
                }
              }) 
              relatedData = { customfields: AllSubjectCustoms } 
              break;
          default:
            break;
        }
        relatedData = {}
        break;
      case "event":
        const eventClass = await prisma.class.findMany({})
        const EventCustoms = await prisma.customField.findMany({
          where: {
            moduleType: "Event",
            isDeleted: false,
            isTemp: false
          }
        })
        relatedData = { classes: eventClass, AllCustomFields : EventCustoms }
        break;

      case "announcement":
        const announcementClass = await prisma.class.findMany({})
        const AnnouncementCustoms = await prisma.customField.findMany({
          where: {
            moduleType: "Announcement",
            isDeleted: false,
            isTemp: false
          }
        })
        relatedData = { classes: announcementClass , AllCustomFields : AnnouncementCustoms }
        break;


      case "lesson":
        const lessonTeachers = await prisma.teacher.findMany({
          // select: { id: true, name: true, surname: true,  },
        });
        const lessonSubjects = await prisma.subject.findMany({
          // select: { id: true, name: true, surname: true,  },
        });

        const lessonClass = await prisma.class.findMany({

        })

        const LessonCustoms = await prisma.customField.findMany({
          where: {
            moduleType: "Lesson",
            isDeleted: false,
            isTemp: false
          }
        })
        console.log("....... " , LessonCustoms)
        relatedData = { teachers: lessonTeachers, subjects: lessonSubjects, classes: lessonClass , AllCustomFields:LessonCustoms };

        break;

      case "attendance":


        const lessionatd = await prisma.lesson.findMany({

        })

        relatedData = { lessons: lessionatd }

        
        break;



      case "result":
        break;

      case "parent":
        // Todo.................................

        const AllParentCustoms = await prisma.customField.findMany({
          where: {
            moduleType: "Parent",
            isDeleted: false,
            isTemp: false
          }
        })
        const parentStudents = await prisma.student.findMany({
          where: {
            ...(role === "teacher" ? { parentId: currentUserId! } : {}),
          },
          select: { id: true, name: true },
        });
        relatedData = { students: parentStudents, AllCustomFields: AllParentCustoms };
        break;

      default:
        break;
    }
  }

  return (
    <div className="">
      <FormModal
        table={table}
        type={type}
        data={data}
        id={id}
        relatedData={relatedData}
      />
    </div>
  );
};

export default FormContainer;
