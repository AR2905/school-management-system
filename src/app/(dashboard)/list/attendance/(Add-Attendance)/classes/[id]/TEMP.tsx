import prisma from "@/lib/prisma"
import { Caladea } from "next/font/google";
import Link from 'next/link';

export default async function CurrentClassComp( {
    params  
} :  {
    params : {
        id : string
    }
}) { 
    const classData = await prisma.class.findUnique({
        where: {
            id : Number(params?.id)
        }
    })
      const LessonList = await prisma.lesson.findMany({
        where : {
            classId : Number(params.id)
        }, 
        orderBy: {
            startTime: 'desc',  // 'desc' orders from most recent to oldest
          },
      })

      const studens = await prisma.student.findMany({
        where : {
            classId: Number(params.id)
        }
      })

      
 
    return <div className="p-10 bg-white p-4 rounded-md flex-1 m-4 mt-0"> 
        <h1 className="text-lg font-semibold mb-4">Lessons Of Class {classData?.name}</h1>

        <table className="min-w-full   border-collapse">
            <thead>
                <tr className="bg-gray-200">
                    {
                         LessonList?.length === 0 ? <></> :  <>
                         <th className="border text-md  border-gray-300 px-4 py-2 text-left">ID</th>
                    <th className="border text-md  border-gray-300 px-4 py-2 text-left">Name</th>
                    <th className="border text-md  border-gray-300 px-4 py-2 text-left">Date</th>
                    <th className="border text-md  border-gray-300 px-4 py-2 text-left">Day</th>

                    <th className="border text-md  border-gray-300 px-4 py-2 text-left">Start Time</th>
                    <th className="border text-md  border-gray-300 px-4 py-2 text-left">End Time</th>
                    <th className="border text-md  border-gray-300 px-4 py-2 text-left">Add</th>
                    </>
                    }
                    
    
                </tr>
            </thead>
            <tbody>
                {
                    LessonList?.length === 0 ? <tr   > 
                    <td colSpan={7} rowSpan={2} className="text-red-400 text-sm text-center mt-8">  There is no lessons for class {classData?.name} </td>
                   </tr> : 
                    LessonList.map((item, key) => { 
                        return (
                             
                                <tr className="border-b border-gray-300  " key={key}>
    
                                    <td className=" text-sm px-4 py-2 text-left">{item.id}</td>
                                    <td className=" text-sm px-4 py-2 text-left">{item.name}</td>
                                    <td className=" text-sm px-4 py-2 text-left">{item.startTime.toLocaleDateString()}</td> 
                                    <td className=" text-sm px-4 py-2 text-left">{item.day}</td> 
    
                                    <td className=" text-sm px-4 py-2 text-left">  {item.startTime.toLocaleTimeString()}</td> 
                                    <td className=" text-sm px-4 py-2 text-left"> {item.endTime.toLocaleTimeString()}</td> 
                                    <td className="px-4 py-2 text-left">
                                        <Link href={`/list/attendance/classes/${params.id}/lesson/${item.id}`} className="p-1 rounded-full text-white hover:bg-blue-500 bg-blue-300 text-center">Go</Link>
    
                                    </td>
                                </tr>
                            
                        )
                    })
                }
                
            </tbody>
        </table>
        
    </div>
}
// import Pagination from "@/components/Pagination";
// import Table from "@/components/Table";
// import prisma from "@/lib/prisma"
// import { ITEM_PER_PAGE } from "@/lib/settings";
// import { Class, Lesson, Prisma } from "@prisma/client";
// import { Caladea } from "next/font/google";
// import Link from 'next/link';
// type ClassList = Lesson  ;
// export default async function CurrentClassComp( {
//     searchParams  
// } :  {
//     // params : {
//     //     id : string
//     // }
//     searchParams :  { [key: string]: string | undefined }
// }) { 

//     const columns = [
//         {
//             header: "Id",
//             accessor: "id",
//           },{
//             header: "Name",
//             accessor: "name",
//           },
//         {
//           header: "Date",
//           accessor: "date",
//         },
//         {
//           header: "Day",
//           accessor: "day",
//           className: "day md:table-cell",
//         },
//         {
//           header: "Start Time",
//           accessor: "startTime",
//           className: "Start Time md:table-cell",
//         },
//         {
//           header: "End Time",
//           accessor: "endTime",
//           className: "End Time md:table-cell",
//         },
   
//               {
//                 header: "Action",
//                 accessor: "add",
//               }, 
//       ];
      
//     // const classData = await prisma..findUnique({
//     //     where: {
//     //         id : Number(searchParams?.id)
//     //     }
//     // })
//     //   const LessonList = await prisma.lesson.findMany({
//     //     where : {
//     //         classId : Number(searchParams.id)
//     //     }, 
//     //     orderBy: {
//     //         startTime: 'desc',  // 'desc' orders from most recent to oldest
//     //       },
//     //   })

//     //   const studens = await prisma.student.findMany({
//     //     where : {
//     //         classId: Number(searchParams.id)
//     //     }
//     //   })

      
// const renderRow = (item: ClassList) => {
   

//     return <tr
//       key={item.id}
//       className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
       
//     >
//       <td className="flex items-center gap-4 p-4">{item.id}</td>
//       <td className="hidden md:table-cell">{item.name}</td>
//       <td className="hidden md:table-cell">{item.startTime.toLocaleDateString()}</td>

//       <td className="hidden md:table-cell">{item.day}</td>
//       <td className="hidden md:table-cell">{item.startTime.toLocaleTimeString()}</td>
//       <td className="hidden md:table-cell">
//         {item.endTime.toLocaleTimeString()}
//       </td>
//       <td>
//         <div className="flex items-center gap-2">
   
//             <> 
//             <Link href={`/list/attendance/classes/${searchParams.id}/lesson/${item.id}`} className="p-1 rounded-full text-white hover:bg-blue-500 bg-blue-300 text-center">Go</Link>

//             </>
     
//         </div>
//       </td>
//     </tr>
//   }

  
//   const { page, ...queryParams } = searchParams;

//   const p = page ? parseInt(page) : 1;

//   // URL PARAMS CONDITION

//   const query: Prisma.LessonWhereInput = {};

//   if (queryParams) {
//     for (const [key, value] of Object.entries(queryParams)) {
//       if (value !== undefined) {
//         switch (key) {
           
//           case "search":
//             query.name = { contains: value, mode: "insensitive" };
//             break;
//           default:
//             break;
//         }
//       }
//     }
//   }

//   const [data, count] = await prisma.$transaction([
//     prisma.lesson.findMany({
//         where : {
//             classId : Number(searchParams.id)
//         }, 
//         orderBy: {
//             startTime: 'desc',  // 'desc' orders from most recent to oldest
//           },
       
//       take: ITEM_PER_PAGE,
//       skip: ITEM_PER_PAGE * (p - 1),
//     }),
//     prisma.lesson.count({ where: query }),
//   ]); 
 
  
      
 
//     return <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
//     {/* TOP */}
//     <div className="flex items-center justify-between">
//       <h1 className="hidden md:block text-lg font-semibold  ">All Classes</h1>
      
//     </div>
//     {/* LIST */}
//     <Table columns={columns} renderRow={renderRow} data={data} />
//     <Pagination page={p} count={count} />

//   </div>
// }



// // 