// src/pages/ChatRoom.tsx
import React, {useState, useEffect} from 'react';
import { useParams } from 'react-router-dom';
import { Message } from '@/types';
import api from '@/api/axios';
import { howManyTimePassed} from '@/utils/index';
import { useDispatch } from 'react-redux';
import { sendMessage, sendJoinRoomMessage, deleteMessage, CHAT_SET_MESSAGES } from '@/store/actions/chatActions';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/index';
import { User } from '@/types';
import Avatar from '@/components/Avatar';

const ChatRoom = () => {
  const { id } = useParams<{ id: string }>();
  const messages = useSelector((state: RootState) => state.chat.messages) as Message[];
  const [users, setUsers] = useState<User[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]); 
  const userId = useSelector((state: RootState) => state.auth.user?.id);
  const [newMessage, setNewMessage] = useState('');
  const dispatch = useDispatch();
  const [isAddPeopleOpen, setIsAddPeopleOpen] = useState(false);

  const getMessages = () => {
    api.get(`/chat/chat-rooms/${id}/messages`)
      .then((response) => {
        dispatch({ type: CHAT_SET_MESSAGES, payload: response.data });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  const getUsers = async () => {
    const response = await api.get(`/chat/chat-rooms/${id}/users`);
    setUsers(response.data);
  };

  const getAllUsers = async (nameParam? : string) => {
    if(!nameParam) {
      const response = await api.get('/chat/users');
      setAllUsers(response.data);
      return;
    }
    const response = await api.get('/chat/users?name=' + nameParam);
    setAllUsers(response.data);
  }

  const handleSendMessage = () => {
    if(!id || !newMessage) return;
    dispatch(sendMessage(newMessage, id));
    setNewMessage('');
  }

  const handleDeleteMessage = (messageId: string) => () => {
    if(!id) return;
    dispatch(deleteMessage(messageId, id));
  }


  const joinRoom = () => {
    if(!id) return;
    dispatch(sendJoinRoomMessage(id));
  }

  const scrollToBottom = () => {
    const chatContainer = document.querySelector("#chat");
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }

  const handleToggleAddPeople = () => {
    if(!isAddPeopleOpen) {
      getAllUsers();
    }
    setIsAddPeopleOpen(!isAddPeopleOpen);
  }

  const handleRemoveUserFromRoom = (userId: string) => (event: React.MouseEvent<HTMLButtonElement>) => {
    if(!id) return;
    api.delete(`/chat/chat-rooms/${id}/users/${userId}`)
      .then(() => {
        getUsers();
      })
      .catch((error) => {
        console.error(error);
      });
  }

  const handleAddUserToRoom = (userId: string) => (event: React.MouseEvent<HTMLButtonElement>) => {
    if(!id) return;
    api.post(`/chat/chat-rooms/${id}/users`, {userId})
      .then(() => {
        getUsers();
      })
      .catch((error) => {
        console.error(error);
      });
  }
  

  const handleSearchUsers = (e: React.ChangeEvent<HTMLInputElement>) => {
    const search = e.target.value;
    getAllUsers(search);
  }

  useEffect(() => {
    joinRoom();
    getMessages();
    getUsers();
  }, []);


  useEffect(() => {
    scrollToBottom();
  }, [messages]);



  return (
    <div>
      <div>
        <h1 className="text-2xl font-medium text-black dark:text-white">Messages</h1>
        <div>
        <div className="mb-4 relative">
          <h2 className="text-lg font-semibold text-black dark:text-white">Users in this Room:</h2>
         <div className='flex'>
          {
            users.map((user, idx) => (
              <div key={idx} className="flex items-center gap-4.5 mr-2">
                <div className="flex items-center justify-center bg-primary rounded-full">
                  <Avatar avatarUrl={user?.avatarUrl} username={user?.username} />
                </div>
              </div>
            ))
          }
          <button onClick={handleToggleAddPeople} className='rounded-full  w-10 h-10 border flex items-center justify-center'>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 text-gray-500 dark:text-white">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
          </button>
          {
            isAddPeopleOpen && (
              <div className='absolute bg-white dark:bg-meta-4 border border-stroke dark:border-strokedark rounded-lg p-4.5 top-0 right-50 z-10'>
                <h3 className='text-lg font-semibold text-black dark:text-white'>Management People</h3>
                <div className='mt-4'>
                  {
                    allUsers.map((user, idx) => (
                      <div key={idx} className="flex items-center gap-4.5 mb-2">
                        <Avatar avatarUrl={user?.avatarUrl} username={user?.username} />
                        <h6>{user.username}</h6>
                        {
                          !users.find(u => u.id === user.id) && (
                            <button onClick={handleAddUserToRoom(user.id)} className='ml-auto rounded bg-primary w text-white w-20 py-2'>Add</button>
                          )
                        }
                        {
                          users.find(u => u.id === user.id) && (
                            <button onClick={handleRemoveUserFromRoom(user.id)} className='ml-auto rounded bg-danger text-white w-20 py-2'>Remove</button>
                          )
                        }
                      </div>
                    ))
                  }
                </div>
                <div className='flex items-center gap-4.5 mt-4'>
                  <input onChange={(e)=>handleSearchUsers(e)} type="text" placeholder='Search user' className='w-full rounded border border-stroke p-2 dark:border-strokedark dark:bg-meta-4 dark:text-white' />
                  <button className='rounded bg-primary text-white px-4.5 py-2'>Add</button>
                </div>
              </div>
            )
          }
         </div>
        </div>
        </div>
        <div id='chat' className='overflow-y-scroll' style={{maxHeight: "70vh"}}>
          {messages.map((message, idx) => (
            <div key={idx} className="flex gap-4.5 border-t border-stroke px-4.5 py-3 hover:bg-gray-2 dark:border-strokedark dark:hover:bg-meta-4 relative">
              <Avatar avatarUrl={message.user?.avatarUrl} username={message.user?.username} width='14' height='14' />

              <div className="flex-grow">
                <h6 className="text-sm font-medium text-black dark:text-white">
                  {message.user?.username}
                </h6>
                <p className="text-sm">{message?.content}</p>
                <p className="text-xs">{howManyTimePassed(message?.createdAt)}</p>
              </div>

              {
                message.user?.id === userId && (
                  <button onClick={handleDeleteMessage(message.id)} className="absolute bottom-1 right-1 p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                )
              }
            </div>
          ))}
        </div>
      </div>



        <div className="mb-5.5">
        <label
          className="mb-3 block text-sm font-medium text-black dark:text-white"
          htmlFor="Username"
        >
          Send a message
        </label>
        <div className="relative">
          <span className="absolute left-4.5 top-4">
            <svg
              className="fill-current"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g opacity="0.8" clipPath="url(#clip0_88_10224)">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M1.56524 3.23223C2.03408 2.76339 2.66997 2.5 3.33301 2.5H9.16634C9.62658 2.5 9.99967 2.8731 9.99967 3.33333C9.99967 3.79357 9.62658 4.16667 9.16634 4.16667H3.33301C3.11199 4.16667 2.90003 4.25446 2.74375 4.41074C2.58747 4.56702 2.49967 4.77899 2.49967 5V16.6667C2.49967 16.8877 2.58747 17.0996 2.74375 17.2559C2.90003 17.4122 3.11199 17.5 3.33301 17.5H14.9997C15.2207 17.5 15.4326 17.4122 15.5889 17.2559C15.7452 17.0996 15.833 16.8877 15.833 16.6667V10.8333C15.833 10.3731 16.2061 10 16.6663 10C17.1266 10 17.4997 10.3731 17.4997 10.8333V16.6667C17.4997 17.3297 17.2363 17.9656 16.7674 18.4344C16.2986 18.9033 15.6627 19.1667 14.9997 19.1667H3.33301C2.66997 19.1667 2.03408 18.9033 1.56524 18.4344C1.0964 17.9656 0.833008 17.3297 0.833008 16.6667V5C0.833008 4.33696 1.0964 3.70107 1.56524 3.23223Z"
                  fill=""
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M16.6664 2.39884C16.4185 2.39884 16.1809 2.49729 16.0056 2.67253L8.25216 10.426L7.81167 12.188L9.57365 11.7475L17.3271 3.99402C17.5023 3.81878 17.6008 3.5811 17.6008 3.33328C17.6008 3.08545 17.5023 2.84777 17.3271 2.67253C17.1519 2.49729 16.9142 2.39884 16.6664 2.39884ZM14.8271 1.49402C15.3149 1.00622 15.9765 0.732178 16.6664 0.732178C17.3562 0.732178 18.0178 1.00622 18.5056 1.49402C18.9934 1.98182 19.2675 2.64342 19.2675 3.33328C19.2675 4.02313 18.9934 4.68473 18.5056 5.17253L10.5889 13.0892C10.4821 13.196 10.3483 13.2718 10.2018 13.3084L6.86847 14.1417C6.58449 14.2127 6.28409 14.1295 6.0771 13.9225C5.87012 13.7156 5.78691 13.4151 5.85791 13.1312L6.69124 9.79783C6.72787 9.65131 6.80364 9.51749 6.91044 9.41069L14.8271 1.49402Z"
                  fill=""
                />
              </g>
              <defs>
                <clipPath id="clip0_88_10224">
                  <rect width="20" height="20" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </span>

          <textarea
            className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
            name="bio"
            id="bio"
            rows={6}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          ></textarea>
        </div>
        </div>

        <div className="flex justify-end gap-4.5">
        <button
          className="flex justify-center rounded border border-stroke py-2 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
          type="submit"
        >
          Cancel
        </button>
        <button
          className="flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:shadow-1"
          type="submit"
          onClick={handleSendMessage}
        >
          Send
        </button>
        </div>
    </div>
  );
};

export default ChatRoom;