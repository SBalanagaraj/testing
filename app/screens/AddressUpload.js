import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import * as yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';
import TextInputs from '../Components/TextInputs';
import {useDispatch, useSelector} from 'react-redux';
import {addAddressFile} from '../Redux/settingSlice';
import {FontAwesome} from '@react-native-vector-icons/fontawesome';

import {appColors} from '../Utiles/appColors';

// ✅ Validation Schema with Yup
const schema = yup.object().shape({
  flatNo: yup.string().required('Flat No. is required'),
  apartmentName: yup.string().required('Apartment Name is required'),
  city: yup.string().required('City is required'),
  state: yup.string().required('State is required'),
  country: yup.string().required('Country is required'),
  pincode: yup
    .string()
    .required('Pincode is required')
    .matches(/^\d{6}$/, 'Pincode must be 6 digits'),
});

export default function AddressUpload({navigation}) {
  const dispatch = useDispatch();
  const {savedAddress} = useSelector(state => state.setting);

  const {
    control,
    handleSubmit,
    formState: {errors},
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      flatNo: '',
      apartmentName: '',
      city: '',
      state: '',
      country: '',
      pincode: '',
    },
  });

  const onSubmit = data => {
    dispatch(addAddressFile(data));
    reset();
    navigation.navigate('addressList');
    console.log('Address Submitted:', data);
  };

  return (
    <ScrollView
      contentContainerStyle={{
        padding: 16,
        backgroundColor: '#fff',
      }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <Text
          style={{
            fontSize: 25,
            fontWeight: '600',
            textAlign: 'center',
          }}>
          Address Details
        </Text>
        {savedAddress && savedAddress.length > 0 && (
          <Pressable
            onPress={() => navigation.navigate('addressList')}
            style={{padding: 15, borderWidth: 0.5, borderRadius: 20}}>
            <View
              style={{
                color: appColors.bgWhite,
                position: 'absolute',
                right: 0,
                top: -10,
                backgroundColor: appColors.searchColor,
                borderRadius: 10,
                width: 22,
                height: 22,
                alignItems: 'center',
                justifyContent: 'center',
                elevation: 10,
              }}>
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: '600',
                  textAlign: 'center',
                  color: appColors.pink,
                }}>
                {savedAddress.length}
              </Text>
            </View>
            <FontAwesome name="address-book" size={30} color={appColors.pink} />
          </Pressable>
        )}
      </View>

      <View style={{paddingVertical: '35%'}}>
        {/* Flat No. */}
        <Controller
          control={control}
          name="flatNo"
          render={({field: {onChange, value}}) => (
            <View style={{marginBottom: 12}}>
              <TextInputs
                fieldName="Flat No."
                placeholder="Enter Flat/House No."
                value={value}
                onChange={onChange}
                required
                errorText={errors.flatNo?.message}
              />
            </View>
          )}
        />

        {/* Apartment Name */}
        <Controller
          control={control}
          name="apartmentName"
          render={({field: {onChange, value}}) => (
            <View style={{marginBottom: 12}}>
              <TextInputs
                fieldName="Apartment Name"
                placeholder="Enter Apartment/Building Name"
                value={value}
                onChange={onChange}
                required
                errorText={errors.apartmentName?.message}
              />
            </View>
          )}
        />

        {/* City + State */}
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <View style={{flex: 1, marginRight: 8}}>
            <Controller
              control={control}
              name="city"
              render={({field: {onChange, value}}) => (
                <TextInputs
                  fieldName="City"
                  placeholder="Enter City"
                  value={value}
                  required
                  onChange={onChange}
                  errorText={errors.city?.message}
                />
              )}
            />
          </View>
          <View style={{flex: 1, marginLeft: 8}}>
            <Controller
              control={control}
              name="state"
              render={({field: {onChange, value}}) => (
                <TextInputs
                  fieldName="State"
                  placeholder="Enter State"
                  value={value}
                  onChange={onChange}
                  required
                  errorText={errors.state?.message}
                />
              )}
            />
          </View>
        </View>

        {/* Country + Pincode */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 12,
          }}>
          <View style={{flex: 1, marginRight: 8}}>
            <Controller
              control={control}
              name="country"
              render={({field: {onChange, value}}) => (
                <TextInputs
                  fieldName="Country"
                  placeholder="Enter Country"
                  value={value}
                  onChange={onChange}
                  required
                  errorText={errors.country?.message}
                />
              )}
            />
          </View>
          <View style={{flex: 1, marginLeft: 8}}>
            <Controller
              control={control}
              name="pincode"
              render={({field: {onChange, value}}) => (
                <TextInputs
                  fieldName="Pincode"
                  placeholder="Enter Pincode"
                  value={value}
                  onChange={onChange}
                  keyboardType="numeric"
                  errorText={errors.pincode?.message}
                  required
                />
              )}
            />
          </View>
        </View>
      </View>

      {/* Submit Button */}
      <TouchableOpacity
        style={{
          marginTop: 20,
          backgroundColor: '#007bff',
          padding: 14,
          borderRadius: 8,
          alignItems: 'center',
        }}
        onPress={handleSubmit(onSubmit)}>
        <Text style={{color: '#fff', fontSize: 16, fontWeight: '600'}}>
          Save Address
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
