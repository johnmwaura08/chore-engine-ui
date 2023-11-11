export type ChoreResponseDto = {
    createdAt: Date;
    updatedAt: Date;
    description: string;
    name: string;
    familyId: number;
    familyName: string;
    frequency: string;
    dayOfMonth: number | null;
    dayOfWeek: number | null;
    specificDate: Date | null;
    userId: number;
    userEmail: string;
    userName: string;
    id: number;
  }