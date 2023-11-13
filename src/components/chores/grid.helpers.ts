/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-namespace */
import { ToastOptions, toast } from "react-toastify";
import { DateTime } from "luxon";
import axios from "axios";

export enum ToastTypeEnum {
  Success = "Success",
  Error = "Error",
  Information = "Information",
}
export module GridHelperFunctions {
  const toastOptions: ToastOptions = {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  };

  export const toaster = (type: ToastTypeEnum, message?: string) => {
    switch (type) {
      case ToastTypeEnum.Error:
        {
          const msg = message || "There was a problem processing your request";
          toast.error(`${msg}`, toastOptions);
        }
        break;
      case ToastTypeEnum.Success:
        {
          const msg = message || "Success";
          toast.success(`${msg}`, toastOptions);
        }
        break;
      case ToastTypeEnum.Information:
        {
          const msg = message || "Information";
          toast.info(`${msg}`, toastOptions);
        }
        break;
      default:
    }
  };

  export const calculateRecordsFound = (arr: any) => {
    if (Array.isArray(arr) && arr.length > 0) {
      return arr.length;
    }
    return 0;
  };

  export function isMobileView(width: number) {
    // Define a breakpoint for mobile view (e.g., 768 pixels)
    const mobileBreakpoint = 768;
  
    // Check if the viewport width is less than the mobile breakpoint
    return width < mobileBreakpoint;
  }
  

  export function isDateToday(dateTimeString: string): boolean {
    const inputDate = new Date(dateTimeString);
    const today = new Date();

    // Compare the year, month, and day of both dates
    return (
      inputDate.getFullYear() === today.getFullYear() &&
      inputDate.getMonth() === today.getMonth() &&
      inputDate.getDate() === today.getDate()
    );
  }
  export const isValidArray = <T>(arr: T[] | undefined | null): boolean => Array.isArray(arr) && arr.length > 0;

 
  export const formatToISO = (date: any): string => {
    if(!date) return '';
    // Convert the provided Date object to a Luxon DateTime object
    const luxonDateTime = DateTime.fromJSDate(date);
  
    // Format the Luxon DateTime object to ISO string
    const isoString = luxonDateTime.toISO();
  
    return isoString || ''; // Handle the case where Luxon fails to format the date
  };

 export function getValueOrDefault(value: any) {
    if (value !== null && value !== '' && value !== undefined) {
      return value;
    } else {
      return undefined;
    }
  }

  export function formatDateForDB(date: any) {
    
    const val = getValueOrDefault(date);
    if (val) {
      return formatToISO(val);
    } else {
      return undefined;
    }
  }

  export function getISODateOfMonth(dayOfMonth: number) {
    // Get the current date and set the provided day of the month
    const currentDate = DateTime.local().set({ day: dayOfMonth });
  
    // Format the date to ISO string
    const isoDateString = currentDate.toISO();
  
    return isoDateString;
  }
  export function getDayOfMonthLuxon(date: any) {
    // Check if the input is a valid Luxon DateTime object
    if(!date) return undefined;
  
    const luxonDateTime = DateTime.fromJSDate(date);
    return luxonDateTime.day;
  
 
  }
  export const stringIsNullOrEmpty = (str: string | undefined): boolean =>
  str === null || str === undefined || str === '' || str.trim().length === 0;

  export function handleAxiosError(error: any){
    if (axios.isAxiosError(error)) {
      console.error("axios res", error.response);
     toaster(
        ToastTypeEnum.Error,
        error?.response?.data?.message
      );
    } else {
      console.error(error);
   toaster(ToastTypeEnum.Error);
    }
  }
  
}
