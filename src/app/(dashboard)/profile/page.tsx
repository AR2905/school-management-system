 
import { currentUser   } from "@clerk/nextjs/server";
 
export default async function  ProfilePage () {
    
    const user : any = await currentUser()

    return <div className="container  h-[100vh] w-full   flex flex-col items-center justify-center">

        <img src={user?.imageUrl}  alt="" className="mt-4 rounded-full"/>

        <h1 className="text-2xl m-2 font-bold">{user?.username}</h1>
        <h1 className="text-md mt-2 text-gray-800">{user?.id}</h1>
        
        <p className="text-green-700">Role : {user?.publicMetadata?.role}</p>

        

    </div>
}