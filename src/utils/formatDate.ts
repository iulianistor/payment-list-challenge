import { format } from "date-fns";

// since tests already use date-fns
export const formatDate = (date: string) => {
    return format(new Date(date), "dd/MM/yyyy, HH:mm:ss");
};