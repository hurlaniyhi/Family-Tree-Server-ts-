// Make a string start with a capital letter
const capitalizer = (str: string): string => {
    return str.toLowerCase().replace(/^\w|\s\w/g, function (letter: string) {
        return letter.toUpperCase();
    })   
}

export default {
    capitalizer
}