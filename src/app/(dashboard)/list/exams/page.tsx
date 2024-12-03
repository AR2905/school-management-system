import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { Class, Exam, Prisma, Subject, Teacher } from "@prisma/client";
import Image from "next/image";
import { auth } from "@clerk/nextjs/server";

type ExamList = Exam & {
  lesson: {
    subject: Subject;
    class: Class;
    teacher: Teacher;
  };
};

const ExamListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {

const { userId, sessionClaims } = auth();
const role = (sessionClaims?.metadata as { role?: string })?.role;
const currentUserId = userId;

function convertTo12HourFormat(timeStr : any) {
  // Regular expression to match the time format (hh:mm:ss AM/PM)
  const regex = /(\d{1,2}):(\d{2}):(\d{2})\s([APM]{2})/i;
  const match = timeStr.match(regex);
  
  if (match) {
      // Time is already in 12-hour format with AM/PM
      return timeStr;
  }

  // Otherwise, handle the 24-hour format input
  let hours = parseInt(timeStr.split(":")[0], 10); // Extract hours
  const minutes = timeStr.split(":")[1]; // Extract minutes
  const seconds = timeStr.split(":")[2]?.split(" ")[0] || "00"; // Extract seconds, assuming 24-hour format input

  let period = "AM"; // Default to AM

  if (hours >= 12) {
      period = "PM"; // PM if hours >= 12
  }

  if (hours > 12) {
      hours -= 12; // Convert 24-hour to 12-hour format
  } else if (hours === 0) {
      hours = 12; // Handle midnight (00:xx -> 12:xx AM)
  }

  // Format hours and minutes as 2-digit numbers
  const formattedHours = hours.toString().padStart(2, '0');
  const formattedMinutes = minutes.padStart(2, '--');

  // Return the formatted time in hh:mm AM/PM
  return `${formattedHours}:${formattedMinutes} ${period}`;
}

const columns = [
  
  {
    header: "Exam",
    accessor: "name",
  },
  {
    header: "Subject",
    accessor: "subject",
    className: "hidden md:table-cell",
  },
  {
    header: "Class",
    accessor: "class",
  },
  
  {
    header: "Date",
    accessor: "date",
    className: "hidden md:table-cell",
  },
  
  ...(role === "admin" || role === "teacher"
    ? [
        {
          header: "Actions",
          accessor: "action",
        },
      ]
    : []),
];

const renderRow = (item: ExamList) => {
 
  return (<tr
    key={item.id}
    className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
  >
    <td className="flex items-center gap-4 p-4">{item.id} - {item.title}</td>
    <td className="hidden md:table-cell">
    {item.lesson.subject.name}
    </td>
    <td>{item.lesson.class.name}</td>
 
    <td className="hidden md:table-cell">
      {new Intl.DateTimeFormat("en-US").format(item.startTime)} - 
      {convertTo12HourFormat(item.startTime.toLocaleTimeString())}
    </td>
    <td>
      <div className="flex items-center gap-2">
        {(role === "admin" || role === "teacher") && (
          <>
            <FormContainer table="exam" type="update" data={item} />
            <FormContainer table="exam" type="delete" id={item.id} />
          </>
        )}
      </div>
    </td>
  </tr>)
}

  const { page, ...queryParams } = searchParams;

  const p = page ? parseInt(page) : 1;

  // URL PARAMS CONDITION

  const query: Prisma.ExamWhereInput = {};

  query.lesson = {};
  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "classId":
            query.lesson.classId = parseInt(value);
            break;
          case "teacherId":
            query.lesson.teacherId = value;
            break;
          case "search":
            query.lesson.subject = {
              name: { contains: value, mode: "insensitive" },
            };
            break;
          default:
            break;
        }
      }
    }
  }

  // ROLE CONDITIONS

  switch (role) {
    case "admin":
      break;
    case "teacher":
      query.lesson.teacherId = currentUserId!;
      break;
    case "student":
      query.lesson.class = {
        students: {
          some: {
            id: currentUserId!,
          },
        },
      };
      break;
    case "parent":
      query.lesson.class = {
        students: {
          some: {
            parentId: currentUserId!,
          },
        },
      };
      break;

    default:
      break;
  }

  const [data, count] = await prisma.$transaction([
    prisma.exam.findMany({
      where: query,
      include: {
        lesson: {
          select: {
            subject: { select: { name: true } },
            teacher: { select: { name: true, surname: true } },
            class: { select: { name: true } },
            
          },
        },

        Entries : {
          include : {
            customField : true
          }
        }
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.exam.count({ where: query }),
  ]);
 
  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Exams</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />

          <div className="flex items-center gap-4 self-end">
          
          {(role === "admin" || role === "teacher") && (
             
              <div className="one flex items-end flex-col gap-2  justify-center ">
                <div className="FirstBox flex gap-2 items-center">
                  <span>Custom </span>
                  <FormContainer table="custom" type="create" data="Exam" />
                </div>
                <div className="SecBox flex gap-2 items-center">
                  <span>Exam </span>

                  <FormContainer table="exam" type="create"/>

                </div>
              </div>
          )}
        </div>
           
        </div>
      </div>
      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={data} />
      {/* PAGINATION */}
      <Pagination page={p} count={count} />
    </div>
  );
};

export default ExamListPage;
