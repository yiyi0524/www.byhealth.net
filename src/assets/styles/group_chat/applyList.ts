import { windowWidth } from '@/services/api'
import { StyleSheet } from 'react-native'
export default StyleSheet.create({
  main: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#fff',
  },
  list: {
    position: 'relative',
    paddingLeft: 15,
    paddingRight: 15,
  },
  item: {
    paddingTop: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F2',
  },
  info: {},
  avatarPar: {
    width: 50,
    height: 50,
    borderRadius: 100,
    overflow: 'hidden',
  },
  avatar: {
    width: 50,
    height: 50,
    resizeMode: 'cover',
  },
  right: {
    marginLeft: 15,
    flex: 1,
  },
  name: {
    fontSize: 15,
    color: '#333',
  },
  desc: {
    fontSize: 12,
    color: '#c7c7c7',
    marginTop: 5,
  },
  btnPar: {
    marginTop: 18,
  },
  btn: {
    width: (windowWidth - 45) / 2,
    height: 36,
    borderRadius: 20,
    borderWidth: 1,
    textAlign: 'center',
    lineHeight: 36,
    fontSize: 13,
  },
  reject: {
    marginRight: 15,
    borderColor: '#ED5736',
    color: '#ED5736',
  },
  agree: {
    backgroundColor: '#1FABA0',
    borderColor: '#1FABA0',
    color: '#fff',
  },
})
