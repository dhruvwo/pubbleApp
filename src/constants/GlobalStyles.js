import {StyleSheet, Dimensions} from 'react-native';
import Colors from '../constants/Colors';

const {width, height} = Dimensions.get('window');

const GlobalStyles = StyleSheet.create({
  windowWidth: width,
  windowHeight: height,
  mainView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    justifyContent: 'center',
    padding: 10,
    borderRadius: 5,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.primary,
    elevation: 1,
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 2.62,
  },
  buttonText: {
    color: Colors.primary,
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center',
  },
  buttonDisabledContainer: {
    opacity: 0.6,
    // backgroundColor: Colors.greyText,
  },
  secondaryButtonContainer: {
    justifyContent: 'center',
    padding: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary,
    elevation: 1,
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 2.62,
  },
  secondaryButtonText: {
    color: Colors.white,
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center',
  },
  flexStyle: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
  },
  footerText: {
    fontSize: 14,
    textAlign: 'center',
  },
  emptyContainer: {
    padding: 16,
    alignItems: 'center',
  },
  devider: {
    borderRightWidth: 0.5,
    borderRightColor: '#ffffff',
    marginVertical: 10,
  },
});

export default GlobalStyles;
