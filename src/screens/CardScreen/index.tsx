import React, { useEffect, useMemo, useState } from 'react';
import {
  Modal as RNModal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/MaterialIcons';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {
  Camera,
  useCameraDevice,
  useCodeScanner,
  useCameraPermission,
} from 'react-native-vision-camera';
import { styles } from './style';
import { appColors } from '../../Utiles/appColors';

type CardType = 'Debit' | 'Credit';

type Card = {
  id: string;
  brand: string;
  type: CardType;
  holder: string;
  number: string;
  last4: string;
  expiry: string;
  cvv?: string; // Optional for backward compatibility or strict for new cards
  isPrimary?: boolean;
};

type Transaction = {
  id: string;
  userId: string;
  direction: 'income' | 'expense';
  amount: number;
  counterpartUserId: string;
};

const CARD_TYPES: CardType[] = ['Debit', 'Credit'];

const CardScreen = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [loadingCards, setLoadingCards] = useState(true);
  const [selectedCardId, setSelectedCardId] = useState<string>('');

  const [addCardVisible, setAddCardVisible] = useState(false);
  const [cardHolderName, setCardHolderName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardType, setCardType] = useState<CardType>('Credit');
  const [cardTypeDropdownOpen, setCardTypeDropdownOpen] = useState(false);
  const [formError, setFormError] = useState('');
  const [submittingCard, setSubmittingCard] = useState(false);

  const [amount, setAmount] = useState('');
  const [scanVisible, setScanVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [scannedUserId, setScannedUserId] = useState<string | null>(null);
  const [transferring, setTransferring] = useState(false);

  // Camera hooks
  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice('back');

  const user = auth().currentUser;

  // Fetch Cards from Firestore
  useEffect(() => {
    if (!user) return;
    setLoadingCards(true);
    const unsubscribe = firestore()
      .collection('users')
      .doc(user.uid)
      .collection('cards')
      .onSnapshot(
        (snapshot: any) => {
          const fetchedCards: Card[] = snapshot.docs.map((doc: any) => ({
            id: doc.id,
            ...doc.data(),
          } as Card));
          
          setCards(fetchedCards);
          if (fetchedCards.length > 0 && !selectedCardId) {
             setSelectedCardId(fetchedCards[0].id);
          }
          setLoadingCards(false);
        },
        (error: any) => {
          console.error('Error fetching cards', error);
          setLoadingCards(false);
        }
      );

    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    if (scanVisible && !hasPermission) {
      requestPermission();
    }
  }, [scanVisible, hasPermission, requestPermission]);

  const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'ean-13'],
    onCodeScanned: codes => {
      if (codes.length > 0 && codes[0].value) {
        handleQrScanned(codes[0].value);
      }
    },
  });

  const maskedNumber = (num: string) => {
    const cleaned = num.replace(/\s+/g, '');
    if (cleaned.length < 4) {
      return cleaned;
    }
    const last4 = cleaned.slice(-4);
    return `•••• •••• •••• ${last4}`;
  };

  const handleAddCardSubmit = async () => {
    setFormError('');
    setSuccessMessage('');

    if (!cardHolderName.trim() || !cardNumber.trim() || !cardExpiry.trim() || !cardCvv.trim()) {
      setFormError('Please fill all card fields.');
      return;
    }

    if (!user) {
        setFormError('User not authenticated');
        return;
    }

    setSubmittingCard(true);

    try {
        const newCardData = {
            brand: cardType === 'Credit' ? 'VISA' : 'Mastercard',
            type: cardType,
            holder: cardHolderName.trim(),
            number: cardNumber.trim(),
            last4: cardNumber.trim().slice(-4),
            expiry: cardExpiry.trim(),
            cvv: cardCvv.trim(),
            createdAt: firestore.FieldValue.serverTimestamp(),
        };

        const docRef = await firestore()
            .collection('users')
            .doc(user?.uid)
            .collection('cards')
            .add(newCardData);

        setSelectedCardId(docRef.id);
        
        setCardHolderName('');
        setCardNumber('');
        setCardExpiry('');
        setCardCvv('');
        setCardType('Credit');
        setAddCardVisible(false);
        setSuccessMessage('Card added successfully');
    } catch (error) {
        console.error('Error adding card:', error);
        setFormError('Failed to add card. Please try again.');
    } finally {
        setSubmittingCard(false);
    }
  };

  const handleScanPress = async () => {
    setErrorMessage('');
    setSuccessMessage('');
    if (!hasPermission) {
      const permission = await requestPermission();
      if (!permission) {
        Alert.alert('Permission needed', 'Camera permission is required to scan QR codes');
        return;
      }
    }
    setScanVisible(true);
  };

  const handleQrScanned = (value: string | null) => {
    if (!value) return;

    // Prevent scanning if already processing
    // if (scanVisible === false) return; // Simple debounce check

    setScanVisible(false);
    setErrorMessage('');
    setSuccessMessage('');

    if (!value.trim()) {
      setErrorMessage('Invalid QR code');
      return;
    }

    // Validate that the ID doesn't contain path separators
    if (value.includes('/') || value.includes('\\')) {
        setErrorMessage('Invalid User ID format');
        return;
    }

    if (user && value === user.uid) {
      setErrorMessage('You cannot transfer to yourself');
      return;
    }

    setScannedUserId(value);
    
    setTimeout(() => {
      setConfirmVisible(true);
    }, 500);
  };

  const handleConfirmTransfer = async () => {
    if (!scannedUserId || !user) {
      setConfirmVisible(false);
      return;
    }

    // 1. Validate Amount
    const parsedAmount = Number(amount.replace(/,/g, '.'));
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      setErrorMessage('Invalid amount. Please enter a positive number.');
      setConfirmVisible(false);
      return;
    }

    setTransferring(true);

    try {
      await firestore().runTransaction(async (transaction: any) => {
        const senderRef = firestore().collection('users').doc(user.uid);
        const receiverRef = firestore().collection('users').doc(scannedUserId);

        // 2. Read both documents
        const senderSnapshot = await transaction.get(senderRef);
        const receiverSnapshot = await transaction.get(receiverRef);

        if (!senderSnapshot.exists) {
          throw new Error("Sender account not found.");
        }
        if (!receiverSnapshot.exists) {
          throw new Error("Receiver account not found.");
        }

        const senderBalance = senderSnapshot.data()?.balance ?? 0;
        const receiverBalance = receiverSnapshot.data()?.balance ?? 0;

        // 3. Check Insufficient Funds
        if (senderBalance < parsedAmount) {
             throw new Error(`Insufficient balance! Available: ${senderBalance}`);
        }

        // 4. Calculate New Balances (Sender -> Receiver)
        const newSenderBalance = senderBalance - parsedAmount;
        const newReceiverBalance = receiverBalance + parsedAmount;

        // 5. Update Balances
        transaction.update(senderRef, { balance: newSenderBalance });
        transaction.update(receiverRef, { balance: newReceiverBalance });

        // 6. Create Transaction Records
        const now = firestore.FieldValue.serverTimestamp();

        // Sender Record (Expense)
        const senderTxRef = firestore().collection('transactions').doc();
        transaction.set(senderTxRef, {
          userId: user.uid,
          type: 'expense',
          method: 'Transfer',
          description: `Transfer to ${scannedUserId}`,
          amount: parsedAmount,
          createdAt: now,
          counterpartUserId: scannedUserId
        });

        // Receiver Record (Income)
        const receiverTxRef = firestore().collection('transactions').doc();
        transaction.set(receiverTxRef, {
          userId: scannedUserId,
          type: 'income',
          method: 'Transfer',
          description: `Received from ${user.uid}`,
          amount: parsedAmount,
          createdAt: now,
          counterpartUserId: user.uid
        });
      });

      setSuccessMessage('Transfer successful!');
      setAmount('');
      setScannedUserId(null);
    } catch (e: any) {
      console.error("Transfer failed", e);
      setErrorMessage(e.message || "Transfer failed");
    } finally {
      setTransferring(false);
      setConfirmVisible(false);
    }
  };


  const selectedCard = useMemo(
    () => cards.find(c => c.id === selectedCardId) || cards[0],
    [cards, selectedCardId],
  );
  const otherCards = useMemo(
    () => cards.filter(c => c.id !== selectedCard?.id),
    [cards, selectedCard?.id],
  );

  const renderPrimaryCard = () => {
    if (!selectedCard) {
      return null;
    }

    return (
      <View style={styles.primaryCardWrapper}>
        {/* Top compact row matching list style */}
        <View style={styles.primaryTopRow}>
          <View style={styles.cardLeft}>
            <View style={styles.cardBrandBadge}>
              <Text style={styles.cardBrandText}>{selectedCard.brand}</Text>
            </View>
            <Text style={styles.primaryTopNumber}>{selectedCard.number}</Text>
          </View>
          <Icon name="check-circle" size={20} color="#10b981" />
        </View>

        {/* Large gradient card */}
        <View style={styles.primaryCard}>
          <View style={styles.primaryRow}>
            <Text style={styles.primaryBrand}>
              {selectedCard.brand} {selectedCard.number.slice(0, 4)} **** ****{' '}
              {selectedCard.last4}
            </Text>
            <View>
              <Text style={styles.primaryDateLabel}>EXPIRY DATE</Text>
              <Text style={styles.primaryExpiry}>{selectedCard.expiry}</Text>
            </View>
          </View>

          <View>
            <Text style={styles.primaryNumberLabel}>CARD NUMBER</Text>
            <Text style={styles.primaryNumber}>{selectedCard.number}</Text>
          </View>

          <View style={styles.primaryFooterRow}>
            <View style={styles.primaryFooterCol}>
              <Text style={styles.primaryFooterLabel}>CARD HOLDER</Text>
              <Text style={styles.primaryFooterValue}>{selectedCard.holder}</Text>
            </View>
            <View style={styles.primaryFooterCol}>
              <Text style={styles.primaryFooterLabel}>CVV</Text>
              <Text style={styles.primaryFooterValue}>***</Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const renderCardItem = (card: Card) => {
    const isSelected = card.id === selectedCardId;

    return (
      <TouchableOpacity
        key={card.id}
        style={styles.cardItem}
        onPress={() => setSelectedCardId(card.id)}>
        <View style={styles.cardLeft}>
          <View style={styles.cardBrandBadge}>
            <Text style={styles.cardBrandText}>{card.brand}</Text>
          </View>
          <View style={styles.cardTextWrapper}>
            <Text style={styles.cardNumber}>{maskedNumber(card.number)}</Text>
            <Text style={styles.cardHolder}>{card.holder}</Text>
          </View>
        </View>
        <View style={styles.cardRight}>
          <Text style={styles.cardType}>{card.type} card</Text>
          <Text style={styles.cardExpiry}>{card.expiry}</Text>
          <View style={styles.cardSelectedIcon}>
            <Icon
              name={isSelected ? 'radio-button-checked' : 'radio-button-unchecked'}
              size={18}
              color={isSelected ? '#10b981' : '#d1d5db'}
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const isScanDisabled = !amount.trim();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Icon name="arrow-back-ios" size={20} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>ADD CARD</Text>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled>
        {/* Cards section */}
        <View style={styles.cardsContainer}>
          {renderPrimaryCard()}

          <View style={styles.cardsList}>
            {otherCards.map(renderCardItem)}
          </View>
        </View>

        {/* Scan & transfer section */}
        <TouchableOpacity
          style={[
            styles.scanSection,
            isScanDisabled && styles.disabledButton,
          ]}
          activeOpacity={0.8}
          disabled={isScanDisabled}
          onPress={handleScanPress}>
          <Icon
            name="qr-code-scanner"
            size={40}
            color="#111827"
            style={styles.scanIcon}
          />
          <Text style={styles.scanLabel}>Scan Card</Text>
        </TouchableOpacity>

        <TextInput
          style={styles.amountInput}
          placeholder="Enter amount"
          placeholderTextColor={`#007bff`}
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
        />

        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
        {successMessage ? (
          <Text style={styles.successText}>{successMessage}</Text>
        ) : null}
      </ScrollView>

      <TouchableOpacity
        style={styles.addCardPrimaryButton}
        onPress={() => {
          setFormError('');
          setAddCardVisible(true);
        }}>
        <Text style={styles.addCardPrimaryText}>ADD CARD</Text>
      </TouchableOpacity>

      {/* Add Card Modal */}
      <Modal
        isVisible={addCardVisible}
        onBackdropPress={() => setAddCardVisible(false)}
        useNativeDriver
        hideModalContentWhileAnimating>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Add Card</Text>

          <Text style={styles.inputLabel}>Card Holder Name</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Full name"
            value={cardHolderName}
            onChangeText={setCardHolderName}
          />

          <Text style={styles.inputLabel}>Card Number</Text>
          <TextInput
            style={styles.textInput}
            placeholder="XXXX XXXX XXXX XXXX"
            keyboardType="numeric"
            value={cardNumber}
            onChangeText={setCardNumber}
          />

          <Text style={styles.inputLabel}>Expiry Date</Text>
          <TextInput
            style={styles.textInput}
            placeholder="MM / YY"
            value={cardExpiry}
            onChangeText={setCardExpiry}
          />

          <Text style={styles.inputLabel}>CVV</Text>
          <TextInput
            style={styles.textInput}
            placeholder="123"
            keyboardType="numeric"
            maxLength={3}
            value={cardCvv}
            onChangeText={setCardCvv}
          />

          <Text style={styles.inputLabel}>Card Type</Text>
          <TouchableOpacity
            style={styles.dropdown}
            onPress={() => setCardTypeDropdownOpen(prev => !prev)}>
            <Text style={styles.dropdownText}>{cardType}</Text>
            <Icon
              name={cardTypeDropdownOpen ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
              size={20}
              color="#555"
            />
          </TouchableOpacity>
          {cardTypeDropdownOpen && (
            <View style={styles.dropdownList}>
              {CARD_TYPES.map(type => (
                <TouchableOpacity
                  key={type}
                  style={styles.dropdownItem}
                  onPress={() => {
                    setCardType(type);
                    setCardTypeDropdownOpen(false);
                  }}>
                  <Text style={styles.dropdownItemText}>{type}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {!!formError && <Text style={styles.errorText}>{formError}</Text>}

          <View style={styles.modalActions}>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => {
                setAddCardVisible(false);
                setFormError('');
              }}>
              <Text style={[styles.modalButtonText, styles.cancelButtonText]}>
                Cancel
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalButton, styles.submitButton]}
              onPress={handleAddCardSubmit}>
              <Text style={styles.modalButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Camera Modal */}
      <RNModal
        visible={scanVisible}
        animationType="fade"
        onRequestClose={() => setScanVisible(false)}>
        <View style={StyleSheet.absoluteFill}>
          {device != null && hasPermission ? (
            <Camera
              style={StyleSheet.absoluteFill}
              device={device}
              isActive={scanVisible}
              codeScanner={codeScanner}
            />
          ) : (
            <View style={{ flex: 1, backgroundColor: 'black', justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ color: 'white' }}>
                {hasPermission === false ? "No Camera Permission" : "Loading Camera..."}
              </Text>
            </View>
          )}

          <TouchableOpacity
            style={{
              position: 'absolute',
              top: 40,
              right: 20,
              padding: 10,
              backgroundColor: 'rgba(0,0,0,0.5)',
              borderRadius: 20
            }}
            onPress={() => setScanVisible(false)}
          >
            <Icon name="close" size={30} color="white" />
          </TouchableOpacity>

          {/* Keeping simulation buttons for testing if device not available in emulator, etc. */}
          <View style={{ position: 'absolute', bottom: 50, left: 0, right: 0, alignItems: 'center' }}>
            <Text style={{ color: 'white', marginBottom: 20, backgroundColor: 'rgba(0,0,0,0.5)', padding: 5 }}>Scan QR Code to Transfer</Text>

            {/* Development/Fallback helpers */}
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <TouchableOpacity
                style={{ backgroundColor: '#fff', padding: 8, borderRadius: 5 }}
                onPress={() => user?.uid && handleQrScanned(user.uid)}>
                <Text style={{ color: '#000', fontSize: 10 }}>Sim Self</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ backgroundColor: '#fff', padding: 8, borderRadius: 5 }}
                onPress={() => handleQrScanned('OTHER_USER_456')}>
                <Text style={{ color: '#000', fontSize: 10 }}>Sim Valid</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </RNModal>

      {/* Transfer confirmation modal */}
      <Modal
        isVisible={confirmVisible}
        onBackdropPress={() => setConfirmVisible(false)}
        useNativeDriver
        hideModalContentWhileAnimating>
        <View style={styles.confirmModalContent}>
          <Text style={styles.confirmText}>
            Transfer ₹{amount || '0.00'} to this user?
          </Text>
          <View style={styles.modalActions}>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => setConfirmVisible(false)}>
              <Text style={[styles.modalButtonText, styles.cancelButtonText]}>
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.submitButton]}
              onPress={handleConfirmTransfer}>
              <Text style={styles.modalButtonText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default CardScreen;

