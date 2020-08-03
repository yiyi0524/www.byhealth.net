import { StyleSheet } from 'react-native'
import sColor from '@styles/color'
export default StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#F9F9F9',
    position: 'relative',
  },
  searchPar: {
    padding: 15,
    backgroundColor: '#fff',
  },
  search: {
    borderRadius: 5,
    backgroundColor: '#F9F9F9',
  },
  input: {
    fontSize: 14,
    color: '#999',
  },
  list: {
    paddingLeft: 15,
    paddingRight: 15,
    backgroundColor: '#fff',
  },
  item: {
    paddingTop: 20,
    paddingBottom: 7,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(219, 219, 219, 0.6)',
  },
  img: {
    width: 36,
    height: 36,
    resizeMode: 'contain',
  },
  inputNumBox: {
    flex: 6,
    
  },
  inputNum: {
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    color: sColor.color666,
    fontSize: 14,
    textAlign: 'center',
  },
  title: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
    marginRight: 12,
  },
  desc: {
    flex: 1,
    fontSize: 13,
    color: '#8B8B8B',
  },
  icon: {
    fontSize: 18,
    color: '#6D6D6D',
  },
  userIcon: {
    flex: 1,
  },
  tips: {
    backgroundColor: '#4D81E4',
    marginTop: 10,
    position: 'relative',
    padding: 8,
    paddingLeft: 15,
    paddingRight: 15,
  },
  tipsTitle: {
    fontSize: 14,
    color: '#fff',
  },
  patientList: {
    flex: 1,
  },
  patientItem: {
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 100,
    resizeMode: 'cover',
  },
  name: {
    marginLeft: 15,
    marginRight: 15,
    fontSize: 15,
    color: '#333',
    flex: 1,
  },
  time: {
    fontSize: 13,
    color: '#999',
  },
  loading: {
    textAlign: 'center',
    lineHeight: 80,
  },
})
