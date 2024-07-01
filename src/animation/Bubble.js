import React, {useEffect} from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  cancelAnimation,
} from 'react-native-reanimated';

const {width, height} = Dimensions.get('window');

const Bubble = ({index}) => {
  const offset = useSharedValue(0);
  const size = Math.floor(Math.random() * 44) + 10;
  const maxPopSize = size * 2;
  const startPositionX = Math.random() * width;
  const startPositionY = Math.random() * height;
  const endPositionX = startPositionX + (Math.random() * 2 - 1) * width;
  const endPositionY = startPositionY + (Math.random() * 2 - 1) * height;

  useEffect(() => {
    const animation = withRepeat(
      withTiming(endPositionY + size, {duration: 2500}),
      -1,
      true,
    );

    offset.value = animation;

    return () => {
      cancelAnimation(offset);
      offset.value = 0;
    };
  }, []);

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [
      {translateX: withTiming(endPositionX, {duration: 1845})},
      {translateY: offset.value},
    ],
    width: size,
    height: size,
    borderRadius: size / 2,
  }));

  const randomColor = `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(
    Math.random() * 256,
  )}, ${Math.floor(Math.random() * 256)}, 0.5)`;

  if (size >= maxPopSize) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.bubble,
          animatedStyles,
          {
            backgroundColor: randomColor,
            position: 'absolute',
            top: startPositionY,
            left: startPositionX,
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  bubble: {
    borderRadius: 50,
  },
});

export default Bubble;
