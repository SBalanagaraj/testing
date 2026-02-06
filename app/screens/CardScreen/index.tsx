import React, {useEffect, useMemo, useState} from 'react';
import {
  Modal as RNModal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {styles} from './style';

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

  const handleScanPress = () => {
    setErrorMessage('');
    setSuccessMessage('');
    setScanVisible(true);
  };

  // This function simulates what would happen when a QR is scanned.
  // When you integrate a real QR library (e.g. react-native-camera or react-native-qrcode-scanner),
  // call this function with the scanned UID.
  const handleQrScanned = (value: string | null) => {
    setScanVisible(false);
    setErrorMessage('');
    setSuccessMessage('');

    if (!value || !value.trim()) {
      setErrorMessage('Invalid QR code');
      return;
    }

    if (value === CURRENT_USER_ID) {
      setErrorMessage('You cannot transfer to yourself');
      return;
    }

    setScannedUserId(value);
    setConfirmVisible(true);
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

      {/* QR Scanner UI placeholder.
          When you integrate a library like `react-native-camera`,
          render the camera preview inside this overlay and call `handleQrScanned`
          from the onBarCodeRead/onRead callback. */}
      <RNModal
        visible={scanVisible}
        animationType="fade"
        transparent
        onRequestClose={() => setScanVisible(false)}>
        <View style={styles.cameraOverlay}>
          <View style={styles.cameraFrame}>
            <Text style={styles.cameraHint}>
              Camera preview placeholder.{'\n'}
              Integrate a QR scanner library here and call handleQrScanned(uid)
              when a QR code is detected.
            </Text>
          </View>
          <View style={styles.cameraActions}>
            <TouchableOpacity
              style={styles.cameraSimButton}
              onPress={() => handleQrScanned(CURRENT_USER_ID)}>
              <Text style={styles.cameraSimText}>Simulate Self Scan</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cameraSimButton}
              onPress={() => handleQrScanned('OTHER_USER_456')}>
              <Text style={styles.cameraSimText}>Simulate Valid Scan</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cameraSimButton}
              onPress={() => handleQrScanned(null)}>
              <Text style={styles.cameraSimText}>Simulate Invalid QR</Text>
            </TouchableOpacity>
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

