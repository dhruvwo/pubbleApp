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

function handleTime(d, s12, s1, s11) {
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

  if (s1 != null) s1.html(curr_date);
  if (s11 != null) s11.html(m_names[curr_month]);

  var hours = d.getHours();
  var minutes = d.getMinutes();
  var ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0' + minutes : minutes;
  //9:30<span>AM</span>
  if (s12 != null)
    s12.html(hours + ':' + minutes + '<span>' + ampm + '</span>');
}
function handleDateStr(d, ele, isDay) {
  if (isDay) {
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
    //30<span>JUN</span>

    ele.html(curr_date + '<span>' + m_names[curr_month] + '</span>');
  } else {
    //9:30<span>AM</span>

    var hours = d.getHours();
    var minutes = d.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    //9:30<span>AM</span>
    ele.html(hours + ':' + minutes + '<span>' + ampm + '</span>');
  }
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
