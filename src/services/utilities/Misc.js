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

export function getUserFromCollection(userId, usersState) {
  return {
    id: userId,
  };
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
