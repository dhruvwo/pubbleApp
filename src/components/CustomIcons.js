import {View} from 'react-native';
import React from 'react';
import Colors from '../constants/Colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import Octicons from 'react-native-vector-icons/Octicons';

export default class CustomIconsComponent extends React.Component {
  render() {
    return <View>{this.fontsContainer()}</View>;
  }

  fontsContainer() {
    const props = this.props;
    switch (props.type) {
      case 'Entypo':
        return (
          <Entypo
            style={props.style ? props.style : {}}
            name={props.name}
            size={props.size ? props.size : 25}
            color={props.color ? props.color : Colors.primary}
          />
        );
      case 'Ionicons':
        return (
          <Ionicons
            style={props.style ? props.style : {}}
            name={props.name}
            size={props.size ? props.size : 25}
            color={props.color ? props.color : Colors.primary}
          />
        );
      case 'FontAwesome5':
        return (
          <FontAwesome5
            style={props.style ? props.style : {}}
            name={props.name}
            size={props.size ? props.size : 25}
            color={props.color ? props.color : Colors.primary}
          />
        );
      case 'FontAwesome':
        return (
          <FontAwesome
            style={[
              props.style ? props.style : {},
              {
                fontSize: props.size || 25,
                color: props.color || Colors.primary,
              },
            ]}
            name={props.name}
          />
        );
      case 'AntDesign':
        return (
          <AntDesign
            style={[
              props.style ? props.style : {},
              {
                fontSize: props.size || 25,
                color: props.color || Colors.primary,
              },
            ]}
            name={props.name}
          />
        );
      case 'MaterialIcons':
        return (
          <MaterialIcons
            style={[
              props.style ? props.style : {},
              {
                fontSize: props.size || 25,
                color: props.color || Colors.primary,
              },
            ]}
            name={props.name}
          />
        );
      case 'MaterialCommunityIcons':
        return (
          <MaterialCommunityIcons
            style={[
              props.style ? props.style : {},
              {
                fontSize: props.size || 25,
                color: props.color || Colors.primary,
              },
            ]}
            name={props.name}
          />
        );
      case 'Feather':
        return (
          <Feather
            style={[
              props.style ? props.style : {},
              {
                fontSize: props.size || 25,
                color: props.color || Colors.primary,
              },
            ]}
            name={props.name}
          />
        );
      case 'Octicons':
        return (
          <Octicons
            style={[
              props.style ? props.style : {},
              {
                fontSize: props.size || 25,
                color: props.color || Colors.primary,
              },
            ]}
            name={props.name}
          />
        );
      default:
        return (
          <Ionicons
            style={props.style ? props.style : {}}
            name={props.name}
            size={props.size || 25}
            color={props.color || Colors.primary}
          />
        );
    }
  }
}
