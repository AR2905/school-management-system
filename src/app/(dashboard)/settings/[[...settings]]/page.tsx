import { UserProfile } from '@clerk/nextjs'

const UserProfilePage = () => <div className=" bg-[#edf9fd] h-[100vh] flex justify-center items-center">
    <UserProfile path="/settings" />  
</div>

export default UserProfilePage 