import { StyleSheet, Dimensions } from 'react-native';
import { appColors } from '../../Utiles/appColors';
// import { fonts } from '../../Utiles/appFont'; // Assuming fonts exist, if not we fall back to system fonts by not specifying or using default

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', // Or appColors.background
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
  },
  // Balance Card
  balanceCard: {
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 25,
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
    // Shadow
    shadowColor: '#6200EE',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  balanceLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    marginBottom: 5,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  balanceValue: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
  },
  
  // Tabs
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginTop: 30,
    marginBottom: 20,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 4,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 10,
  },
  activeTab: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9E9E9E',
  },
  activeTabText: {
    color: '#333',
  },

  // Timeline
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  transactionItem: {
    flexDirection: 'row',
    marginBottom: 0, // Handled by height or content
    height: 80,
  },
  // Date Column
  dateColumn: {
    width: 60,
    alignItems: 'flex-start',
    paddingTop: 5,
  },
  dateText: {
    fontSize: 12,
    color: '#9E9E9E',
    fontWeight: '500',
  },
  // Timeline Line
  timelineWrapper: {
    alignItems: 'center',
    width: 30,
    marginRight: 10,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#E0E0E0', // Lighter grey for the line
    position: 'absolute',
    top: 20, 
    bottom: -20, // Connect to next item
    zIndex: -1,
  },
  timelineDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 3,
    backgroundColor: '#fff',
    zIndex: 1,
    marginTop: 5,
  },
  // Content
  detailsCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff', // Transparent or white
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  textWrapper: {
    flex: 1,
  },
  typeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  descriptionText: {
    fontSize: 12,
    color: '#9E9E9E',
  },
  amountText: {
    fontSize: 16,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    color: '#999',
    fontSize: 16,
  }
});
