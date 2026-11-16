import React, { useState, useEffect, useContext, useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GlobleData } from '../../../../../../Store';

const Timer = () => {
  const { manageData, currentIndex } = useContext(GlobleData);
  let TotalTime = manageData.questions[currentIndex]?.totalTime;


  const [countDown, setCountDown] = useState(convertTimeToSeconds(TotalTime));
  const [runTimer, setRunTimer] = useState(false);

  useEffect(() => {
    let timerId;
    if (runTimer) {
      timerId = setInterval(() => {
        setCountDown((prevCountDown) => prevCountDown - 1);
      }, 1000);
    }

    return () => {
      if (timerId) {
        clearInterval(timerId);
      }
    };
  }, [runTimer]);

  useEffect(() => {
    if (countDown <= 0 && runTimer) {
      console.log("expired");
      setRunTimer(false);
      setCountDown(0);
    }
  }, [countDown, runTimer]);
  useEffect(() => {
    if (TotalTime != undefined) {
      togglerTimer();
    }
  }, [togglerTimer]);
  const togglerTimer = useCallback(() => {
    setRunTimer((prevState) => !prevState);
  }, []);



  const hours = Math.floor(countDown / 3600);
  const minutes = Math.floor((countDown % 3600) / 60);
  const seconds = countDown % 60;
  // console.log(TotalTime, "sss")

  return (
    <View>
      <Text style={styles.timerText}>Time: {hours.toString().padStart(2, '0')}:{minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}</Text>
    </View>
  );
};

const convertTimeToSeconds = (timeString) => {
  if (!timeString) return 0;
  const [hours, minutes, seconds] = timeString.split(':').map(Number);
  return hours * 3600 + minutes * 60 + seconds;
};

const styles = StyleSheet.create({
  timerText: {
    fontSize: 16,
  },
});

export default Timer;
