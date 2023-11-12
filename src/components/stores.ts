export const _dayOfTheWeekStore = [
    {
      id: 1,
      name: "Monday",
    },
    {
      id: 2,
      name: "Tuesday",
    },
    {
      id: 3,
      name: "Wednesday",
    },
    {
      id: 4,
      name: "Thursday",
    },
    {
      id: 5,
      name: "Friday",
    },
    {
      id: 6,
      name: "Saturday",
    },
    {
      id: 7,
      name: "Sunday",
    },
  ];


  export enum Frequency {
    DAILY = "DAILY",
    WEEKLY = "WEEKLY",
    BIWEEKLY = "BIWEEKLY",
    MONTHLY = "MONTHLY",
    SPECIFIC_DATE = "SPECIFIC_DATE",
  }
  
  export const frequencyStore = [
    { id: Frequency.DAILY, name: "Daily" },
    { id: Frequency.WEEKLY, name: "Weekly" },
    { id: Frequency.MONTHLY, name: "Monthly" },
    { id: Frequency.BIWEEKLY, name: "Biweekly" },
    { id: Frequency.SPECIFIC_DATE, name: "Specific Date" },
  ];