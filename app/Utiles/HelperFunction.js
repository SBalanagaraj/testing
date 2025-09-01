import {Dimensions} from 'react-native';
import {responsiveFontSize} from 'react-native-responsive-dimensions';

const {width} = Dimensions.get('screen');

export const scrnWidth = Dimensions.get('screen').width;
export const scrnHeight = Dimensions.get('screen').height;
export const bottom_Height = scrnWidth < 500 ? 60 : 70;
export const widthResponse = scrnWidth < 500 ? true : false;

export const fontScalling = size => {
  if (size > 0) {
    return width > 500
      ? responsiveFontSize(size - 0.8)
      : responsiveFontSize(size);
  }
};

export const print = (data, str) => {
  return console.log(JSON.stringify(data, undefined, 4), str);
};

export const formatDate = isoString => {
  const date = new Date(isoString);
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  })}`;
};
