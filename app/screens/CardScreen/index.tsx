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
import {
  Camera,
  useCameraDevice,
  useCodeScanner,
  useCameraPermission,
} from 'react-native-vision-camera';
import { styles } from './style';

type CardType = 'Debit' | 'Credit';

type Card = {
  id: string;
  brand: string;
  type: CardType;
  holder: string;
  number: string;
  last4: string;
  expiry: string;
  isPrimary?: boolean;
};

type Transaction = {
  id: string;
  userId: string;
  direction: 'income' | 'expense';
  amount: number;
  counterpartUserId: string;
};

// Placeholder for the current user. Replace with real auth UID later.
const CURRENT_USER_ID = 'USER_123';

const INITIAL_CARDS: Card[] = [
  {
    id: '1',
    brand: 'VISA',
    type: 'Credit',
    holder: 'Rohit Sharma',
    number: '3344 9988 4567 2323',
    last4: '2323',
    expiry: '22 / 24',
    isPrimary: true,
  },
  {
    id: '2',
    brand: 'Mastercard',
    type: 'Debit',
    holder: 'Rohit Sharma',
    number: '3344 3467 3421 2323',
    last4: '2323',
    expiry: '11 / 25',
  },
];

const CARD_TYPES: CardType[] = ['Debit', 'Credit'];

const CardScreen = () => {
  const [cards, setCards] = useState<Card[]>(INITIAL_CARDS);
  const [selectedCardId, setSelectedCardId] = useState<string>('1');

  const [addCardVisible, setAddCardVisible] = useState(false);
  const [cardHolderName, setCardHolderName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardType, setCardType] = useState<CardType>('Credit');
  const [cardTypeDropdownOpen, setCardTypeDropdownOpen] = useState(false);
  const [formError, setFormError] = useState('');

  const [amount, setAmount] = useState('');
  const [scanVisible, setScanVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [scannedUserId, setScannedUserId] = useState<string | null>(null);

  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Camera hooks
  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice('back');

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

  useEffect(() => {
    // Example side effect: log whenever a transfer is recorded.
    if (transactions.length > 0) {
      // Placeholder for sending these to backend in the future.
      // e.g. send to Firestore or your API.
      // console.log('Transactions updated', transactions);
    }
  }, [transactions]);

  const maskedNumber = (num: string) => {
    const cleaned = num.replace(/\s+/g, '');
    if (cleaned.length < 4) {
      return cleaned;
    }
    const last4 = cleaned.slice(-4);
    return `•••• •••• •••• ${last4}`;
  };

  const handleAddCardSubmit = () => {
    setFormError('');
    setSuccessMessage('');

    if (!cardHolderName.trim() || !cardNumber.trim() || !cardExpiry.trim()) {
      setFormError('Please fill all card fields.');
      return;
    }

    const newCard: Card = {
      id: Date.now().toString(),
      brand: cardType === 'Credit' ? 'VISA' : 'Mastercard',
      type: cardType,
      holder: cardHolderName.trim(),
      number: cardNumber.trim(),
      last4: cardNumber.trim().slice(-4),
      expiry: cardExpiry.trim(),
    };

    setCards(prev => [...prev, newCard]);
    setSelectedCardId(newCard.id);

    setCardHolderName('');
    setCardNumber('');
    setCardExpiry('');
    setCardType('Credit');
    setAddCardVisible(false);
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
    // If the modal is already closed or we are already processing a user, ignore
    // But `scanVisible` check inside the callback might follow stale state closure in some cases depending on implementation.
    // However, we call setScanVisible(false) immediately.

    // We need to guard against rapid multiple calls
    if (!value) return;

    setScanVisible(false);
    setErrorMessage('');
    setSuccessMessage('');

    if (!value.trim()) {
      setErrorMessage('Invalid QR code');
      return;
    }

    if (value === CURRENT_USER_ID) {
      setErrorMessage('You cannot transfer to yourself');
      return;
    }

    setScannedUserId(value);
    // Add small delay to allow modal to close smoothly before opening the next one
    setTimeout(() => {
      setConfirmVisible(true);
    }, 500);
  };

  const handleConfirmTransfer = () => {
    if (!scannedUserId) {
      setConfirmVisible(false);
      return;
    }

    const parsedAmount = Number(amount.replace(/,/g, '.'));
    if (Number.isNaN(parsedAmount) || parsedAmount <= 0) {
      setErrorMessage('Invalid amount.');
      setConfirmVisible(false);
      return;
    }

    const transferId = Date.now().toString();
    const expense: Transaction = {
      id: `${transferId}-expense`,
      userId: CURRENT_USER_ID,
      direction: 'expense',
      amount: parsedAmount,
      counterpartUserId: scannedUserId,
    };
    const income: Transaction = {
      id: `${transferId}-income`,
      userId: scannedUserId,
      direction: 'income',
      amount: parsedAmount,
      counterpartUserId: CURRENT_USER_ID,
    };

    setTransactions(prev => [expense, income, ...prev]);
    setConfirmVisible(false);
    setSuccessMessage('Transfer successful');
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

        <Text style={styles.amountLabel}>Enter amount</Text>
        <TextInput
          style={styles.amountInput}
          placeholder="₹0.00"
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
                onPress={() => handleQrScanned(CURRENT_USER_ID)}>
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

