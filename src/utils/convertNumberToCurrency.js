/**
 * https://stackoverflow.com/questions/149055/how-can-i-format-numbers-as-currency-string-in-javascript
 *
 * @param number number: number to convert to currency value
 * @param currencySymbol currencySymbol: symbol of the currency i,e $ for UDS
 * @param decimals decimals: length of decimal
 * @param sectionLength sectionLength: length of whole part
 * @param sectionDelimiter   sectionDelimiter: sections delimiter
 * @param decimalDelimiter   decimalDelimiter: decimal delimiter
 */
const convertNumberToCurrency = (
  number,
  currencySymbol = '$',
  decimals = 2,
  sectionLength = 3,
  sectionDelimiter = ',',
  decimalDelimiter = '.',
) => {
  var re = `\\d(?=(\\d{${sectionLength || 3}})+${decimals > 0 ? '\\D' : '$'})`;
  var num = number.toFixed(Math.max(0, ~~decimals));

  const value = (decimalDelimiter
    ? num.replace('.', decimalDelimiter)
    : num
  ).replace(new RegExp(re, 'g'), `$&${sectionDelimiter || ','}`);

  return `${currencySymbol}${value}`;
};

export default convertNumberToCurrency;
