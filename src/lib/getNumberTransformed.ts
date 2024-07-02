

export const removeexponentials = (n:any) => {
    var sign = +n < 0 ? "-" : "",
      toStr = n.toString();
    if (!/e/i.test(toStr)) {
      return n;
    }
    var [lead, decimal, pow] = n.toString()
      .replace(/^-/, "")
      .replace(/^([0-9]+)(e.*)/, "$1.$2")
      .split(/e|\./);
    return +pow < 0
      ? sign + "0." + "0".repeat(Math.max(Math.abs(pow) - 1 || 0, 0)) + lead + decimal
      : sign + lead + (+pow >= decimal.length ? (decimal + "0".repeat(Math.max(+pow - decimal.length || 0, 0))) : (decimal.slice(0, +pow) + "." + decimal.slice(+pow)))
  }
  
  
  export const getdecimalcount = (lastprice:any)  => {
    var decimalindex = 2;
    var _tmp = (removeexponentials(lastprice) + "").split(".");
    if (Number(_tmp[0]) == 0) {
      decimalindex = decimalindex + 2;
      var indexpricearray = (removeexponentials(lastprice) + "").split(".")[1];
      if (indexpricearray != null)
        for (var loopvar = 0; (loopvar < indexpricearray.length); loopvar++) {
          if (Number(indexpricearray[loopvar]) == 0)
            decimalindex = decimalindex + 1;
          else
            break;
        }
    }
    else if (Number(_tmp[0]) < 10) {
      decimalindex = 5;
    }
    else if (Number(_tmp[0]) < 50) {
      decimalindex = 4;
    }
    else if (Number(_tmp[0]) < 100) {
      decimalindex = 3;
    }
    else if (Number(_tmp[0]) < 500) {
      decimalindex = 2;
    }
    else {
      decimalindex = 1;
    }
    //console.log(decimalindex)
    return decimalindex;
  }
  
  
  export const getnumbertransformed=(number:any, nodots = false) => {
    //if (isNaN(Number(number)))
    if (!isNumber(number)) {
      return number;
    }
    else {
      var decimals = getdecimalcount(Number(number));
      if (decimals < 11) {
        return removeexponentials(truncateToDecimals(Number(number), decimals));
      }
      else if (nodots) {
        return removeexponentials(truncateToDecimals(Number(number), decimals));
      }
      else {
        number = removeexponentials(Number(number));
        return (number + "").substring(0, 4) + "..." + (number + "").substring((number + "").length - 3);
      }
    }
  }
  
  export const isNumber =(value:any) => {
    return (typeof value === 'number' && !isNaN(value)) || ((typeof value === 'string') && value.trim() != '' && !isNaN(Number(value)))
  }
  export const truncateToDecimals = (num:any, fixed = 0)  => {
    try {
      if (num == Infinity) {
        return num;
      }
      else if (!isNumber(num)) {
        return num;
      }
      else if (num == null)
        return num;
      else {
        num = removeexponentials(num);
        //console.log(num + "   " + fixed);
        var re = new RegExp('^-?\\d+(?:\.\\d{0,' + (fixed || -1) + '})?');
        return num.toString().match(re)[0];
      }
    }
    catch (e) {
   
      console.error(e);
      console.log(num + "   " + fixed);
      return num;
    }
  }