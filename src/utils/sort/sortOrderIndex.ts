import { BaseReferenceType } from "@/types/BaseReferenceType";

export const sortByOrderIndexDesc = (a: BaseReferenceType, b: BaseReferenceType) => b.orderIndex - a.orderIndex;
