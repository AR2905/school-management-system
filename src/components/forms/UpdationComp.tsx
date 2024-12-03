import { GetField } from "@/lib/actions";

export default async function Updation(){
    const fielddata = await GetField(172)  
    
    console.log("FIELD" , fielddata)
    return <>
    {fielddata?.fieldName}
    </>
}