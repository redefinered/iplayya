import React from 'react';
import PropTypes from 'prop-types';
import { Modal, View, Dimensions, StyleSheet, Text } from 'react-native';
import { TouchableRipple, Title, withTheme } from 'react-native-paper';
import { compose } from 'redux';

const WalkThroughGuide = ({
  visible,
  theme,
  title,
  content,
  next,
  skip,
  skipValue,
  heightValue,
  topPosValue,
  bottomPosValue,
  leftWidth,
  rightWidth,
  topWidth,
  bottomWidth,
  rotateArrow,
  hideModal,
  nextModal,
  disabled,
  trianglePosition,
  leftPadding,
  rightPadding,
  nextLine,
  addLine,
  containerPosition,
  topPadding,
  bottomPadding
}) => {
  const styles = StyleSheet.create({
    triangleContainer: {
      position: 'absolute',
      top: topPosValue,
      bottom: bottomPosValue,
      alignItems: trianglePosition,
      width: '100%',
      height: 50,
      paddingLeft: leftPadding,
      paddingRight: rightPadding
    },
    triangleModal: {
      backgroundColor: 'transparent',
      borderStyle: 'solid',
      borderLeftWidth: leftWidth,
      borderRightWidth: rightWidth,
      borderTopWidth: topWidth,
      borderBottomWidth: bottomWidth,
      borderLeftColor: 'transparent',
      borderRightColor: 'transparent',
      borderTopColor: '#ffffff',
      borderBottomColor: '#ffffff',
      transform: [{ rotate: rotateArrow }]
    },
    container: {
      backgroundColor: '#ffffff',
      width: Dimensions.get('window').width - 30,
      borderRadius: 24
    },
    containerHolder: {
      height: heightValue,
      flex: 1,
      justifyContent: containerPosition,
      paddingTop: topPadding,
      paddingBottom: bottomPadding
    }
  });
  return (
    <Modal animationType="fade" visible={visible} transparent statusBarTranslucent>
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          backgroundColor: 'rgba(0,0,0,0.5)',
          height: Dimensions.get('window').height
        }}
      >
        <View style={styles.containerHolder}>
          <View style={styles.container}>
            <View style={{ padding: 15 }}>
              <View>
                <Title
                  style={{
                    color: theme.iplayya.colors.vibrantpussy,
                    fontSize: 20,
                    fontWeight: 'bold',
                    fontFamily: 'NotoSans'
                  }}
                >
                  {title}
                </Title>
                <View style={{ paddingRight: 10 }}>
                  {addLine === false ? (
                    <Text
                      style={{
                        color: theme.iplayya.colors.black80,
                        fontFamily: 'NotoSans',
                        fontWeight: '400',
                        paddingVertical: 10,
                        paddingBottom: 20,
                        fontSize: 14,
                        paddingRight: 7,
                        lineHeight: 19
                      }}
                    >
                      {content} {'\n'}
                      {'\n'} {nextLine}
                    </Text>
                  ) : (
                    <Text
                      style={{
                        color: theme.iplayya.colors.black80,
                        fontFamily: 'NotoSans',
                        fontWeight: '400',
                        paddingVertical: 10,
                        paddingBottom: 20,
                        fontSize: 14,
                        paddingRight: 7,
                        lineHeight: 19
                      }}
                    >
                      {content}
                    </Text>
                  )}
                </View>
              </View>
              <View
                style={{
                  justifyContent: 'space-between',
                  flexDirection: 'row',
                  paddingHorizontal: 40
                }}
              >
                <TouchableRipple
                  borderless={true}
                  rippleColor="rgba(0,0,0,0.28)"
                  disabled={disabled}
                  onPress={disabled ? null : () => hideModal()}
                  style={{ borderRadius: 4 }}
                >
                  <View style={{ padding: theme.spacing(1) }}>
                    <Text style={{ color: theme.iplayya.colors.black70, fontWeight: 'bold' }}>
                      {skip}{' '}
                      <Text style={{ color: theme.iplayya.colors.black70, fontWeight: 'normal' }}>
                        {' '}
                        {skipValue}
                      </Text>
                    </Text>
                  </View>
                </TouchableRipple>
                <TouchableRipple
                  borderless={true}
                  rippleColor="rgba(0,0,0,0.28)"
                  onPress={() => nextModal()}
                  style={{ borderRadius: 4 }}
                >
                  <View style={{ padding: theme.spacing(1) }}>
                    <Text style={{ color: theme.iplayya.colors.vibrantpussy, fontWeight: 'bold' }}>
                      {next}
                    </Text>
                  </View>
                </TouchableRipple>
              </View>
            </View>
            <View style={styles.triangleContainer}>
              <View style={styles.triangleModal}></View>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

WalkThroughGuide.propTypes = {
  theme: PropTypes.object,
  visible: PropTypes.bool,
  title: PropTypes.string,
  content: PropTypes.string,
  nextLine: PropTypes.string,
  skip: PropTypes.string,
  skipValue: PropTypes.string,
  next: PropTypes.string,
  heightValue: PropTypes.number,
  topPosValue: PropTypes.number,
  bottomPosValue: PropTypes.number,
  leftWidth: PropTypes.number,
  rightWidth: PropTypes.number,
  topWidth: PropTypes.number,
  bottomWidth: PropTypes.number,
  rotateArrow: PropTypes.string,
  hideModal: PropTypes.func,
  nextModal: PropTypes.func,
  disabled: PropTypes.bool,
  trianglePosition: PropTypes.string,
  leftPadding: PropTypes.number,
  rightPadding: PropTypes.number,
  addLine: PropTypes.bool,
  containerPosition: PropTypes.string,
  topPadding: PropTypes.number,
  bottomPadding: PropTypes.number
};

export default compose(withTheme)(WalkThroughGuide);
