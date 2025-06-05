const { contextBridge } = require('electron')
const fs = require('fs')
const path = require('path')
const xlsx = require('xlsx')

contextBridge.exposeInMainWorld('fortnocAPI', {
  loadExcelData: () => {
    try {
      const base = process.cwd()
      const groupsPath = path.join(base, 'email_groups.xlsx')
      const contactsPath = path.join(base, 'contacts.xlsx')

      const groupsWB = xlsx.readFile(groupsPath)
      const contactsWB = xlsx.readFile(contactsPath)

      const groupsSheet = groupsWB.Sheets[groupsWB.SheetNames[0]]
      const contactsSheet = contactsWB.Sheets[contactsWB.SheetNames[0]]

      return {
        emailData: xlsx.utils.sheet_to_json(groupsSheet, { header: 1 }),
        contactData: xlsx.utils.sheet_to_json(contactsSheet)
      }
    } catch (err) {
      console.error("❌ Excel load error:", err.message)
      return { error: err.message }
    }
  }
})
