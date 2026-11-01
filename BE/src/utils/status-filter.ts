import { STATUS_FILTERS, type StatusFilter } from "../constants/catalog.constants.js";

// undefined berarti tanpa filter is_active.
export function statusToIsActive(status: StatusFilter): boolean | undefined {
  if (status === STATUS_FILTERS.ALL) {
    return undefined;
  }
  return status === STATUS_FILTERS.ACTIVE;
}
