const http = require('http')
const fs = require('fs')
const url = require('url')
const path = require('path')

// 监听代码中未捕获的异常
process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason)
  process.exit(1)
})

// 下载超时时间
const TIMEOUT = 10 * 1000
async function download (options) {
  const { progress } = options
  const reqOptions = url.parse(options.url)
  const dest = options.dest
  const fileStream = fs.createWriteStream(dest)
  const request = http.get(reqOptions)
  let hasFailed
  return new Promise((resolve, reject) => {
    const onReqError = (err) => {
      hasFailed = true
      fileStream.end()
      fs.unlinkSync(dest)
      reject(err)
    }
    // 监听处理连接超时情况
    request.on('socket', (s) => {
      s.setTimeout(TIMEOUT, () => {
        onReqError(new Error('network timeout'))
        s.destroy()
      })
    })
    request.on('response', (response) => {
      const totalBytes = parseInt(response.headers['content-length'], 10)
      let downloaded = 0

      response.on('data', (chunk) => {
        fileStream.write(chunk)
        downloaded += chunk.length
        progress && progress({totalBytes, downloaded, time: Date.now()})
      })

      response.on('end', () => {
        if (hasFailed) return
        fileStream.end()
        const result = { url: options.url, dest }
        resolve(result)
      })
    })

    request.on('error', onReqError)
  })
}

download({
  url: 'http://img.ithome.com/newsuploadfiles/2018/2/20180201_121223_433.jpg',
  dest: path.join(__dirname, 'abc.jpg'),
  progress (ob) {
    console.log('progress', ob)
  }
}).then((resp) => {
  console.log('done', resp)
}, (err) => {
  console.log('failed', err)
})
