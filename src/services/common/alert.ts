import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

// ✅ Reusable confirm modal
export const confirmAction = async (
  title: string,
  text: string,
  confirmButtonText = 'Yes',
  cancelButtonText = 'Cancel'
): Promise<boolean> => {
  const result = await MySwal.fire({
    title,
    text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText,
    cancelButtonText,
  });

  return result.isConfirmed;
};

// ✅ Reusable toast
export const showToast = (
  message: string,
  type: 'success' | 'error' | 'info' | 'warning' = 'success'
) => {
  Swal.fire({
    toast: true,
    position: 'top-end',
    icon: type,
    title: message,
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
  });
};
