import React, {useState} from 'react';
import {Text, StyleSheet, TouchableOpacity, View} from 'react-native';
import Colors from '../constants/Colors';
import {useDispatch} from 'react-redux';
import {eventsAction} from '../store/actions';
import {DatePicker} from '@ant-design/react-native';
import enUs from 'antd-mobile/lib/date-picker/locale/en_US';

export default function TimerComponent(props) {
  const dispatch = useDispatch();
  const {data, fnClose} = props;
  const nowTimeStamp = Date.now();
  const [customDate, setCustomDate] = useState(new Date(nowTimeStamp));

  const onSubmit = async (days) => {
    const time = nowTimeStamp + 3600 * 1000 * 24 * days;
    addReminder(time);
  };

  const addReminder = async (time) => {
    const params = {
      conversationId: data.conversationId,
      timestamp: time,
    };
    await dispatch(eventsAction.addTaskReminder(params));
    fnClose();
  };

  return (
    <View>
      <TouchableOpacity onPress={() => onSubmit(1)} style={styles.container}>
        <Text style={styles.text}>24 hr</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onSubmit(3)} style={styles.container}>
        <Text style={styles.text}>72 hr</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onSubmit(7)} style={styles.container}>
        <Text style={styles.text}>1 Week</Text>
      </TouchableOpacity>
      <View style={styles.container}>
        <DatePicker
          minDate={new Date(nowTimeStamp)}
          locale={enUs}
          value={customDate}
          onChange={(date) => {
            setCustomDate(new Date(date));
          }}
          onOk={(date) => {
            addReminder(new Date(date).getTime());
          }}
          onDismiss={() => fnClose()}>
          <Text style={styles.text}>Custom</Text>
        </DatePicker>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
    borderWidth: 1,
    borderColor: Colors.primaryInactive,
  },
  text: {
    color: Colors.primaryActive,
  },
});
