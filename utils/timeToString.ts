export function timeToText(time) {
    if(time < 12){
        return `${time}:00 A.M`
    }
    else {
        return `${time}:00 P.M`
    }
}