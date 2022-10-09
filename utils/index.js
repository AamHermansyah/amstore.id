// auth
export const userMustLogin = (itMustLogin, token) => {
    itMustLogin = itMustLogin ? token === undefined : token !== undefined;
    return itMustLogin;
}

// formatRupiah
export const formatRupiah = (price) => {
    var	number_string = price.toString(),
	remnant 	= number_string.length % 3,
	rupiah 	= number_string.substr(0, remnant),
	thousands 	= number_string.substr(remnant).match(/\d{3}/g);
		
    if (thousands) {
        const separator = remnant ? '.' : '';
        rupiah += separator + thousands.join('.');
    }

    return rupiah
}

// text truncate
export const textTruncate = (text, length = 25) => {
    return text.length > length ? text.split('').splice(0, length).join('') + '...' : text
}

// debounce fetch
export const debounce = (func, delay = 300) => {
    let debounceTimer;
    return function () {
        const context = this;
        const args = arguments;
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => func.apply(context, args), delay);
    }
}

// get random number
export const getRandomNum = (max, length) => {
    if(length > max) return `${length} so bigger than ${max}`;
    const result = [];
    while(result.length < length){
      const random = Math.floor(Math.random() * max);
      if(!result.find(num => num === random)){
        result.push(random);
      }
    }
    
    return result
  }

// sum all number in array
export const sumNumberInArr = (arr) => {
    arr = arr
        .filter(product => product.is_transaction === 0)
        .map(product => product.unit_price)
        .reduce((acc, value) => acc + (+value), 0);
    return formatRupiah(arr);
}

// remove br tag html from string
export const removeBrTagHtml = (string) => {
    return string.replace(/(<br>)/g, "")
}