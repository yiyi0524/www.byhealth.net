import { ImagePickerOptions } from "react-native-image-picker"
const opt: ImagePickerOptions = {
  // 不生成 base64 图片,可以提升性能
  noData: true,
  allowsEditing: true,
  // 文件质量 0-1 之间
  quality: 0.5,
  mediaType: "photo",
  title: "选择图片",
  cancelButtonTitle: "取消",
  chooseFromLibraryButtonTitle: "从相册选择",
  takePhotoButtonTitle: "拍照",
  customButtons: [],
  storageOptions: {
    skipBackup: true,
    path: "images",
  },
}
export default opt
