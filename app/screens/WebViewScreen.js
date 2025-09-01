import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {WebView} from 'react-native-webview';
import {Linking} from 'react-native';

const WebViewScreen = ({navigation}) => {
  const webRef = useRef(null);
  const [loads, setLoads] = useState(0);
  const [currentUrl, setCurrentUrl] = useState('');

  const onShouldStartLoadWithRequest = event => {
    // Check if the URL is an external link
    console.log(event, 'event');
    if (event.url.startsWith('https')) {
      Linking.canOpenURL(event.url).then(supported => {
        if (supported) {
          Linking.openURL(event.url);
        } else {
          console.log("Don't know how to open URI: " + event.url);
        }
      });
      return false; // Prevent WebView from loading the external URL
    }
    return true; // Allow WebView to load other URLs (including Google Meet)
  };

  const onNavigationStateChange = navState => {
    setCurrentUrl(navState.url); // keep track of current url
    navigation.goBack();
  };

  return (
    <View style={{flex: 1}}>
      <WebView
        source={{uri: 'https://meet.google.com/ifx-dpua-qse'}}
        style={{flex: 1}}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        onShouldStartLoadWithRequest={onShouldStartLoadWithRequest} // iOS & Android
        onNavigationStateChange={onNavigationStateChange}
      />
      {/* Floating Button */}
    </View>
  );
};

export default WebViewScreen;

const styles = StyleSheet.create({});
