import prisma from "@/lib/prisma"

export default async function PerticularClass( {
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
    const studens = await prisma.student.findMany({
        where : {
            classId : Number(params.id) 
        },
        select : {
id : true , username: true, name : true
        }
    }) 
    return <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0"> 
        <h1 className="text-lg font-semibold mb-4">Students Of Class {classData?.name}</h1>

        {studens.length === 0 ? (
            <p className="text-red-400 text-sm">No student found</p>
        ) : (
            <table className="min-w-full border-collapse">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border text-md border-gray-300 px-4 py-2 text-left">ID</th>
                        <th className="border text-md border-gray-300 px-4 py-2 text-left">Name</th>
                        <th className="border text-md border-gray-300 px-4 py-2 text-left">Username</th>
                    </tr>
                </thead>
                <tbody>
                    {studens.map((item, key) =>  
                        <tr key={key} className="border-b border-gray-300">
                            <td className="text-sm px-4 py-2 text-left">{item.id}</td>
                            <td className="text-sm px-4 py-2 text-left">{item.name}</td>
                            <td className="text-sm px-4 py-2 text-left">{item.username}</td>
                        </tr>
                    )}
                </tbody>
            </table>
        )}
    </div>
}