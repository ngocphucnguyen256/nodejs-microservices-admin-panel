import Breadcrumb from '../components/Breadcrumb';
import userThree from '../images/user/user-03.png';
import { useState,useEffect } from "react";
import { ChatRoom } from '@/types';
import api from '@/api/axios'
import { Link } from 'react-router-dom';
const Chat = () => {

  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [newRoomName, setNewRoomName] = useState<string>("");


   const getChatRooms = () => {
    api.get('/chat/chat-rooms')
      .then((response) => {
        setChatRooms(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  const crateChatRoom = () => {
    const name = newRoomName;
    api.post('/chat/chat-rooms', { name })
      .then(() => {
        getChatRooms();
      })
      .catch((error) => {
        console.error(error);
      });
    }

    useEffect(() => {
        getChatRooms();
    }, []);
  


  return (
    <>
      <div className="mx-auto max-w-270">
        
        <Breadcrumb pageName="Settings" />

        <div className="grid grid-cols-5 gap-8">
          <div className="col-span-5 xl:col-span-3">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">
                  Chat
                </h3>
              </div>
              <div className="p-7">
                <form action="#">
                <div className="w-full sm:w-1/2 flex items-stretch">
                    <div className="">
                    <input
                        value={newRoomName}
                        onChange={(e) => setNewRoomName(e.target.value)}
                        className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        type="text"
                        name="phoneNumber"
                        id="phoneNumber"
                    />
                    </div>
                    <button
                      className="flex ml-2 justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:shadow-1"
                      type="button"
                      onClick={crateChatRoom}
                    >
                      Create
                    </button>
                </div>
      
        
                </form>
              </div>
            </div>
          </div>
            
          <div className="col-span-5 xl:col-span-3">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">
                  Chat rooms
                </h3>
              </div> 
              <div className="p-7 grid ">
                {
                    chatRooms.map((chatRoom) => (
                        <Link
                        to={`/chat/${chatRoom.id}`}
                        key={chatRoom.id}
                        className="flex items-center gap-5 py-3 px-7.5 hover:bg-gray-3 dark:hover:bg-meta-4"
                      >
                            <div className="flex items-center justify-between py-4 border-b border-stroke">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-full">
                                <img src={userThree} alt="user" />
                                </div>
                                <div>
                                <h4 className="font-medium text-black dark:text-white">{chatRoom.name}</h4>
                                <p className="text-s">Created at {chatRoom.createdAt}</p>
                                </div>
                            </div>
                            </div>
                        </Link>
                    ))
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Chat;
