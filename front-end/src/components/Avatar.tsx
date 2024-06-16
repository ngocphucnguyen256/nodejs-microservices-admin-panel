import { concatApiUrl } from '@/utils';
interface AvatarProps {
  avatarUrl ?: string;
  username?: string;
  width?: string;
  height?: string;
}
const Avatar = ({ avatarUrl, username, width= '10', height ='10'}: AvatarProps) => {
  
  return (
    <div className={`flex items-center justify-center bg-primary rounded-full w-${width} h-${height}`} >
    {
        avatarUrl ? (
            <img className={`rounded-full  w-${width} h-${height}`} src={concatApiUrl('user/'+ avatarUrl)} alt="user" />
        ) : (
            <div className={`text-white text-lg font-semibold w-${width} h-${height} flex items-center justify-center`}>
            {username?.charAt(0).toUpperCase()}
            </div>
        )
    }
  </div>
  );
};

export default Avatar;
