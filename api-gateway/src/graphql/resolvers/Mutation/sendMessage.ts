import { ResolverContext } from "../../types";
import { PubSub } from 'graphql-subscriptions';

const pubsub = new PubSub();
const MESSAGE_RECEIVED = 'MESSAGE_RECEIVED';

interface Args {
  sender: string;
  content: string;
}

const sendMessageResolver = async ({ sender, content } : Args) => {
    const message = { id: Date.now().toString(), sender, content };
    pubsub.publish(MESSAGE_RECEIVED, { messageReceived: message });
    return message;
};

export default sendMessageResolver;