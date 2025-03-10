import { messaging } from "../configs/firebase";
import { Order, WorkStatus, OrderStatus } from "@prisma/client";
import prisma from "@/configs/database";
import logger from "./logger";
import { Message } from "firebase-admin/lib/messaging/messaging-api";

export interface NotificationData {
  title: string;
  body: string;
  orderId: string;
  type: "ORDER_STATUS_CHANGED" | "WORK_STATUS_CHANGED";
  newStatus: string;
}

export const sendNotificationToUser = async (
  userId: string,
  data: NotificationData
): Promise<string | null> => {
  try {
    // Ambil token FCM dari profil pengguna
    const userProfile = await prisma.userProfile.findUnique({
      where: { userId },
      select: { fcmToken: true },
    });

    if (!userProfile?.fcmToken) {
      logger.warn(`Tidak ada token FCM untuk user ID: ${userId}`);
      return null;
    }

    const message: Message = {
      token: userProfile.fcmToken,
      notification: {
        title: data.title,
        body: data.body,
      },
      data: {
        orderId: data.orderId,
        type: data.type,
        newStatus: data.newStatus,
        click_action: "FLUTTER_NOTIFICATION_CLICK", // Untuk Flutter apps
      },
      android: {
        priority: "high",
        notification: {
          channelId: "bengkel-service-notifications",
        },
      },
      apns: {
        payload: {
          aps: {
            badge: 1,
            sound: "default",
          },
        },
      },
    };

    const response = await messaging.send(message);
    logger.info(`Notifikasi berhasil dikirim: ${response}`);
    return response;
  } catch (error) {
    logger.error("Error saat mengirim notifikasi:", error);
    throw error;
  }
};

export const generateStatusChangeNotification = (
  order: Order,
  oldStatus: OrderStatus | WorkStatus | null,
  newStatus: OrderStatus | WorkStatus,
  statusType: "order" | "work"
): NotificationData => {
  const statusMapping = {
    // Pesan status Order
    DRAFT: "Pesanan Anda masih dalam draft",
    CONFIRMED: "Pesanan Anda telah dikonfirmasi",
    PROCESSING: "Pesanan Anda sedang diproses",
    COMPLETED: "Pesanan Anda telah selesai",
    CANCELLED: "Pesanan Anda telah dibatalkan",

    // Pesan status Pekerjaan
    QUEUED: "Motor Anda dalam antrian servis",
    INSPECTION: "Motor Anda sedang dalam inspeksi",
    IN_PROGRESS: "Motor Anda sedang dalam pengerjaan",
    // CANCELLED: "Pengerjaan motor Anda dibatalkan",
  };

  const title =
    statusType === "order"
      ? "Status Pesanan Berubah"
      : "Status Pengerjaan Berubah";

  const body =
    statusMapping[newStatus as keyof typeof statusMapping] ||
    `Status ${statusType === "order" ? "pesanan" : "pengerjaan"} berubah menjadi ${newStatus}`;

  return {
    title,
    body,
    orderId: order.id,
    type:
      statusType === "order" ? "ORDER_STATUS_CHANGED" : "WORK_STATUS_CHANGED",
    newStatus: newStatus.toString(),
  };
};
