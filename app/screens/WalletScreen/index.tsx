import React, {useCallback, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Modal as RNModal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Modal from 'react-native-modal';
// Firebase imports will be enabled once backend is wired
// import auth from '@react-native-firebase/auth';
// import firestore from '@react-native-firebase/firestore';
// QR code library will be enabled once we finalize the dependency
// import QRCode from 'react-native-qrcode-svg';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {appColors} from '../../Utiles/appColors';
import {styles} from './style';

const METHODS = ['Money cash', 'Debit card', 'Bank account', 'Credit card'];

// Demo user used only for UI preview mode.
// Replace this with: const user = auth().currentUser; when enabling Firebase Auth.
const DEMO_USER = {uid: 'DEMO_USER_UID'};

const WalletScreen = () => {
  const user = DEMO_USER;

  const [balance, setBalance] = useState(0);
  const [balanceLoading, setBalanceLoading] = useState(true);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [transactionsLoading, setTransactionsLoading] = useState(true);

  const [addWalletVisible, setAddWalletVisible] = useState(false);
  const [qrVisible, setQrVisible] = useState(false);

  const [method, setMethod] = useState(METHODS[0]);
  const [methodDropdownOpen, setMethodDropdownOpen] = useState(false);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const fetchBalance = useCallback(async () => {
    setBalanceLoading(true);
    try {
      // Firebase Firestore logic (commented until backend is ready)
      // const userRef = firestore().collection('users').doc(user.uid);
      // const doc = await userRef.get();
      // const data = doc.data();
      // setBalance(data?.balance ?? 0);

      // Demo value for pure UI mode
      setBalance(32000);
    } catch (e) {
      console.log('Error fetching balance (demo)', e);
    } finally {
      setBalanceLoading(false);
    }
  }, []);

  const fetchTransactions = useCallback(async () => {
    setTransactionsLoading(true);
    try {
      // Firebase Firestore logic (commented until backend is ready)
      // const snapshot = await firestore()
      //   .collection('transactions')
      //   .where('userId', '==', user.uid)
      //   .orderBy('createdAt', 'desc')
      //   .limit(20)
      //   .get();
      // const list = snapshot.docs.map(doc => ({
      //   id: doc.id,
      //   ...doc.data(),
      // }));
      // setTransactions(list);

      // Demo transactions for UI preview only
      setTransactions([
        {
          id: '1',
          userId: user.uid,
          type: 'income',
          method: 'Money cash',
          description: 'Money in your wallet',
          amount: 35,
        },
        {
          id: '2',
          userId: user.uid,
          type: 'income',
          method: 'Debit card',
          description: '**** 3665',
          amount: 25,
        },
        {
          id: '3',
          userId: user.uid,
          type: 'income',
          method: 'Bank account',
          description: '**** 2254',
          amount: 55,
        },
        {
          id: '4',
          userId: user.uid,
          type: 'income',
          method: 'Credit card',
          description: '**** 3088',
          amount: 15,
        },
      ]);
    } catch (e) {
      console.log('Error fetching transactions (demo)', e);
    } finally {
      setTransactionsLoading(false);
    }
  }, [user.uid]);

  useEffect(() => {
    fetchBalance();
    fetchTransactions();
  }, [fetchBalance, fetchTransactions]);

  const handleSubmit = async () => {
    setFormError('');

    if (!method) {
      setFormError('Please select a method.');
      return;
    }

    if (!amount.trim()) {
      setFormError('Please enter an amount.');
      return;
    }

    const parsedAmount = Number(amount.replace(/,/g, '.'));
    if (Number.isNaN(parsedAmount) || parsedAmount <= 0) {
      setFormError('Amount must be a positive number.');
      return;
    }

    setSubmitting(true);
    try {
      // Firebase transaction logic (commented until backend is ready)
      // const newBalance = await firestore().runTransaction(async tx => {
      //   const userRef = firestore().collection('users').doc(user.uid);
      //   const userSnap = await tx.get(userRef);
      //   const currentBalance = userSnap.exists
      //     ? userSnap.data().balance || 0
      //     : 0;
      //   const updatedBalance = currentBalance + parsedAmount;
      //
      //   const transactionRef = firestore().collection('transactions').doc();
      //
      //   tx.set(transactionRef, {
      //     userId: user.uid,
      //     type: 'income',
      //     method,
      //     description: description.trim(),
      //     amount: parsedAmount,
      //     createdAt: firestore.FieldValue.serverTimestamp(),
      //   });
      //
      //   tx.set(
      //     userRef,
      //     {
      //       balance: updatedBalance,
      //     },
      //     {merge: true},
      //   );
      //
      //   return updatedBalance;
      // });

      // Demo-only: update local state so UI reacts
      setBalance(prev => prev + parsedAmount);
      setTransactions(prev => [
        {
          id: Date.now().toString(),
          userId: user.uid,
          type: 'income',
          method,
          description: description.trim(),
          amount: parsedAmount,
        },
        ...prev,
      ]);

      setDescription('');
      setAmount('');
      setMethod(METHODS[0]);
      setAddWalletVisible(false);
    } catch (e) {
      console.log('Error submitting wallet transaction (demo)', e);
      setFormError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const renderTransactionItem = ({item}: {item: any}) => {
    const iconName = (() => {
      switch (item.method) {
        case 'Money cash':
          return 'account-balance-wallet';
        case 'Debit card':
          return 'credit-card';
        case 'Bank account':
          return 'account-balance';
        case 'Credit card':
          return 'payment';
        default:
          return 'account-balance-wallet';
      }
    })();

    return (
      <View style={styles.transactionCard}>
        <View style={styles.transactionLeft}>
          <View style={styles.transactionIconWrapper}>
            <Icon
              name={iconName}
              size={22}
              color={appColors?.textColor || '#333'}
            />
          </View>
          <View style={styles.transactionTextWrapper}>
            <Text style={styles.transactionTitle}>{item.method}</Text>
            {!!item.description && (
              <Text style={styles.transactionSubtitle}>{item.description}</Text>
            )}
          </View>
        </View>
        <Text style={styles.transactionAmount}>
          {parsedCurrency(item.amount)}
        </Text>
      </View>
    );
  };

  const parsedCurrency = (value: number | string) =>
    `$${Number(value || 0).toFixed(2).toString()}`;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Icon name="arrow-back-ios" size={20} color="#333" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>My Balance</Text>

        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => setQrVisible(true)}>
          <Icon name="settings" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Balance Card */}
      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>My Balance</Text>
        <Text style={styles.balanceDate}>Today</Text>
        {balanceLoading ? (
          <ActivityIndicator color="#fff" style={styles.balanceLoader} />
        ) : (
          <Text style={styles.balanceValue}>{parsedCurrency(balance)}</Text>
        )}
        <Text style={styles.balanceFooter}>TOTAL BALANCE</Text>
      </View>

      {/* Transactions List */}
      <View style={styles.listContainer}>
        {transactionsLoading ? (
          <ActivityIndicator color={appColors?.primary || '#3b82f6'} />
        ) : (
          <FlatList
            data={transactions}
            keyExtractor={item => item.id}
            renderItem={renderTransactionItem}
            contentContainerStyle={styles.listContent}
          />
        )}
      </View>

      {/* Add Wallet Button */}
      <TouchableOpacity
        style={styles.addWalletButton}
        onPress={() => setAddWalletVisible(true)}>
        <Text style={styles.addWalletText}>ADD WALLET</Text>
      </TouchableOpacity>

      {/* Add Wallet Modal */}
      <Modal
        isVisible={addWalletVisible}
        onBackdropPress={() => !submitting && setAddWalletVisible(false)}
        useNativeDriver
        hideModalContentWhileAnimating>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Add Wallet</Text>

          {/* Method dropdown */}
          <Text style={styles.inputLabel}>Method</Text>
          <TouchableOpacity
            style={styles.dropdown}
            onPress={() => setMethodDropdownOpen(prev => !prev)}>
            <Text style={styles.dropdownText}>{method}</Text>
            <Icon
              name={methodDropdownOpen ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
              size={20}
              color="#555"
            />
          </TouchableOpacity>
          {methodDropdownOpen && (
            <View style={styles.dropdownList}>
              {METHODS.map(option => (
                <TouchableOpacity
                  key={option}
                  style={styles.dropdownItem}
                  onPress={() => {
                    setMethod(option);
                    setMethodDropdownOpen(false);
                  }}>
                  <Text style={styles.dropdownItemText}>{option}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Description */}
          <Text style={styles.inputLabel}>Description</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Description"
            value={description}
            onChangeText={setDescription}
          />

          {/* Amount */}
          <Text style={styles.inputLabel}>Amount</Text>
          <TextInput
            style={styles.textInput}
            placeholder="0.00"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
          />

          {!!formError && <Text style={styles.errorText}>{formError}</Text>}

          <View style={styles.modalActions}>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              disabled={submitting}
              onPress={() => {
                if (submitting) {
                  return;
                }
                setAddWalletVisible(false);
                setFormError('');
              }}>
              <Text style={[styles.modalButtonText, styles.cancelButtonText]}>
                Cancel
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalButton, styles.submitButton]}
              disabled={submitting}
              onPress={handleSubmit}>
              {submitting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.modalButtonText}>Submit</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* QR Code Modal */}
      <RNModal
        visible={qrVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setQrVisible(false)}>
        <View style={styles.qrBackdrop}>
          <View style={styles.qrContent}>
            <Text style={styles.modalTitle}>Your QR Code</Text>
            <View style={styles.qrPreviewWrapper}>
              {/* Placeholder UI while QR library is disabled */}
              <View style={styles.qrPreviewBox}>
                <Text style={styles.qrPreviewText}>QR Code preview for:</Text>
                <Text style={styles.qrUserId}>{user.uid}</Text>
              </View>
            </View>
            <TouchableOpacity
              style={[
                styles.modalButton,
                styles.submitButton,
                styles.qrCloseButton,
              ]}
              onPress={() => setQrVisible(false)}>
              <Text style={styles.modalButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </RNModal>
    </View>
  );
};

export default WalletScreen;

