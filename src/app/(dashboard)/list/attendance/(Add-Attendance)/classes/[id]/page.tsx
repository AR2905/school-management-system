import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import prisma from "@/lib/prisma"
import { ITEM_PER_PAGE } from "@/lib/settings";
import { Class, Lesson, Prisma } from "@prisma/client";
import { Caladea } from "next/font/google";
import Link from 'next/link';
type ClassList = Lesson  ;
export default async function CurrentClassComp( {
    params, 
    searchParams  
} :  {
    params : {
        id : string
    }, 
    searchParams :  { [key: string]: string | undefined }
}) { 

    const columns = [
        {
            header: "Id",
            accessor: "id",
          },{
            header: "Name",
            accessor: "name",
          },
        {
          header: "Date",
          accessor: "date",
        },
        {
          header: "Day",
          accessor: "day",
          className: "day md:table-cell",
        },
        {
          header: "Start Time",
          accessor: "startTime",
          className: "Start Time md:table-cell",
        },
        {
          header: "End Time",
          accessor: "endTime",
          className: "End Time md:table-cell",
        },
   
              {
                header: "Action",
                accessor: "add",
              }, 
      ];
      
 
      
const renderRow = (item: ClassList) => {
   

    return <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
       
    >
      <td className="flex items-center gap-4 p-4">{item.id}</td>
      <td className="hidden md:table-cell">{item.name}</td>
      <td className="hidden md:table-cell">{item.startTime.toLocaleDateString()}</td>

      <td className="hidden md:table-cell">{item.day}</td>
      <td className="hidden md:table-cell">{item.startTime.toLocaleTimeString()}</td>
      <td className="hidden md:table-cell">
        {item.endTime.toLocaleTimeString()}
      </td>
      <td>
        <div className="flex items-center gap-2">
   
            <> 
            <Link href={`/list/attendance/classes/${params.id}/lesson/${item.id}`} className="p-1 rounded-full text-white hover:bg-blue-500 bg-blue-300 text-center">Go</Link>

            </>
     
        </div>
      </td>
    </tr>
  }

  
  const { page, ...queryParams } = searchParams;

  const p = page ? parseInt(page) : 1;

  // URL PARAMS CONDITION

  const query: Prisma.LessonWhereInput = {};

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
           
          case "search":
            query.name = { contains: value, mode: "insensitive" };
            break;
          default:
            break;
        }
      }
    }
  }

  const [data, count] = await prisma.$transaction([
    prisma.lesson.findMany({
        where: {
            classId: Number(params.id)
        },
        orderBy: {
            startTime: 'desc',  // 'desc' orders from most recent to oldest
        },
        take: ITEM_PER_PAGE,
        skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.lesson.count({
        where: {
            classId: Number(params.id)
        }
    }),
  ]); 
 
  
      
 
    return <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
    {/* TOP */}
    <div className="flex items-center justify-between">
      <h1 className="hidden md:block text-lg font-semibold  ">All Lessons</h1>
      
    </div>
    {/* LIST */}
    <Table columns={columns} renderRow={renderRow} data={data} />
    <Pagination page={p} count={count} />

  </div>
}



// 