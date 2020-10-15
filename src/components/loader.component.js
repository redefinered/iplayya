import React from 'react';
import { Modal, View, ActivityIndicator } from 'react-native';

const Loader = (props) => (
  <Modal transparent>
    <View style={{ flex: 1, justifyContent: 'center' }}>
      <ActivityIndicator color="#E34398" {...props} />
    </View>
  </Modal>
);

export default Loader;
