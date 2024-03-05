import { PubSub } from 'graphql-subscriptions';

const pubsub = new PubSub();
const MESSAGE_RECEIVED = 'MESSAGE_RECEIVED';

export default {
    messageReceived: {
      subscribe: () => pubsub.asyncIterator([MESSAGE_RECEIVED]),
    },
};