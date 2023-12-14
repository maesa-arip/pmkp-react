import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer'
import React from 'react'
import MyDocument from './MyDocument'

export default function ViewDocument() {
  return (
    <PDFDownloadLink document={<MyDocument/>}></PDFDownloadLink>
//   <PDFViewer>
//     <MyDocument />
//   </PDFViewer>
  )
}
