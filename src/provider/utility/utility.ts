// Make a string start with a capital letter
const capitalizer = (str: string): string => {
  let splittedString = str.trim().split(' ')
  let capitalizedString = ''
  
  for(let string of splittedString){
    capitalizedString += `${string[0].toUpperCase()}${string.substring(1, string.length)} `
  }
  return capitalizedString.trim()
}

const validateArrayElements = (arr: Array<any> | any): boolean => {
  let result = false

  if(typeof arr === 'string' || typeof arr === 'number') return true;
  if(!arr) return false;

  if(arr.length > 0) {
    for(let element of arr){
      if(element.toUpperCase() === element && element.toLowerCase() === element){
        result = true; break;
      }
      else result = false;
    }
  }

  return result
}

const capitalizeArrayElements = (arr: Array<string>): Array<string> => {
  let capitalizedArray = []
  for(let str of arr){
    capitalizedArray.push(capitalizer(str))
  }
  return capitalizedArray
}


export default {
    capitalizer,
    validateArrayElements,
    capitalizeArrayElements
}