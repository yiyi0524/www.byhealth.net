import React, { Component } from 'react'
import { Text, View, Platform } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { AudioRecorder, AudioUtils } from 'react-native-audio'
import Permissions from 'react-native-permissions'
import { uploadAudio } from '@/services/api'
interface Props {}
interface State {
  hasMicAuth: boolean
  isRecord: boolean
  recordTime: number
}
type DefaultProps = {}
const audioPath = AudioUtils.CachesDirectoryPath + '/tempAudio.aac'

export default class Test extends Component<Props & DefaultProps, State> {
  static defaultProps: DefaultProps
  constructor(props: any) {
    super(props)
    this.state = this.getInitState()
  }
  getInitState = (): State => {
    return { hasMicAuth: false, isRecord: false, recordTime: 0 }
  }
  checkAudioRecordAuth = () => {
    return new Promise((s, j) => {
      Permissions.check('microphone')
        .then(resp => {
          // Response is one of: 'authorized', 'denied', 'restricted', or 'undetermined'
          if (resp !== 'authorized') {
            Permissions.request('microphone').then(status => {
              if (status === 'authorized') {
                s()
              } else {
                j()
              }
            })
          } else {
            s()
          }
        })
        .catch(() => {
          j()
        })
    })
      .then(() => {
        this.setState({ hasMicAuth: true })
      })
      .catch(() => this.setState({ hasMicAuth: false }))
  }
  componentDidMount() {
    Permissions.check('microphone').then(resp => {
      if (resp === 'authorized') {
        this.setState({
          hasMicAuth: true,
        })
      }
    })
    AudioRecorder.onProgress = data => {
      this.setState({ recordTime: Math.floor(data.currentTime) })
    }
    AudioRecorder.onFinished = data => {
      console.log('onFinished: ', data)
    }
  }
  cancelRecord = () => {
    this.setState({
      isRecord: false,
    })
    AudioRecorder.stopRecording().catch(err => {
      console.log('取消录音失败,', err)
    })
  }
  render() {
    const { hasMicAuth, recordTime, isRecord } = this.state
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>{recordTime}</Text>
        <TouchableOpacity
          onPressIn={() => {
            if (!hasMicAuth) {
              console.log('当前没有录音权限')
              this.checkAudioRecordAuth()
              return
            }
            if (isRecord) {
              console.log('当前正在录音,取消')
              return
            }
            this.setState(
              {
                isRecord: true,
              },
              () => {
                console.log('正在录音')
                AudioRecorder.prepareRecordingAtPath(audioPath, {
                  SampleRate: 22050,
                  Channels: 1,
                  AudioQuality: 'Low',
                  AudioEncoding: 'aac',
                }).then(() => {
                  AudioRecorder.startRecording()
                    .then(val => console.log('开始录音成功,', val))
                    .catch(err => {
                      console.error(err)
                      this.setState({ isRecord: false })
                    })
                })
              },
            )
          }}
          onPressOut={() => {
            if (!isRecord) {
              return
            }
            if (recordTime < 1) {
              console.log('录音时间过短正在取消')
              this.cancelRecord()
              return
            }
            this.setState({
              isRecord: false,
            })
            AudioRecorder.stopRecording().then(val => {
              console.log(val)
              this.setState({
                recordTime: 0,
              })
              let filePrefix = Platform.OS === 'android' ? 'file://' : ''
              uploadAudio(filePrefix + val)
                .then(json => console.log(json))
                .catch(err => console.log(err))
            })
          }}
        >
          <View
            style={{
              width: 200,
              height: 50,
              borderColor: 'red',
              borderStyle: 'solid',
              borderWidth: 1,
            }}
          >
            <Text style={{ fontSize: 20, color: isRecord ? 'red' : '#333' }}>录制</Text>
          </View>
        </TouchableOpacity>
      </View>
    )
  }
}
