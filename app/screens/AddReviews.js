// AddReviewScreen.js
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {MaterialIcons} from '@react-native-vector-icons/material-icons';
import HeaderBlock from '../Components/HeaderBlock';
import {appColors} from '../Utiles/appColors';
import Modal from 'react-native-modal';

const AddReviewScreen = ({route}) => {
  const isEdit = route && route?.params && route?.params?.edit;
  const data = isEdit ? route?.params?.item : '';
  const [rating, setRating] = useState(4); // Default rating
  const [review, setReview] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const maxChars = 500;

  useEffect(() => {
    if (data != '') {
      console.log(data, 'data');
      setRating(data?.rating);
      setReview(data?.comment);
    }
  }, [data]);

  const handlePostReview = () => {
    if (!review.trim()) {
      Alert.alert('Error', 'Please enter your review.');
      return;
    }
    Alert.alert('Success', 'Review submitted successfully!');
    console.log({rating, review});
    // Here you can send review to API
  };

  return (
    <View style={styles.container}>
      {/* Back button */}
      <HeaderBlock
        leftIcon
        title={isEdit ? 'Edit your review' : 'Add the review'}
      />

      {/* User Info */}
      <View style={styles.userInfo}>
        <Image
          source={{
            uri: data != '' ? data.avatar : 'https://via.placeholder.com/50',
          }}
          style={styles.avatar}
        />
        <Text style={styles.userName}>{data != '' ? data.name : 'Priya'}</Text>
        {isEdit && (
          <MaterialIcons
            onPress={() => setIsVisible(!isVisible)}
            style={{paddingLeft: '50%'}}
            name="delete-outline"
            size={30}
            color={appColors.pink}
          />
        )}
      </View>

      {/* Rating */}
      <View style={styles.ratingContainer}>
        {[1, 2, 3, 4, 5].map(star => (
          <TouchableOpacity key={star} onPress={() => setRating(star)}>
            <Icon
              name={star <= rating ? 'star' : 'star-o'}
              size={35}
              color="#FFD700"
              style={styles.star}
            />
          </TouchableOpacity>
        ))}
      </View>

      {/* Review Input */}
      <Text style={styles.label}>Your Review</Text>
      <View style={styles.textAreaWrapper}>
        <TextInput
          style={styles.textArea}
          placeholder="Write your review here..."
          value={review}
          onChangeText={text => {
            if (text.length <= maxChars) setReview(text);
          }}
          multiline
        />
        <Text style={styles.charCount}>
          {review.length}/{maxChars}
        </Text>
      </View>

      {/* Submit Button */}
      <TouchableOpacity style={styles.submitButton} onPress={handlePostReview}>
        <Text style={styles.submitText}>Post Review</Text>
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        isVisible={isVisible}
        backdropColor={'rgba(0, 0, 0, 0.6)'}
        backdropOpacity={1}
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onBackdropPress={() => setIsVisible(false)}
        onRequestClose={() => {
          setIsVisible(false);
        }}>
        <View style={styles.overlay}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
              Are you sure need to Delete{'\n'}your Review ?
            </Text>

            <View style={styles.btnRow}>
              <TouchableOpacity
                style={styles.btn}
                onPress={() => setIsVisible(false)}>
                <Text style={styles.btnText}>No</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.btn, styles.deleteBtn]}
                onPress={() => {
                  // Handle delete action here
                  setIsVisible(false);
                }}>
                <Text style={styles.btnText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default AddReviewScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ff4d88',
    marginLeft: 10,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#ccc',
    marginRight: 10,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  ratingContainer: {
    flexDirection: 'row',
    marginVertical: 15,
  },
  star: {
    marginRight: 5,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  textAreaWrapper: {
    borderWidth: 1,
    borderColor: '#ffb6c1',
    borderRadius: 8,
    padding: 8,
    backgroundColor: '#ffe6ee',
    marginBottom: 15,
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  charCount: {
    alignSelf: 'flex-end',
    color: '#999',
    fontSize: 12,
  },
  submitButton: {
    backgroundColor: '#ff4d88',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
  },
  submitText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    backgroundColor: 'white',
    width: 330,
    paddingVertical: 20,
    borderRadius: 15,
    alignItems: 'center',
    elevation: 5,
  },
  modalText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  btnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  },
  btn: {
    backgroundColor: '#ff4f79',
    paddingHorizontal: 25,
    paddingVertical: 10,
    borderRadius: 30,
  },
  deleteBtn: {
    marginLeft: 15,
  },
  btnText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
