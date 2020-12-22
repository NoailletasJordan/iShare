// *https://www.registers.service.gov.uk/registers/country/use-the-api*
import 'isomorphic-fetch'
import React from 'react'
import TextField from '@material-ui/core/TextField'
import Autocomplete from '@material-ui/lab/Autocomplete'
import CircularProgress from '@material-ui/core/CircularProgress'

function sleep(delay = 0) {
  return new Promise(resolve => {
    setTimeout(resolve, delay)
  })
}

export default function Asynchronous(props) {
  const [open, setOpen] = React.useState(false)
  const [options, setOptions] = React.useState([])
  const loading = open && options.length === 0
  const inputEl = React.useRef(null)

  React.useEffect(() => {
    if (!inputEl.current) return
    console.log(inputEl.current.value)
  }, [inputEl.current])

  React.useEffect(() => {
    let active = true

    if (!loading) {
      return undefined
    }

    ;(async () => {
      const response = await fetch(
        'https://country.register.gov.uk/records.json?page-size=5000'
      )
      await sleep(1e3) // For demo purposes.
      const countries = await response.json()

      if (active) {
        setOptions(Object.keys(countries).map(key => countries[key].item[0]))
      }
    })()

    return () => {
      active = false
    }
  }, [loading])

  React.useEffect(() => {
    console.log(props.fields.location)
  }, [props.fields.location])

  React.useEffect(() => {
    if (!open) {
      setOptions([])
    }
  }, [open])

  return (
    <Autocomplete
      id="asynchronous-demo"
      open={open}
      onOpen={() => {
        setOpen(true)
      }}
      onClose={() => {
        setOpen(false)
      }}
      getOptionSelected={(option, value) => option.name === value.name}
      getOptionLabel={option => option.name}
      options={options}
      loading={loading}
      onSelectCapture={e => props.handleChange(e, 'location')}
      disableOpenOnFocus
      ref={inputEl}
      renderInput={params => (
        <TextField
          {...params}
          label="Asynchronous"
          fullWidth
          autoComplete={false}
          searchText={props.fields.location}
          variant="outlined"
          //value={props.fields.location}
          onNewRequest={e => console.log(inputEl.current.value)}
          onChange={e => {
            props.handleChange(e, 'location')
          }}
          //onChange={handleTest}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <React.Fragment>
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </React.Fragment>
            )
          }}
        />
      )}
    />
  )
}
