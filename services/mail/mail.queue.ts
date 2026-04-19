import AsyncStorage from "@react-native-async-storage/async-storage";

const MAIL_QUEUE_KEY = "MAIL_QUEUE";

export const MailQueue = {
    async getQueue() {
        const data = await AsyncStorage.getItem(MAIL_QUEUE_KEY);
        return data ? JSON.parse(data) : [];
    },

    async addToQueue(mailItem: any) {
        const queue = await this.getQueue();
        queue.push({
            ...mailItem,
            retries: 0,
            createdAt: Date.now(),
        });
        await AsyncStorage.setItem(MAIL_QUEUE_KEY, JSON.stringify(queue));
    },

    async updateQueue(queue: any[]) {
        await AsyncStorage.setItem(MAIL_QUEUE_KEY, JSON.stringify(queue));
    },

    async clearQueue() {
        await AsyncStorage.removeItem(MAIL_QUEUE_KEY);
    },
};