import dayjs from "dayjs";

export function isSameDay(dateString) {
    const providedDate = dayjs(dateString, "YYYY-MM-DD HH:mm:ss");
    const currentDate = dayjs();
    return providedDate.isSame(currentDate, "day");
}

export function greetings() {
    const currentDate = new Date().getHours();
    if(currentDate < 12){
        return 'Amazing Morning'
    }
    else if(currentDate < 18){
        return 'Amazing Afternoon'
    }
    else{
        return 'Amazing Morning'
    }
}
