import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fb',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2933',
  },
  settingsButton: {
    padding: 8,
  },
  balanceCard: {
    marginTop: 16,
    marginHorizontal: 16,
    paddingVertical: 24,
    paddingHorizontal: 20,
    borderRadius: 16,
    // backgroundColor: '#5B4FE9', // Handled by LinearGradient
    alignItems: 'center', // Center content horizontally
    elevation: 4,
    shadowColor: '#fff',
  },
  balanceLabel: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 4,
  },
  balanceDate: {
    color: '#e5e7eb',
    fontSize: 12,
  },
  balanceValue: {
    marginTop: 16,
    fontSize: 32,
    fontWeight: '700',
    color: '#fff',
  },
  balanceFooter: {
    marginTop: 4,
    fontSize: 12,
    color: '#e5e7eb',
  },
  balanceLoader: {
    marginTop: 16,
  },
  listContainer: {
    flex: 1,
    marginTop: 16,
    paddingHorizontal: 16,
  },
  listContent: {
    paddingVertical: 8,
  },
  transactionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 10,
    elevation: 0.4,
    shadowColor: '#fff',
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  transactionIconWrapper: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#eef2ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  transactionTextWrapper: {
    marginLeft: 10,
  },
  transactionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  transactionSubtitle: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  transactionAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  addWalletButton: {
    marginHorizontal: 16,
    marginBottom: 24,
    backgroundColor: '#007bff',
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addWalletText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
    textAlign: 'center',
  },
  inputLabel: {
    fontSize: 13,
    color: '#4b5563',
    marginTop: 8,
    marginBottom: 4,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: '#111827',
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  dropdownText: {
    fontSize: 14,
    color: '#111827',
  },
  dropdownList: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    marginTop: 4,
    overflow: 'hidden',
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
  },
  dropdownItemText: {
    fontSize: 14,
    color: '#111827',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    marginRight: 8,
  },
  submitButton: {
    backgroundColor: '#007bff',
    marginLeft: 8,
  },
  modalButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  cancelButtonText: {
    color: '#111827',
  },
  errorText: {
    color: '#b91c1c',
    fontSize: 12,
    marginTop: 6,
  },
  qrBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  qrContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    width: '100%',
  },
  qrPreviewWrapper: {
    marginVertical: 24,
  },
  qrPreviewBox: {
    width: 180,
    height: 180,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#9ca3af',
    justifyContent: 'center',
    alignItems: 'center',
  },
  qrPreviewText: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  qrUserId: {
    marginTop: 8,
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
  },
  qrCloseButton: {
    alignSelf: 'stretch',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  infoText: {
    fontSize: 14,
    color: '#4b5563',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 8,
  },
});

