import { FilterCriteriaDto } from "./FilterCriteriaDto";
import { SortDirectionType } from "./SortDirectionType";

export interface SearchRequestDto {
    filters: FilterCriteriaDto[]
    globalOperator: GlobalOperator;
    sortBy: string
    sortDir: SortDirectionType

}

export enum GlobalOperator {
    AND,
    OR
}