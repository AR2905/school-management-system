import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { Class, Prisma, Teacher } from "@prisma/client";
import Image from "next/image";
import { auth } from "@clerk/nextjs/server"; 
import { redirect } from 'next/navigation';  
  
import Link from "next/link";
type ClassList = Class & { supervisor: Teacher };

const ClassListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {

const { userId , sessionClaims } = auth();
const role = (sessionClaims?.metadata as { role?: string })?.role;


const columns = [
  {
    header: "Class Name",
    accessor: "name",
  },
  {
    header: "Capacity",
    accessor: "capacity",
    className: "hidden md:table-cell",
  },
  {
    header: "Grade",
    accessor: "grade",
    className: "hidden md:table-cell",
  },
  {
    header: "Supervisor",
    accessor: "supervisor",
    className: "hidden md:table-cell",
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

const renderRow = (item: ClassList) => {
   

  return <tr
    key={item.id}
    className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
     
  >
    <td className="flex items-center gap-4 p-4">{item.name}</td>
    <td className="hidden md:table-cell">{item.capacity}</td>
    <td className="hidden md:table-cell">{item.name[0]}</td>
    <td className="hidden md:table-cell">
      {
        (item.supervisor) ? item.supervisor.name : "-"
      } 
    </td>
    <td>
      <div className="flex items-center gap-2">
 
          <> 
            <Link href={`/list/results/classes/${item.id}`}  className="p-1 rounded-full text-white hover:bg-blue-500 bg-blue-300 text-center" >Go</Link>
          </>
   
      </div>
    </td>
  </tr>
}

  const { page, ...queryParams } = searchParams;

  const p = page ? parseInt(page) : 1;

  // URL PARAMS CONDITION

  const query: Prisma.ClassWhereInput = {};

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

  
  var data 

  if(role === "teacher") { 
    data = await prisma.class.findMany({
      where: {
        supervisorId : userId
      },
      include: {
        supervisor: true,
      },
    });
  }
  else {
    data = await prisma.class.findMany({
      where: query,
      include: {
        supervisor: true,
      },
    });
  }

   


  const count = data.length;

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold  ">All Classes</h1>
        
      </div>
      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={data} />
    </div>
  );
};
 



export default async function AddAttendance () {
  
    return <div> 
 
    
         <ClassListPage searchParams={{}}></ClassListPage>
  
 
    </div>
}