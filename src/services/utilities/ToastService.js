import Toast from 'react-native-simple-toast';

export default function ToastService(props) {
  Toast.show(props.message, props.isLong ? Toast.LONG : Toast.SHORT);
}
