
export default class FakeSerialPort {
  constructor (portName, params) {
    this._isOpen = false
    const that = this
    this.close = jest.fn(() => {
      that._isOpen = false
    })
    this.portName = portName
    this.params = params
  }
  open (callback) {
    this._isOpen = true
    callback()
  }
  on (_, callback) {
    callback(Buffer.from([0xaa, 0xc5, 0x08, 0x01, 0x00, 0x00, 0xea, 0xb4, 0xa7, 0xab]))
  }
  isOpen () {
    return this._isOpen
  }
  write (_, callback) {
    callback()
  }
}
