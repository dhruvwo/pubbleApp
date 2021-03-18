import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  ScrollView,
  StatusBar,
} from 'react-native';
import {
  WingBlank,
  WhiteSpace,
  InputItem,
  ActivityIndicator,
} from '@ant-design/react-native';
import EventsDetailsHeaderTabs from '../components/EventsDetailsHeaderTabs';
import Colors from '../constants/Colors';
import CustomIconsComponent from '../components/CustomIcons';

export default function EventsDetailsScreen(props) {
  return (
    <SafeAreaView style={{backgroundColor: Colors.white, flex: 1}}>
      <StatusBar barStyle={'dark-content'} />
      <EventsDetailsHeaderTabs navigation={props.navigation} />

      <ScrollView>
        <View style={{paddingBottom: 50}}>
          <WhiteSpace />
          <WhiteSpace />
          <WhiteSpace />
          <WingBlank>
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'row',
              }}>
              <View
                style={{
                  backgroundColor: '#ff5d87',
                  alignItems: 'center',
                  paddingVertical: 5,
                  paddingHorizontal: 10,
                  borderRadius: 4,
                }}>
                <Text
                  style={{
                    fontSize: 28,
                    fontWeight: 'bold',
                    color: Colors.white,
                    flexWrap: 'wrap',
                  }}>
                  9
                </Text>
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    color: Colors.white,
                  }}>
                  Mar
                </Text>
              </View>

              <View
                style={{
                  marginHorizontal: 8,
                }}>
                <Text
                  style={{
                    color: '#ff5d87',
                    fontWeight: 'bold',
                    fontSize: 16,
                  }}>
                  -
                </Text>
              </View>

              <View
                style={{
                  backgroundColor: '#ff5d87',
                  alignItems: 'center',
                  paddingVertical: 5,
                  paddingHorizontal: 10,
                  borderRadius: 4,
                }}>
                <Text
                  style={{
                    fontSize: 28,
                    fontWeight: 'bold',
                    color: Colors.white,
                    flexWrap: 'wrap',
                  }}>
                  30
                </Text>
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    color: Colors.white,
                  }}>
                  Jun
                </Text>
              </View>
            </View>
          </WingBlank>

          <WhiteSpace />
          <WhiteSpace />
          <WhiteSpace />
          <WingBlank>
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text style={{fontSize: 16, color: '#ff5d87'}}>
                5:30 AM - 4:30 AM
              </Text>

              <WhiteSpace />
              <WhiteSpace />
              <Text style={{fontSize: 17}}>Test Live QA App</Text>
              <Text style={{fontSize: 17}}>Display Live QA App</Text>
              <WhiteSpace />
              <Text style={{fontSize: 16, color: '#95b1c1'}}>
                Liveblog Event
              </Text>
            </View>
          </WingBlank>

          <WhiteSpace />
          <WhiteSpace />
          <WhiteSpace />
          <WingBlank
            style={{
              paddingHorizontal: 18,
            }}>
            <View
              style={{
                justifyContent: 'space-between',
                flexDirection: 'row',
              }}>
              <View
                style={{
                  backgroundColor: '#DEEAEF',
                  alignItems: 'center',
                  padding: 12,
                  borderRadius: 2,
                  flex: 1,
                  marginHorizontal: 5,
                  // marginRight: 15,
                }}>
                <Text
                  style={{
                    fontSize: 30,
                    fontWeight: 'bold',
                    color: '#8BA5B4',
                    flexWrap: 'wrap',
                  }}>
                  -
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: 'bold',
                    color: '#B0C6D2',
                  }}>
                  Online Users
                </Text>
              </View>

              <View
                style={{
                  backgroundColor: '#DEEAEF',
                  alignItems: 'center',
                  padding: 12,
                  borderRadius: 2,
                  flex: 1,
                  marginHorizontal: 5,
                }}>
                <Text
                  style={{
                    fontSize: 30,
                    fontWeight: 'bold',
                    color: '#8BA5B4',
                    flexWrap: 'wrap',
                  }}>
                  30
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: 'bold',
                    color: '#B0C6D2',
                  }}>
                  Questions
                </Text>
              </View>
            </View>
          </WingBlank>

          <WhiteSpace />
          <WhiteSpace />
          <WingBlank
            style={{
              paddingHorizontal: 22,
            }}>
            <View
              style={{
                justifyContent: 'space-between',
                flexDirection: 'row',
              }}>
              <View
                style={{
                  flex: 1,
                  backgroundColor: '#1ec8d1',
                  padding: 10,
                  borderRadius: 2,
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginHorizontal: 4,
                  // marginRight: 15,
                }}>
                <CustomIconsComponent
                  color={'white'}
                  name={'questioncircleo'}
                  type={'AntDesign'}
                  size={20}
                />
                <Text
                  style={{
                    color: Colors.white,
                    flexWrap: 'wrap',
                    fontSize: 13,
                    marginHorizontal: 5,
                  }}>
                  Add Question
                </Text>
              </View>

              <View
                style={{
                  flex: 1,
                  backgroundColor: '#1ec8d1',
                  padding: 10,
                  borderRadius: 2,
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginHorizontal: 4,
                  // marginRight: 15,
                }}>
                <CustomIconsComponent
                  color={'white'}
                  name={'newspaper-o'}
                  type={'FontAwesome'}
                  size={22}
                />
                <Text
                  style={{
                    color: Colors.white,
                    flexWrap: 'wrap',
                    fontSize: 13,
                    marginHorizontal: 5,
                  }}>
                  Add Post
                </Text>
              </View>

              <View
                style={{
                  flex: 1,
                  backgroundColor: '#1ec8d1',
                  padding: 10,
                  borderRadius: 2,
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginHorizontal: 4,
                  // marginRight: 15,
                }}>
                <CustomIconsComponent
                  color={'white'}
                  name={'server'}
                  type={'FontAwesome'}
                  size={21}
                />
                <Text
                  style={{
                    color: Colors.white,
                    flexWrap: 'wrap',
                    fontSize: 13,
                    marginHorizontal: 5,
                  }}>
                  Add Poll
                </Text>
              </View>
            </View>
          </WingBlank>

          <WhiteSpace />
          <WhiteSpace />
          <WhiteSpace />
          <WhiteSpace />
          <WingBlank
            style={{
              paddingHorizontal: 24,
            }}>
            <View
              style={{
                backgroundColor: '#F2F7F9',
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingHorizontal: 15,
                paddingVertical: 8,
                borderRadius: 2,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                }}>
                <CustomIconsComponent
                  color={'#B2C5CD'}
                  name={'smile-o'}
                  type={'FontAwesome'}
                  size={25}
                />

                <View
                  style={{
                    paddingLeft: 10,
                  }}>
                  <Text
                    style={{
                      color: '#8DA7B5',
                      fontSize: 15,
                      fontWeight: 'bold',
                      flexWrap: 'wrap',
                      marginBottom: 3,
                    }}>
                    Reaction Controller
                  </Text>
                  <Text
                    style={{
                      color: '#8ba5b4',
                      fontSize: 13,
                      fontWeight: '600',
                      flexWrap: 'wrap',
                      opacity: 0.65,
                      marginBottom: 3,
                    }}>
                    Status: OFF
                  </Text>
                  <Text
                    style={{
                      color: '#8ba5b4',
                      fontSize: 13,
                      fontWeight: '600',
                      flexWrap: 'wrap',
                      opacity: 0.65,
                    }}>
                    Position: REPLACE INPUTBOX
                  </Text>
                </View>
              </View>

              <View>
                <CustomIconsComponent
                  color={'#B2C5CD'}
                  name={'lock'}
                  type={'FontAwesome5'}
                  size={20}
                />
              </View>
            </View>
          </WingBlank>

          <WhiteSpace />
          <WhiteSpace />
          <WhiteSpace />
          <WhiteSpace />
          <WhiteSpace />
          <WingBlank
            style={{
              paddingHorizontal: 24,
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <Text
                style={{
                  color: '#8ba5b4',
                  textTransform: 'uppercase',
                  fontSize: 14,
                  fontWeight: 'bold',
                }}>
                moderators
              </Text>
              <View
                style={{
                  borderWidth: 1,
                  borderColor: '#8ba5b4',
                  paddingHorizontal: 4,
                  paddingVertical: 1,
                }}>
                <Text
                  style={{
                    color: '#8ba5b4',
                    textTransform: 'uppercase',
                    fontSize: 11,
                    fontWeight: 'bold',
                  }}>
                  mod
                </Text>
              </View>
            </View>

            <View
              style={{
                flexDirection: 'row',
                marginTop: 3,
              }}>
              <View
                style={{
                  backgroundColor: '#8ba5b4',
                  padding: 2,
                  width: 45,
                }}></View>
              <View
                style={{
                  backgroundColor: '#edf2f5',
                  padding: 0,
                  width: '88%',
                }}></View>
            </View>
          </WingBlank>

          <WingBlank
            style={{
              paddingHorizontal: 24,
            }}>
            <View
              style={{
                marginTop: 12,
                backgroundColor: '#FFCE54',
                borderRadius: 50,
                height: 40,
                width: 40,
              }}>
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexGrow: 1,
                  flexShrink: 1,
                  position: 'relative',
                }}>
                <Text
                  style={{
                    color: '#fff',
                    fontSize: 16,
                    fontWeight: '600',
                  }}>
                  BH
                </Text>

                <View
                  style={{
                    position: 'absolute',
                    justifyContent: 'space-between',
                  }}>
                  <View
                    style={{
                      backgroundColor: '#fff',
                    }}>
                    <CustomIconsComponent
                      color={'#B2C5CD'}
                      name={'shield-alt'}
                      type={'FontAwesome5'}
                      size={13}
                    />
                  </View>

                  <View
                    style={{
                      backgroundColor: '#fff',
                      marginTop: 30,
                    }}>
                    <View
                      style={{
                        backgroundColor: '#7CD219',
                        height: 13,
                        width: 13,
                        borderRadius: 13,
                      }}></View>
                  </View>
                </View>
              </View>
            </View>
          </WingBlank>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
