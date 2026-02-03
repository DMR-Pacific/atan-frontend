import { ClientOrderAddDto } from "./ClientOrderAddDto";
import { ClientOrderUpdateDto } from "./ClientOrderUpdateDto";
import { DmrOrderDto } from "./DmrOrderDto";

export interface ClientOrderFormData {
  label: string;
  assignedToIdList: number[];
  dmrOrders?: DmrOrderDto[] // only use when adding dmrOrders that dont exist yet
  dmrOrderIds: number[];       // only used for Add
  priorityId?: number | null;
  clientTypeId?: number | null;
  statusId?: number | null;
  categoryId?: number | null;
  dueDate?: string;
  notes?: string;
  value?: number;
}

export const mapFormToAddDto = (formData: ClientOrderFormData): ClientOrderAddDto => ({
  label: formData.label,
  assignedToIdList: formData.assignedToIdList,
  dmrOrderIds: formData.dmrOrderIds || [],
  priorityId: formData.priorityId ?? null,
  clientTypeId: formData.clientTypeId ?? null,
  statusId: formData.statusId ?? null,
  categoryId: formData.categoryId ?? null,
  dueDate: formData.dueDate ?? '',
  notes: formData.notes ?? '',
  value: formData.value ?? 0,
  dmrOrders: formData.dmrOrders || [],
});

export const mapFormToUpdateDto = (formData: ClientOrderFormData): ClientOrderUpdateDto => ({
  label: formData.label, // optional in backend if you want
  assignedToIdList: formData.assignedToIdList,
  priorityId: formData.priorityId ?? undefined,
  clientTypeId: formData.clientTypeId ?? undefined,
  statusId: formData.statusId ?? undefined,
  categoryId: formData.categoryId ?? undefined,
  dueDate: formData.dueDate,
  notes: formData.notes,
  value: formData.value,
  dmrOrderIds: formData.dmrOrderIds,
});
