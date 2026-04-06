export interface FilterCriteriaDto {
    column: string;
    value: any;

    operation: Operation
}

export enum Operation {
    EQUAL = "EQUAL",
    LIKE = "LIKE",
    IN = "IN",
    GREATER_THAN = "GREATER_THAN",
    LESS_THAN = "LESS_THAN",
    BETWEEN = "BETWEEN",
    JOIN = "JOIN"
}