// 防抖处理,把刷新函数传，如果timer有值每次timer清零，然后设定
// 延时时间如果时间没到又有图片传入就再调用，如果加载完了时间到了之后就会回调刷新函数
export function debounce(func, delay) {
    let timer = null;
    return function (args) {
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => {
            func.apply(args);
        }, delay);
    };
}
export function formatDate(date, fmt) {
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    let o = {
      'M+': date.getMonth() + 1,
      'd+': date.getDate(),
      'h+': date.getHours(),
      'm+': date.getMinutes(),
      's+': date.getSeconds()
    };
    for (let k in o) {
      if (new RegExp(`(${k})`).test(fmt)) {
        let str = o[k] + '';
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
      }
    }
    return fmt;
  };
  
  function padLeftZero (str) {
    return ('00' + str).substr(str.length);
  };
  
  