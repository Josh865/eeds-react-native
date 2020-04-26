import React, { useEffect, useRef, useState } from 'react';
import { Platform, StyleSheet, TouchableOpacity } from 'react-native';
import BottomSheet from 'reanimated-bottom-sheet';
import Animated from 'react-native-reanimated';
import { useSafeArea } from 'react-native-safe-area-context';
import {
  Divider,
  Icon,
  Layout,
  List,
  ListItem,
  Text,
} from '@ui-kitten/components';

const LogInMethodBottomSheet = ({
  showBottomSheet,
  setShowBottomSheet,
  additionalLogInMethods,
  goToLogInScreen,
}) => {
  const insets = useSafeArea();
  const [fall] = useState(new Animated.Value(1));
  const bottomSheet = useRef();

  useEffect(() => {
    // Argument passed to snapTo method is index of the bottom sheet's snapPoints array
    showBottomSheet
      ? bottomSheet.current.snapTo(0)
      : bottomSheet.current.snapTo(1);
  }, [showBottomSheet]);

  // This will animate the opacity of the dark backdrop that appears over the main screen
  // content when the bottom sheet is opened and closed.
  const animatedShadowOpacity = Animated.interpolate(fall, {
    inputRange: [0, 1],
    outputRange: [0.5, 0],
  });

  const renderBottomSheetHeader = () => {
    const CloseIcon = style => <Icon {...style} name="close" />;

    return (
      <Layout level="3" style={styles.headerContainer}>
        <Text category="s1" style={{ flex: 1 }}>
          More Ways to Log In
        </Text>
        <TouchableOpacity
          style={styles.closeButtonContainer}
          onPress={() => setShowBottomSheet(false)}
        >
          <Layout level="4" style={styles.closeButton}>
            <CloseIcon width={20} height={20} fill="#8f9bb3" />
          </Layout>
        </TouchableOpacity>
      </Layout>
    );
  };

  const renderBottomSheetContent = () => {
    const renderItem = ({ item }) => (
      <ListItem
        title={item.Custom_Field_Name}
        description={item.Sponsor_Name}
        onPress={() => goToLogInScreen('custom', item)}
      />
    );

    return (
      <Layout>
        <List
          data={additionalLogInMethods}
          ListFooterComponent={() => <Layout />} // Create safe space below list for iOS
          ListFooterComponentStyle={{ paddingBottom: insets.bottom }}
          ItemSeparatorComponent={() => <Divider />}
          renderItem={renderItem}
        />
      </Layout>
    );
  };

  return (
    <>
      {/* The platform specific code prevents Android users from dismissing the bottom
      sheet with a swipe, but without it the inner list cannot be scrolled and the onPress
      handler is not called. Everything works fine on iOS. */}
      <BottomSheet
        ref={bottomSheet}
        snapPoints={[325, 0]}
        initialSnap={1}
        renderContent={renderBottomSheetContent}
        renderHeader={renderBottomSheetHeader}
        enabledGestureInteraction={Platform.OS === 'ios' ? true : false}
        callbackNode={fall}
        onCloseEnd={() => setShowBottomSheet(false)}
      />

      {/* This is the dark backdrop that appears over the main screen content when the
      bottom sheet is open. */}
      <Animated.View
        pointerEvents="none"
        style={[
          styles.shadowContainer,
          {
            opacity: animatedShadowOpacity,
          },
        ]}
      />
    </>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 13,
    paddingHorizontal: 15,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },

  closeButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: 35,
    height: 35,
  },

  closeButton: {
    borderRadius: 9999,
    padding: 2,
  },

  shadowContainer: {
    zIndex: 20,
    ...StyleSheet.absoluteFill,
    backgroundColor: 'black',
  },
});

export default LogInMethodBottomSheet;
