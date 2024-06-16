import { Message, Action } from '@/types';

const initialState : { 
    messages: Message[] 
} = {
    messages: [],
};

const chatReducer = (state = initialState, action: Action) => {
  switch (action.type) {
    case 'CHAT_MESSAGE_RECEIVED':
      return {
        ...state,
        messages: [...state.messages, action.payload],
      };
    case 'CHAT_SET_MESSAGES':
      return {
        ...state,
        messages: action.payload,
      };
    case 'DELETED_MESSAGE':
      return {
        ...state,
        messages: state.messages.filter((message) => message.id !== action.payload),
      };
    default:
      return state;
  }
};

export default chatReducer;
