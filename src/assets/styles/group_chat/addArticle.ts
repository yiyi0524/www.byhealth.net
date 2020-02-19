import { StyleSheet } from 'react-native'
export default StyleSheet.create({
  main: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#fff',
  },
  content: {
    flex: 0.9,
    padding: 15,
  },
  list: {
    paddingBottom: 30,
  },
  footer: {
    flex: 0.1,
    position: 'relative',
  },
  btnPar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 8,
    paddingLeft: 35,
    paddingRight: 35,
    backgroundColor: '#fff',
  },
  btnContent: {
    height: 44,
    backgroundColor: '#ED5736',
    borderRadius: 22,
  },
  btn: {
    lineHeight: 44,
    textAlign: 'center',
    color: '#fff',
    fontSize: 14,
  },
  item: {},
  input: {
    fontSize: 13,
    color: '#666',
  },
  title: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
  },
  textarea: {
    marginBottom: 15,
    fontSize: 13,
    color: '#666',
    borderWidth: 1,
    borderColor: '#eee',
  },
})
