export function cleanString(str: string, decimals: number) {
    if (!str || Number(str) === 0 || Number(str) === NaN) return '0';
    let newStr = '';
    if (str.length <= decimals) {
        const diff = decimals - str.length;
        const list = str.split('');
        for (let i = 0; i < diff; i++) {
            list.splice(0, -1, '0');
        }
        list.splice(0, -1, '0.');
        newStr = list.join('');
    } else {
        newStr = str;
        const decimalPlaces = newStr.slice(decimals);
        const inFront = newStr.slice(0, str.length - decimals);
        newStr = `${inFront}.${decimalPlaces}`;
    }
  
    return newStr;
  }