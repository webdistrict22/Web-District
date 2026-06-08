import toast from "react-hot-toast";
import ConfirmDialog from "../components/common/ConfirmDialog";

export function confirmAction({
  title = "Confirm action",
  message = "Are you sure you want to continue?",
  confirmText = "Confirm",
  cancelText = "Cancel",
} = {}) {
  return new Promise((resolve) => {
    let isSettled = false;
    let toastId;
    const trigger = document.activeElement;

    const close = (value) => {
      if (isSettled) return;
      isSettled = true;
      toast.remove(toastId);
      resolve(value);
      window.requestAnimationFrame(() => trigger?.focus?.());
    };

    toastId = toast.custom(
      (toastState) => (
        <ConfirmDialog
          toastState={toastState}
          title={title}
          message={message}
          confirmText={confirmText}
          cancelText={cancelText}
          onClose={close}
        />
      ),
      { duration: Infinity }
    );
  });
}
