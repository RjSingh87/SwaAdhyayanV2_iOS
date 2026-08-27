// ActivityTracker.js
import React, { useContext, useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import Services from './Services';
import { apiRoot } from './constant/ConstentValue';
import { GlobleData } from './Store';

/**
 * Raw function to send activity log API request.
 * Call this if you already have access to userData.
 */
export const sendActivityLog = (payload, userData) => {
  const sessionUID = userData?.data?.sessionUID || userData?.data?.uuid;
  const schoolID = userData?.data?.schoolID;
  const userTypeID = userData?.data?.userTypeID;
  const userRefID = userData?.data?.userRefID;

  if (!sessionUID) {
    console.warn('ActivityTracker: sessionUID missing in userData');
    return;
  }

  const finalPayload = {
    sessionUID,
    schoolID,
    userTypeID,
    userRefID,
    deviceType: Platform.OS || 'ios',
    ...payload,
  };

  console.log('Logging Activity Payload:', finalPayload);

  Services.post(apiRoot.logInteraction, finalPayload)
    .then((res) => {
      console.log('Activity logged status:', res?.status);
    })
    .catch((err) => {
      console.warn('Failed to log activity', err);
    });
};

/**
 * Custom Hook to get `trackActivity` function inside React components.
 */
export const useActivityTracker = () => {
  const { userData } = useContext(GlobleData);

  const trackActivity = (payload = {}) => {
    sendActivityLog(payload, userData);
  };

  return trackActivity;
};

/**
 * Component version: Logs interaction once on Mount.
 * Prevents multiple duplicate calls during screen re-renders.
 */
export const ActivityTracker = ({ payload = {}, children = null }) => {
  const { userData } = useContext(GlobleData);
  const isLogged = useRef(false);

  useEffect(() => {
    // Only fire once when component mounts
    if (!isLogged.current && userData?.data) {
      sendActivityLog(payload, userData);
      isLogged.current = true;
    }
  }, [userData, payload]);

  return children;
};

export default ActivityTracker;
