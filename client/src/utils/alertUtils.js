import Swal from 'sweetalert2';

// Custom clean white & blue theme consistent with portfolio styling
const lightCustomClass = {
  popup: 'rounded-2xl bg-white border border-[#dce7fa] text-[#1a1a1a] shadow-2xl font-sans',
  title: 'text-lg font-bold text-[#1a1a1a] tracking-tight',
  htmlContainer: 'text-xs text-[#555555]',
  confirmButton: 'px-5 py-2.5 rounded-full bg-[#1683FF] hover:bg-[#1371dc] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-[#1683FF]/20 mx-1.5 focus:outline-none',
  cancelButton: 'px-5 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-[#444444] font-semibold text-xs transition-all mx-1.5 focus:outline-none',
  denyButton: 'px-5 py-2.5 rounded-full bg-red-50 hover:bg-red-100 text-red-600 font-semibold text-xs transition-all mx-1.5 focus:outline-none',
};

// Lightweight Toast for fast success updates (Home toggles, order changes, saves)
export const toastSuccess = (message = 'Saved successfully.') => {
  return Swal.fire({
    toast: true,
    position: 'top-end',
    icon: 'success',
    title: message,
    showConfirmButton: false,
    timer: 2800,
    timerProgressBar: true,
    background: '#ffffff',
    color: '#1a1a1a',
    iconColor: '#1683FF',
    customClass: {
      popup: 'border border-[#dce7fa] rounded-xl shadow-lg',
      title: 'text-xs font-semibold text-[#1a1a1a]',
    },
  });
};

export const toastError = (message = 'Something went wrong.') => {
  return Swal.fire({
    toast: true,
    position: 'top-end',
    icon: 'error',
    title: message,
    showConfirmButton: false,
    timer: 3500,
    timerProgressBar: true,
    background: '#ffffff',
    color: '#1a1a1a',
    iconColor: '#ef4444',
    customClass: {
      popup: 'border border-red-200 rounded-xl shadow-lg',
      title: 'text-xs font-semibold text-red-600',
    },
  });
};

// Modal Alert for Detailed Success
export const showSuccess = (title = 'Success!', text = '') => {
  return Swal.fire({
    icon: 'success',
    title,
    text,
    background: '#ffffff',
    color: '#1a1a1a',
    iconColor: '#1683FF',
    buttonsStyling: false,
    customClass: lightCustomClass,
    confirmButtonText: 'OK',
  });
};

// Modal Alert for Errors with HTTP / Message Parser
export const showError = (errorOrMessage, defaultFallback = 'Unable to complete the action. Please try again.') => {
  let message = defaultFallback;

  if (typeof errorOrMessage === 'string' && errorOrMessage.trim()) {
    message = errorOrMessage;
  } else if (errorOrMessage?.response) {
    const status = errorOrMessage.response.status;
    const backendMsg = errorOrMessage.response.data?.message;

    if (backendMsg && typeof backendMsg === 'string') {
      message = backendMsg;
    } else if (status === 400) {
      message = 'Please check the information you entered and try again.';
    } else if (status === 401) {
      message = 'Your session has expired. Please log in again.';
    } else if (status === 403) {
      message = 'You do not have permission to perform this action.';
    } else if (status === 404) {
      message = 'The requested item could not be found.';
    } else if (status === 409) {
      message = 'An item with this information already exists.';
    } else if (status === 422) {
      message = 'Validation failed. Please verify the submitted data.';
    } else if (status >= 500) {
      message = 'Server encountered an issue. Please try again later.';
    }
  } else if (errorOrMessage?.message) {
    if (errorOrMessage.message.includes('Network Error')) {
      message = 'Unable to connect to server. Please check your internet connection.';
    } else {
      message = errorOrMessage.message;
    }
  }

  return Swal.fire({
    icon: 'error',
    title: 'Action Failed',
    text: message,
    background: '#ffffff',
    color: '#1a1a1a',
    iconColor: '#ef4444',
    buttonsStyling: false,
    customClass: lightCustomClass,
    confirmButtonText: 'Understood',
  });
};

// Confirmation Dialog for Destructive / Important Actions
export const showConfirm = async ({
  title = 'Are you sure?',
  text = 'This action cannot be undone.',
  confirmText = 'Yes, Proceed',
  cancelText = 'Cancel',
  icon = 'warning',
  isDestructive = true,
}) => {
  const result = await Swal.fire({
    title,
    text,
    icon,
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    reverseButtons: true,
    buttonsStyling: false,
    background: '#ffffff',
    color: '#1a1a1a',
    iconColor: isDestructive ? '#ef4444' : '#1683FF',
    customClass: {
      ...lightCustomClass,
      confirmButton: isDestructive
        ? 'px-5 py-2.5 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-red-600/20 mx-1.5 focus:outline-none'
        : lightCustomClass.confirmButton,
    },
  });

  return result.isConfirmed;
};

// Warning / Information Alert
export const showWarning = (title = 'Notice', text = '') => {
  return Swal.fire({
    icon: 'warning',
    title,
    text,
    background: '#ffffff',
    color: '#1a1a1a',
    iconColor: '#f59e0b',
    buttonsStyling: false,
    customClass: lightCustomClass,
    confirmButtonText: 'OK',
  });
};
