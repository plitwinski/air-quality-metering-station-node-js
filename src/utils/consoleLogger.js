export const log = (msg) => {
  if (process.env.OMEGA2P !== true) {
    console.log(msg)
  }
}
