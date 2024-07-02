import React, {useEffect} from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  cancelAnimation,
  Easing,
} from 'react-native-reanimated';

const {width, height} = Dimensions.get('window');

const Bubble = ({index}) => {
  const offsetY = useSharedValue(0);
  const offsetX = useSharedValue(0);
  const scale = useSharedValue(1);
  const rotate = useSharedValue(0);
  const opacity = useSharedValue(1);
  const direction = useSharedValue(Math.random() > 0.5 ? 1 : -1);
  const color = useSharedValue(
    `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(
      Math.random() * 256,
    )}, ${Math.floor(Math.random() * 256)}, 0.5)`,
  );

  const size = Math.floor(Math.random() * 44) + 10;

  // Randomly position bubbles around the edges
  const startPositionX =
    Math.random() < 0.5
      ? Math.random() * width
      : Math.random() < 0.5
      ? 0
      : width;
  const startPositionY =
    startPositionX === 0 || startPositionX === width
      ? Math.random() * height
      : Math.random() < 0.5
      ? 0
      : height;

  useEffect(() => {
    const duration = Math.random() * 3000 + 2000;

    offsetY.value = withRepeat(
      withTiming(
        startPositionY === 0
          ? height
          : startPositionY === height
          ? 0
          : Math.random() * height,
        {
          duration: duration,
          easing: Easing.inOut(Easing.ease),
        },
      ),
      -1,
      true,
    );

    const zigZag = () => {
      offsetX.value = withRepeat(
        withSequence(
          withTiming(
            startPositionX + direction.value * ((Math.random() * width) / 4),
            {
              duration: duration / 2,
              easing: Easing.inOut(Easing.ease),
            },
          ),
          withTiming(
            startPositionX - direction.value * ((Math.random() * width) / 4),
            {
              duration: duration / 2,
              easing: Easing.inOut(Easing.ease),
            },
          ),
        ),
        -1,
        true,
      );
      direction.value *= -1;
    };

    zigZag();

    scale.value = withRepeat(
      withSequence(
        withTiming(1.5, {
          duration: duration / 2,
          easing: Easing.inOut(Easing.ease),
        }),
        withTiming(1, {
          duration: duration / 2,
          easing: Easing.inOut(Easing.ease),
        }),
      ),
      -1,
      true,
    );

    rotate.value = withRepeat(
      withTiming(360, {duration: duration * 2, easing: Easing.linear}),
      -1,
      false,
    );

    opacity.value = withRepeat(
      withSequence(
        withTiming(0.5, {
          duration: duration / 2,
          easing: Easing.inOut(Easing.ease),
        }),
        withTiming(1, {
          duration: duration / 2,
          easing: Easing.inOut(Easing.ease),
        }),
      ),
      -1,
      true,
    );

    color.value = withRepeat(
      withSequence(
        withTiming(
          `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(
            Math.random() * 256,
          )}, ${Math.floor(Math.random() * 256)}, 0.5)`,
          {duration: duration, easing: Easing.linear},
        ),
        withTiming(
          `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(
            Math.random() * 256,
          )}, ${Math.floor(Math.random() * 256)}, 0.5)`,
          {duration: duration, easing: Easing.linear},
        ),
      ),
      -1,
      false,
    );

    return () => {
      cancelAnimation(offsetY);
      cancelAnimation(offsetX);
      cancelAnimation(scale);
      cancelAnimation(rotate);
      cancelAnimation(opacity);
      cancelAnimation(color);
      offsetY.value = 0;
      offsetX.value = 0;
      scale.value = 1;
      rotate.value = 0;
      opacity.value = 1;
      color.value = `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(
        Math.random() * 256,
      )}, ${Math.floor(Math.random() * 256)}, 0.5)`;
    };
  }, []);

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [
      {translateX: offsetX.value},
      {translateY: offsetY.value},
      {scale: scale.value},
      {rotate: `${rotate.value}deg`},
    ],
    width: size,
    height: size,
    borderRadius: size / 2,
    backgroundColor: color.value,
    position: 'absolute',
    top: startPositionY,
    left: startPositionX,
    opacity: opacity.value,
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.bubble, animatedStyles]} />
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
