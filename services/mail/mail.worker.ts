import { api } from "../api";
import { MailQueue } from "./mail.queue";
const MAX_RETRIES = 1;
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export async function processMailQueue(token: string | null) {
  const queue = await MailQueue.getQueue();
  const updatedQueue = [];

  for (const item of queue) {
    try {
      await api.sendMail(token, item);
      console.log("✅ Mail sent:", item.to);
    } catch (error) {
      if (item.retries < MAX_RETRIES) {
        item.retries += 1;

        // exponential backoff
        const backoff = Math.pow(2, item.retries) * 1000;
        await delay(backoff);

        updatedQueue.push(item);
      } else {
        console.log("❌ Dropping mail after max retries:", item.to);
      }
    }
  }

  await MailQueue.updateQueue(updatedQueue);
}