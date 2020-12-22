import React from 'react'
import TextField from '@material-ui/core/TextField'
import Autocomplete from '@material-ui/lab/Autocomplete'

export default function Playground(props) {
  const defaultProps = {
    options: skills,
    getOptionLabel: option => option.title
  }

  const flatProps = {
    options: skills.map(option => option.title)
  }

  return (
    <div>
      <Autocomplete
        {...defaultProps}
        style={{
          marginTop: '-40px',
          marginBottom: '-8px',
          width: '300px',
          maxWidth: '500px',
          justifySelf: 'flex-end'
        }}
        freeSolo
        id="controlled-demo"
        value={props.value}
        onChange={(event, newValue) => props.handleChange(event, newValue)}
        renderInput={params => (
          <TextField {...params} label="controlled" margin="normal" fullWidth />
        )}
      />
    </div>
  )
}

// Top 100 films as rated by IMDb users. http://www.imdb.com/chart/top
const skills = [
  { title: 'The Shawshank Redemption' },
  { title: 'The Godfather' },
  { title: 'The Godfather: Part II' },
  { title: 'The Dark Knight' },
  { title: '12 Angry Men' },
  { title: "Schindler's List" },
  { title: 'Pulp Fiction' },
  { title: 'The Lord of the Rings: The Return of the King' },
  { title: 'The Good, the Bad and the Ugly' },
  { title: 'Fight Club' },
  { title: 'The Lord of the Rings: The Fellowship of the Ring' },
  { title: 'Star Wars: Episode V - The Empire Strikes Back' },
  { title: 'Forrest Gump' },
  { title: 'Inception' },
  { title: 'The Lord of the Rings: The Two Towers' },
  { title: "One Flew Over the Cuckoo's Nest" },
  { title: 'Goodfellas' },
  { title: 'The Matrix' },
  { title: 'Seven Samurai' },
  { title: 'Star Wars: Episode IV - A New Hope' },
  { title: 'City of God' },
  { title: 'Se7en' },
  { title: 'The Silence of the Lambs' },
  { title: "It's a Wonderful Life" },
  { title: 'Life Is Beautiful' },
  { title: 'The Usual Suspects' },
  { title: 'Léon: The Professional' },
  { title: 'Spirited Away' },
  { title: 'Saving Private Ryan' },
  { title: 'Once Upon a Time in the West' },
  { title: 'American History X' },
  { title: 'Interstellar' },
  { title: 'Casablanca' },
  { title: 'City Lights' },
  { title: 'Psycho' },
  { title: 'The Green Mile' },
  { title: 'The Intouchables' },
  { title: 'Modern Times' },
  { title: 'Raiders of the Lost Ark' },
  { title: 'Rear Window' },
  { title: 'The Pianist' },
  { title: 'The Departed' },
  { title: 'Terminator 2: Judgment Day' },
  { title: 'Back to the Future' },
  { title: 'Whiplash' },
  { title: 'Gladiator' },
  { title: 'Memento' },
  { title: 'The Prestige' },
  { title: 'The Lion King' },
  { title: 'Apocalypse Now' },
  { title: 'Alien' },
  { title: 'Sunset Boulevard' }
]
