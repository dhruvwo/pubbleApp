import * as _ from 'lodash';

export function formatAMPM2(date) {
  let newDate = new Date(date);
  var hours = newDate.getHours();
  var minutes = newDate.getMinutes();
  var year = newDate.getFullYear();

  var ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0' + minutes : minutes;
  var strTime = hours + ':' + minutes + ' ' + ampm;
  var today = new Date();

  if (
    today.getTime() - newDate.getTime() > 60000 * 60 * 24 ||
    today.getDay() != newDate.getDay()
  )
    strTime = formatDateTime(newDate);

  if (year != today.getFullYear()) strTime = strTime + ', ' + year;
  return strTime;
}

export function getUserInitals(alias) {
  if (alias) {
    if (alias.includes(' ')) {
      let name = alias;
      if (name) {
        let firstName = alias.split(' ')[0];
        let lastName = alias.split(' ')[1];
        return (firstName.charAt(0) || '') + (lastName.charAt(0) || '');
      }
      return '';
    }
    return alias.charAt(0) + alias.charAt(1);
  }
  return ' ';
}

export function formatAMPM(date) {
  let newDate = new Date(date);
  var hours = newDate.getHours();
  var minutes = newDate.getMinutes();
  var year = newDate.getFullYear();

  var ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0' + minutes : minutes;
  var strTime = hours + ':' + minutes + ' ' + ampm;
  var today = new Date();

  if (
    today.getTime() - newDate.getTime() > 60000 * 60 * 24 ||
    today.getDay() != newDate.getDay()
  )
    strTime += ' - ' + formatDateTime(newDate);

  if (year != today.getFullYear()) strTime = strTime + ', ' + year;
  return strTime;
}

function formatDateTime(d) {
  var m_names = new Array(
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  );
  var curr_date = d.getDate();
  var curr_month = d.getMonth();
  return curr_date + ' ' + m_names[curr_month];
}

export function replaceAll(str, search, replacement) {
  var newStr = '';
  if (_.isString(str)) {
    // maybe add a lodash test? Will not handle numbers now.
    newStr = str.split(search).join(replacement);
  }
  return newStr;
}

function filterXss(str) {
  var regex = /\[url=(\s)*javascript:.*?\].*?\[\/url\]/gi;
  str = str.replaceAll(regex, '');
  return str;
}

export function handleURLBB(str) {
  str = filterXss(str);

  var regex = /\[url=(.*?)\](.*?)\[\/url\]/g;

  str = str.replace(regex, '<a href="$1" target="_blank">$2</a>');

  return str;
}

export function safeContent(content) {
  content = content.replace('onerror=prompt(/XSSPOSED/)', '');
  content = content.replace('onload=prompt(/XSSPOSED/)', '');
  content = content.replace('prompt(/XSSPOSED/)', '');
  content = content.replaceAll('onerror=', '');
  content = content.replaceAll('alert(', '');
  content = content.replaceAll('javascript:alert', '');
  content = content.replaceAll('alert(.*?)', '');
  return content;
}
