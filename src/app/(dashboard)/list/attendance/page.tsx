// import prisma from "@/lib/prisma"

// export default async function AttendancePage(){ 
//     // Fetch students along with their attendance records
//     const students = await prisma.student.findMany({
//         include: {
//             attendances: true, // Include attendance records
//         }
//     })
   
//     return <div>
//         <div className="container h-[100vh] w-full flex-col justify-center items-center p-8">
//             <h1 className="container text-xl font-bold underline">Present students :</h1>
//             {
//                 students.map((s, key) => (
//                     <div key={key} className="flex justify-start gap-4">
 

// <p>
    
//     {s.attendances.map(a => a.present ? `${s.id} -`  : '').join(', ')}


// </p>
//                     </div>
//                 ))
//             }
//         </div>
//     </div>
// }

import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { Attendance, Class, Lesson, Prisma, Student, Teacher } from "@prisma/client";
import Image from "next/image";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";

type AttendaceList = Attendance & { student: Student , lesson : Lesson } 

const AttendaceListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {

const { sessionClaims } = auth();
const role = (sessionClaims?.metadata as { role?: string })?.role;




const columns = [
  {
    header: "id",
    accessor: "id",
  },
  {
    header: "date",
    accessor: "date", 
  },
  {
    header: "present",
    accessor: "present", 
  },
  {
    header: "studetnt",
    accessor: "studentId", 
  },
  {
    header: "lesson",
    accessor: "lessonId", 
  },
  ...(role === "admin"
    ? [
        {
          header: "Actions",
          accessor: "action",
        },
      ]
    : []),
];

const renderRow = (item: AttendaceList) => {
 
  const getDayFromDate = (dateString: string): string => {
    const date = new Date(dateString);
    const options = { weekday: 'short' } as const;  
    return new Intl.DateTimeFormat('en-US', options).format(date);
  }; 
  return (<tr
    key={item.id}
    className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
  >
     <td>{item.id}</td>
     <td>{item.date.toLocaleDateString()} -  {getDayFromDate(item?.date.toString())}</td>
     <td>{item.present ? "P" : "A"}</td>
     <td>{item.student.name}</td>
     <td>{item.lessonId}</td>
     <td>
        <div className="flex items-center gap-2">
          {role === "admin" && (
            <>
              <FormContainer table="attendance" type="update" data={item} />
              <FormContainer table="attendance" type="delete" id={item.id} />
            </>
          )}
        </div>
      </td>
  </tr>)
};

  const { page, ...queryParams } = searchParams;

  const p = page ? parseInt(page) : 1;

  // URL PARAMS CONDITION

  const query: Prisma.AttendanceWhereInput = {};

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "supervisorId":
            query.studentId = value;
            break;
          case "search":
            query.studentId = { contains: value, mode: "insensitive" };
            break;
          default:
            break;
        }
      }
    }
  }

  const [data, count] = await prisma.$transaction([
    prisma.attendance.findMany({
      where: query,
      include: {
        student: true,
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.attendance.count({ where: query }),
  ]);
 

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
 
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Attendance</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
 

            
            {/* {role === "admin" && <FormContainer table="attendance" type="create" />} */}
          </div>
        </div>
      </div>
      {/* LIST */}
       
      <Table columns={columns} renderRow={renderRow} data={data} />
      {/* PAGINATION */}
      <Pagination page={p} count={count} />

      <div className="flex w-full   justify-center items-center ">

        {
          (role === "admin" || role === "teacher") ? 
          <Link href={"/list/attendance/classes"} className="bg-green-300 transition-all duration-100 p-2 font-bold rounded-lg hover:border-solid border-2 border-green-600  hover:bg-green-500 hover:text-white      ">Attendance</Link>

 : <></>
        }

      </div>
    </div>
  );
};

export default AttendaceListPage;
