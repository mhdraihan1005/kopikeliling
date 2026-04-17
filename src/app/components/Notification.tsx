type NotificationType = "info" | "success" | "warning" | "error";

interface NotificationProps {
  title?: string;
  message: string;
  type?: NotificationType;
}

const styles: Record<NotificationType, string> = {
  info: "border-sky-300/70 bg-sky-50 text-sky-700 dark:border-sky-600/40 dark:bg-sky-950/40 dark:text-sky-200",
  success: "border-emerald-300/70 bg-emerald-50 text-emerald-700 dark:border-emerald-600/40 dark:bg-emerald-950/40 dark:text-emerald-200",
  warning: "border-amber-300/70 bg-amber-50 text-amber-700 dark:border-amber-600/40 dark:bg-amber-950/40 dark:text-amber-200",
  error: "border-rose-300/70 bg-rose-50 text-rose-700 dark:border-rose-600/40 dark:bg-rose-950/40 dark:text-rose-200",
};

export default function Notification({ title, message, type = "info" }: NotificationProps) {
  return (
    <div className={`rounded-3xl border p-4 text-sm shadow-sm ${styles[type]}`}>
      {title ? <h3 className="mb-1 font-semibold">{title}</h3> : null}
      <p>{message}</p>
    </div>
  );
}
