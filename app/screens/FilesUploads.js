import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ToastAndroid,
  PermissionsAndroid,
} from 'react-native';
import {pick} from '@react-native-documents/picker';
import {viewDocument} from '@react-native-documents/viewer';
import {appColors} from '../Utiles/appColors';
import {useDispatch, useSelector} from 'react-redux';
import {addFile, removeFile} from '../Redux/settingSlice';
import {formatDate, print} from '../Utiles/HelperFunction';
import {FlatList} from 'react-native-gesture-handler';
import {FontAwesome} from '@react-native-vector-icons/fontawesome';
import {MaterialDesignIcons} from '@react-native-vector-icons/material-design-icons';
import HeaderBlock from '../Components/HeaderBlock';
import ReactNativeBlobUtil from 'react-native-blob-util';

export default function UploadScreen() {
  const [menuVisible, setMenuVisible] = useState(false);
  const dispatch = useDispatch();

  const {list} = useSelector(state => state.setting);

  // local file we cannot download so we integrated with dummy pdf link
  const downloadFile = async fN => {
    console.log(url, 'url');
    console.log(ext, 'ext');

    const url =
      'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';
    const ext = 'pdf';

    // Ask permission (Android < 11)
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
    );

    if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
      console.log('Storage permission denied');
      return;
    }

    if (url && ext) {
      const fileName = `${fN}`;
      const {DownloadDir} = ReactNativeBlobUtil.fs.dirs;

      ReactNativeBlobUtil.config({
        fileCache: true,
        path: `${ReactNativeBlobUtil.fs.dirs.DocumentDir}/test.pdf`,
        addAndroidDownloads: {
          useDownloadManager: true, // ✅ this uses system DownloadManager
          notification: true, // shows download in notification bar
          path: `${DownloadDir}/${fileName}`, // full path to save
          title: fileName,
          description: 'Downloading invoice...',
          mime: 'application/pdf',
          mediaScannable: true, // makes file visible in gallery/downloads apps
        },
      })
        .fetch('GET', url)
        .then(res => console.log('File saved at:', res.path()))
        .catch(err => console.log(err));
    }
  };

  // // Handle PDF Upload
  const pickPDF = async () => {
    try {
      const [result] = await pick({
        mode: 'open',
      });
      if (Object.keys(result).length > 0) {
        const fileData = {
          uri: result?.uri,
          mimeType: result?.type,
          name: result?.name,
          size: result?.size,
          uploadedAt: new Date().toISOString(),
        };
        dispatch(addFile(fileData));
        setMenuVisible(false);
      }
      console.log(JSON.stringify(result, undefined, 4));
    } catch (err) {
      // see error handling
    }
  };

  const renderItem = ({item}) => (
    <View
      style={{
        backgroundColor: '#fff',
        margin: 10,
        padding: 15,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
      }}>
      {/* View Button */}
      {item.mimeType === 'application/pdf' ? (
        <FontAwesome name="file-pdf-o" size={30} color={appColors.black} />
      ) : item.mimeType === 'audio/mpeg' ? (
        <FontAwesome name="music" size={30} color={appColors.borderPink} />
      ) : item.mimeType === 'video/mp4' ? (
        <FontAwesome
          name="video-camera"
          size={30}
          color={appColors.borderPink}
        />
      ) : (
        <FontAwesome
          name="file-image-o"
          size={30}
          color={appColors.borderPink}
        />
      )}
      <View style={{paddingLeft: 20, width: '70%'}}>
        {/* File Name */}
        <Text style={{fontSize: 16, fontWeight: '600', color: '#333'}}>
          {item.name}
        </Text>

        {/* File Info */}
        <Text style={{fontSize: 13, color: '#666', marginTop: 4}}>
          {item.mimeType}
        </Text>
        <Text style={{fontSize: 12, color: '#999', marginTop: 2}}>
          Size: {(item.size / 1024).toFixed(1)} KB
        </Text>
        <Text style={{fontSize: 12, color: '#999', marginTop: 2}}>
          Uploaded: {formatDate(item.uploadedAt)}
        </Text>

        {/* Action Buttons */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
            marginTop: 10,
          }}>
          <TouchableOpacity
            onPress={() => {
              const uriToOpen = item?.uri;
              viewDocument({uri: uriToOpen, mimeType: item.mimeType}).catch(
                console.log('it will show an error '),
              );
            }}
            style={{
              backgroundColor: '#4CAF50',
              paddingVertical: 6,
              paddingHorizontal: 12,
              borderRadius: 8,
              marginRight: 8,
            }}>
            <Text style={{color: '#fff', fontSize: 13}}>View</Text>
          </TouchableOpacity>

          {/* Delete Button */}
          <TouchableOpacity
            onPress={() => dispatch(removeFile(item.uri))}
            style={{
              backgroundColor: '#FF4D4D',
              paddingVertical: 6,
              paddingHorizontal: 12,
              borderRadius: 8,
            }}>
            <Text style={{color: '#fff', fontSize: 13}}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
      <MaterialDesignIcons
        onPress={() => {
          downloadFile(item.name);
        }}
        // style={{paddingLeft: 40}}
        name="download"
        size={28}
        color={appColors.textColor}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <HeaderBlock title="Uploaded Files " />

      {list && list.length > 0 && (
        <FlatList data={list} renderItem={renderItem} />
      )}
      {/* Upload Menu */}
      {menuVisible && (
        <View style={styles.menu}>
          <TouchableOpacity style={styles.menuItem} onPress={() => pickPDF()}>
            <Text style={styles.menuText}>📄 Upload File</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Floating Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setMenuVisible(!menuVisible)}>
        <Text style={styles.fabText}>＋</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#f5f5f5'},

  // Floating Button
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: '#ff4081',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 25,
  },
  fabText: {
    fontSize: 30,
    color: '#fff',
    marginBottom: 2,
  },

  // Upload Menu
  menu: {
    position: 'absolute',
    bottom: 100,
    right: 30,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 15,
    shadowColor: appColors.pink,
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  menuItem: {
    paddingVertical: 10,
  },
  menuText: {
    fontSize: 16,
    color: '#333',
  },
});
