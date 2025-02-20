import dayjs from "dayjs";

export function     isSameDay(dateString) {
    const providedDate = dayjs(dateString, "YYYY-MM-DD HH:mm:ss");
    const currentDate = dayjs();
    return providedDate.isSame(currentDate, "day");
}
