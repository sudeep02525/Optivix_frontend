const fs = require('fs')
const p = 'c:/NexusIDE/optivix-frontend/components/Sidebar.jsx'
let s = fs.readFileSync(p, 'utf8')
const start = s.indexOf("activeTab === 'scanner_removed'")
const end = s.indexOf("activeTab === 'settings'")
if (start > -1 && end > start) {
  s = s.slice(0, start) + s.slice(end)
  fs.writeFileSync(p, s)
  console.log('removed block')
} else {
  console.log('not found', start, end)
}
