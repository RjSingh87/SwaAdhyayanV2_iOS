import React, { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

const DraggableList = () => {
  const [items, setItems] = useState([
    { id: '1', text: 'Item 1' },
    { id: '2', text: 'Item 2' },
    { id: '3', text: 'Item 3' },
  ]);

  const positions = items.map((_, index) => useSharedValue(index * 80));

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      ctx.startY = positions.map((p) => p.value);
    },
    onActive: (event, ctx) => {
      positions.forEach((pos, index) => {
        pos.value = ctx.startY[index] + event.translationY;
      });
    },
    onEnd: (_) => {
      positions.forEach((pos, index) => {
        pos.value = withSpring(index * 80);
      });
    },
  });

  return (
    <View style={styles.container}>
      {items.map((item, index) => {
        const animatedStyle = useAnimatedStyle(() => {
          return {
            transform: [{ translateY: positions[index].value }],
          };
        });

        return (
          <PanGestureHandler key={item.id} onGestureEvent={gestureHandler}>
            <Animated.View style={[styles.item, animatedStyle]}>
              <Text style={styles.text}>{item.text}</Text>
            </Animated.View>
          </PanGestureHandler>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    height: 20,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
  },
});

export default DraggableList;