
const SUCCESS = 0x0;
export default config => {
  return new Promise((s, j) => {
    fetch(config.url, config)
      .then(resp => {
        console.log(resp)
        if (resp.ok) {
          resp.json().then((json) => {
            console.log(json)
            if (json.code === SUCCESS) {
              s(json)
            } else {
              j(json)
            }
          })
        } else {
          j({
            msg: `HttpCode ${resp.status} ${resp.statusText}`,
          })
        }
      })

  })
}
