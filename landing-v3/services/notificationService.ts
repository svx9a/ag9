/**
 * LINE Notification Service
 * Sends notifications via the backend using LINE Messaging API.
 */

const API_BASE_URL = '';

export const LineNotificationService = {
  async sendNotification(userId: string, message: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/line/notify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, message }),
      });

      if (!response.ok) {
        throw new Error('Failed to send LINE notification');
      }

      return await response.json();
    } catch (error) {
      console.error('LineNotificationService Error:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Send a rich message for spraying task updates
   */
  async sendTaskUpdate(userId: string, taskDetails: any) {
    const message = `📡 HiveGrid: Task Update!\nTask: ${taskDetails.id}\nStatus: ${taskDetails.status}\nLocation: ${taskDetails.location}\nPowered by KasetGenY`;
    return this.sendNotification(userId, message);
  }
};
