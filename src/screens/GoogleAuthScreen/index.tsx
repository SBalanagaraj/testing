import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    Dimensions,
} from 'react-native';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/AntDesign'; // Using AntDesign for Google icon
import { appColors } from '../../Utiles/appColors'; // Assuming this exists based on CardScreen
import { useDispatch } from 'react-redux';
import { setUserInfo } from '../../Redux/userSlice';
import { fonts } from '../../Utiles/appFont'; // Assuming this exists

const { width } = Dimensions.get('window');

const GoogleAuthScreen = () => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        GoogleSignin.configure({
            webClientId: "783632660361-1kpo6encf1o63jdfbnassd6tcf832uhf.apps.googleusercontent.com",
            offlineAccess: true,
        });
    }, []);

    const signInWithGoogle = async () => {
        try {
            setLoading(true);

            // Check if your device supports Google Play
            await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

            // Get the users ID token
            const signInResult = await GoogleSignin.signIn();
            let idToken = signInResult.data?.idToken;
            if (!idToken) {
                // Fallback for older versions if structure differs, though 16.x usually uses data.idToken
                idToken = signInResult.idToken;
            }

            if (!idToken) {
                throw new Error('No ID token found');
            }

            // Create a Google credential with the token
            const googleCredential = auth.GoogleAuthProvider.credential(idToken);

            // Sign-in the user with the credential
            const userCredential = await auth().signInWithCredential(googleCredential);
            const user = userCredential.user;
            if (user) {
                dispatch(setUserInfo({
                    uid: user.uid,
                    email: user.email,
                    displayName: user.displayName,
                    photoURL: user.photoURL,
                }));
            }

            // Navigation will be handled by the auth state listener in App.js

        } catch (error: any) {
            console.error(error);
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                // user cancelled the login flow
                Alert.alert('Cancelled', 'Sign in was cancelled');
            } else if (error.code === statusCodes.IN_PROGRESS) {
                // operation (e.g. sign in) is in progress already
                Alert.alert('In Progress', 'Sign in is already in progress');
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                // play services not available or outdated
                Alert.alert('Error', 'Google Play Services are not available or outdated');
            } else {
                // some other error happened
                Alert.alert('Error', 'Something went wrong during sign in: ' + error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>Welcome Back</Text>
                <Text style={styles.subtitle}>Sign in to continue to your account</Text>

                <TouchableOpacity
                    style={styles.googleButton}
                    onPress={signInWithGoogle}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <>
                            <Icon name="google" size={24} color="#fff" style={styles.icon} />
                            <Text style={styles.buttonText}>Sign in with Google</Text>
                        </>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default GoogleAuthScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        width: '100%',
        paddingHorizontal: 24,
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 48,
        textAlign: 'center',
    },
    googleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#DB4437', // Google Red
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        width: '100%',
        maxWidth: 300,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    icon: {
        marginRight: 12,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});
