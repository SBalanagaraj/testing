import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Or MaterialCommunityIcons
import FontAwesome from 'react-native-vector-icons/FontAwesome5';
import { styles } from './style';

interface Transaction {
  id: string;
  userId: string;
  type: 'income' | 'expense';
  amount: number;
  method: string;
  description?: string;
  createdAt?: any; // Firebase Timestamp
  counterpartUserId?: string;
}

const TransactionScreen = () => {
  const user = auth().currentUser;
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [activeTab, setActiveTab] = useState<'Received' | 'Sent'>('Received');

  // Fetch Balance
  useEffect(() => {
    if (!user) return;
    const unsubscribe = firestore()
      .collection('users')
      .doc(user.uid)
      .onSnapshot(doc => {
        setBalance(doc.data()?.balance ?? 0);
      });
    return () => unsubscribe();
  }, [user]);

  // Fetch Transactions
  useEffect(() => {
    if (!user) return;
    setLoading(true);

    const unsubscribe = firestore()
      .collection('transactions')
      .where('userId', '==', user.uid)
      .onSnapshot(snapshot => {
        const list = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Sort by date desc (doing it client side for simplicity/avoiding index creation delays)
        list.sort((a, b) => {
          const tA = a.createdAt?.toMillis ? a.createdAt.toMillis() : Date.now();
          const tB = b.createdAt?.toMillis ? b.createdAt.toMillis() : Date.now();
          return tB - tA;
        });

        setTransactions(list);
        setLoading(false);
      }, err => {
        console.error("Tx load error", err);
        setLoading(false);
      });

    return () => unsubscribe();
  }, [user]);

  const filteredTransactions = transactions.filter(t => {
    if (activeTab === 'Received') return t.type === 'income';
    if (activeTab === 'Sent') return t.type === 'expense';
    return true;
  });

  const parsedCurrency = (val: number | string) => {
    return Number(val || 0).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$& ');
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp || !timestamp.toDate) return '';
    const date = timestamp.toDate();
    // Format: "Mar. 24"
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
    const dateStr = date.toLocaleDateString('en-US', options);
    // Insert dot after month if needed manually or accept default local
    // Simple custom format:
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[date.getMonth()]}. ${date.getDate()}`;
  };

  const renderItem = ({ item, index }: { item: Transaction; index: number }) => {
    const isIncome = item.type === 'income';
    
    // Icon Logic
    let iconName = 'exchange-alt';
    let iconColor = isIncome ? '#4CAF50' : '#F44336';
    let bgColor = isIncome ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)';

    if (item.method === 'Money cash') iconName = 'wallet';
    if (item.method === 'Bank account') iconName = 'university';
    if (item.method === 'Transfer') iconName = isIncome ? 'arrow-down' : 'arrow-up';

    return (
      <View style={styles.transactionItem}>
        {/* Left Date */}
        <View style={styles.dateColumn}>
          <Text style={styles.dateText}>{formatDate(item.createdAt)}</Text>
        </View>

        {/* Timeline Line */}
        <View style={styles.timelineWrapper}>
           {/* Only show line if not last item, or handle smarter line connecting */}
           {index !== filteredTransactions.length - 1 && <View style={styles.timelineLine} />}
           <View style={[styles.timelineDot, { borderColor: isIncome ? '#4CAF50' : '#3B82F6' }]} />
        </View>

        {/* Details */}
        <View style={styles.detailsCard}>
           {/* Icon Box */}
           <View style={[styles.iconWrapper, { backgroundColor: bgColor }]}>
              <FontAwesome name={iconName} size={16} color={iconColor} />
           </View>

           <View style={styles.textWrapper}>
              <Text style={styles.typeText}>{isIncome ? 'Income' : 'Expend'}</Text>
              <Text style={styles.descriptionText} numberOfLines={1}>{item.description || item.method}</Text>
           </View>
           
           <View>
             {isIncome ? (
                 <Text style={[styles.amountText, { color: '#4CAF50' }]}>+ {parsedCurrency(item.amount)} $</Text>
             ) : (
                 <Text style={[styles.amountText, { color: '#333' }]}>{parsedCurrency(item.amount)} $</Text>
             )}
           </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Header (Optional custom header or just spacing) */}
      <View style={{height: 20}} />

      {/* Balance Card */}
      <LinearGradient
        colors={['#7F00FF', '#E100FF']} 
        start={{x: 0, y: 0}} end={{x: 1, y: 1}}
        style={styles.balanceCard}
      >
        <Text style={styles.balanceLabel}>TOTAL BALANCE</Text>
        <Text style={styles.balanceValue}>{parsedCurrency(balance)} $</Text>
      </LinearGradient>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'Received' && styles.activeTab]}
          onPress={() => setActiveTab('Received')}
        >
          <Text style={[styles.tabText, activeTab === 'Received' && styles.activeTabText]}>Received</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'Sent' && styles.activeTab]}
          onPress={() => setActiveTab('Sent')}
        >
          <Text style={[styles.tabText, activeTab === 'Sent' && styles.activeTabText]}>Sent</Text>
        </TouchableOpacity>
      </View>

      {/* List */}
      {loading ? (
        <ActivityIndicator size="large" color="#E100FF" style={{marginTop: 50}} />
      ) : (
        <FlatList
          data={filteredTransactions}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
               <Text style={styles.emptyText}>No {activeTab.toLowerCase()} transactions.</Text>
            </View>
          }
        />
      )}
    </View>
  );
};

export default TransactionScreen;
